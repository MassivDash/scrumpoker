use actix_files::{Files, NamedFile};
use actix_rt::System;
use actix_web::dev::{fn_service, ServiceRequest, ServiceResponse};
use actix_web::middleware::{NormalizePath, TrailingSlash};
use actix_web::{middleware, web, App, HttpServer};
use api::room::create_room::create_room;
use api::room::list_rooms::list_rooms;
use std::env;

mod api;
mod args;
mod cors;
mod room;
mod session;

use crate::args::collect_args::collect_args;
use crate::cors::get_cors_options::get_cors_options;
use crate::room::room_manager::AppState;
use crate::session::flash_messages::set_up_flash_messages;

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
            .route("/api/list_rooms", web::get().to(list_rooms))
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
