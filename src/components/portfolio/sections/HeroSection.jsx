import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative min-h-210 flex justify-center px-5 pt-30 pb-20 overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 z-1 bg-[url('/bg-gradiant.png')] bg-no-repeat bg-top bg-cover"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="max-w-4xl w-full relative flex flex-col items-center z-2">
                {/* Subtitle */}
                <div className="text-orange-400 font-sans text-base font-normal text-center">
                    Product Designer • Vibe Coder
                </div>

                {/* Title */}
                <div className="font-[Gloock] text-[200px] leading-[0.9] font-normal text-center relative z-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_10%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0)_90%)] bg-clip-text text-transparent">
                    SURJITH
                </div>

                {/* Hero Image */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-w-lg w-full">
                    <Image
                        src="/surjith-hero.png"
                        alt="Surjith sitting on orange stool"
                        width={480}
                        height={600}
                        className="w-full h-auto block object-contain"
                        priority
                    />
                </div>

                {/* Tagline */}
                <p className="w-full font-sans text-base mt-30 font-normal text-left text-zinc-400 z-40">
                    I Do UX that drives, <br />
                    <span className="bg-[linear-gradient(90deg,#FF6B35,#FF8E53)] bg-clip-text text-transparent text-[56px] font-semibold whitespace-nowrap">
                        Business Growth
                    </span>
                </p>
            </div>
        </section>
    );
}