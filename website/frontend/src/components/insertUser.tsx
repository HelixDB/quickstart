"use client";

import { useState, useEffect } from "react";
import { CheckCircle2Icon, CircleMinus, CircleAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { createUser } from "@/app/api";

export default function InsertUser() {
    // Insert user form state
    const [insertUserForm, setInsertUserForm] = useState({
        name: "",
        age: "",
        email: ""
    });

    // Insert user alert state for showing submission results
    const [insertUserAlert, setInsertUserAlert] = useState<{
        show: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
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

    // Auto-dismiss alert after 5 seconds
    useEffect(() => {
        if (insertUserAlert.show) {
            const timer = setTimeout(() => {
                setInsertUserAlert(prev => ({ ...prev, show: false }));
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
                const result = await createUser(userData);
                console.log("User created:", result);
                
                // Show success alert with result
                setInsertUserAlert({
                    show: true,
                    type: 'success',
                    title: 'User Created Successfully!',
                    message: `User "${userData.name}" (ID: ${result[0]?.user?.id || 'Unknown'}) has been created successfully.`
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
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <Alert className={`${insertUserAlert.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800'} shadow-lg`}>
                        {insertUserAlert.type === 'success' ? (
                            <CheckCircle2Icon className={`h-4 w-4 text-green-600 dark:text-green-400`} />
                        ) : (
                            <CircleAlert className={`h-4 w-4 text-red-600 dark:text-red-400`} />
                        )}
                        <AlertTitle className={insertUserAlert.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                            {insertUserAlert.title}
                        </AlertTitle>
                        <AlertDescription className={insertUserAlert.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                            {insertUserAlert.message}
                        </AlertDescription>
                        <button
                            onClick={() => setInsertUserAlert(prev => ({ ...prev, show: false }))}
                            className={`mt-2 text-xs underline ${insertUserAlert.type === 'success' ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'}`}
                        >
                            <CircleMinus className={`cursor-pointer h-4 w-4 ${insertUserAlert.type === 'success' ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'}`} />
                        </button>
                    </Alert>
                </div>
            )}

            {/* Insert User Section */}
            <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-auto">
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
