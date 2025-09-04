"use client";

import { useState, useEffect, useCallback } from "react";
import { User, ChevronDown, Copy, Check } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getUsers, getPostsByUser } from "@/app/api";
import { getUsers as getUsersTS, getPostsByUser as getPostsByUserTS } from "@/app/ts-sdk";
import { Backend } from "@/app/page";

interface Post {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export default function GetUserPosts({ backend }: { backend: Backend }) {
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
    const [currBackend, setCurrBackend] = useState<Backend>(backend);

    // Fetch users on component mount
    const fetchUsers = useCallback(async () => {
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
        } finally {
            setLoading(false);
        }
    }, [backend]);
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch posts for selected user
    const fetchUserPosts = useCallback(async (userId: string) => {
        if (!userId) {
            setPosts([]);
            return;
        }

        try {
            setPostsLoading(true);
            let result;
            if (backend === Backend.API) {
                result = await getPostsByUser({ user_id: userId });
                result = result[0]?.posts;
            }
            else {
                result = await getPostsByUserTS(userId);
                result = result.posts;
            }
            setPosts(result || []);
            setCurrentPage(1); // Reset to first page when new data loads
        } catch (error) {
            console.error("Error fetching user posts:", error);
            setPosts([]);
        } finally {
            setPostsLoading(false);
        }
    }, [backend]);

    useEffect(() => {
        if (currBackend !== backend) {
            setCurrBackend(backend);
            fetchUserPosts(selectedUserId);
            fetchUsers();
        }
    }, [backend, currBackend, selectedUserId, fetchUserPosts, fetchUsers]);

    // Handle user selection change
    const handleUserChange = useCallback((userId: string) => {
        setSelectedUserId(userId);
        fetchUserPosts(userId);
    }, [fetchUserPosts]);

    // Calculate pagination
    const totalPages = Math.ceil(posts.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    // Reset to page 1 when rows per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage]);

    // Utility functions from getPosts
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

    const truncateContent = (content: string) => {
        if (content.length <= 25) return content;
        return content.substring(0, 25) + "...";
    };

    const copyButton = (data: string, id: string) => {
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

    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

    // Add helper functions for user selection
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

    // Keyboard navigation for pagination
    useEffect(() => {
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
    }, [currentPage, totalPages, handlePageChange]);

    return (
        <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">User Posts</h2>
            </div>

            {/* User Selection */}
            <div className="flex flex-col gap-2 mb-6">
                <label htmlFor="user-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select User
                </label>
                {loading ? (
                    <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse flex items-center px-3">
                        <span className="text-sm text-gray-500">Loading users...</span>
                    </div>
                ) : (
                    <Select value={selectedUserId} onValueChange={handleUserChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a user to view their posts">
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

            {/* Posts Section */}
            {selectedUserId && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Posts by {getSelectedUserName()}</h3>
                        
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

                    {postsLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">Loading posts...</div>
                        </div>
                    ) : (
                        <>
                            {/* Table Container */}
                            <div className="max-h-[33vh] overflow-y-auto">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="sticky top-0 dark:bg-gray-900 z-10">
                                            <TableRow>
                                                <TableHead className="w-fit font-semi-bold">ID</TableHead>
                                                <TableHead className="min-w-[200px] font-semi-bold">Content</TableHead>
                                                <TableHead className="font-semi-bold">Created At</TableHead>
                                                <TableHead className="font-semi-bold">Updated At</TableHead>
                                                <TableHead className="font-semi-bold">View Full</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentPosts.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                        No posts found for this user.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentPosts.map((post) => (
                                                    <TableRow key={post.id}>
                                                        <TableCell className="font-mono text-sm">{formatId(post.id)} {copyButton(post.id, post.id)}</TableCell>
                                                        <TableCell className="font-sm">{truncateContent(post.content)}</TableCell>
                                                        <TableCell className="font-sm">{formatDate(post.created_at)}</TableCell>
                                                        <TableCell className="font-sm">{formatDate(post.updated_at)}</TableCell>
                                                        <TableCell className="font-sm">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <button className="px-3 py-1 text-sm bg-foreground/80 hover:bg-foreground/60 text-white rounded-md transition-colors">
                                                                        View
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Post Content</DialogTitle>
                                                                        <DialogDescription>
                                                                            Created: {formatDate(post.created_at)} | Updated: {formatDate(post.updated_at)}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4">
                                                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto">
                                                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                                                                {post.content}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {posts.length > 0 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {Math.min(endIndex, posts.length)} of {posts.length} posts
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
                </>
            )}
        </div>
    );
}
