import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PublicSite from './pages/PublicSite';
import PublicArticleDetail from './pages/PublicArticleDetail';
import PublicGalleryDetail from './pages/PublicGalleryDetail';
import PublicPortalSite from './pages/PublicPortalSite';
import { CompetitionProvider } from './context/CompetitionContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const urlParams = new URLSearchParams(window.location.search);
const publicCompetitionId = urlParams.get('publicCompetitionId');
const publicArticleId = urlParams.get('articleId');
const publicGalleryId = urlParams.get('galleryId');
const isPortal = urlParams.get('portal') === 'true';

root.render(
  <React.StrictMode>
    <CompetitionProvider>
      {isPortal ? (
        <PublicPortalSite />
      ) : publicCompetitionId ? (
        publicArticleId ? (
          <PublicArticleDetail competitionId={publicCompetitionId} articleId={publicArticleId} />
        ) : publicGalleryId ? (
          <PublicGalleryDetail competitionId={publicCompetitionId} galleryId={publicGalleryId} />
        ) : (
          <PublicSite competitionId={publicCompetitionId} />
        )
      ) : <App />}
    </CompetitionProvider>
  </React.StrictMode>
);