use actix_session::Session;
use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

use crate::room::room_manager::AppState;

#[derive(Deserialize)]
pub struct CreateRoomRequest {
    pub room_name: String,
    pub user_name: String,
}

#[derive(Serialize)]
pub struct CreateRoomResponse {
    pub room_name: String,
    pub room_id: String,
    pub user_name: String,
}

pub async fn create_room(
    data: web::Data<Arc<AppState>>,
    session: Session,
    req: web::Json<CreateRoomRequest>,
) -> impl Responder {
    let room_name = req.room_name.clone();
    let user_name = req.user_name.clone();
    let room_id = Uuid::new_v4().to_string();

    // Store user name in session
    session.insert("user_name", &user_name).unwrap();
    session.insert("room_name", &room_name).unwrap();
    session.insert("room_id", &room_id).unwrap();

    // Add room
    data.add_room(room_id.clone(), room_name.clone(), user_name.clone());

    let response = CreateRoomResponse {
        room_name,
        room_id,
        user_name,
    };

    HttpResponse::Ok().json(response)
}
