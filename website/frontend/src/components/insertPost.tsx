"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SuccessComponent, SuccessAlert } from "@/components/success";

import { getUsers, createPost, createPostEmbedding } from "@/app/api";
import { getUsers as getUsersTS, createPost as createPostTS, createPostEmbedding as createPostEmbeddingTS } from "@/app/ts-sdk";
import { Backend } from "@/app/page";

interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export default function InsertPost({ backend }: { backend: Backend }) {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [postContent, setPostContent] = useState("");
    const [postVector, setPostVector] = useState<number[]>([0.0, 0.0, 0.0, 0.0, 0.0]);
    const [loading, setLoading] = useState(true);
    
    // Alert state for showing submission results
    const [alert, setAlert] = useState<SuccessAlert>({
        show: false,
        type: 'success',
        title: '',
        message: ''
    });

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                let result;
                if (backend === Backend.API) {
                    result = await getUsers();
                    result = result[0]?.users;
                }
                else {
                    result = await getUsersTS();
                    result = result.users;
                }
                const usersData = result || [];
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Error Loading Users',
                    message: 'Failed to load users from the server.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Auto-dismiss alert after 5 seconds
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!selectedUserId) {
            setAlert({
                show: true,
                type: 'error',
                title: 'User Required',
                message: 'Please select a user before creating the post.'
            });
            return;
        }

        if (!postContent.trim()) {
            setAlert({
                show: true,
                type: 'error',
                title: 'Content Required',
                message: 'Please enter some content for the post.'
            });
            return;
        }


        try {
            const selectedUser = users.find(user => user.id === selectedUserId);
            let postResult;
            if (backend === Backend.API) {
                postResult = await createPost({ user_id: selectedUserId, content: postContent.trim() });
                postResult = postResult[0]?.post;
            }
            else {
                postResult = await createPostTS(selectedUserId, postContent.trim());
                postResult = postResult.post;
            }

            console.log("Post created:", postResult.content.substring(0, 50));

            // Create embedding
            const postId = postResult?.id;
            if (postId) {
                let embeddingResult;
                if (backend === Backend.API) {
                    embeddingResult = await createPostEmbedding({
                    post_id: postId,
                    vector: postVector,
                    content: postContent.trim()
                    });
                    embeddingResult = embeddingResult[0]?.embedding_node?.data;
                }
                else {
                    embeddingResult = await createPostEmbeddingTS(postId, postVector, postContent.trim());
                    embeddingResult = embeddingResult.embedding;
                }
                console.log("Embedding created:", embeddingResult.slice(0, 5));
            }

            setAlert({
                show: true,
                type: 'success',
                title: 'Post Created',
                message: `Post by ${selectedUser?.name} has been created successfully with embedding.`
            });

            // Reset form after successful submission
            setSelectedUserId("");
            setPostContent("");
            setPostVector([0.0, 0.0, 0.0, 0.0, 0.0]);

        } catch (error) {
            console.error("Error creating post:", error);
            setAlert({
                show: true,
                type: 'error',
                title: 'Error Creating Post',
                message: error instanceof Error ? error.message : 'An unexpected error occurred while creating the post.'
            });
        }
    };

    const clearForm = () => {
        setSelectedUserId("");
        setPostContent("");
        setPostVector([0.0, 0.0, 0.0, 0.0, 0.0]);
    };

    const getSelectedUserName = () => {
        const user = users.find(u => u.id === selectedUserId);
        return user?.name || '';
    };

    const groupedUsers = users.reduce((groups, user) => {
        const firstLetter = user.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(user);
        return groups;
    }, {} as Record<string, User[]>);

    const sortedGroups = Object.keys(groupedUsers).sort();

    return (
        <>
            {/* Alert */}
            {alert.show && (
                <SuccessComponent alert={alert} setAlert={setAlert} />
            )}

            {/* Insert Post Section */}
            <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">Insert Post</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* User Selection */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="user-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select User
                        </label>
                        {loading ? (
                            <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse flex items-center px-3">
                                <span className="text-sm text-gray-500">Loading users...</span>
                            </div>
                        ) : (
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a user to create post for">
                                        {selectedUserId && (
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>{getSelectedUserName()}</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {sortedGroups.length === 0 ? (
                                        <SelectItem value="no-users" disabled>
                                            No users available
                                        </SelectItem>
                                    ) : (
                                        sortedGroups.map(letter => (
                                            <SelectGroup key={letter}>
                                                <SelectLabel>{letter}</SelectLabel>
                                                {groupedUsers[letter].map(user => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4" />
                                                            <span>{user.name}</span>
                                                            <span className="text-xs text-gray-500">({user.email})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="post-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Post Content
                        </label>
                        <Textarea
                            id="post-content"
                            placeholder="What's on your mind? Share your thoughts..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="resize-none min-h-[120px]"
                        />
                        <div className="flex justify-end items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>
                                {postContent.length} characters
                            </span>
                        </div>
                    </div>

                    {/* Post Vector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Embedding Vector
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {postVector.map((value, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    step={0.1}
                                    placeholder={`Float ${index + 1}`}
                                    value={value}
                                    onChange={(e) => {
                                        const newVector = [...postVector];
                                        newVector[index] = parseFloat(e.target.value) || 0.0;
                                        setPostVector(newVector);
                                        console.log("Post vector updated:", newVector);
                                    }}
                                    className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={!selectedUserId || !postContent.trim() || postVector.every(v => v === 0.0)}
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Insert Post
                        </button>
                        <button
                            type="button"
                            onClick={clearForm}
                            disabled={!selectedUserId && !postContent.trim() && postVector.every(v => v === 0.0)}
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}