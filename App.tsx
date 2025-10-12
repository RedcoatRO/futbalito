import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ManageCompetitions from './pages/ManageCompetitions';
import ManageTeams from './pages/ManageTeams';
import ManageArenas from './pages/ManageArenas';
import ManagePlayers from './pages/ManagePlayers';
import ManageReferees from './pages/ManageReferees';
import ManageObservers from './pages/ManageObservers';
import LiveMatch from './pages/LiveMatch';
import Browse from './pages/Browse';
import Publish from './pages/Publish';
import WebBuilder from './pages/WebBuilder';
import PortalBuilder from './pages/PortalBuilder';
import ManageArticles from './pages/ManageArticles';
import EditArticle from './pages/EditArticle';
import ManageMedia from './pages/ManageMedia';
import EditGallery from './pages/EditGallery';
import ManageSponsors from './pages/ManageSponsors';
import ManageRegulations from './pages/ManageRegulations';
import Settings from './pages/Settings';
import Marketplace from './pages/Marketplace';
import CompetitionDetail from './pages/CompetitionDetail';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  // Publish flow state
  const [selectedCompetitionForPublishId, setSelectedCompetitionForPublishId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);


  const handleViewCompetition = (id: string) => {
    setSelectedCompetitionId(id);
    setCurrentPage('COMPETITION_DETAIL');
  };

  const handleBackToCompetitions = () => {
    setSelectedCompetitionId(null);
    setCurrentPage('MANAGE_COMPETITIONS');
  };
  
  const handleManageLiveMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setCurrentPage('LIVE_MATCH');
  };

  const handleBackFromLiveMatch = () => {
    setSelectedMatchId(null);
    setCurrentPage('COMPETITION_DETAIL');
  };
  
  const handleCustomizeSite = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setCurrentPage('WEB_BUILDER');
  };
  
  const handleCustomizePortal = () => {
    setCurrentPage('PORTAL_BUILDER');
  };

  const handleManageArticles = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setCurrentPage('MANAGE_ARTICLES');
  };
  
  const handleManageMedia = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setCurrentPage('MANAGE_MEDIA');
  };
  
  const handleManageSponsors = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setCurrentPage('MANAGE_SPONSORS');
  };
  
  const handleManageRegulations = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setCurrentPage('MANAGE_REGULATIONS');
  };

  const handleBackToPublish = () => {
    setSelectedCompetitionForPublishId(null);
    setSelectedArticleId(null);
    setSelectedGalleryId(null);
    setCurrentPage('PUBLISH');
  };
  
  const handleEditArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentPage('EDIT_ARTICLE');
  };

  const handleCreateArticle = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setSelectedArticleId(null);
    setCurrentPage('EDIT_ARTICLE');
  }

  const handleBackToArticles = () => {
    setSelectedArticleId(null);
    setCurrentPage('MANAGE_ARTICLES');
  };

  const handleEditGallery = (galleryId: string) => {
    setSelectedGalleryId(galleryId);
    setCurrentPage('EDIT_GALLERY');
  };
  
  const handleCreateGallery = (competitionId: string) => {
    setSelectedCompetitionForPublishId(competitionId);
    setSelectedGalleryId(null);
    setCurrentPage('EDIT_GALLERY');
  };

  const handleBackToMedia = () => {
      setSelectedGalleryId(null);
      setCurrentPage('MANAGE_MEDIA');
  };


  const renderContent = useCallback(() => {
    switch (currentPage) {
      case 'DASHBOARD':
        return <Dashboard setPage={setCurrentPage} />;
      case 'BROWSE':
        return <Browse />;
      case 'MANAGE_COMPETITIONS':
        return <ManageCompetitions setPage={setCurrentPage} onViewCompetition={handleViewCompetition} />;
      case 'MANAGE_TEAMS':
        return <ManageTeams />;
      case 'MANAGE_ARENAS':
        return <ManageArenas />;
      case 'MANAGE_PLAYERS':
        return <ManagePlayers />;
      case 'MANAGE_REFEREES':
        return <ManageReferees />;
      case 'MANAGE_OBSERVERS':
        return <ManageObservers />;
      case 'COMPETITION_DETAIL':
        if (selectedCompetitionId) {
          return <CompetitionDetail competitionId={selectedCompetitionId} onBack={handleBackToCompetitions} onManageLiveMatch={handleManageLiveMatch} />;
        }
        return <ManageCompetitions setPage={setCurrentPage} onViewCompetition={handleViewCompetition} />;
      case 'PUBLISH':
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
       case 'WEB_BUILDER':
        if (selectedCompetitionForPublishId) {
          return <WebBuilder competitionId={selectedCompetitionForPublishId} onBack={handleBackToPublish} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'PORTAL_BUILDER':
        return <PortalBuilder onBack={handleBackToPublish} />;
      case 'MANAGE_ARTICLES':
        if (selectedCompetitionForPublishId) {
            return <ManageArticles competitionId={selectedCompetitionForPublishId} onBack={handleBackToPublish} onEditArticle={handleEditArticle} onCreateArticle={handleCreateArticle} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'EDIT_ARTICLE':
        if (selectedCompetitionForPublishId) {
            return <EditArticle competitionId={selectedCompetitionForPublishId} articleId={selectedArticleId} onBack={handleBackToArticles} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'MANAGE_MEDIA':
        if (selectedCompetitionForPublishId) {
            return <ManageMedia competitionId={selectedCompetitionForPublishId} onBack={handleBackToPublish} onCreateGallery={handleCreateGallery} onEditGallery={handleEditGallery} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'EDIT_GALLERY':
        if (selectedCompetitionForPublishId) {
            return <EditGallery competitionId={selectedCompetitionForPublishId} galleryId={selectedGalleryId} onBack={handleBackToMedia} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'MANAGE_SPONSORS':
        if (selectedCompetitionForPublishId) {
            return <ManageSponsors competitionId={selectedCompetitionForPublishId} onBack={handleBackToPublish} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'MANAGE_REGULATIONS':
        if (selectedCompetitionForPublishId) {
            return <ManageRegulations competitionId={selectedCompetitionForPublishId} onBack={handleBackToPublish} />;
        }
        return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
      case 'SETTINGS':
        return <Settings setPage={setCurrentPage} />;
      case 'MARKETPLACE':
        return <Marketplace />;
      case 'LIVE_MATCH':
        if (selectedMatchId) {
            return <LiveMatch matchId={selectedMatchId} onBack={handleBackFromLiveMatch} />;
        }
        if (selectedCompetitionId) {
            return <CompetitionDetail competitionId={selectedCompetitionId} onBack={handleBackToCompetitions} onManageLiveMatch={handleManageLiveMatch} />;
        }
        return <Dashboard setPage={setCurrentPage} />;
      default:
        return <Dashboard setPage={setCurrentPage} />;
    }
  }, [currentPage, selectedCompetitionId, selectedMatchId, selectedCompetitionForPublishId, selectedArticleId, selectedGalleryId]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;