"use server"

const BACKEND_URL = "http://localhost:8000"

export async function createUser(data: { name: string, age: number, email: string }) {
    const response = await fetch(`${BACKEND_URL}/createUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function createFollow(data: { follower_id: string, followed_id: string }) {
    const response = await fetch(`${BACKEND_URL}/createFollow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function createPost(data: { user_id: string, content: string }) {
    const response = await fetch(`${BACKEND_URL}/createPost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function createPostEmbedding(data: { post_id: string, vector: number[], content: string }) {
    const response = await fetch(`${BACKEND_URL}/createPostEmbedding`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function getUsers() {
    const response = await fetch(`${BACKEND_URL}/getUsers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}

export async function getPosts() {
    const response = await fetch(`${BACKEND_URL}/getPosts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}

export async function getPostsByUser(data: { user_id: string }) {
    const response = await fetch(`${BACKEND_URL}/getPostsByUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function getFollowers(data: { user_id: string }) {
    const response = await fetch(`${BACKEND_URL}/getFollowers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function getFollowing(data: { user_id: string }) {
    const response = await fetch(`${BACKEND_URL}/getFollowing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export async function searchPostEmbeddings(data: { vector: number[], k: number }) {
    const response = await fetch(`${BACKEND_URL}/searchPostEmbeddings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}