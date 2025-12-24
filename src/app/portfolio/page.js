import HeroSection from "@/components/portfolio/sections/HeroSection";
import CaseStudySection from "@/components/portfolio/sections/CaseStudySection";
import MicroAppsSection from "@/components/portfolio/sections/MicroAppsSection";

export default function Portfolio() {
    return (
        <main className="w-full bg-zinc-900">
            <HeroSection />
            <CaseStudySection />
        </main>
    );
}