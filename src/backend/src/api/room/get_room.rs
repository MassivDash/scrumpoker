use std::collections::HashMap;

use actix_session::Session;
use actix_web::{web, HttpResponse, Responder};
use serde::Serialize;
use std::sync::Arc;

use crate::room::room_manager::{AppState, Estimation};

#[derive(Serialize)]
pub struct RoomResponse {
    pub id: String,
    pub name: String,
    pub user_is_owner: bool,
    pub estimations: Vec<HashMap<String, Estimation>>,
    users: Vec<String>,
}

pub async fn get_room(
    data: web::Data<Arc<AppState>>,
    session: Session,
    room_id: web::Path<String>,
) -> impl Responder {
    let room_id = room_id.into_inner();
    if let Some(room) = data.get_room(&room_id) {
        let user_name: Option<String> = session.get("user_name").unwrap_or(None);
        let user_is_owner = user_name.as_deref() == Some(&room.owner);

        let response = RoomResponse {
            id: room.id,
            name: room.name,
            user_is_owner,
            estimations: room.estimations,
            users: room.users,
        };
        HttpResponse::Ok().json(response)
    } else {
        HttpResponse::NotFound().body("Room not found")
    }
}
