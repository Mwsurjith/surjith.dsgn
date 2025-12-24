'use client';

export default function DateHeader({ label }) {
    return (
        <div className="text-[10px] h-8 font-medium tracking-[0.1em] uppercase text-zinc-500 p-2 mt-8">
            {label}
        </div>
    );
}
