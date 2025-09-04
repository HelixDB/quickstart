package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/HelixDB/helix-go"
)

var HelixClient *helix.Client

// NOTE you will see responses being wrapped in array to match frontend expectation in some handlers,
// this is because our frontend expects an array of objects, but the backend returns a single object

func main() {
	// connect to helixdb client
	HelixClient = helix.NewClient("http://localhost:6969")

	// routes
	http.HandleFunc("/createUser", createUserHandler)
	http.HandleFunc("/createFollow", createFollowHandler)
	http.HandleFunc("/createPost", createPostHandler)
	http.HandleFunc("/createPostEmbedding", createPostEmbeddingHandler)
	http.HandleFunc("/getUsers", getUsersHandler)
	http.HandleFunc("/getPosts", getPostsHandler)
	http.HandleFunc("/getPostsByUser", getPostsByUserHandler)
	http.HandleFunc("/getFollowers", getFollowersHandler)
	http.HandleFunc("/getFollowing", getFollowingHandler)
	http.HandleFunc("/getUserPosts", getUserPostsHandler)
	http.HandleFunc("/searchPostEmbeddings", searchPostEmbeddingsHandler)
	http.HandleFunc("/health", healthHandler)

	// start server
	fmt.Println("Go backend server starting on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func parseJSONBody(r *http.Request) (map[string]any, error) {
	var data map[string]any
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func sendJSONResponse(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("createUser", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func createFollowHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("createFollow", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func createPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("createPost", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func createPostEmbeddingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("createPostEmbedding", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var response map[string]any
	err := HelixClient.Query("getUsers").Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func getPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var response map[string]any
	err := HelixClient.Query("getPosts").Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func getPostsByUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("getPostsByUser", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, response)
}

func getFollowersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("getFollowers", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, response)
}

func getFollowingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("getFollowing", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, response)
}

func getUserPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("getUserPosts", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, []map[string]any{response})
}

func searchPostEmbeddingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := parseJSONBody(r)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var response map[string]any
	err = HelixClient.Query("searchPostEmbeddings", helix.WithData(data)).Scan(&response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendJSONResponse(w, response)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := map[string]string{"status": "healthy"}
	sendJSONResponse(w, response)
}
