
import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import PublicRankings from '../components/public/PublicRankings.tsx';
import PublicSchedule from '../components/public/PublicSchedule.tsx';
import PublicArticlesList from '../components/public/PublicArticlesList.tsx';
import PublicGalleriesList from '../components/public/PublicGalleriesList.tsx';
import PublicSponsors from '../components/public/PublicSponsors.tsx';
import PublicPlayerStats from '../components/public/PublicPlayerStats.tsx';
import PublicSanctions from '../components/public/PublicSanctions.tsx';
import PublicRegulations from '../components/public/PublicRegulations.tsx';
import PublicAnnouncements from '../components/public/PublicAnnouncements.tsx';

interface PublicSiteProps {
  competitionId: string;
}

const PublicSite: React.FC<PublicSiteProps> = ({ competitionId }) => {
  const { getCompetitionById } = useCompetitions();
  const competition = getCompetitionById(competitionId);

  if (!competition || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Competition Not Found</h1>
          <p className="text-gray-500 mt-2">The requested competition is not available for public view.</p>
        </div>
      </div>
    );
  }

  const { publicConfig } = competition;
  const navItems = [
    { name: 'News', href: '#news', show: publicConfig.showArticles },
    { name: 'Rankings', href: '#rankings', show: publicConfig.showRankings && (competition.format === 'league' || competition.format === 'mixed') },
    { name: 'Schedule', href: '#schedule', show: publicConfig.showSchedule },
    { name: 'Stats', href: '#stats', show: publicConfig.showPlayerStats },
    { name: 'Galleries', href: '#galleries', show: publicConfig.showGalleries },
    { name: 'Regulations', href: '#regulations', show: publicConfig.showRegulations },
    { name: 'Sponsors', href: '#sponsors', show: publicConfig.showSponsors },
  ].filter(item => item.show);

  return (
    <div style={{ backgroundColor: publicConfig.backgroundColor }} className="min-h-screen font-sans">
      <header className="p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)'}}>
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src={publicConfig.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>
              <h2 className="ml-4 text-xl font-bold" style={{ color: publicConfig.primaryColor }}>{publicConfig.title}</h2>
            </div>
            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-600 hover:text-gray-900">{item.name}</a>
              ))}
            </nav>
        </div>
      </header>
      <main>
        <div className="container mx-auto py-12 px-6 space-y-20">
            <PublicAnnouncements competitionId={competitionId} />
            {publicConfig.showArticles && <div id="news"><PublicArticlesList competitionId={competitionId} /></div>}
            {publicConfig.showGalleries && <div id="galleries"><PublicGalleriesList competitionId={competitionId} /></div>}
            {publicConfig.showRankings && (competition.format === 'league' || competition.format === 'mixed') && <div id="rankings"><PublicRankings competitionId={competitionId} /></div>}
            {publicConfig.showSchedule && <div id="schedule"><PublicSchedule competitionId={competitionId} /></div>}
            {publicConfig.showPlayerStats && <div id="stats"><PublicPlayerStats competitionId={competitionId} /></div>}
            <PublicSanctions competitionId={competitionId} />
            {publicConfig.showRegulations && <div id="regulations"><PublicRegulations competitionId={competitionId} /></div>}
            {publicConfig.showSponsors && <div id="sponsors"><PublicSponsors competitionId={competitionId} /></div>}
        </div>
      </main>
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
        <div className="container mx-auto text-center text-gray-500 flex flex-col items-center justify-center space-y-6">
            {publicConfig.showSponsors && <PublicSponsors competitionId={competitionId} isFooter />}
            <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
                Powered by Futbalito
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSite;
