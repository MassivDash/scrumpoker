use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Answers {
    pub answer: String,
    pub username: String,
}

#[allow(dead_code)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Estimation {
    pub revealed: bool,
    pub question: String,
    pub answers: Vec<Answers>, // answer: username
}

#[allow(dead_code)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Room {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub users: Vec<String>,
    pub current_estimation: u8,
    pub estimations: Vec<Estimation>, // question: Estimation
}

pub struct AppState {
    pub rooms: Mutex<HashMap<String, Room>>,
    pub clients: Mutex<HashMap<String, mpsc::UnboundedSender<String>>>,
    pub room_clients: Mutex<HashMap<String, HashSet<String>>>, // room_id -> set of client ids
}

#[allow(dead_code)]
impl AppState {
    pub fn new() -> Arc<Self> {
        Arc::new(AppState {
            rooms: Mutex::new(HashMap::new()),
            clients: Mutex::new(HashMap::new()),
            room_clients: Mutex::new(HashMap::new()),
        })
    }

    pub fn add_room(&self, id: String, name: String, owner: String) {
        let mut rooms = self.rooms.lock().unwrap();
        let users = vec![owner.clone()];
        rooms.insert(
            id.clone(),
            Room {
                id,
                name,
                owner,
                current_estimation: 0,
                estimations: Vec::new(),
                users,
            },
        );
    }

    pub fn remove_room(&self, id: &str) {
        let mut rooms = self.rooms.lock().unwrap();
        rooms.remove(id);
    }

    pub fn get_room(&self, id: &str) -> Option<Room> {
        let rooms = self.rooms.lock().unwrap();
        rooms.get(id).cloned()
    }

    pub fn update_room(&self, id: String, room: Room) {
        let mut rooms = self.rooms.lock().unwrap();
        rooms.insert(id, room);
    }

    pub fn add_user_to_room(&self, room_id: &str, username: String) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            room.users.push(username);
        }
    }
    pub fn add_estimation(&self, room_id: &str, question: String) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            let estimation_map = room
                .estimations
                .iter_mut()
                .find(|estimation| estimation.question == question);
            if estimation_map.is_none() {
                let new_estimation = Estimation {
                    revealed: false,
                    question: question.clone(),
                    answers: Vec::new(),
                };
                room.estimations.push(new_estimation);
            }
        }
    }

    pub fn reveal_estimation(&self, room_id: &str, estimation_index: u8) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            if let Some(estimation) = room.estimations.get_mut(estimation_index as usize) {
                estimation.revealed = true;
            }
        }
    }

    pub fn remove_estimation(&self, room_id: &str, estimation: u8) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            room.estimations.remove(estimation as usize);
        }
    }

    pub fn add_estimation_answer(
        &self,
        room_id: &str,
        estimation_index: u8,
        answer: &str,
        username: &str,
    ) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            if let Some(estimation) = room.estimations.get_mut(estimation_index as usize) {
                if let Some(existing_answer) = estimation
                    .answers
                    .iter_mut()
                    .find(|a| a.username == username)
                {
                    existing_answer.answer = answer.to_string();
                } else {
                    estimation.answers.push(Answers {
                        answer: answer.to_string(),
                        username: username.to_string(),
                    });
                }
            }
        }
    }

    pub fn change_current_estimation(&self, room_id: &str, current_estimation: u8) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            room.current_estimation = current_estimation;
        }
    }

    pub fn add_client(&self, id: String, tx: mpsc::UnboundedSender<String>, room_id: String) {
        let mut clients = self.clients.lock().unwrap();
        clients.insert(id.clone(), tx);

        let mut room_clients = self.room_clients.lock().unwrap();
        room_clients.entry(room_id).or_default().insert(id);
    }

    pub fn remove_client(&self, id: &str) {
        let mut clients = self.clients.lock().unwrap();
        clients.remove(id);

        let mut room_clients = self.room_clients.lock().unwrap();
        for clients in room_clients.values_mut() {
            clients.remove(id);
        }
    }

    pub fn broadcast(&self, room_id: &str, message: &str) {
        let clients = self.clients.lock().unwrap();
        let room_clients = self.room_clients.lock().unwrap();
        if let Some(client_ids) = room_clients.get(room_id) {
            for client_id in client_ids {
                if let Some(tx) = clients.get(client_id) {
                    let _ = tx.send(message.to_string());
                }
            }
        }
    }
}
