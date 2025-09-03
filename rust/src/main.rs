use helix_rs::{HelixDB, HelixDBClient};
use serde::{Deserialize, Serialize};

// input structs for queries
#[derive(Serialize)]
struct CreateUserInput {
    name: String,
    age: u32,
    email: String,
}

#[derive(Serialize)]
struct CreateFollowInput {
    follower_id: String,
    followed_id: String,
}

#[derive(Serialize)]
struct CreatePostInput {
    user_id: String,
    content: String,
}

#[derive(Serialize)]
struct CreatePostEmbeddingInput {
    post_id: String,
    vector: Vec<f64>,
    content: String,
}

#[derive(Serialize)]
struct GetUserPostsInput {
    user_id: String,
}

#[derive(Serialize)]
struct GetFollowingInput {
    user_id: String,
}

#[derive(Serialize)]
struct GetFollowersInput {
    user_id: String,
}

#[derive(Serialize)]
struct SearchEmbeddingsInput {
    vector: Vec<f64>,
    k: i64,
}

// output structs for query responses
#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct User {
    id: String,
    name: String,
    age: u32,
    email: String,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct Post {
    id: String,
    content: String,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize, Debug)]
struct CreateUserResponse {
    user: User,
}

#[derive(Deserialize, Debug)]
struct CreatePostResponse {
    post: Post,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct GetUsersResponse {
    users: Vec<User>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct GetPostsResponse {
    posts: Vec<Post>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct GetFollowingResponse {
    following: Vec<User>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct GetFollowersResponse {
    followers: Vec<User>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // connect to client
    let client = HelixDB::new(Some("http://localhost"), Some(6969), None);

    println!("Creating 3 users...");

    // create alice
    let alice_input = CreateUserInput {
        name: "Alice".to_string(),
        age: 25u32,
        email: "alice@example.com".to_string(),
    };

    let alice_response: CreateUserResponse = client.query("createUser", &alice_input).await?;
    println!("Created Alice: {:?}", alice_response);

    // create bob
    let bob_input = CreateUserInput {
        name: "Bob".to_string(),
        age: 30u32,
        email: "bob@example.com".to_string(),
    };

    let bob_response: CreateUserResponse = client.query("createUser", &bob_input).await?;
    println!("Created Bob: {:?}", bob_response);

    // create charlie
    let charlie_input = CreateUserInput {
        name: "Charlie".to_string(),
        age: 28u32,
        email: "charlie@example.com".to_string(),
    };

    let charlie_response: CreateUserResponse = client.query("createUser", &charlie_input).await?;
    println!("Created Charlie: {:?}", charlie_response);

    let alice_id = alice_response.user.id;
    let bob_id = bob_response.user.id;
    let charlie_id = charlie_response.user.id;

    println!("Creating follow relationships...");

    // alice follows bob
    let follow_input1 = CreateFollowInput {
        follower_id: alice_id.clone(),
        followed_id: bob_id.clone(),
    };
    let _follow_result1: serde_json::Value = client.query("createFollow", &follow_input1).await?;
    println!("Alice follows Bob: success");

    // bob follows charlie
    let follow_input2 = CreateFollowInput {
        follower_id: bob_id.clone(),
        followed_id: charlie_id.clone(),
    };
    let _follow_result2: serde_json::Value = client.query("createFollow", &follow_input2).await?;
    println!("Bob follows Charlie: success");

    // charlie follows alice
    let follow_input3 = CreateFollowInput {
        follower_id: charlie_id.clone(),
        followed_id: alice_id.clone(),
    };
    let _follow_result3: serde_json::Value = client.query("createFollow", &follow_input3).await?;
    println!("Charlie follows Alice: success");

    println!("Creating posts...");

    // alice's post
    let alice_post_input = CreatePostInput {
        user_id: alice_id.clone(),
        content: "Hello world! My first post on HelixDB".to_string(),
    };
    let alice_post_response: CreatePostResponse =
        client.query("createPost", &alice_post_input).await?;
    println!("Created Alice's post: {:?}", alice_post_response);

    // bob's post
    let bob_post_input = CreatePostInput {
        user_id: bob_id.clone(),
        content: "Loving the graph database capabilities".to_string(),
    };
    let bob_post_response: CreatePostResponse = client.query("createPost", &bob_post_input).await?;
    println!("Created Bob's post: {:?}", bob_post_response);

    // charlie's post
    let charlie_post_input = CreatePostInput {
        user_id: charlie_id.clone(),
        content: "Building cool social networks with Helix".to_string(),
    };
    let charlie_post_response: CreatePostResponse =
        client.query("createPost", &charlie_post_input).await?;
    println!("Created Charlie's post: {:?}", charlie_post_response);

    println!("Creating post embeddings with dummy vectors...");

    // alice's post embedding
    let alice_embedding_input = CreatePostEmbeddingInput {
        post_id: alice_post_response.post.id,
        vector: vec![0.1, 0.2, 0.3, 0.4, 0.5],
        content: "Hello world! My first post on HelixDB".to_string(),
    };
    let _alice_embedding_result: serde_json::Value = client
        .query("createPostEmbedding", &alice_embedding_input)
        .await?;
    println!("Created Alice's embedding: success");

    // bob's post embedding
    let bob_embedding_input = CreatePostEmbeddingInput {
        post_id: bob_post_response.post.id,
        vector: vec![0.2, 0.3, 0.4, 0.5, 0.6],
        content: "Loving the graph database capabilities".to_string(),
    };
    let _bob_embedding_result: serde_json::Value = client
        .query("createPostEmbedding", &bob_embedding_input)
        .await?;
    println!("Created Bob's embedding: success");

    // charlie's post embedding
    let charlie_embedding_input = CreatePostEmbeddingInput {
        post_id: charlie_post_response.post.id,
        vector: vec![0.3, 0.4, 0.5, 0.6, 0.7],
        content: "Building cool social networks with Helix".to_string(),
    };
    let _charlie_embedding_result: serde_json::Value = client
        .query("createPostEmbedding", &charlie_embedding_input)
        .await?;
    println!("Created Charlie's embedding: success");

    println!("\nQuerying and displaying the data...");

    // get all users
    println!("All Users:");
    let users_response: GetUsersResponse = client.query("getUsers", &()).await?;
    println!("{:?}", users_response);

    // get all posts
    println!("\nAll Posts:");
    let posts_response: GetPostsResponse = client.query("getPosts", &()).await?;
    println!("{:?}", posts_response);

    // get alice's posts
    println!("\nAlice's Posts:");
    let alice_posts_input = GetUserPostsInput {
        user_id: alice_id.clone(),
    };
    let alice_posts_response: GetPostsResponse =
        client.query("getPostsByUser", &alice_posts_input).await?;
    println!("{:?}", alice_posts_response);

    // get who alice is following
    println!("\nWho Alice is Following:");
    let alice_following_input = GetFollowingInput {
        user_id: alice_id.clone(),
    };
    let alice_following_response: GetFollowingResponse =
        client.query("getFollowing", &alice_following_input).await?;
    println!("{:?}", alice_following_response);

    // get bob's followers
    println!("\nBob's Followers:");
    let bob_followers_input = GetFollowersInput {
        user_id: bob_id.clone(),
    };
    let bob_followers_response: GetFollowersResponse =
        client.query("getFollowers", &bob_followers_input).await?;
    println!("{:?}", bob_followers_response);

    // search for posts similar to alice's embedding
    println!("\nSearching for posts similar to Alice's embedding [0.1, 0.2, 0.3, 0.4, 0.5]:");
    let search_input = SearchEmbeddingsInput {
        vector: vec![0.1, 0.2, 0.3, 0.4, 0.5],
        k: 1,
    };
    let search_response: GetPostsResponse =
        client.query("searchPostEmbeddings", &search_input).await?;
    println!("{:?}", search_response);

    Ok(())
}
