"use client"

import { 
    createUser, 
    createPost,
    getUsers,
    createPostEmbedding
} from "./api";

const predefinedUsers = [
    {
        name: "Alice",
        age: "25",
        email: "alice@example.com"
    },
    {
        name: "Bob",
        age: "30",
        email: "bob@example.com"
    },
    {
        name: "Charlie",
        age: "28",
        email: "charlie@example.com"
    }
];

const predefinedPosts = [
    {
        content: "Hello world! My first post on HelixDB",
        vector: [0.1, 0.2, 0.3, 0.4, 0.5]
    },
    {
        content: "Loving the graph database capabilities",
        vector: [0.2, 0.3, 0.4, 0.5, 0.6]
    },
    {
        content: "Building cool social networks with Helix",
        vector: [0.3, 0.4, 0.5, 0.6, 0.7]
    }
];

export async function initializePredefinedData() {
    const result = await getUsers();
    const users = result[0]?.users || [];

    if (users.length === 0) {
        console.log("No users found, initializing predefined data");
        for (let index = 0; index < predefinedUsers.length; index++) {
            const user = predefinedUsers[index];
            const userResult = await createUser({
                name: user.name,
                age: parseInt(user.age),
                email: user.email
            });
            const userId = userResult[0]?.user?.id.toString() || '';
            if (userId.length > 0) {
                const postResult = await createPost({
                    content: predefinedPosts[index].content,
                    user_id: userId
                });
                const postId = postResult[0]?.post?.id;
                if (postId) {
                    await createPostEmbedding({
                        post_id: postId,
                        vector: predefinedPosts[index].vector,
                        content: predefinedPosts[index].content
                    });
                }
            }
        }
    } else {
        console.log("Users found, skipping initialization");
    }
}