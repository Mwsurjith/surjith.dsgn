'use client';

import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CaseStudyModal = ({ project, onClose }) => {
    const modalRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const horizontalWrapperRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const wrapper = horizontalWrapperRef.current;
        if (!wrapper) return;

        const handleScroll = () => {
            const scrollLeft = wrapper.scrollLeft;
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            setScrollProgress(progress);
        };

        wrapper.addEventListener('scroll', handleScroll);
        return () => wrapper.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClose = () => {
        onClose?.();
    };

    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm">
            <div className="fixed inset-0 w-full h-full bg-white z-[10000] overflow-hidden" ref={modalRef}>
                {/* Close Button */}
                <button
                    className="fixed top-8 right-8 w-12 h-12 rounded-full bg-white/20 border-none flex items-center justify-center cursor-pointer z-[10001] transition-all duration-300 hover:bg-black/15 hover:rotate-90 max-md:top-5 max-md:right-5 max-md:w-10 max-md:h-10"
                    onClick={handleClose}
                >
                    <X color="white" size={24} />
                </button>

                {/* Progress Bar */}
                <div className="fixed top-0 left-0 right-0 h-[3px] bg-black/[0.08] z-[10001]">
                    <div
                        className="h-full bg-gradient-to-r from-[#FF6B35] to-zinc-600 transition-[width] duration-100 ease-out rounded-r"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                {/* Scroll Container */}
                <div className="w-full h-screen overflow-hidden relative" ref={scrollContainerRef}>
                    <div
                        className="flex h-full overflow-x-scroll overflow-y-hidden scroll-auto scrollbar-none"
                        ref={horizontalWrapperRef}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Intro Section */}
                        <section className="flex-shrink-0 w-screen h-full flex items-center justify-center p-20 box-border bg-gradient-to-br from-zinc-900 to-zinc-800 text-white max-md:p-[60px_32px] max-sm:p-[40px_24px]">
                            <div className="max-w-[1200px] w-full h-full flex flex-col justify-center">
                                <div className="mb-[60px]">
                                    <span className="text-sm font-semibold tracking-[3px] uppercase text-[#FF6B35] block mb-5">
                                        CASE STUDY
                                    </span>
                                    <h1 className="font-['Gloock'] text-[8vw] font-normal m-0 mb-6 leading-none text-white/90 max-md:text-5xl">
                                        {project.title}
                                    </h1>
                                    <p className="text-base font-normal leading-6 m-0 max-w-[700px] text-white/60 max-md:text-lg">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:gap-6">
                                    <div>
                                        <h3 className="text-[11px] font-semibold tracking-[2px] uppercase m-0 mb-3 opacity-50">
                                            PLATFORM
                                        </h3>
                                        <p className="text-base font-normal leading-relaxed m-0">
                                            {project.platform}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-semibold tracking-[2px] uppercase m-0 mb-3 opacity-50">
                                            INDUSTRY
                                        </h3>
                                        <p className="text-base font-normal leading-relaxed m-0">
                                            {project.industry}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-semibold tracking-[2px] uppercase m-0 mb-3 opacity-50">
                                            MY ROLE
                                        </h3>
                                        <p className="text-base font-normal leading-relaxed m-0">
                                            {project.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Feature Sections */}
                        {project.images?.map((image, idx) => (
                            <section
                                key={idx}
                                className={`flex-shrink-0 w-screen h-full flex items-center justify-center p-20 box-border max-md:p-[60px_32px] max-sm:p-[40px_24px] ${idx % 2 === 0 ? 'bg-zinc-100' : 'bg-white'
                                    }`}
                            >
                                <div className="max-w-[1200px] w-full h-full flex flex-col justify-center">
                                    <div className="w-full flex items-center justify-center">
                                        <img
                                            src={image}
                                            alt={`${project.title} screen ${idx + 1}`}
                                            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] max-md:max-h-[70vh]"
                                        />
                                    </div>
                                </div>
                            </section>
                        ))}

                        {/* CTA Section */}
                        <section className="flex-shrink-0 w-screen h-full flex items-center justify-center p-20 box-border bg-gradient-to-br from-zinc-700 to-zinc-900 text-white text-center max-md:p-[60px_32px] max-sm:p-[40px_24px]">
                            <div className="max-w-[1200px] w-full h-full flex flex-col justify-center">
                                <h2 className="font-['Gloock'] text-[clamp(40px,6vw,64px)] font-normal m-0 mb-6 leading-tight max-md:text-4xl">
                                    Want to see more?
                                </h2>
                                <p className="font-['Figtree'] text-xl font-normal leading-relaxed m-0 mb-12 max-w-[600px] mx-auto opacity-95">
                                    I'd be happy to share the full case study and walk through the design process in detail.
                                </p>
                                <div className="flex gap-5 justify-center max-md:flex-col max-md:items-center">
                                    <a
                                        href="mailto:mwsurjith51@gmail.com"
                                        className="inline-flex items-center justify-center px-9 py-[18px] no-underline font-['Figtree'] text-base font-semibold rounded-xl transition-all duration-300 cursor-pointer bg-white text-zinc-800 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(255,255,255,0.3)] max-md:w-full max-md:max-w-[300px]"
                                    >
                                        Get in Touch
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/surjith"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-9 py-[18px] no-underline font-['Figtree'] text-base font-semibold rounded-xl transition-all duration-300 cursor-pointer bg-transparent text-white border-2 border-white hover:bg-white hover:text-zinc-800 hover:-translate-y-[3px] max-md:w-full max-md:max-w-[300px]"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyModal;
