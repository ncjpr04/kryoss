"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOrder: string;
    onSortOrderChange: (value: string) => void;
}

export function SearchBar({
    search,
    onSearchChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderChange,
}: SearchBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {search && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSearchChange("")}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex gap-2">
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Date Added</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={onSortOrderChange}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
