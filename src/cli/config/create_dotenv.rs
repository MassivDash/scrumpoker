use std::collections::HashMap;
use std::fs::File;
use std::io::Write;

pub fn create_dotenv_frontend(public_keys: HashMap<String, String>, dotenv_path: &str) {
    let mut dotenv_contents = String::new();

    for (key, value) in public_keys {
        let env_key = key.to_uppercase();
        dotenv_contents.push_str(&format!("{}={}\n", env_key, value));
    }

    if let Err(err) =
        File::create(dotenv_path).and_then(|mut file| file.write_all(dotenv_contents.as_bytes()))
    {
        eprintln!("Error writing to {}: {}", dotenv_path, err);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;
    use std::fs::File;
    use std::io::Read;

    #[test]
    fn test_create_dotenv_frontend_new_file() {
        let dotenv_path = "./src/frontend/.test-new-env";

        // Create a temporary public_keys HashMap for testing
        let mut public_keys = HashMap::new();
        public_keys.insert(
            "public_api_url".to_string(),
            "http://localhost:8080/api".to_string(),
        );
        public_keys.insert(
            "public_ws_url".to_string(),
            "ws://localhost:8080/ws/".to_string(),
        );

        // Create a temporary file for testing
        create_dotenv_frontend(public_keys, dotenv_path);

        // Read the contents of the temporary file
        let mut file = File::open(dotenv_path).unwrap();
        let mut contents = String::new();
        file.read_to_string(&mut contents).unwrap();

        // Assert that the file has been created and contains the correct value
        assert!(contents.contains("PUBLIC_API_URL=http://localhost:8080/api"));
        assert!(contents.contains("PUBLIC_WS_URL=ws://localhost:8080/ws/"));

        // remove the temporary files
        std::fs::remove_file(dotenv_path).unwrap();
    }

    #[test]
    fn test_create_dotenv_frontend_existing_file() {
        let dotenv_path = "./src/frontend/.test-exist-env";

        // Create a temporary public_keys HashMap for testing
        let mut public_keys = HashMap::new();
        public_keys.insert(
            "public_api_url".to_string(),
            "http://localhost:8080/api".to_string(),
        );
        public_keys.insert(
            "public_ws_url".to_string(),
            "ws://localhost:8080/ws/".to_string(),
        );

        // Create a temporary file for testing
        let mut file = File::create(dotenv_path).unwrap();
        file.write_all("PUBLIC_API_URL=old_value\n".as_bytes())
            .unwrap();

        // Update the file with the new value
        create_dotenv_frontend(public_keys, dotenv_path);

        // Read the contents of the temporary file
        let mut file = File::open(dotenv_path).unwrap();
        let mut contents = String::new();
        file.read_to_string(&mut contents).unwrap();

        // Assert that the file has been updated with the new value
        assert!(contents.contains("PUBLIC_API_URL=http://localhost:8080/api"));
        assert!(contents.contains("PUBLIC_WS_URL=ws://localhost:8080/ws/"));

        // remove the temporary files
        std::fs::remove_file(dotenv_path).unwrap();
    }
}
