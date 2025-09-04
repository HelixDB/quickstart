"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { SuccessComponent, SuccessAlert } from "@/components/success";

import { createUser } from "@/app/api";
import { createUser as createUserTS } from "@/app/ts-sdk";
import { Backend } from "@/app/page";

export default function InsertUser({ backend }: { backend: Backend }) {
    // Insert user form state
    const [insertUserForm, setInsertUserForm] = useState({
        name: "",
        age: "",
        email: ""
    });

    // Insert user alert state for showing submission results
    const [insertUserAlert, setInsertUserAlert] = useState<SuccessAlert>({
        show: false,
        type: 'success',
        title: '',
        message: ''
    });

    const handleInsertUserInputChange = (field: keyof typeof insertUserForm, value: string) => {
        setInsertUserForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatId = (id: string) => {
        const parts = id.split('-');
        return "...-" + parts.slice(1, -1).join('-') + "-...";
    };

    // Auto-dismiss alert after 5 seconds
    useEffect(() => {
        if (insertUserAlert.show) {
            const timer = setTimeout(() => {
                setInsertUserAlert({ ...insertUserAlert, show: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [insertUserAlert.show]);

    const handleInsertUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (insertUserForm.name && insertUserForm.age && insertUserForm.email) {
            const userData = {
                name: insertUserForm.name,
                age: parseInt(insertUserForm.age),
                email: insertUserForm.email
            };
            try {
                let result;
                if (backend === Backend.API) {
                    result = await createUser(userData);
                    result = result[0]?.user;
                }
                else {
                    result = await createUserTS(userData.name, userData.age, userData.email);
                    result = result.user;
                }

                console.log("User created:", result);
                
                // Show success alert with result
                setInsertUserAlert({
                    show: true,
                    type: 'success',
                    title: 'User Created Successfully!',
                    message: `User "${userData.name}" (ID: ${formatId(result?.id || 'Unknown')}) has been created successfully.`
                });
                
                // Reset form after successful submission
                setInsertUserForm({ name: "", age: "", email: "" });
            } catch (error) {
                console.error("Error creating user:", error);
                
                // Show error alert
                setInsertUserAlert({
                    show: true,
                    type: 'error',
                    title: 'Error Creating User',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred while creating the user.'
                });
            }
        }
    };

    return (
        <>
            {/* Insert User Alert - Fixed Overlay */}
            {insertUserAlert.show && (
                <SuccessComponent alert={insertUserAlert} setAlert={setInsertUserAlert} />
            )}

            {/* Insert User Section */}
            <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-hidden">
                <h2 className="text-2xl font-semibold mb-4">Insert User</h2>
                
                <form onSubmit={handleInsertUserSubmit} className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Lebron James"
                            value={insertUserForm.name}
                            onChange={(e) => handleInsertUserInputChange("name", e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Age
                        </label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="38"
                            value={insertUserForm.age}
                            onChange={(e) => handleInsertUserInputChange("age", e.target.value)}
                            min="1"
                            max="120"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="lebron.james@gmail.com"
                            value={insertUserForm.email}
                            onChange={(e) => handleInsertUserInputChange("email", e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={!insertUserForm.name || !insertUserForm.age || !insertUserForm.email}
                            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Insert User
                        </button>
                        <button
                            type="button"
                            onClick={() => setInsertUserForm({ name: "", age: "", email: "" })}
                            disabled={!insertUserForm.name || !insertUserForm.age || !insertUserForm.email}
                            className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
