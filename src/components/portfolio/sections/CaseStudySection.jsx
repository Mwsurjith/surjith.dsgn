'use client';

import { useState } from 'react';
import CaseStudyCard from '../CaseStudyCard';
import CaseStudyModal from '../CaseStudyModal';
import { caseStudies } from '@/constants/site';

const CaseStudySection = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenModal = (study) => {
        setSelectedProject(study);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    return (
        <>
            <section className="w-full py-20 px-4 pb-50">
                <div className="max-w-5xl mx-auto flex flex-col gap-50">
                    {caseStudies.map((study) => (
                        <CaseStudyCard
                            key={study.id}
                            projectName={study.projectName}
                            launchYear={study.launchYear}
                            subtitle={study.subtitle}
                            title={study.title}
                            description={study.description}
                            images={study.images}
                            onOpenModal={() => handleOpenModal(study)}
                        />
                    ))}
                </div>
            </section>

            {selectedProject && (
                <CaseStudyModal
                    project={selectedProject}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default CaseStudySection;
