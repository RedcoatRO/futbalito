import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import HeroSection from '../components/public/HeroSection.tsx';
import CompetitionList from '../components/public/CompetitionList.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

const PublicPortalSite: React.FC = () => {
    const { portalConfig, competitions, articles } = useCompetitions();

    const publicCompetitions = useMemo(() => {
        return competitions.filter(c => c.isPublic);
    }, [competitions]);

    const heroArticle = useMemo(() => {
        // Find the most recent article from any public competition
        const publicCompIds = publicCompetitions.map(c => c.id);
        return articles
            .filter(a => publicCompIds.includes(a.competitionId) && a.status === 'published')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            [0] || null;
    }, [articles, publicCompetitions]);

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
            />
            <main>
                <div className="container mx-auto py-12 px-6">
                    <HeroSection heroArticle={heroArticle} />
                    <CompetitionList competitions={publicCompetitions} />
                </div>
            </main>
            <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
                <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
                    Powered by Futbalito
                </div>
            </footer>
        </div>
    );
};

export default PublicPortalSite;
