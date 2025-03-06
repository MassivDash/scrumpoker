use actix_session::{storage::CookieSessionStore, SessionMiddleware};
use actix_web::cookie::{Key, SameSite};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, PartialEq, Eq, Debug)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct User {
    pub id: i64,
    username: String,
    password: String,
}

pub fn session_middleware() -> SessionMiddleware<CookieSessionStore> {
    SessionMiddleware::builder(CookieSessionStore::default(), Key::from(&[0; 64]))
        .cookie_name("astroX".to_string())
        .cookie_domain(Some("localhost".to_string()))
        .cookie_path("/".to_string())
        .cookie_secure(false)
        .cookie_http_only(false)
        .cookie_same_site(SameSite::Lax)
        .build()
}
