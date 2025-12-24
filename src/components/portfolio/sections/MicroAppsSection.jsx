'use client';

import { useRouter } from 'next/navigation';
import MicroAppCard from '../MicroAppCard';
import { microApps } from '@/constants/site';

const MicroAppsSection = () => {
    const handleAppClick = (app) => {
        console.log('Clicked on app:', app.name);
    };

    return (
        <section className="w-full py-20 px-4">
            <div className="flex flex-wrap justify-center gap-10">
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
        </section>
    );
};

export default MicroAppsSection;
