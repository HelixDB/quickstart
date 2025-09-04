"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { searchPostEmbeddings } from "@/app/api";
import { searchPostEmbeddings as searchPostEmbeddingsTS } from "@/app/ts-sdk";
import { Backend } from "@/app/page";

interface Post {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function SearchPosts({ backend }: { backend: Backend }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchVector, setSearchVector] = useState<number[]>([0.0, 0.0, 0.0, 0.0, 0.0]);
    const [kValue, setKValue] = useState<number>(10);
    const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
    const [hasSearched, setHasSearched] = useState(false);
    const [currBackend, setCurrBackend] = useState<Backend>(backend);
    
    const handleSearch = async () => {
        try {
            setLoading(true);
            setHasSearched(true);
            let result;
            if (backend === Backend.API) {
                result = await searchPostEmbeddings({ vector: searchVector, k: kValue });
                result = result[0]?.posts;
            } else {
                result = await searchPostEmbeddingsTS(searchVector, kValue);
                result = result.posts;
            }
            setPosts(result || []);
            console.log("Search results:", result?.length || 0);
        } catch (error) {
            console.error("Error searching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currBackend !== backend) {
            setCurrBackend(backend);
            setHasSearched(false);
            setPosts([]);
            if (searchVector.some(v => v !== 0.0)){
                handleSearch();
            }
        }
    }, [backend]);

    const clearForm = () => {
        setSearchVector([0.0, 0.0, 0.0, 0.0, 0.0]);
        setKValue(10);
        setPosts([]);
        setHasSearched(false);
    };

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

    
    return (
        <div className="w-full h-[65vh] bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6 overflow-y-auto" style={{ paddingBottom: '10px' }}>
            <h2 className="text-2xl font-semibold mb-4">Search Posts</h2>
            
            {/* Search Form */}
            <div className="flex flex-col gap-2 mb-6">
                {/* Vector Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search Vector
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {searchVector.map((value, index) => (
                            <input
                                key={index}
                                type="number"
                                step={0.1}
                                placeholder={`Float ${index + 1}`}
                                value={value}
                                onChange={(e) => {
                                    const newVector = [...searchVector];
                                    newVector[index] = parseFloat(e.target.value) || 0.0;
                                    setSearchVector(newVector);
                                }}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        ))}
                    </div>
                </div>

                {/* K Value Slider */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Top {kValue} Results
                    </label>
                    <div className="px-2">
                        <Slider
                            value={[kValue]}
                            onValueChange={(value) => setKValue(value[0])}
                            max={20}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span>20</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            {hasSearched && (
                <>
                    {/* Table Container */}
                    <div className="max-h-[30vh] overflow-y-auto">
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
                                    {posts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                No posts found for your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        posts.map((post) => (
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
                </>
            )}

            {/* Search Button */}
            <div className="mt-3 flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={handleSearch}
                        disabled={loading || searchVector.every(v => v === 0.0)}
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Searching...' : 'Search Posts'}
                    </button>
                    <button
                        type="button"
                        onClick={clearForm}
                        disabled={searchVector.every(v => v === 0.0) && kValue === 10 && !hasSearched}
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear
                    </button>
                </div>
                {hasSearched && posts.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {posts.length} posts
                    </div>
                )}
            </div>
        </div>
    );
}