use actix_session::Session;
use actix_web::{web, HttpResponse, Responder};
use serde::Serialize;
use std::sync::Arc;

use crate::room::room_manager::AppState;

#[derive(Serialize)]
pub struct ListResponse {
    pub username: String,
    pub rooms: Vec<RoomInfo>,
}

#[derive(Serialize)]
pub struct RoomInfo {
    id: String,
    name: String,
}

pub async fn list_rooms(data: web::Data<Arc<AppState>>, session: Session) -> impl Responder {
    if let Some(user_name) = session.get::<String>("user_name").unwrap_or(None) {
        let rooms = data.rooms.lock().unwrap();
        let room_list: Vec<RoomInfo> = rooms
            .iter()
            .filter(|(_, room)| room.owner == user_name)
            .map(|(id, room)| RoomInfo {
                id: id.clone(),
                name: room.name.clone(),
            })
            .collect();

        let room_list_response = ListResponse {
            username: user_name,
            rooms: room_list,
        };

        HttpResponse::Ok().json(room_list_response)
    } else {
        HttpResponse::Unauthorized().body("User not logged in")
    }
}
