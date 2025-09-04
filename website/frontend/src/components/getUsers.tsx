"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getUsers } from "@/app/api";
import { getUsers as getUsersTS } from "@/app/ts-sdk";
import { Backend } from "@/app/page";

interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export default function GetUsers({ backend }: { backend: Backend }) {
    const [users, setUsers] = useState<User[]>([]);
    const [currBackend, setCurrBackend] = useState<Backend>(backend);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());

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
            setUsers(result || []);
            console.log("Users fetched:", result.length);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (currBackend !== backend) {
            setCurrBackend(backend);
            fetchUsers();
        }
    }, [backend]);

    // Calculate pagination
    const totalPages = Math.ceil(users.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    // Reset to page 1 when rows per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatId = (id: string) => {
        const parts = id.split('-');
        return "...-" + parts.slice(1, -1).join('-') + "-...";
    };

    const copyButton = (data: any, id: string) => {
        const isCopied = copiedIds.has(id);
        
        return (
            <button 
                className="ml-2 cursor-pointer active:scale-95 transition-transform" 
                onClick={() => {
                    navigator.clipboard.writeText(data);
                    setCopiedIds(prev => new Set([...prev, id]));
                    setTimeout(() => {
                        setCopiedIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(id);
                            return newSet;
                        });
                    }, 500);
                }}
            >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
        );
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink 
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        // Add visible page numbers
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                        isActive={currentPage === page}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    useEffect(() => {
        // If .  is pressed, go to next page, if , is pressed, go to previous page
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '.') {
                if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                }
            }
            else if (event.key === ',') {
                if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPage, totalPages]);

    return (
        <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Users</h2>
                
                {/* Rows per page selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                                {rowsPerPage}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[1, 5, 10, 15, 20, 50, 100].map((rows) => (
                                <DropdownMenuItem
                                    key={rows}
                                    onClick={() => setRowsPerPage(rows)}
                                    className={rowsPerPage === rows ? 'bg-gray-100 dark:bg-gray-800' : ''}
                                >
                                    {rows}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Loading users...</div>
                </div>
            ) : (
                <>
                    {/* Table Container */}
                    <div className="max-h-[48vh] overflow-y-auto">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="sticky top-0 dark:bg-gray-900 z-10">
                                    <TableRow>
                                        <TableHead className="w-fit font-semi-bold">ID</TableHead>
                                        <TableHead className="min-w-[60px] font-semi-bold">Name</TableHead>
                                        <TableHead className="min-w-[40px] font-semi-bold">Age</TableHead>
                                        <TableHead className="min-w-[100px] font-semi-bold">Email</TableHead>
                                        <TableHead className="font-semi-bold">Created At</TableHead>
                                        <TableHead className="font-semi-bold">Updated At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-mono text-sm">{formatId(user.id)} {copyButton(user.id, user.id)}</TableCell>
                                                <TableCell className="font-sm">{user.name}</TableCell>
                                                <TableCell className="font-sm">{user.age}</TableCell>
                                                <TableCell className="font-sm">{user.email}</TableCell>
                                                <TableCell className="font-sm">{formatDate(user.created_at)}</TableCell>
                                                <TableCell className="font-sm">{formatDate(user.updated_at)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {users.length > 0 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {Math.min(endIndex, users.length)} of {users.length} users
                            </div>
                            
                            {totalPages > 1 && (
                                <Pagination className="w-fit">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                        
                                        {renderPaginationItems()}
                                        
                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}