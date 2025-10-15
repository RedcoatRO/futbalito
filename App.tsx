
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Browse from './pages/Browse.tsx';
import ManageCompetitions from './pages/ManageCompetitions.tsx';
import CompetitionDetail from './pages/CompetitionDetail.tsx';
import LiveMatch from './pages/LiveMatch.tsx';
import ManageTeams from './pages/ManageTeams.tsx';
import ManagePlayers from './pages/ManagePlayers.tsx';
import PlayerDetail from './pages/PlayerDetail.tsx';
import ManageArenas from './pages/ManageArenas.tsx';
import ManageReferees from './pages/ManageReferees.tsx';
import ManageObservers from './pages/ManageObservers.tsx';
import ManageOrganizers from './pages/ManageOrganizers.tsx';
import ManageNationalTeam from './pages/ManageNationalTeam.tsx';
import Publish from './pages/Publish.tsx';
import WebBuilder from './pages/WebBuilder.tsx';
import PortalBuilder from './pages/PortalBuilder.tsx';
import ManageArticles from './pages/ManageArticles.tsx';
import EditArticle from './pages/EditArticle.tsx';
import ManageMedia from './pages/ManageMedia.tsx';
import EditGallery from './pages/EditGallery.tsx';
import ManageSponsors from './pages/ManageSponsors.tsx';
import ManageRegulations from './pages/ManageRegulations.tsx';
import Reports from './pages/Reports.tsx';
import Marketplace from './pages/Marketplace.tsx';
import Settings from './pages/Settings.tsx';
import PublicSite from './pages/PublicSite.tsx';
import PublicArticleDetail from './pages/PublicArticleDetail.tsx';
import PublicGalleryDetail from './pages/PublicGalleryDetail.tsx';
import PublicAllLiveStreams from './pages/PublicAllLiveStreams.tsx';
import PublicPortalSite from './pages/PublicPortalSite.tsx';

import type { Page } from './types.ts';

