import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

// Import new components for the portal homepage
import PublicHeader from '../components/public/PublicHeader.tsx';
import HeroSection from '../components/public/HeroSection.tsx';
import CompetitionList from '../components/public/CompetitionList.tsx';
import MatchTicker from '../components/public/MatchTicker.tsx';

const PublicPortalSite: React.FC = () => {
  const { competitions, portalConfig, matches, articles } = useCompetitions();

  // Memoize all data fetching and filtering for performance
  const publicCompetitions = useMemo(() => competitions.filter(c => c.isPublic), [competitions]);
  
  const aggregatedData = useMemo(() => {
    if (publicCompetitions.length === 0) {
      return {
        heroArticle: null,
        recentMatches: [],
        upcomingMatches: [],
      };
    }

    const publicCompetitionIds = publicCompetitions.map(c => c.id);

    // Find the latest published article from any public competition
    const heroArticle = articles
      .filter(a => publicCompetitionIds.includes(a.competitionId) && a.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;

    // Aggregate matches from all public competitions
    const allPublicMatches = matches.filter(m => publicCompetitionIds.includes(m.competitionId));
    const now = new Date();

    // Get the 3 most recently finished matches
    const recentMatches = allPublicMatches
      .filter(m => m.status === 'Finished' && new Date(m.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
      
    // Get the next 3 upcoming matches
    const upcomingMatches = allPublicMatches
      .filter(m => m.status !== 'Finished' && new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    return { heroArticle, recentMatches, upcomingMatches };
  }, [publicCompetitions, matches, articles]);


  if (!portalConfig || publicCompetitions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Competition Portal Not Available</h1>
          <p className="text-gray-500 mt-2">No competitions have been made public yet.</p>
        </div>
      </div>
    );
  }

  const { title, logoUrl, primaryColor, backgroundColor } = portalConfig;

  // Define the main navigation for the entire portal
  const portalNavItems = [
    { name: 'Home', href: '/?portal=true' },
    { name: 'News', href: '/?portal=true&portal_page=news' },
    { name: 'Matches', href: '/?portal=true&portal_page=matches' },
    { name: 'Stats', href: '/?portal=true&portal_page=stats' },
    { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
  ];

  return (
    <div style={{ backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={logoUrl}
        title={title}
        primaryColor={primaryColor}
        navItems={portalNavItems}
        activePage="Home"
      />
      <main>
        <div className="container mx-auto py-12 px-6">
          <HeroSection heroArticle={aggregatedData.heroArticle} />
          <CompetitionList competitions={publicCompetitions} />
          <MatchTicker 
            recentMatches={aggregatedData.recentMatches}
            upcomingMatches={aggregatedData.upcomingMatches}
            competitions={publicCompetitions}
          />
        </div>
      </main>
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
            Powered by Futbalito
        </div>
      </footer>
    </div>
  );
};

export default PublicPortalSite;