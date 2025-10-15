import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Gallery } from '../types.ts';

/**
 * Renders the aggregated galleries hub, displaying all photo galleries
 * from all public competitions.
 */
const PublicAllGalleries: React.FC = () => {
    const { competitions, galleries, mediaImages, portalConfig } = useCompetitions();

    // Memoized calculation to get all galleries from public competitions
    const publicGalleries = useMemo(() => {
        const publicCompetitionIds = competitions.filter(c => c.isPublic).map(c => c.id);
        // Assuming galleries are already roughly in chronological order from context
        return galleries.filter(g => publicCompetitionIds.includes(g.competitionId));
    }, [competitions, galleries]);

    if (!portalConfig) {
        return <p>Portal not configured.</p>;
    }

    const { title, logoUrl, primaryColor, backgroundColor } = portalConfig;

    const portalNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal=true&portal_page=news' },
        { name: 'Matches', href: '/?portal=true&portal_page=matches' },
        { name: 'Stats', href: '/?portal=true&portal_page=stats' },
        { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
    ];
    
    // Helper to get the cover image URL for a gallery
    const getFirstImage = (imageIds: string[]) => {
        if (imageIds.length === 0) return 'https://picsum.photos/seed/placeholder/600/400';
        const image = mediaImages.find(img => img.id === imageIds[0]);
        return image ? image.url : 'https://picsum.photos/seed/placeholder/600/400';
    };

    // Helper to create the URL for a gallery detail page
    const publicGalleryUrl = (gallery: Gallery) => 
        `${window.location.origin}${window.location.pathname}?publicCompetitionId=${gallery.competitionId}&galleryId=${gallery.id}`;

    return (
        <div style={{ backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={logoUrl}
                title={title}
                primaryColor={primaryColor}
                navItems={portalNavItems}
                activePage="Galleries"
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Photo Galleries</h1>
                {publicGalleries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publicGalleries.map(gallery => (
                            <a href={publicGalleryUrl(gallery)} key={gallery.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <img src={getFirstImage(gallery.imageIds)} alt={gallery.title} className="h-48 w-full object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{gallery.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{gallery.imageIds.length} photos</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">No photo galleries have been published yet.</p>
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

export default PublicAllGalleries;
