
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Browse from './pages/Browse.tsx';
import ManageCompetitions from './pages/ManageCompetitions.tsx';
import ManageTeams from './pages/ManageTeams.tsx';
import ManagePlayers from './pages/ManagePlayers.tsx';
import ManageArenas from './pages/ManageArenas.tsx';
import ManageReferees from './pages/ManageReferees.tsx';
import ManageObservers from './pages/ManageObservers.tsx';
import ManageOrganizers from './pages/ManageOrganizers.tsx';
import ManageNationalTeam from './pages/ManageNationalTeam.tsx';
import Publish from './pages/Publish.tsx';
import Reports from './pages/Reports.tsx';
import Marketplace from './pages/Marketplace.tsx';
import Settings from './pages/Settings.tsx';
import CompetitionDetail from './pages/CompetitionDetail.tsx';
import LiveMatch from './pages/LiveMatch.tsx';
import PlayerDetail from './pages/PlayerDetail.tsx';
import WebBuilder from './pages/WebBuilder.tsx';
import ManageArticles from './pages/ManageArticles.tsx';
import EditArticle from './pages/EditArticle.tsx';
import ManageMedia from './pages/ManageMedia.tsx';
import EditGallery from './pages/EditGallery.tsx';
import ManageSponsors from './pages/ManageSponsors.tsx';
import ManageRegulations from './pages/ManageRegulations.tsx';
import PublicSite from './pages/PublicSite.tsx';
import PublicArticleDetail from './pages/PublicArticleDetail.tsx';
import PublicGalleryDetail from './pages/PublicGalleryDetail.tsx';
import PublicAllLiveStreams from './pages/PublicAllLiveStreams.tsx';
import PublicPortalSite from './pages/PublicPortalSite.tsx';
import PublicTeamDetail from './pages/PublicTeamDetail.tsx';
import PublicNationalTeam from './pages/PublicNationalTeam.tsx';
// FIX: Import PortalBuilder component to resolve 'Cannot find name' error.
import PortalBuilder from './pages/PortalBuilder.tsx';

import type { Page } from './types.ts';

