use helix_rs::{HelixDB, HelixDBClient};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::convert::Infallible;
use std::sync::Arc;
use warp::{Filter, Reply};

// NOTE you will see responses being wrapped in array to match frontend expectation in some handlers, 
// but this is because our frontend expects an array of objects, but the backend returns a single object

#[tokio::main]
async fn main() {
    // create client
    let client = Arc::new(HelixDB::new(Some("http://localhost"), Some(6969), None));

    // routes with client passed via with_client filter
    let create_user = warp::path("createUser")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(create_user_handler);

    let create_follow = warp::path("createFollow")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(create_follow_handler);

    let create_post = warp::path("createPost")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(create_post_handler);

    let create_post_embedding = warp::path("createPostEmbedding")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(create_post_embedding_handler);

    let get_users = warp::path("getUsers")
        .and(warp::post())
        .and(with_client(client.clone()))
        .and_then(get_users_handler);

    let get_posts = warp::path("getPosts")
        .and(warp::post())
        .and(with_client(client.clone()))
        .and_then(get_posts_handler);

    let get_posts_by_user = warp::path("getPostsByUser")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(get_posts_by_user_handler);

    let get_followers = warp::path("getFollowers")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(get_followers_handler);

    let get_following = warp::path("getFollowing")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(get_following_handler);

    let search_post_embeddings = warp::path("searchPostEmbeddings")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_client(client.clone()))
        .and_then(search_post_embeddings_handler);

    let health = warp::path("health")
        .and(warp::get())
        .and_then(health_handler);

    let routes = create_user
        .or(create_follow)
        .or(create_post)
        .or(create_post_embedding)
        .or(get_users)
        .or(get_posts)
        .or(get_posts_by_user)
        .or(get_followers)
        .or(get_following)
        .or(search_post_embeddings)
        .or(health);

    println!("Rust backend server starting on port 8000...");
    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}

// inject client into handlers
fn with_client(client: Arc<HelixDB>) -> impl Filter<Extract = (Arc<HelixDB>,), Error = Infallible> + Clone {
    warp::any().map(move || client.clone())
}

async fn create_user_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("createUser", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn create_follow_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("createFollow", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn create_post_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("createPost", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn create_post_embedding_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("createPostEmbedding", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn get_users_handler(client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    let data: HashMap<String, Value> = HashMap::new();
    match client.query("getUsers", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn get_posts_handler(client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    let data: HashMap<String, Value> = HashMap::new();
    match client.query("getPosts", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn get_posts_by_user_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("getPostsByUser", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn get_followers_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("getFollowers", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn get_following_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("getFollowing", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn search_post_embeddings_handler(data: HashMap<String, Value>, client: Arc<HelixDB>) -> Result<impl Reply, Infallible> {
    match client.query("searchPostEmbeddings", &data).await {
        Ok(response) => {
            let response_value: Value = response;
            let wrapped_response = vec![response_value];
            Ok(warp::reply::json(&wrapped_response))
        }
        Err(err) => {
            let error_response = serde_json::json!({"error": err.to_string()});
            Ok(warp::reply::json(&error_response))
        }
    }
}

async fn health_handler() -> Result<impl Reply, Infallible> {
    let response = serde_json::json!({"status": "healthy"});
    Ok(warp::reply::json(&response))
}