use std::env;

use actix_files::{Files, NamedFile};
use actix_rt::{spawn, System};

use actix_web::dev::{fn_service, ServiceRequest, ServiceResponse};
use actix_web::middleware::{NormalizePath, TrailingSlash};
use actix_web::web::Payload;
use actix_web::Error;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer};
use api::room::create_room::create_room;
use api::room::create_room_session::create_room_session;
use api::room::get_room::get_room;
use api::room::list_rooms::list_rooms;
use api::room::ws_handler::room_ws;
use std::sync::Arc;

mod api;
mod args;
mod cors;
mod room;
mod session;

use crate::args::collect_args::collect_args;
use crate::cors::get_cors_options::get_cors_options;
use crate::room::room_manager::AppState;
use crate::session::flash_messages::set_up_flash_messages;

async fn ws_handler(
    req: HttpRequest,
    stream: Payload,
    app_state: web::Data<Arc<AppState>>,
) -> Result<HttpResponse, Error> {
    let room_id = req.match_info().get("room_id").unwrap().to_string();
    let (res, session, msg_stream) = actix_ws::handle(&req, stream)?;

    // spawn websocket handler (and don't await it) so that the response is returned immediately
    let app_state_clone = app_state.clone();
    spawn(room_ws(
        app_state_clone.get_ref().clone(),
        session,
        msg_stream,
        room_id,
    ));

    Ok(res)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args = collect_args(env::args().collect());
    let host = args.host;
    let port = args.port.parse::<u16>().unwrap();
    let cors_url = args.cors_url;

    // configure logging
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    let app_state = web::Data::new(AppState::new());

    // Set up the actix server
    let server = HttpServer::new(move || {
        let env = args.env.to_string();
        let cors = get_cors_options(env, cors_url.clone()); //Prod CORS URL address, for dev run the cors is set to *

        // The services and wrappers are loaded from the last to first
        // Ensure all the wrappers are after routes and handlers
        App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .route("/api/create_room", web::post().to(create_room))
            .route(
                "/api/create_room_session",
                web::post().to(create_room_session),
            )
            .route("/api/list_rooms", web::get().to(list_rooms))
            .route("/api/get_room/{room_id}", web::get().to(get_room))
            .route("/ws/{room_id}", web::get().to(ws_handler))
            .service(
                Files::new("/", "../frontend/dist/")
                    .prefer_utf8(true)
                    .index_file("index.html")
                    .default_handler(fn_service(|req: ServiceRequest| async {
                        let (req, _) = req.into_parts();
                        let file = NamedFile::open_async("../frontend/dist/404.html").await?;
                        let res = file.into_response(&req);
                        Ok(ServiceResponse::new(req, res))
                    })),
            )
            .wrap(session::session_middleware::session_middleware())
            .wrap(set_up_flash_messages())
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .wrap(NormalizePath::new(TrailingSlash::Trim)) // Add this line to handle trailing slashes\
    })
    .bind((host, port))?;

    let server = server.run();

    System::current().arbiter().spawn(async {
        println!("Actix server has started 🚀");
    });

    server.await
}
