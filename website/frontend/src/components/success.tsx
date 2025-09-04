"use client";

import { CheckCircle2Icon, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface SuccessAlert {
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
}

export function SuccessComponent({ alert, setAlert }: { alert: SuccessAlert, setAlert: (alert: SuccessAlert) => void }) {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alert className={`${alert.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800'} shadow-lg relative`}>
                {alert.type === 'success' ? (
                    <CheckCircle2Icon className={`h-4 w-4 text-green-600 dark:text-green-400`} />
                ) : (
                    <CircleAlert className={`h-4 w-4 text-red-600 dark:text-red-400`} />
                )}
                <button
                    onClick={() => setAlert({ ...alert, show: false })}
                    className={`cursor-pointer absolute top-2 right-2 px-2 text-xs underline flex items-center gap-1 ${alert.type === 'success' ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'}`}
                    aria-label="Dismiss"
                >
                    Dismiss
                </button>
                <AlertTitle className={alert.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                    {alert.title}
                </AlertTitle>
                <AlertDescription className={alert.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    {alert.message}
                </AlertDescription>
            </Alert>
        </div>
    );
}