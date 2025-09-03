package main

import (
	"fmt"
	"log"

	"github.com/HelixDB/helix-go"
)

var HelixClient *helix.Client

type CreateUserResponse struct {
	User struct {
		ID        string      `json:"id"`
		Name      string      `json:"name"`
		Age       int32       `json:"age"`
		Email     string      `json:"email"`
		CreatedAt interface{} `json:"created_at"`
		UpdatedAt interface{} `json:"updated_at"`
	} `json:"user"`
}

type CreatePostResponse struct {
	Post struct {
		ID        string      `json:"id"`
		Content   string      `json:"content"`
		CreatedAt interface{} `json:"created_at"`
		UpdatedAt interface{} `json:"updated_at"`
	} `json:"post"`
}

type GetUsersResponse struct {
	Users []struct {
		ID        string      `json:"id"`
		Name      string      `json:"name"`
		Age       int32       `json:"age"`
		Email     string      `json:"email"`
		CreatedAt interface{} `json:"created_at"`
		UpdatedAt interface{} `json:"updated_at"`
	} `json:"users"`
}

type GetPostsResponse struct {
	Posts []struct {
		ID        string      `json:"id"`
		Content   string      `json:"content"`
		CreatedAt interface{} `json:"created_at"`
		UpdatedAt interface{} `json:"updated_at"`
	} `json:"posts"`
}

