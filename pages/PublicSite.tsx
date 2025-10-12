import React from 'react';
import { useCompetitions } from '../context/CompetitionContext';
import { ShieldCheckIcon, FacebookIcon, TwitterIcon, InstagramIcon } from '../components/icons/Icons';
import PublicRankings from '../components/public/PublicRankings';
import PublicSchedule from '../components/public/PublicSchedule';
import PublicArticlesList from '../components/public/PublicArticlesList';
import PublicGalleriesList from '../components/public/PublicGalleriesList';
import PublicSponsors from '../components/public/PublicSponsors';
import PublicPlayerStats from '../components/public/PublicPlayerStats';
import PublicRegulations from '../components/public/PublicRegulations';

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
          <p className="text-gray-500 mt-2">The requested public site is not available or has not been configured.</p>
        </div>
      </div>
    );
  }

  const { title, description, logoUrl, primaryColor, backgroundColor, ...config } = competition.publicConfig;
  
  const navLinks = [
    { name: 'Live', active: config.showLiveStream, anchor: 'news' },
    { name: 'News', active: config.showArticles, anchor: 'news' },
    { name: 'Galleries', active: config.showGalleries, anchor: 'galleries' },
    { name: 'Regulations', active: config.showRegulations, anchor: 'regulations'},
    { name: 'Rankings', active: config.showRankings, anchor: 'rankings' },
    { name: 'Schedule', active: config.showSchedule, anchor: 'schedule' },
    { name: 'Stats', active: config.showPlayerStats, anchor: 'stats' },
  ].filter(link => link.active);

  return (
    <div style={{ backgroundColor }} className="min-h-screen font-sans">
      <header className="p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)'}}>
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>
              <h2 className="ml-4 text-xl font-bold" style={{ color: primaryColor }}>{title}</h2>
            </div>
            <nav className="hidden md:flex space-x-6">
                {navLinks.map(link => (
                    <a key={link.name} href={`#${link.anchor}`} className="text-sm font-medium text-gray-600 hover:text-gray-900">{link.name}</a>
                ))}
            </nav>
        </div>
      </header>
      <main>
        <div className="container mx-auto py-20 px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">{description}</p>
        </div>
        
        <div className="container mx-auto py-16 px-6 space-y-20">
            {config.showArticles && <div id="news"><PublicArticlesList competitionId={competition.id} /></div>}
            {config.showGalleries && <div id="galleries"><PublicGalleriesList competitionId={competition.id} /></div>}
            {config.showSponsors && <div id="sponsors"><PublicSponsors competitionId={competition.id} /></div>}
            {config.showRegulations && <div id="regulations"><PublicRegulations competitionId={competition.id} /></div>}
            {config.showRankings && (competition.format === 'league' || competition.format === 'mixed') && <div id="rankings"><PublicRankings competitionId={competition.id} /></div>}
            {config.showSchedule && <div id="schedule"><PublicSchedule competitionId={competition.id} /></div>}
            {config.showPlayerStats && <div id="stats"><PublicPlayerStats competitionId={competition.id} /></div>}
        </div>
      </main>
      <footer className="py-12 border-t bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)'}}>
        <div className="container mx-auto text-center text-gray-500">
            {config.showSponsorsInFooter && (
                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Our Sponsors</h4>
                    <PublicSponsors competitionId={competition.id} isFooter={true} />
                </div>
            )}
            <p className="text-sm">{config.footerText}</p>
            <div className="flex justify-center space-x-6 mt-4">
                {config.facebookUrl && <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer"><FacebookIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
                {config.twitterUrl && <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer"><TwitterIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
                {config.instagramUrl && <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer"><InstagramIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
            </div>
            <div className="mt-8 text-xs text-gray-400 flex items-center justify-center">
                <ShieldCheckIcon className="h-4 w-4 mr-1"/>
                Powered by Futbalito
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSite;