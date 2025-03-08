use actix_session::Session;
use actix_web::{web, HttpResponse, Responder};
use serde::Serialize;
use std::sync::Arc;

use crate::room::room_manager::{AppState, Estimation};

#[derive(Serialize)]
pub struct RoomResponse<'a> {
    pub id: &'a String,
    pub name: &'a String,
    pub owner: &'a String,
    pub estimations: &'a Vec<Estimation>,
    pub users: &'a Vec<String>,
    pub current_estimation: u8,
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

        // if link is shared the user is not the owner
        // add him to users list

        if !user_is_owner {
            // check if user on the users list
            let user_already_in_room = room
                .users
                .iter()
                .any(|u| u == user_name.as_deref().unwrap());
            if !user_already_in_room {
                let mut rooms = data.rooms.lock().unwrap();
                let room = rooms.get_mut(&room_id).unwrap();
                room.users.push(user_name.unwrap());
            }
        }

        let response = RoomResponse {
            id: &room.id,
            name: &room.name,
            owner: &room.owner,
            current_estimation: room.current_estimation,
            estimations: &room.estimations,
            users: &room.users,
        };

        let ws_room = room.clone();

        let ws_response = crate::api::room::ws_handler::ResponseMessageWS {
            type_: "UserJoined".to_string(),
            data: ws_room,
        };

        let serde_msg = serde_json::to_string(&ws_response).unwrap();
        data.broadcast(&room_id, &serde_msg);
        HttpResponse::Ok().json(response)
    } else {
        HttpResponse::NotFound().body("Room not found")
    }
}
