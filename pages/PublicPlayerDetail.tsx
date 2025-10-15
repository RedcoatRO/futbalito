import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

interface PublicPlayerDetailProps {
    playerId: string;
}

const PublicPlayerDetail: React.FC<PublicPlayerDetailProps> = ({ playerId }) => {
    const { portalConfig, players, teams, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId } = useCompetitions();

    const player = players.find(p => p.id === playerId);
    const team = teams.find(t => t.id === player?.teamId);
    const transfers = getTransfersByPlayerId(playerId);
    const registrations = getPlayerRegistrationsByPlayerId(playerId);

    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];
    
    if (!player) {
        return <div>Player not found.</div>;
    }

    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'N/A';

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                        {player.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">{player.name}</h1>
                        {team && (
                            <a href={`/?teamId=${team.id}`} className="flex items-center mt-1 group">
                                <img src={team.logoUrl} alt={team.name} className="h-6 w-6 rounded-full mr-2"/>
                                <p className="text-lg text-gray-600 group-hover:underline">{team.name}</p>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Season Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-md"><span>Goals</span><span className="font-bold">{player.stats.goals}</span></div>
                            <div className="flex justify-between p-3"><span>Assists</span><span className="font-bold">{player.stats.assists}</span></div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-md"><span>Yellow Cards</span><span className="font-bold">{player.stats.yellowCards}</span></div>
                            <div className="flex justify-between p-3"><span>Red Cards</span><span className="font-bold">{player.stats.redCards}</span></div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Registration History</h2>
                            <ul className="divide-y divide-gray-200">
                                {registrations.map(reg => (
                                    <li key={reg.id} className="py-2 grid grid-cols-3 gap-4">
                                        <span className="font-mono text-sm">{reg.registrationNumber}</span>
                                        <span className="text-sm text-gray-600">Until: {new Date(reg.validUntil).toLocaleDateString()}</span>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${reg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Transfer History</h2>
                            <ul className="divide-y divide-gray-200">
                                {transfers.map(t => (
                                    <li key={t.id} className="py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{getTeamName(t.fromTeamId)} &rarr; {getTeamName(t.toTeamId)}</span>
                                            <span className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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

export default PublicPlayerDetail;