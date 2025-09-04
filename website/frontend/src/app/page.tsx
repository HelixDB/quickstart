"use client";

import { useEffect, useState } from "react";
import { initializePredefinedData } from "./data";
import InsertUser from "@/components/insertUser";
import Nav from "@/components/nav";
import InsertFollow from "@/components/insertFollow";
import InsertPost from "@/components/insertPost";
import GetUsers from "@/components/getUsers";
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
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '1' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setCurrentPage("insertUser");
            }
            else if (event.key === '2' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setCurrentPage("insertFollow");
            }
            else if (event.key === '3' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setCurrentPage("insertPost");
            }
            else if (event.key === '4' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setCurrentPage("getUsers");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                </div>
            </main>
        </div>
    );
}
