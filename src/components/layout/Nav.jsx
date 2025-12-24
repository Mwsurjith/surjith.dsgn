"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretDown, UserCircle, FigmaLogo } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import MicroAppCard from "@/components/portfolio/MicroAppCard";
import { microApps } from "@/constants/site";

export default function Nav() {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAppClick = (app) => {
        if (app.href) {
            router.push(app.href);
        }
        setIsDropdownOpen(false);
    };

    return (
        <nav className="w-full p-4 flex justify-between items-center fixed top-0 z-10">
            {/* Prefix */}
            <div className="flex items-center p-2 h-12 rounded-xl bg-zinc-800 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04),0px_0px_0.5px_0px_rgba(0,0,0,0.16)]">
                {/* Figma Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center px-1 py-1 rounded-md h-8 hover:bg-zinc-700 transition-colors cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <FigmaLogo size={20} weight="light" className="text-zinc-200" />
                        <CaretDown
                            size={16}
                            className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">
                            <div className="p-2">
                                <p className="text-xs text-zinc-500 uppercase tracking-wide px-2 py-1 mb-4">
                                    Micro Apps
                                </p>
                                <div className="flex gap-2">
                                    {microApps.map((app) => (
                                        <MicroAppCard
                                            key={app.id}
                                            logo={app.logo}
                                            name={app.name}
                                            bgColor={app.bgColor}
                                            onClick={() => handleAppClick(app)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Author */}
                <Link href="/" className="flex items-center gap-1 p-1.5 hover:opacity-80 transition-opacity">
                    <p className="text-sm font-medium text-zinc-200">Surjith</p>
                    <div className="flex items-center justify-center px-1 py-0.5 rounded bg-blue-500/10 text-blue-300 text-xs font-normal leading-[14px]">
                        Product Designer
                    </div>
                </Link>
            </div>

            {/* Suffix */}
            <div className="flex items-center gap-2 p-2 h-12 rounded-xl bg-zinc-800 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04),0px_0px_0.5px_0px_rgba(0,0,0,0.16)]">
                {/* User Image */}
                <Link href="/" className="flex items-center justify-center p-1 hover:opacity-80 transition-opacity">
                    <UserCircle size={24} className="text-zinc-400" />
                </Link>

                {/* Primary Button */}
                <Button className="bg-blue-400 text-white hover:bg-blue-500">Get in touch</Button>
            </div>
        </nav>
    );
}

