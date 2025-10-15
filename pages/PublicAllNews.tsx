import React, { useMemo, useState } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Article } from '../types.ts';

/**
 * Renders the aggregated news hub, displaying all published articles
 * from all public competitions. Includes sorting functionality.
 */
const PublicAllNews: React.FC = () => {
    const { competitions, articles, portalConfig } = useCompetitions();
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    // Memoized calculation to get all published articles from public competitions
    const publicArticles = useMemo(() => {
        const publicCompetitionIds = competitions.filter(c => c.isPublic).map(c => c.id);
        const allPublicArticles = articles.filter(a => 
            publicCompetitionIds.includes(a.competitionId) && a.status === 'published'
        );
        // Sort articles based on the selected sort order
        return allPublicArticles.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [competitions, articles, sortBy]);

    if (!portalConfig) {
        return <p>Portal not configured.</p>;
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
    
    // Helper function to create the URL for an article detail page
    const publicArticleUrl = (article: Article) => 
        `${window.location.origin}${window.location.pathname}?publicCompetitionId=${article.competitionId}&articleId=${article.id}`;

    return (
        <div style={{ backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={logoUrl}
                title={title}
                primaryColor={primaryColor}
                navItems={portalNavItems}
                activePage="News"
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">All News</h1>
                    <div className="flex items-center">
                        <label htmlFor="sort" className="text-sm font-medium text-gray-600 mr-2">Sort by:</label>
                        <select 
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                            className="border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
                {publicArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publicArticles.map(article => (
                        <a href={publicArticleUrl(article)} key={article.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <img src={article.featuredImageUrl} alt={article.title} className="h-48 w-full object-cover" />
                            <div className="p-6 min-h-[136px] flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">By {article.author} on {new Date(article.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="mt-4 text-sm font-semibold" style={{color: primaryColor}}>Read More &rarr;</div>
                            </div>
                        </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">No news articles have been published yet.</p>
                    </div>
                )}
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

export default PublicAllNews;
