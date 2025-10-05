import React, { useState } from 'react';
import { useCompetitions } from '../context/CompetitionContext';
import { ShieldCheckIcon } from '../components/icons/Icons';
import PublicRankings from '../components/public/PublicRankings';
import PublicSchedule from '../components/public/PublicSchedule';
import PublicArticlesList from '../components/public/PublicArticlesList';
import PublicGalleriesList from '../components/public/PublicGalleriesList';
import PublicSponsors from '../components/public/PublicSponsors';
import PublicPlayerStats from '../components/public/PublicPlayerStats';
import Tabs from '../components/ui/Tabs';

const PublicPortalSite: React.FC = () => {
  const { competitions, portalConfig } = useCompetitions();
  const publicCompetitions = competitions.filter(c => c.isPublic);
  const [activeCompetitionId, setActiveCompetitionId] = useState(publicCompetitions[0]?.id || null);

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
  const activeCompetition = competitions.find(c => c.id === activeCompetitionId);

  return (
    <div style={{ backgroundColor }} className="min-h-screen font-sans">
      <header className="p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)'}}>
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>
              <h2 className="ml-4 text-xl font-bold" style={{ color: primaryColor }}>{title}</h2>
            </div>
        </div>
      </header>
      <main>
        <div className="container mx-auto py-12 px-6">
            <div className="bg-white rounded-lg shadow-xl p-6">
                 <Tabs 
                    tabs={publicCompetitions.map(c => c.name)}
                    activeTab={activeCompetition?.name || ''}
                    setActiveTab={(tabName) => {
                        const newComp = publicCompetitions.find(c => c.name === tabName);
                        if(newComp) setActiveCompetitionId(newComp.id);
                    }}
                 />
                 <div className="py-10">
                    {activeCompetition && activeCompetition.publicConfig ? (
                        <div className="space-y-20">
                            {activeCompetition.publicConfig.showArticles && <div id="news"><PublicArticlesList competitionId={activeCompetition.id} /></div>}
                            {activeCompetition.publicConfig.showGalleries && <div id="galleries"><PublicGalleriesList competitionId={activeCompetition.id} /></div>}
                            {activeCompetition.publicConfig.showSponsors && <div id="sponsors"><PublicSponsors competitionId={activeCompetition.id} /></div>}
                            {activeCompetition.publicConfig.showRankings && (activeCompetition.format === 'league' || activeCompetition.format === 'mixed') && <div id="rankings"><PublicRankings competitionId={activeCompetition.id} /></div>}
                            {activeCompetition.publicConfig.showSchedule && <div id="schedule"><PublicSchedule competitionId={activeCompetition.id} /></div>}
                            {activeCompetition.publicConfig.showPlayerStats && <div id="stats"><PublicPlayerStats competitionId={activeCompetition.id} /></div>}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">This competition has no public content configured.</p>
                    )}
                 </div>
            </div>
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