func main() {

	// connect to client
	HelixClient = helix.NewClient("http://localhost:6969")

	fmt.Println("Creating 3 users...")

	// create alice
	aliceData := map[string]any{
		"name":  "Alice",
		"age":   int32(25),
		"email": "alice@example.com",
	}

	var aliceUser CreateUserResponse
	err := HelixClient.Query("createUser", helix.WithData(aliceData)).Scan(&aliceUser)
	if err != nil {
		log.Fatalf("Error creating Alice: %s", err)
	}
	fmt.Printf("Created Alice: %+v\n", aliceUser)

	// create bob
	bobData := map[string]any{
		"name":  "Bob",
		"age":   int32(30),
		"email": "bob@example.com",
	}

	var bobUser CreateUserResponse
	err = HelixClient.Query("createUser", helix.WithData(bobData)).Scan(&bobUser)
	if err != nil {
		log.Fatalf("Error creating Bob: %s", err)
	}
	fmt.Printf("Created Bob: %+v\n", bobUser)

	// create charlie
	charlieData := map[string]any{
		"name":  "Charlie",
		"age":   int32(28),
		"email": "charlie@example.com",
	}

	var charlieUser CreateUserResponse
	err = HelixClient.Query("createUser", helix.WithData(charlieData)).Scan(&charlieUser)
	if err != nil {
		log.Fatalf("Error creating Charlie: %s", err)
	}
	fmt.Printf("Created Charlie: %+v\n", charlieUser)

	aliceID := aliceUser.User.ID
	bobID := bobUser.User.ID
	charlieID := charlieUser.User.ID

	fmt.Println("Creating follow relationships...")

	// alice follows bob
	followData1 := map[string]any{
		"follower_id": aliceID,
		"followed_id": bobID,
	}
	var followResult1 map[string]any
	err = HelixClient.Query("createFollow", helix.WithData(followData1)).Scan(&followResult1)
	if err != nil {
		log.Fatalf("Error creating follow relationship: %s", err)
	}
	fmt.Printf("Alice follows Bob: %+v\n", followResult1)

	// bob follows charlie
	followData2 := map[string]any{
		"follower_id": bobID,
		"followed_id": charlieID,
	}
	var followResult2 map[string]any
	err = HelixClient.Query("createFollow", helix.WithData(followData2)).Scan(&followResult2)
	if err != nil {
		log.Fatalf("Error creating follow relationship: %s", err)
	}
	fmt.Printf("Bob follows Charlie: %+v\n", followResult2)

	// charlie follows alice
	followData3 := map[string]any{
		"follower_id": charlieID,
		"followed_id": aliceID,
	}
	var followResult3 map[string]any
	err = HelixClient.Query("createFollow", helix.WithData(followData3)).Scan(&followResult3)
	if err != nil {
		log.Fatalf("Error creating follow relationship: %s", err)
	}
	fmt.Printf("Charlie follows Alice: %+v\n", followResult3)

	fmt.Println("Creating posts...")

	// alice's post
	alicePostData := map[string]any{
		"user_id": aliceID,
		"content": "Hello world! My first post on HelixDB",
	}

	var alicePost CreatePostResponse
	err = HelixClient.Query("createPost", helix.WithData(alicePostData)).Scan(&alicePost)
	if err != nil {
		log.Fatalf("Error creating Alice's post: %s", err)
	}
	fmt.Printf("Created Alice's post: %+v\n", alicePost)

	// bob's post
	bobPostData := map[string]any{
		"user_id": bobID,
		"content": "Loving the graph database capabilities",
	}

	var bobPost CreatePostResponse
	err = HelixClient.Query("createPost", helix.WithData(bobPostData)).Scan(&bobPost)
	if err != nil {
		log.Fatalf("Error creating Bob's post: %s", err)
	}
	fmt.Printf("Created Bob's post: %+v\n", bobPost)

	// charlie's post
	charliePostData := map[string]any{
		"user_id": charlieID,
		"content": "Building cool social networks with Helix",
	}

	var charliePost CreatePostResponse
	err = HelixClient.Query("createPost", helix.WithData(charliePostData)).Scan(&charliePost)
	if err != nil {
		log.Fatalf("Error creating Charlie's post: %s", err)
	}
	fmt.Printf("Created Charlie's post: %+v\n", charliePost)

	fmt.Println("Creating post embeddings with dummy vectors...")

	// alice's post embedding
	aliceEmbeddingData := map[string]any{
		"post_id": alicePost.Post.ID,
		"vector":  []float64{0.1, 0.2, 0.3, 0.4, 0.5},
		"content": "Hello world! My first post on HelixDB",
	}
	var aliceEmbeddingResult map[string]any
	err = HelixClient.Query("createPostEmbedding", helix.WithData(aliceEmbeddingData)).Scan(&aliceEmbeddingResult)
	if err != nil {
		log.Fatalf("Error creating Alice's post embedding: %s", err)
	}
	fmt.Printf("Created Alice's embedding: %+v\n", aliceEmbeddingResult)

	// bob's post embedding
	bobEmbeddingData := map[string]any{
		"post_id": bobPost.Post.ID,
		"vector":  []float64{0.2, 0.3, 0.4, 0.5, 0.6},
		"content": "Loving the graph database capabilities",
	}
	var bobEmbeddingResult map[string]any
	err = HelixClient.Query("createPostEmbedding", helix.WithData(bobEmbeddingData)).Scan(&bobEmbeddingResult)
	if err != nil {
		log.Fatalf("Error creating Bob's post embedding: %s", err)
	}
	fmt.Printf("Created Bob's embedding: %+v\n", bobEmbeddingResult)

	// charlie's post embedding
	charlieEmbeddingData := map[string]any{
		"post_id": charliePost.Post.ID,
		"vector":  []float64{0.3, 0.4, 0.5, 0.6, 0.7},
		"content": "Building cool social networks with Helix",
	}
	var charlieEmbeddingResult map[string]any
	err = HelixClient.Query("createPostEmbedding", helix.WithData(charlieEmbeddingData)).Scan(&charlieEmbeddingResult)
	if err != nil {
		log.Fatalf("Error creating Charlie's post embedding: %s", err)
	}
	fmt.Printf("Created Charlie's embedding: %+v\n", charlieEmbeddingResult)

	fmt.Println("\nQuerying and displaying the data...")

	// get all users
	fmt.Println("All Users:")
	var usersResponse GetUsersResponse
	err = HelixClient.Query("getUsers").Scan(&usersResponse)
	if err != nil {
		log.Fatalf("Error getting users: %s", err)
	}
	fmt.Printf("%+v\n", usersResponse)

	// get all posts
	fmt.Println("\nAll Posts:")
	var postsResponse GetPostsResponse
	err = HelixClient.Query("getPosts").Scan(&postsResponse)
	if err != nil {
		log.Fatalf("Error getting posts: %s", err)
	}
	fmt.Printf("%+v\n", postsResponse)

	// get alice's posts
	fmt.Println("\nAlice's Posts:")
	var alicePostsResponse GetPostsResponse
	alicePostsData := map[string]any{"user_id": aliceID}
	err = HelixClient.Query("getPostsByUser", helix.WithData(alicePostsData)).Scan(&alicePostsResponse)
	if err != nil {
		log.Fatalf("Error getting Alice's posts: %s", err)
	}
	fmt.Printf("%+v\n", alicePostsResponse)

	// get who alice is following
	fmt.Println("\nWho Alice is Following:")
	var aliceFollowingResponse map[string]any
	aliceFollowingData := map[string]any{"user_id": aliceID}
	err = HelixClient.Query("getFollowing", helix.WithData(aliceFollowingData)).Scan(&aliceFollowingResponse)
	if err != nil {
		log.Fatalf("Error getting Alice's following: %s", err)
	}
	fmt.Printf("%+v\n", aliceFollowingResponse)

	// get bob's followers
	fmt.Println("\nBob's Followers:")
	var bobFollowersResponse map[string]any
	bobFollowersData := map[string]any{"user_id": bobID}
	err = HelixClient.Query("getFollowers", helix.WithData(bobFollowersData)).Scan(&bobFollowersResponse)
	if err != nil {
		log.Fatalf("Error getting Bob's followers: %s", err)
	}
	fmt.Printf("%+v\n", bobFollowersResponse)

	// search for posts similar to alice's embedding
	fmt.Println("\nSearching for posts similar to Alice's embedding [0.1, 0.2, 0.3, 0.4, 0.5]:")
	var searchResponse GetPostsResponse
	searchData := map[string]any{
		"vector": []float64{0.1, 0.2, 0.3, 0.4, 0.5},
		"k":      int64(1),
	}
	err = HelixClient.Query("searchPostEmbeddings", helix.WithData(searchData)).Scan(&searchResponse)
	if err != nil {
		log.Fatalf("Error searching post embeddings: %s", err)
	}
	fmt.Printf("%+v\n", searchResponse)
}
