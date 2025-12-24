"use client";
import { useState } from "react";
import { ArrowUpRight, Copy, CheckCircle, Check } from "@phosphor-icons/react";
import { Button } from "../ui/button";

export default function Footer() {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText("mwsurjith51@gmail.com");
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    };

    return (
        <footer className="w-full bg-zinc-900 py-20 px-5">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-xs font-medium tracking-[0.1em] uppercase text-zinc-400 mb-1">
                        HAVE A PROJECT IN MIND?
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Pick a sprint below to get started.
                    </p>
                </div>

                {/* Sprint Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {/* Website Sprint Card */}
                    <a
                        href="https://mwsurjith.notion.site/2cdbcb45563d80bf9e89fdbfc1a3fd31?pvs=105"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-zinc-950 border border-transparent p-6 flex flex-col gap-4 hover:border-blue-400 transition-all cursor-pointer"
                    >
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
                            2 WEEKS
                        </span>
                        <h3 className="font-[Gloock] text-3xl text-white">
                            Marketing Website Sprint
                        </h3>
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                Design + Build + Deploy (Fully Live)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                Responsive + Fast + SEO Basics
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                Lead Capture (Forms + Analytics)
                            </li>
                        </ul>
                        <Button className="mt-4 items-center p-1 self-start bg-transparent text-white border-b-2 border-transparent text-sm font-medium cursor-pointer transition-all duration-300 group-hover:bg-transparent group-hover:border-white group-hover:-translate-y-1 hover:bg-transparent hover:border-white hover:-translate-y-1 rounded-none h-auto">
                            Start Website Sprint
                        </Button>
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    {/* MVP Sprint Card */}
                    <a
                        href="https://www.notion.so/mwsurjith/2cdbcb45563d8071bf93f4c106d03370?pvs=106"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-zinc-950 border border-transparent p-6 flex flex-col gap-4 hover:border-blue-400 transition-all cursor-pointer"
                    >
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
                            6 WEEKS
                        </span>
                        <h3 className="font-[Gloock] text-3xl text-white">
                            0 → 1 MVP Web App Sprint
                        </h3>
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                UX + UI + Working Code
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                Auth + Database + Core Features
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle size={20} weight="fill" className="text-green-400/60" />
                                Deploy + Handoff (So it can grow)
                            </li>
                        </ul>
                        <Button className="mt-4 items-center p-1 self-start bg-transparent text-white  border-b-2 border-transparent text-sm font-medium cursor-pointer transition-all duration-300 group-hover:bg-transparent group-hover:border-white group-hover:-translate-y-1 hover:bg-transparent hover:border-white hover:-translate-y-1 rounded-none h-auto">
                            Start MVP Sprint
                        </Button>
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                    <a
                        href="https://www.instagram.com/mwsurjith/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                        Instagram
                        <ArrowUpRight size={14} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mwsurjith/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                        Linked In
                        <ArrowUpRight size={14} />
                    </a>
                    <button
                        onClick={handleCopyEmail}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                        {copied ? (
                            <>
                                Copied to clipboard
                                <Check size={14} className="text-green-500" />
                            </>
                        ) : (
                            <>
                                mwsurjith51@gmail.com
                                <Copy size={14} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </footer>
    );
}
