"use client";

import { useEffect, useState } from "react";
import { initializePredefinedData } from "./data";
import InsertUser from "@/components/insertUser";
import Nav from "@/components/nav";
import InsertFollow from "@/components/insertFollow";
import InsertPost from "@/components/insertPost";
import GetUsers from "@/components/getUsers";
import GetPosts from "@/components/getPosts";
import GetUserPosts from "@/components/getUserPosts";
import GetFollows from "@/components/getFollows";
import SearchPosts from "@/components/searchPosts";
import { Switch } from "@/components/ui/switch";

export enum Backend {
    API = "api",
    TS_SDK = "ts-sdk"
}

export default function Home() {
    const [currentPage, setCurrentPage] = useState("insertUser");
    const [backend, setBackend] = useState<Backend>(Backend.API);

    useEffect(() => {
        initializePredefinedData();
    }, []);

    useEffect(() => {
        const pages = ["insertUser", "insertFollow", "insertPost", "getUsers", "getPosts", "getUserPosts", "getFollows", "searchPosts"];
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && (event.key >= '1' && event.key <= pages.length.toString())) {
                event.preventDefault();
                setCurrentPage(pages[parseInt(event.key) - 1]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Alt') {
                event.preventDefault();
                setBackend(backend === Backend.API ? Backend.TS_SDK : Backend.API);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [backend]);

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center max-h-screen p-7 pb-15 sm:p-20">
            <main className="flex flex-col gap-[30px] row-start-2 items-center sm:items-start max-w-4xl w-full">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-4xl font-bold tracking-tight text-center sm:text-left">
                        HelixDB Quickstart
                    </h1>
                    
                    {/* Backend Toggle */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                            API
                        </span>
                        <Switch
                            id="backend-switch"
                            checked={backend === Backend.TS_SDK}
                            onCheckedChange={(checked) => {
                                setBackend(checked ? Backend.TS_SDK : Backend.API);
                            }}
                        />
                        <span className="text-sm font-medium">
                            TypeScript SDK
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />

                <div className="w-full h-full">
                    {/* Insert User Page */}
                    {currentPage === "insertUser" && <InsertUser backend={backend} />}

                    {/* Insert Follow Page */}
                    {currentPage === "insertFollow" && <InsertFollow backend={backend} />}

                    {/* Insert Post Page */}
                    {currentPage === "insertPost" && <InsertPost backend={backend} />}

                    {/* Get Users Page */}
                    {currentPage === "getUsers" && <GetUsers backend={backend} />}

                    {/* Get Posts Page */}
                    {currentPage === "getPosts" && <GetPosts backend={backend} />}

                    {/* Get User Posts Page */}
                    {currentPage === "getUserPosts" && <GetUserPosts backend={backend} />}

                    {/* Get Follows Page */}
                    {currentPage === "getFollows" && <GetFollows backend={backend} />}

                    {/* Search Posts Page */}
                    {currentPage === "searchPosts" && <SearchPosts backend={backend} />}
                </div>
            </main>
        </div>
    );
}
