'use client';

import { useState, useEffect } from 'react';
import { CodeXml } from 'lucide-react';
import { Button } from '../ui/button';
import Lottie from 'lottie-react';

const CaseStudyCard = ({
    projectName,
    launchYear,
    subtitle,
    title,
    description,
    images,
    onOpenModal,
    rootRef
}) => {
    const [lottieData, setLottieData] = useState(null);
    const isLottie = images && images[0] && images[0].endsWith('.json');

    useEffect(() => {
        if (isLottie) {
            fetch(images[0])
                .then((res) => res.json())
                .then((data) => setLottieData(data))
                .catch((err) => console.error('Failed to load Lottie:', err));
        }
    }, [images, isLottie]);

    return (
        <div className="relative flex flex-col w-full gap-2" ref={rootRef}>
            {/* Project Badges */}
            {(projectName || launchYear) && (
                <div className="flex gap-2">
                    {projectName && (
                        <div className="bg-zinc-800 text-white/80 text-xs leading-[18px] font-normal px-2.5 py-2 rounded-md tracking-wide h-8 flex items-center">
                            {projectName}
                        </div>
                    )}
                    {launchYear && (
                        <div className="bg-zinc-800 text-white/80 text-xs leading-[18px] font-normal px-2.5 py-2 rounded-md tracking-wide h-8 flex items-center">
                            <CodeXml className="relative -left-[3px] w-[18px] h-[18px] p-0.5 mr-1 bg-[#5BAA64] text-white rounded align-middle" />
                            Launched in {launchYear}
                        </div>
                    )}
                </div>
            )}

            {/* Card Content */}
            <div className="group grid grid-cols-[1fr_2fr] gap-10 w-full h-full items-center bg-zinc-950 border border-transparent hover:border-blue-400 relative">
                {/* Corner Pins */}
                <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                {/* Left Section */}
                <div className="flex flex-col gap-4 p-10 pr-0 h-full justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="text-[10px] font-normal text-[#FF6B35] uppercase tracking-wide">
                            {subtitle}
                        </div>
                        <h2 className="font-['Gloock'] text-[32px] font-semibold text-white m-0 mb-2 leading-[1.2] tracking-wide max-md:text-2xl">
                            {title}
                        </h2>
                        <p className="text-sm font-normal text-white/70 leading-[1.6] m-0">
                            {description}
                        </p>
                    </div>
                    <Button className="items-center p-1 self-start bg-transparent text-white border-b-2 border-transparent text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-transparent hover:border-white hover:-translate-y-1 rounded-none h-auto" onClick={onOpenModal}>
                        Read More
                    </Button>
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-center h-full">
                    <div className="flex items-center justify-center w-full overflow-hidden">
                        {isLottie ? (
                            lottieData ? (
                                <Lottie
                                    animationData={lottieData}
                                    loop={true}
                                    autoplay={true}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center text-white/50">
                                    Loading...
                                </div>
                            )
                        ) : (
                            <img
                                src={images && images[0]}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Bottom Corner Pins */}
                <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute w-2 h-2 bg-zinc-50 border border-blue-400 -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            </div>
        </div>
    );
};

export default CaseStudyCard;

