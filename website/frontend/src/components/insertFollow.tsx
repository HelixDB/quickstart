"use client";

import { useState, useEffect } from "react";
import { CheckCircle2Icon, MoreHorizontal, Search, CircleX, CircleMinus, CircleAlert, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
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

import { getUsers, createFollow } from "@/app/api";

interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export default function InsertFollow() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [nameFilter, setNameFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedFollowed, setSelectedFollowed] = useState<User | null>(null);
    const [selectedFollower, setSelectedFollower] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Alert state for showing submission results
    const [alert, setAlert] = useState<{
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

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const result = await getUsers();
                const usersData = result[0]?.users || [];
                setUsers(usersData);
                setFilteredUsers(usersData);
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

    // Filter users by name
    useEffect(() => {
        if (nameFilter.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [nameFilter, users]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to page 1 when rows per page changes or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage, nameFilter]);

    // Auto-dismiss alert after 5 seconds
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    const handleSetRelation = (user: User, type: 'following' | 'follower') => {
        if (type === 'following') {
            if (selectedFollower === user) {
                if (selectedFollowed !== null){
                    setSelectedFollower(selectedFollowed)
                }
                else {
                    setSelectedFollower(null)
                }
            }
            setSelectedFollowed(user);
        } else {
            if (selectedFollowed === user) {
                if (selectedFollower !== null){
                    setSelectedFollowed(selectedFollower)
                }
                else {
                    setSelectedFollowed(null)
                }
            }
            setSelectedFollower(user);
        }
    };

    const removeRelation = (userId: string) => {
        if (selectedFollowed?.id === userId) {
            setSelectedFollowed(null);
        } else if (selectedFollower?.id === userId) {
            setSelectedFollower(null);
        }
    };

    const handleCreateFollows = async () => {
        if (selectedFollowed === null || selectedFollower === null) {
            setAlert({
                show: true,
                type: 'error',
                title: 'No Relations Selected',
                message: 'Please select at least one follow relationship before creating follows.'
            });
            return;
        }

        try {
            const result = await createFollow({ follower_id: selectedFollower?.id, followed_id: selectedFollowed?.id });

            console.log("Follow relationship created:", result);

            setAlert({
                show: true,
                type: 'success',
                title: 'Follow Relationship Created',
                message: `${selectedFollower?.name} follows ${selectedFollowed?.name}`
            });

            // Clear selected relations after successful creation
            setSelectedFollowed(null);
            setSelectedFollower(null);

        } catch (error) {
            console.error("Error creating follows:", error);
            setAlert({
                show: true,
                type: 'error',
                title: 'Error Creating Follows',
                message: error instanceof Error ? error.message : 'An unexpected error occurred while creating follows.'
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getRelationType = (userId: string): 'followed' | 'follower' | null => {
        if (selectedFollowed?.id === userId) return 'followed';
        if (selectedFollower?.id === userId) return 'follower';
        return null;
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
        <>
            {/* Alert - Fixed Overlay */}
            {alert.show && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <Alert className={`${alert.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800'} shadow-lg`}>
                        {alert.type === 'success' ? (
                            <CheckCircle2Icon className={`h-4 w-4 text-green-600 dark:text-green-400`} />
                        ) : (
                            <CircleAlert className={`h-4 w-4 text-red-600 dark:text-red-400`} />
                        )}
                        <AlertTitle className={alert.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                            {alert.title}
                        </AlertTitle>
                        <AlertDescription className={alert.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                            {alert.message}
                        </AlertDescription>
                        <button
                            onClick={() => setAlert(prev => ({ ...prev, show: false }))}
                            className={`mt-2 text-xs underline ${alert.type === 'success' ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'}`}
                        >
                            <CircleMinus className={`cursor-pointer h-4 w-4 ${alert.type === 'success' ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'}`} />
                        </button>
                    </Alert>
                </div>
            )}

            {/* Insert Follow Section */}
            <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Insert Follow Relationships</h2>

                    {/* Selected Relations Summary */}
                    {(selectedFollowed !== null || selectedFollower !== null) && (
                        <div className="flex items-center gap-3">
                            {/* Follower Rectangle */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                selectedFollower 
                                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' 
                                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 border-dashed'
                            }`}>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Follower:
                                </div>
                                {selectedFollower ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                            {selectedFollower.name}
                                        </span>
                                        <button
                                            onClick={() => setSelectedFollower(null)}
                                            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                                        >
                                            <CircleX className="cursor-pointer h-4 w-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        Select user
                                    </span>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className="text-gray-400 dark:text-gray-500 font-bold">
                                →
                            </div>

                            {/* Following Rectangle */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                selectedFollowed 
                                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
                                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 border-dashed'
                            }`}>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Following:
                                </div>
                                {selectedFollowed ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                            {selectedFollowed.name}
                                        </span>
                                        <button
                                            onClick={() => setSelectedFollowed(null)}
                                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                        >
                                            <CircleX className="cursor-pointer h-4 w-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        Select user
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Controls */}
                <div className="mb-4 flex justify-between items-center mt-1">
                    {/* Name Filter */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Filter users by name"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
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

                {/* Users Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-500">Loading users...</div>
                    </div>
                ) : (
                    <>
                        {/* Table Container with Scrolling */}
                        <div className="max-h-[35vh] overflow-y-auto mb-4 rounded-md">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead className="min-w-[20px] font-semi-bold">Name</TableHead>
                                            <TableHead className="min-w-[40px] font-semi-bold">Age</TableHead>
                                            <TableHead className="min-w-[100px] font-semi-bold">Email</TableHead>
                                            <TableHead className="font-semi-bold">Created At</TableHead>
                                            <TableHead className="font-semi-bold">Updated At</TableHead>
                                            <TableHead className="w-[100px] font-semi-bold">Status</TableHead>
                                            <TableHead className="w-[50px] font-semi-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                    {nameFilter ? 'No users found matching your search.' : 'No users available.'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            currentUsers.map((user) => {
                                                const relationType = getRelationType(user.id);
                                                return (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-sm">{user.name.slice(0, 15)}{user.name.length > 15 ? '...' : ''}</TableCell>
                                                        <TableCell className="font-sm">{user.age}</TableCell>
                                                        <TableCell className="font-sm">{user.email.slice(0, 15)}{user.email.length > 15 ? '...' : ''}</TableCell>
                                                        <TableCell className="font-sm">{formatDate(user.created_at)}</TableCell>
                                                        <TableCell className="font-sm">{formatDate(user.updated_at)}</TableCell>
                                                        <TableCell>
                                                            {relationType ? (
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    relationType === 'followed' 
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                }`}>
                                                                    {relationType === 'followed' ? 'Following' : 'Follower'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="cursor-pointer h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleSetRelation(user, 'following')}
                                                                        className={relationType === 'followed' ? 'bg-green-50 dark:bg-green-950' : ''}
                                                                    >
                                                                        Set as Followed
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleSetRelation(user, 'follower')}
                                                                        className={relationType === 'follower' ? 'bg-purple-50 dark:bg-purple-950' : ''}
                                                                    >
                                                                        Set as Follower
                                                                    </DropdownMenuItem>
                                                                    {relationType && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => removeRelation(user.id)}
                                                                            variant="destructive"
                                                                        >
                                                                            Remove Selection
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination and info */}
                        {filteredUsers.length > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

                {/* Create Follows Button */}
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateFollows}
                        disabled={selectedFollowed === null || selectedFollower === null}
                        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Insert Follow
                    </button>
                    <button
                        onClick={() => {
                            setSelectedFollowed(null);
                            setSelectedFollower(null);
                        }}
                        disabled={selectedFollowed === null && selectedFollower === null}
                        className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </>
    );
}
