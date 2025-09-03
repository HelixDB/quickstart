import HelixDB from "helix-ts";

// type definitions for our data structures
interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    created_at: string;
    updated_at: string;
}

interface Post {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

async function main() {
    // connect to client
    const client = new HelixDB("http://localhost:6969");

    console.log("Creating 3 users...");

    // create alice
    const aliceResponse = await client.query("createUser", {
        name: "Alice",
        age: 25,
        email: "alice@example.com"
    });
    console.log("Created Alice:", aliceResponse);

    // create bob
    const bobResponse = await client.query("createUser", {
        name: "Bob",
        age: 30,
        email: "bob@example.com"
    });
    console.log("Created Bob:", bobResponse);

    // create charlie
    const charlieResponse = await client.query("createUser", {
        name: "Charlie",
        age: 28,
        email: "charlie@example.com"
    });
    console.log("Created Charlie:", charlieResponse);

    const aliceId = aliceResponse.user.id;
    const bobId = bobResponse.user.id;
    const charlieId = charlieResponse.user.id;

    console.log("Creating follow relationships...");

    // alice follows bob
    const followResult1 = await client.query("createFollow", {
        follower_id: aliceId,
        followed_id: bobId
    });
    console.log("Alice follows Bob:", followResult1);

    // bob follows charlie
    const followResult2 = await client.query("createFollow", {
        follower_id: bobId,
        followed_id: charlieId
    });
    console.log("Bob follows Charlie:", followResult2);

    // charlie follows alice
    const followResult3 = await client.query("createFollow", {
        follower_id: charlieId,
        followed_id: aliceId
    });
    console.log("Charlie follows Alice:", followResult3);

    console.log("Creating posts...");

    // alice's post
    const alicePostResponse = await client.query("createPost", {
        user_id: aliceId,
        content: "Hello world! My first post on HelixDB"
    });
    console.log("Created Alice's post:", alicePostResponse);

    // bob's post
    const bobPostResponse = await client.query("createPost", {
        user_id: bobId,
        content: "Loving the graph database capabilities"
    });
    console.log("Created Bob's post:", bobPostResponse);

    // charlie's post
    const charliePostResponse = await client.query("createPost", {
        user_id: charlieId,
        content: "Building cool social networks with Helix"
    });
    console.log("Created Charlie's post:", charliePostResponse);

    console.log("Creating post embeddings with dummy vectors...");

    // alice's post embedding
    const aliceEmbeddingResult = await client.query("createPostEmbedding", {
        post_id: alicePostResponse.post.id,
        vector: [0.1, 0.2, 0.3, 0.4, 0.5],
        content: "Hello world! My first post on HelixDB"
    });
    console.log("Created Alice's embedding:", aliceEmbeddingResult);

    // bob's post embedding
    const bobEmbeddingResult = await client.query("createPostEmbedding", {
        post_id: bobPostResponse.post.id,
        vector: [0.2, 0.3, 0.4, 0.5, 0.6],
        content: "Loving the graph database capabilities"
    });
    console.log("Created Bob's embedding:", bobEmbeddingResult);

    // charlie's post embedding
    const charlieEmbeddingResult = await client.query("createPostEmbedding", {
        post_id: charliePostResponse.post.id,
        vector: [0.3, 0.4, 0.5, 0.6, 0.7],
        content: "Building cool social networks with Helix"
    });
    console.log("Created Charlie's embedding:", charlieEmbeddingResult);

    console.log("\nQuerying and displaying the data...");

    // get all users
    console.log("All Users:");
    const usersResponse = await client.query("getUsers", {});
    console.log(JSON.stringify(usersResponse, null, 2));

    // get all posts
    console.log("\nAll Posts:");
    const postsResponse = await client.query("getPosts", {});
    console.log(JSON.stringify(postsResponse, null, 2));

    // get alice's posts
    console.log("\nAlice's Posts:");
    const alicePostsResponse = await client.query("getPostsByUser", {
        user_id: aliceId
    });
    console.log(JSON.stringify(alicePostsResponse, null, 2));

    // get who alice is following
    console.log("\nWho Alice is Following:");
    const aliceFollowingResponse = await client.query("getFollowing", {
        user_id: aliceId
    });
    console.log(JSON.stringify(aliceFollowingResponse, null, 2));

    // get bob's followers
    console.log("\nBob's Followers:");
    const bobFollowersResponse = await client.query("getFollowers", {
        user_id: bobId
    });
    console.log(JSON.stringify(bobFollowersResponse, null, 2));

    // search for posts similar to alice's embedding
    console.log("\nSearching for posts similar to Alice's embedding [0.1, 0.2, 0.3, 0.4, 0.5]:");
    const searchResponse = await client.query("searchPostEmbeddings", {
        vector: [0.1, 0.2, 0.3, 0.4, 0.5],
        k: 1
    });
    console.log(JSON.stringify(searchResponse, null, 2));
}

main().catch(console.error);