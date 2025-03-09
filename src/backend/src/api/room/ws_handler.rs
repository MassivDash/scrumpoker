use std::{
    pin::pin,
    time::{Duration, Instant},
};

use actix_ws::AggregatedMessage;
use futures_util::{
    future::{select, Either},
    StreamExt as _,
};
use std::sync::Arc;
use tokio::{sync::mpsc, time::interval};

use crate::room::room_manager::{AppState, Room};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
enum WsMessage {
    AddQuestion {
        question: String,
    },
    RemoveQuestion {
        estimation: u8,
    },
    AddAnswer {
        estimation: u8,
        answer: String,
        username: String,
    },
    SetCurrentEstimation {
        estimation: u8,
    },
    RevealEstimations {
        estimation: u8,
    },
}
/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

/// WebSocket handler for managing connections and processing messages.
pub async fn room_ws(
    app_state: Arc<AppState>,
    mut session: actix_ws::Session,
    msg_stream: actix_ws::MessageStream,
    room_id: String,
) {
    log::info!("connected");

    let mut last_heartbeat = Instant::now();
    let mut interval = interval(HEARTBEAT_INTERVAL);

    let (conn_tx, mut conn_rx) = mpsc::unbounded_channel();

    // Generate a unique connection ID
    let conn_id = uuid::Uuid::new_v4().to_string();

    // Add the client to the app state
    app_state.add_client(conn_id.clone(), conn_tx, room_id.clone());

    let msg_stream = msg_stream
        .max_frame_size(128 * 1024)
        .aggregate_continuations()
        .max_continuation_size(2 * 1024 * 1024);

    let mut msg_stream = pin!(msg_stream);

    let close_reason = loop {
        let tick = pin!(interval.tick());
        let msg_rx = pin!(conn_rx.recv());

        let messages = pin!(select(msg_stream.next(), msg_rx));

        match select(messages, tick).await {
            Either::Left((Either::Left((Some(Ok(msg)), _)), _)) => {
                log::debug!("msg: {msg:?}");

                match msg {
                    AggregatedMessage::Ping(bytes) => {
                        last_heartbeat = Instant::now();
                        session.pong(&bytes).await.unwrap();
                    }

                    AggregatedMessage::Pong(_) => {
                        last_heartbeat = Instant::now();
                    }

                    AggregatedMessage::Text(text) => {
                        process_text_msg(&app_state, &mut session, &text, &conn_id, &room_id).await;
                    }

                    AggregatedMessage::Binary(_bin) => {
                        log::warn!("unexpected binary message");
                    }

                    AggregatedMessage::Close(reason) => break reason,
                }
            }

            Either::Left((Either::Left((Some(Err(err)), _)), _)) => {
                log::error!("{}", err);
                break None;
            }

            Either::Left((Either::Left((None, _)), _)) => break None,

            Either::Left((Either::Right((Some(chat_msg), _)), _)) => {
                session.text(chat_msg).await.unwrap();
            }

            Either::Left((Either::Right((None, _)), _)) => unreachable!(
                "all connection message senders were dropped; chat server may have panicked"
            ),

            Either::Right((_inst, _)) => {
                if Instant::now().duration_since(last_heartbeat) > CLIENT_TIMEOUT {
                    log::info!(
                        "client has not sent heartbeat in over {CLIENT_TIMEOUT:?}; disconnecting"
                    );
                    break None;
                }

                let _ = session.ping(b"").await;
            }
        };
    };

    app_state.remove_client(&conn_id);

    let _ = session.close(close_reason).await;
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseMessageWS {
    pub type_: String,
    pub data: Room,
}

async fn process_text_msg(
    app_state: &AppState,
    session: &mut actix_ws::Session,
    text: &str,
    _conn_id: &str,
    room_id: &str,
) {
    let msg = text.trim();

    match serde_json::from_str::<WsMessage>(msg) {
        Ok(WsMessage::AddQuestion { question }) => {
            app_state.add_estimation(room_id, question.clone());
            // Get the current room object from the app state and broadcast the new question
            if let Some(room) = app_state.get_room(room_id) {
                let message = ResponseMessageWS {
                    type_: "AddQuestion".to_string(),
                    data: room,
                };

                let serde_msg = serde_json::to_string(&message).unwrap();
                app_state.broadcast(room_id, &serde_msg);
            }
        }
        Ok(WsMessage::RemoveQuestion { estimation }) => {
            app_state.remove_estimation(room_id, estimation);
            // Get the current room object from the app state and broadcast the removed question
            if let Some(room) = app_state.get_room(room_id) {
                let message = ResponseMessageWS {
                    type_: "RemoveQuestion".to_string(),
                    data: room,
                };

                let serde_msg = serde_json::to_string(&message).unwrap();
                app_state.broadcast(room_id, &serde_msg);
            }
        }
        Ok(WsMessage::AddAnswer {
            estimation,
            answer,
            username,
        }) => {
            app_state.add_estimation_answer(room_id, estimation, &answer, &username);
            // Get the current room object from the app state and broadcast the new answer
            if let Some(room) = app_state.get_room(room_id) {
                let message = ResponseMessageWS {
                    type_: "AddAnswer".to_string(),
                    data: room,
                };

                let serde_msg = serde_json::to_string(&message).unwrap();
                app_state.broadcast(room_id, &serde_msg);
            }
        }
        Ok(WsMessage::SetCurrentEstimation { estimation }) => {
            app_state.change_current_estimation(room_id, estimation);
            // Get the current room object from the app state and broadcast the new estimation
            if let Some(room) = app_state.get_room(room_id) {
                let message = ResponseMessageWS {
                    type_: "SetCurrentEstimation".to_string(),
                    data: room,
                };

                let serde_msg = serde_json::to_string(&message).unwrap();
                app_state.broadcast(room_id, &serde_msg);
            }
        }
        Ok(WsMessage::RevealEstimations { estimation }) => {
            app_state.reveal_estimation(room_id, estimation);
            if let Some(room) = app_state.get_room(room_id) {
                let message = ResponseMessageWS {
                    type_: "RevealEstimation".to_string(),
                    data: room,
                };

                let serde_msg = serde_json::to_string(&message).unwrap();
                app_state.broadcast(room_id, &serde_msg);
            }
        }
        Err(_) => {
            session.text("Invalid message format").await.unwrap();
        }
    }
}