const App: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const queryParams = new URLSearchParams(window.location.search);
    const publicCompetitionId = queryParams.get('publicCompetitionId');
    const articleId = queryParams.get('articleId');
    const galleryId = queryParams.get('galleryId');
    const liveView = queryParams.get('view') === 'live';
    const isPortal = queryParams.get('portal') === 'true';
    const isPublicTeam = queryParams.get('teamId');
    const isPublicNational = queryParams.get('nationalTeam');

    const [page, setPage] = useState<Page>('DASHBOARD');
    const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null);
    const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
    const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
    const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
    const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
    const [manageSponsorsCompetitionId, setManageSponsorsCompetitionId] = useState<string | null>(null);
    const [manageRegulationsCompetitionId, setManageRegulationsCompetitionId] = useState<string | null>(null);


    // Public Site Routing
    if (isPublicNational) {
        return <PublicNationalTeam />;
    }
    if (isPublicTeam) {
        return <PublicTeamDetail />;
    }
    if (isPortal) {
        return <PublicPortalSite />;
    }
    if (publicCompetitionId) {
        if (articleId) {
            return <PublicArticleDetail competitionId={publicCompetitionId} articleId={articleId} />;
        }
        if (galleryId) {
            return <PublicGalleryDetail competitionId={publicCompetitionId} galleryId={galleryId} />;
        }
        if (liveView) {
            return <PublicAllLiveStreams competitionId={publicCompetitionId} />;
        }
        return <PublicSite competitionId={publicCompetitionId} />;
    }

    // Handlers to switch between pages/views
    const handleViewCompetition = (id: string) => {
        setActiveCompetitionId(id);
        setPage('VIEW_COMPETITION');
    };

    const handleBackToCompetitions = () => {
        setActiveCompetitionId(null);
        setPage('MANAGE_COMPETITIONS');
    };
    
    const handleManageLiveMatch = (id: string) => {
        setActiveMatchId(id);
        setPage('LIVE_MATCH');
    };

    const handleBackToCompetitionDetail = () => {
        setActiveMatchId(null);
        setPage('VIEW_COMPETITION');
    }

    const handleViewPlayerDetail = (id: string) => {
        setActivePlayerId(id);
        setPage('VIEW_PLAYER');
    };
    
    const handleBackToPlayers = () => {
        setActivePlayerId(null);
        setPage('MANAGE_PLAYERS');
    };
    
    const handleCustomizeSite = (id: string) => {
        setActiveCompetitionId(id);
        setPage('WEB_BUILDER');
    };

    const handleBackToPublish = () => {
        setActiveCompetitionId(null);
        setActiveArticleId(null);
        setActiveGalleryId(null);
        setManageSponsorsCompetitionId(null);
        setManageRegulationsCompetitionId(null);
        setPage('PUBLISH');
    };

    const handleManageArticles = (id: string) => {
        setActiveCompetitionId(id);
        setPage('MANAGE_ARTICLES');
    };
    
    const handleCreateArticle = (id: string) => {
        setActiveCompetitionId(id);
        setActiveArticleId(null);
        setPage('EDIT_ARTICLE');
    };
    
    const handleEditArticle = (id: string) => {
        setActiveArticleId(id);
        setPage('EDIT_ARTICLE');
    };

    const handleManageMedia = (id: string) => {
        setActiveCompetitionId(id);
        setPage('MANAGE_MEDIA');
    };

    const handleCreateGallery = (id: string) => {
        setActiveCompetitionId(id);
        setActiveGalleryId(null);
        setPage('EDIT_GALLERY');
    };

    const handleEditGallery = (id: string) => {
        setActiveGalleryId(id);
        setPage('EDIT_GALLERY');
    };
    
    const handleManageSponsors = (id: string) => {
        setManageSponsorsCompetitionId(id);
        setPage('MANAGE_SPONSORS');
    }

    const handleManageRegulations = (id: string) => {
        setManageRegulationsCompetitionId(id);
        setPage('MANAGE_REGULATIONS');
    }

    const handleCustomizePortal = () => {
        setPage('PORTAL_BUILDER');
    }

    const renderPage = () => {
        switch (page) {
            case 'DASHBOARD': return <Dashboard setPage={setPage} />;
            case 'BROWSE': return <Browse />;
            case 'MANAGE_COMPETITIONS': return <ManageCompetitions setPage={setPage} onViewCompetition={handleViewCompetition} />;
            case 'MANAGE_TEAMS': return <ManageTeams />;
            case 'MANAGE_PLAYERS': return <ManagePlayers onViewPlayerDetail={handleViewPlayerDetail} />;
            case 'MANAGE_ARENAS': return <ManageArenas />;
            case 'MANAGE_REFEREES': return <ManageReferees />;
            case 'MANAGE_OBSERVERS': return <ManageObservers />;
            case 'MANAGE_ORGANIZERS': return <ManageOrganizers />;
            case 'MANAGE_NATIONAL_TEAM': return <ManageNationalTeam />;
            case 'PUBLISH': return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
            case 'REPORTS': return <Reports />;
            case 'MARKETPLACE': return <Marketplace />;
            case 'SETTINGS': return <Settings setPage={setPage} />;
            case 'VIEW_COMPETITION': return activeCompetitionId ? <CompetitionDetail competitionId={activeCompetitionId} onBack={handleBackToCompetitions} onManageLiveMatch={handleManageLiveMatch} /> : <p>Competition not found</p>;
            case 'LIVE_MATCH': return activeMatchId ? <LiveMatch matchId={activeMatchId} onBack={handleBackToCompetitionDetail} /> : <p>Match not found</p>;
            case 'VIEW_PLAYER': return activePlayerId ? <PlayerDetail playerId={activePlayerId} onBack={handleBackToPlayers} /> : <p>Player not found</p>;
            case 'WEB_BUILDER': return activeCompetitionId ? <WebBuilder competitionId={activeCompetitionId} onBack={handleBackToPublish} /> : <p>Competition not selected</p>;
            case 'MANAGE_ARTICLES': return activeCompetitionId ? <ManageArticles competitionId={activeCompetitionId} onBack={handleBackToPublish} onCreateArticle={handleCreateArticle} onEditArticle={handleEditArticle} /> : <p>No competition selected</p>;
            case 'EDIT_ARTICLE': return activeCompetitionId ? <EditArticle competitionId={activeCompetitionId} articleId={activeArticleId} onBack={() => setPage('MANAGE_ARTICLES')} /> : <p>No competition selected</p>;
            case 'MANAGE_MEDIA': return activeCompetitionId ? <ManageMedia competitionId={activeCompetitionId} onBack={handleBackToPublish} onCreateGallery={handleCreateGallery} onEditGallery={handleEditGallery} /> : <p>No competition selected</p>;
            case 'EDIT_GALLERY': return activeCompetitionId ? <EditGallery competitionId={activeCompetitionId} galleryId={activeGalleryId} onBack={() => setPage('MANAGE_MEDIA')} /> : <p>No competition selected</p>;
            case 'MANAGE_SPONSORS': return manageSponsorsCompetitionId ? <ManageSponsors competitionId={manageSponsorsCompetitionId} onBack={handleBackToPublish} /> : <p>No competition selected</p>;
            case 'MANAGE_REGULATIONS': return manageRegulationsCompetitionId ? <ManageRegulations competitionId={manageRegulationsCompetitionId} onBack={handleBackToPublish} /> : <p>No competition selected</p>;
            case 'PORTAL_BUILDER': return <PortalBuilder onBack={handleBackToPublish} />;
            default: return <Dashboard setPage={setPage} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar page={page} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
