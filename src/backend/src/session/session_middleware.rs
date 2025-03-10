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

pub fn extract_domain_from_url(url: &str) -> String {
    if url.starts_with("http://localhost") {
        "localhost".to_string()
    } else {
        let url = url.replace("http://", "").replace("https://", "");
        let parts: Vec<&str> = url.split('/').collect();
        parts[0].to_string()
    }
}

pub fn session_middleware(cors_url: String) -> SessionMiddleware<CookieSessionStore> {
    let cors_url = cors_url.clone();
    let session_domain = extract_domain_from_url(&cors_url);

    SessionMiddleware::builder(CookieSessionStore::default(), Key::from(&[0; 64]))
        .cookie_name("scrum-poker".to_string())
        .cookie_domain(Some(session_domain))
        .cookie_path("/".to_string())
        .cookie_secure(false)
        .cookie_http_only(false)
        .cookie_same_site(SameSite::Lax)
        .build()
}
