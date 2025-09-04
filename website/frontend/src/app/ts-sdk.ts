"use server"

import HelixDB from "helix-ts";

const HELIXDB_URL = "http://localhost:6969";

const client = new HelixDB(HELIXDB_URL);

export async function createUser(name: string, age: number, email: string) {
    return await client.query("createUser", { "name": name, "age": age, "email": email });
}

export async function createFollow(follower_id: string, followed_id: string) {
    return await client.query("createFollow", { "follower_id": follower_id, "followed_id": followed_id });
}

export async function createPost(user_id: string, content: string) {
    return await client.query("createPost", { "user_id": user_id, "content": content });
}

export async function createPostEmbedding(post_id: string, vector: number[], content: string) {
    return await client.query("createPostEmbedding", { "post_id": post_id, "vector": vector, "content": content });
}

export async function getUsers() {
    return await client.query("getUsers", {});
}

export async function getPosts() {
    return await client.query("getPosts", {});
}

export async function getPostsByUser(user_id: string) {
    return await client.query("getPostsByUser", { "user_id": user_id });
}

export async function getFollowers(user_id: string) {
    return await client.query("getFollowers", { "user_id": user_id });
}

export async function getFollowing(user_id: string) {
    return await client.query("getFollowing", { "user_id": user_id });
}

export async function getUserPosts(user_id: string) {
    return await client.query("getUserPosts", { "user_id": user_id });
}

export async function searchPostEmbeddings(vector: number[], k: number) {
    return await client.query("searchPostEmbeddings", { "vector": vector, "k": k });
}