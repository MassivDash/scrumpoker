use std::collections::HashMap;

use super::collect_args::collect_config_args;
use super::toml::read_toml;
use serde::Deserialize;
use serde::Serialize;

#[derive(Deserialize, Debug, Serialize, PartialEq)]
pub struct Config {
    pub host: String,
    pub port: Option<u16>,
    pub env: String,
    pub astro_port: Option<u16>,
    pub cors_url: String,
    pub prod_astro_build: bool,
    pub public_keys: HashMap<String, String>,
}

#[derive(Deserialize, Debug, Serialize, PartialEq)]
pub struct PublicKeys {
    pub public_api_url: String,
    pub public_ws_url: String,
}

pub fn get_config(args: &Vec<String>) -> Config {
    // create default config

    let astro_port = 5432;
    let cors_url = format!("http://localhost:{}", astro_port);

    let mut config: Config = Config {
        host: "localhost".to_string(),
        port: Some(8080),
        env: "dev".to_string(),
        prod_astro_build: false,
        astro_port: Some(astro_port),
        cors_url,
        public_keys: {
            let mut keys = HashMap::new();
            keys.insert(
                "public_api_url".to_string(),
                "http://localhost:8080/api".to_string(),
            );
            keys.insert(
                "public_ws_url".to_string(),
                "ws://localhost:8080/ws/".to_string(),
            );
            keys
        },
    };

    if let Ok(toml) = read_toml(&ASTROX_TOML.to_string()) {
        config = toml;
    }

    config = collect_config_args(config, args);
    config
}

pub const ASTROX_TOML: &str = "Astrox.toml";
