"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function Nav({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
    return (
        <NavigationMenu className="w-full">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        currentPage === "insertUser" 
                            ? "bg-foreground text-white hover:bg-foreground/80 hover:text-white" 
                            : "bg-foreground/10 hover:bg-foreground/5 focus:bg-foreground/5"
                    }`}>
                        <div className="cursor-pointer" onClick={() => setCurrentPage("insertUser")}>Insert User</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        currentPage === "insertFollow" 
                            ? "bg-foreground text-white hover:bg-foreground/80 hover:text-white" 
                            : "bg-foreground/10 hover:bg-foreground/5 focus:bg-foreground/5"
                    }`}>
                        <div className="cursor-pointer" onClick={() => setCurrentPage("insertFollow")}>Insert Follow</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        currentPage === "insertPost" 
                            ? "bg-foreground text-white hover:bg-foreground/80 hover:text-white" 
                            : "bg-foreground/10 hover:bg-foreground/5 focus:bg-foreground/5"
                    }`}>
                        <div className="cursor-pointer" onClick={() => setCurrentPage("insertPost")}>Insert Post</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        currentPage === "getUsers" 
                            ? "bg-foreground text-white hover:bg-foreground/80 hover:text-white" 
                            : "bg-foreground/10 hover:bg-foreground/5 focus:bg-foreground/5"
                    }`}>
                        <div className="cursor-pointer" onClick={() => setCurrentPage("getUsers")}>View Users</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}