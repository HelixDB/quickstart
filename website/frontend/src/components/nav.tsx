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
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/80 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        <div className="cursor-pointer" onClick={() => setCurrentPage("insertUser")}>Insert User</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/80 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        <div className="cursor-pointer" onClick={() => setCurrentPage("insertFollow")}>Insert Follow</div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}