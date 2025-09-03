"use client";

import { useState } from "react";

export default function Home() {
    const predefinedUsers = [
        {
            name: "Alice Johnson",
            age: "28",
            description: "Software engineer with expertise in React and Node.js. Loves hiking and photography.",
            embedding: "0.234, 0.891, 0.567, 0.123, 0.789"
        },
        {
            name: "Bob Smith",
            age: "34",
            description: "Marketing manager specializing in digital campaigns. Enjoys cooking and travel.",
            embedding: "0.456, 0.123, 0.789, 0.345, 0.567"
        },
        {
            name: "Carol Davis",
            age: "42",
            description: "Data scientist with experience in machine learning and AI. Passionate about chess.",
            embedding: "0.678, 0.345, 0.123, 0.789, 0.234"
        },
        {
            name: "David Wilson",
            age: "29",
            description: "UX designer focused on mobile applications. Avid runner and music enthusiast.",
            embedding: "0.123, 0.567, 0.345, 0.891, 0.678"
        },
        {
            name: "Emma Brown",
            age: "31",
            description: "Product manager with background in fintech. Loves reading and gardening.",
            embedding: "0.789, 0.234, 0.678, 0.123, 0.456"
        }
    ];

    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [searchVector, setSearchVector] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchAge, setSearchAge] = useState("");
    
    const currentUser = predefinedUsers[currentUserIndex];
    const allEmbeddings = predefinedUsers.map(user => user.embedding);

    const nextUser = () => {
        setCurrentUserIndex((prev) => (prev + 1) % predefinedUsers.length);
    };

    const insertUser = () => {
        console.log("Inserting user:", currentUser);
    };

    const getAllUsers = () => {
        console.log("Getting all users");
    };

    const getUserByName = () => {
        console.log("Getting user by name:", searchName);
    };

    const getUserByAge = () => {
        console.log("Getting user by age:", searchAge);
    };

    const searchByVector = () => {
        console.log("Searching by vector:", searchVector);
    };

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-center sm:text-left">
                    HelixDB Quickstart
                </h1>

                {/* Insert User Section */}
                <div className="w-full bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Insert User</h2>
                    <div className="flex flex-col gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            User {currentUserIndex + 1} of {predefinedUsers.length}
                        </div>
                        
                        <div className="rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm">
                            <strong>Name:</strong> {currentUser.name}
                        </div>
                        
                        <div className="rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm">
                            <strong>Age:</strong> {currentUser.age}
                        </div>
                        
                        <div className="rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm min-h-[100px]">
                            <div className="mb-3">
                                <strong>Description:</strong> {currentUser.description}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                <strong>Embedding:</strong> {currentUser.embedding}
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={nextUser}
                                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-5"
                            >
                                Next User
                            </button>
                            <button
                                onClick={insertUser}
                                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5"
                            >
                                Insert User
                            </button>
                        </div>
                    </div>
                </div>

                {/* Get User Section */}
                <div className="w-full bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Get Users</h2>

                    <div className="flex gap-4 items-center flex-wrap mb-4">
                        <button
                            onClick={getAllUsers}
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5"
                        >
                            Get All Users
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <select
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="flex-1 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a name...</option>
                                {predefinedUsers.map((user, index) => (
                                    <option key={index} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={getUserByName}
                                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm px-5 py-2"
                            >
                                Get User by Name
                            </button>
                        </div>

                        <div className="flex gap-2 items-center">
                            <select
                                value={searchAge}
                                onChange={(e) => setSearchAge(e.target.value)}
                                className="flex-1 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select an age...</option>
                                {[...new Set(predefinedUsers.map(user => user.age))].sort((a, b) => parseInt(a) - parseInt(b)).map((age, index) => (
                                    <option key={index} value={age}>
                                        {age} years old
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={getUserByAge}
                                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm px-5 py-2"
                            >
                                Get User by Age
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <select
                                    value={searchVector}
                                    onChange={(e) => setSearchVector(e.target.value)}
                                    className="flex-1 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select an embedding vector...</option>
                                    {predefinedUsers.map((user, index) => (
                                        <option key={index} value={user.embedding}>
                                            {user.name}'s embedding: {user.embedding}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={searchByVector}
                                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm px-5 py-2"
                                >
                                    Vector Search Description
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">
                                {predefinedUsers.length} embedding vectors available
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
