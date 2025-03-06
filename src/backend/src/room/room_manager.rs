use std::collections::HashMap;
use std::sync::Mutex;

#[allow(dead_code)]
#[derive(Clone, Debug)]
pub struct Estimation {
    pub revealed: bool,
    pub question: String,
    pub answers: HashMap<String, String>, // answer: username
}

#[allow(dead_code)]
#[derive(Clone, Debug)]
pub struct Room {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub estimations: HashMap<String, Estimation>, // question: Estimation
}

pub struct AppState {
    pub rooms: Mutex<HashMap<String, Room>>,
}

#[allow(dead_code)]
impl AppState {
    pub fn new() -> Self {
        AppState {
            rooms: Mutex::new(HashMap::new()),
        }
    }

    pub fn add_room(&self, id: String, name: String, owner: String) {
        let mut rooms = self.rooms.lock().unwrap();
        rooms.insert(
            id.clone(),
            Room {
                id,
                name,
                owner,
                estimations: HashMap::new(),
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

    pub fn add_estimation(
        &self,
        room_id: &str,
        question: String,
        answer: String,
        username: String,
    ) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            let estimation = room
                .estimations
                .entry(question.clone())
                .or_insert(Estimation {
                    question: question.clone(),
                    answers: HashMap::new(),
                    revealed: false,
                });
            estimation.answers.insert(answer, username);
        }
    }

    pub fn reveal_estimation(&self, room_id: &str, question: &str) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            if let Some(estimation) = room.estimations.get_mut(question) {
                estimation.revealed = true;
            }
        }
    }

    pub fn clear_estimations(&self, room_id: &str) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            room.estimations.clear();
        }
    }

    pub fn add_estimation_answer(
        &self,
        room_id: &str,
        question: &str,
        answer: &str,
        username: &str,
    ) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(room) = rooms.get_mut(room_id) {
            if let Some(estimation) = room.estimations.get_mut(question) {
                estimation
                    .answers
                    .insert(answer.to_string(), username.to_string());
            }
        }
    }
}