function App() {
  const [page, setPage] = useState<Page>('DASHBOARD');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for detail pages
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);


  // Handle public site rendering based on URL params
  const urlParams = new URLSearchParams(window.location.search);
  const publicCompetitionId = urlParams.get('publicCompetitionId');
  const publicArticleId = urlParams.get('articleId');
  const publicGalleryId = urlParams.get('galleryId');
  const publicLiveView = urlParams.get('view') === 'live';
  const isPortal = urlParams.get('portal') === 'true';

  if (isPortal) {
    return <PublicPortalSite />;
  }
  
  if (publicCompetitionId) {
    if (publicArticleId) {
        return <PublicArticleDetail competitionId={publicCompetitionId} articleId={publicArticleId} />;
    }
    if (publicGalleryId) {
        return <PublicGalleryDetail competitionId={publicCompetitionId} galleryId={publicGalleryId} />;
    }
    if (publicLiveView) {
        return <PublicAllLiveStreams competitionId={publicCompetitionId} />;
    }
    return <PublicSite competitionId={publicCompetitionId} />;
  }


  const handleSetPage = (newPage: Page) => {
    setPage(newPage);
    setSelectedCompetitionId(null);
    setSelectedMatchId(null);
    setSidebarOpen(false);
  };

  const viewCompetitionDetail = (id: string) => {
    setSelectedCompetitionId(id);
    setPage('COMPETITION_DETAIL');
  };

  const viewLiveMatch = (id: string) => {
    setSelectedMatchId(id);
    setPage('LIVE_MATCH');
  };

  const viewPlayerDetail = (id: string) => {
    setSelectedPlayerId(id);
    setPage('PLAYER_DETAIL');
  };
  
  const handleBackToCompetitions = () => {
    setSelectedCompetitionId(null);
    setPage('MANAGE_COMPETITIONS');
  };

  const handleBackFromLiveMatch = () => {
    setSelectedMatchId(null);
    if(selectedCompetitionId) {
        setPage('COMPETITION_DETAIL');
    } else {
        setPage('MANAGE_COMPETITIONS');
    }
  };

  const handleBackFromPlayerDetail = () => {
    setSelectedPlayerId(null);
    setPage('MANAGE_PLAYERS');
  };
  
  // Publish flow handlers
  const handleCustomizeSite = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setPage('WEB_BUILDER');
  };
  const handleManageArticles = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setPage('MANAGE_ARTICLES');
  };
  const handleCreateArticle = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setSelectedArticleId(null);
    setPage('EDIT_ARTICLE');
  };
  const handleEditArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setPage('EDIT_ARTICLE');
  };
   const handleManageMedia = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setPage('MANAGE_MEDIA');
  };
  const handleCreateGallery = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setSelectedGalleryId(null);
    setPage('EDIT_GALLERY');
  };
  const handleEditGallery = (galleryId: string) => {
    setSelectedGalleryId(galleryId);
    setPage('EDIT_GALLERY');
  };
  const handleManageSponsors = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setPage('MANAGE_SPONSORS');
  };
  const handleManageRegulations = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setPage('MANAGE_REGULATIONS');
  };
  const handleBackToPublish = () => {
    setSelectedCompetitionId(null);
    setSelectedArticleId(null);
    setPage('PUBLISH');
  };
  const handleBackToArticles = () => {
    setSelectedArticleId(null);
    setPage('MANAGE_ARTICLES');
  };
   const handleBackToMedia = () => {
    setSelectedGalleryId(null);
    setPage('MANAGE_MEDIA');
  };
  const handleCustomizePortal = () => {
    setPage('PORTAL_BUILDER');
  };


  const renderPage = () => {
    switch (page) {
      case 'DASHBOARD': return <Dashboard setPage={handleSetPage} />;
      case 'BROWSE': return <Browse />;
      case 'MANAGE_COMPETITIONS': return <ManageCompetitions setPage={handleSetPage} onViewCompetition={viewCompetitionDetail} />;
      case 'COMPETITION_DETAIL': return selectedCompetitionId ? <CompetitionDetail competitionId={selectedCompetitionId} onBack={handleBackToCompetitions} onManageLiveMatch={viewLiveMatch} /> : <p>No competition selected.</p>;
      case 'LIVE_MATCH': return selectedMatchId ? <LiveMatch matchId={selectedMatchId} onBack={handleBackFromLiveMatch} /> : <p>No match selected.</p>;
      case 'MANAGE_TEAMS': return <ManageTeams />;
      case 'MANAGE_PLAYERS': return <ManagePlayers onViewPlayerDetail={viewPlayerDetail} />;
      case 'PLAYER_DETAIL': return selectedPlayerId ? <PlayerDetail playerId={selectedPlayerId} onBack={handleBackFromPlayerDetail} /> : <p>No player selected.</p>;
      case 'MANAGE_ARENAS': return <ManageArenas />;
      case 'MANAGE_REFEREES': return <ManageReferees />;
      case 'MANAGE_OBSERVERS': return <ManageObservers />;
      case 'MANAGE_ORGANIZERS': return <ManageOrganizers />;
      case 'MANAGE_NATIONAL_TEAM': return <ManageNationalTeam />;
      case 'PUBLISH': return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'WEB_BUILDER': return selectedCompetitionId ? <WebBuilder competitionId={selectedCompetitionId} onBack={handleBackToPublish} /> : <p>No competition selected.</p>;
      case 'PORTAL_BUILDER': return <PortalBuilder onBack={handleBackToPublish} />;
      case 'MANAGE_ARTICLES': return selectedCompetitionId ? <ManageArticles competitionId={selectedCompetitionId} onBack={handleBackToPublish} onCreateArticle={handleCreateArticle} onEditArticle={handleEditArticle}/> : <p>No competition selected.</p>;
      case 'EDIT_ARTICLE': return selectedCompetitionId ? <EditArticle competitionId={selectedCompetitionId} articleId={selectedArticleId} onBack={handleBackToArticles} /> : <p>No competition selected.</p>;
      case 'MANAGE_MEDIA': return selectedCompetitionId ? <ManageMedia competitionId={selectedCompetitionId} onBack={handleBackToPublish} onCreateGallery={handleCreateGallery} onEditGallery={handleEditGallery} /> : <p>No competition selected.</p>;
      case 'EDIT_GALLERY': return selectedCompetitionId ? <EditGallery competitionId={selectedCompetitionId} galleryId={selectedGalleryId} onBack={handleBackToMedia} /> : <p>No competition selected.</p>;
      case 'MANAGE_SPONSORS': return selectedCompetitionId ? <ManageSponsors competitionId={selectedCompetitionId} onBack={handleBackToPublish} /> : <p>No competition selected.</p>;
      case 'MANAGE_REGULATIONS': return selectedCompetitionId ? <ManageRegulations competitionId={selectedCompetitionId} onBack={handleBackToPublish} /> : <p>No competition selected.</p>;
      case 'REPORTS': return <Reports />;
      case 'MARKETPLACE': return <Marketplace />;
      case 'SETTINGS': return <Settings setPage={handleSetPage} />;
      default: return <Dashboard setPage={handleSetPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar page={page} setPage={handleSetPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
