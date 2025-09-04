"use client";

import { useEffect, useState } from "react";
import { 
    createUser, 
    createPost,
    getUsers 
} from "./api";
import InsertUser from "@/components/insertUser";
import Nav from "@/components/nav";
import InsertFollow from "@/components/insertFollow";
import InsertPost from "@/components/insertPost";

export default function Home() {
    const [currentPage, setCurrentPage] = useState("insertUser");

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

    useEffect(() => {
        const initializePredefinedData = async () => {
            for (let index = 0; index < predefinedUsers.length; index++) {
                const user = predefinedUsers[index];
                const userResult = await createUser({
                    name: user.name,
                    age: parseInt(user.age),
                    email: user.email
                });
                const userId = userResult[0]?.user?.id.toString() || '';
                if (userId.length > 0) {
                    await createPost({
                        content: predefinedPosts[index].content,
                        user_id: userId
                    });
                }
            }
        };
        
        // initializePredefinedData();
    }, []);

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-center sm:text-left">
                    HelixDB Quickstart
                </h1>

                {/* Navigation Menu */}
                <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />

                <div className="w-full h-full">
                    {/* Insert User Page */}
                    {currentPage === "insertUser" && <InsertUser />}

                    {/* Insert Follow Page */}
                    {currentPage === "insertFollow" && <InsertFollow />}

                    {/* Insert Post Page */}
                    {currentPage === "insertPost" && <InsertPost />}
                </div>
            </main>
        </div>
    );
}
