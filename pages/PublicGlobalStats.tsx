import React, { useMemo, useState } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Player } from '../types.ts';

type SortKey = 'goals' | 'assists';

/**
 * Renders the global player statistics page, showing aggregated leaderboards
 * for metrics like goals and assists across all public competitions.
 */
const PublicGlobalStats: React.FC = () => {
    const { competitions, players, teams, portalConfig } = useCompetitions();
    const [activeTab, setActiveTab] = useState<SortKey>('goals');

    // Memoize the list of all players from public competitions
    const allPublicPlayers = useMemo(() => {
        const publicTeamIds = new Set(competitions.filter(c => c.isPublic).flatMap(c => c.teamIds));
        return players.filter(p => publicTeamIds.has(p.teamId));
    }, [competitions, players]);

    // Memoize the sorted list of players based on the active tab (stat)
    const sortedPlayers = useMemo(() => {
        return [...allPublicPlayers].sort((a, b) => {
            const aStat = a.stats[activeTab] || 0;
            const bStat = b.stats[activeTab] || 0;
            // Primary sort by the stat, secondary by goals if not sorting by goals, tertiary by name
            if (bStat !== aStat) return bStat - aStat;
            if (activeTab !== 'goals' && b.stats.goals !== a.stats.goals) return b.stats.goals - a.stats.goals;
            return a.name.localeCompare(b.name);
        });
    }, [allPublicPlayers, activeTab]);

    if (!portalConfig) return <p>Portal not configured.</p>;

    const { title, logoUrl, primaryColor, backgroundColor } = portalConfig;

    const portalNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal=true&portal_page=news' },
        { name: 'Matches', href: '/?portal=true&portal_page=matches' },
        { name: 'Stats', href: '/?portal=true&portal_page=stats' },
        { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
    ];

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

    return (
        <div style={{ backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={logoUrl}
                title={title}
                primaryColor={primaryColor}
                navItems={portalNavItems}
                activePage="Stats"
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Global Player Rankings</h1>
                
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Tabs for different stats */}
                    <div className="flex border-b">
                        <button onClick={() => setActiveTab('goals')} className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'goals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Top Scorers</button>
                        <button onClick={() => setActiveTab('assists')} className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'assists' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Top Assists</button>
                    </div>

                    {/* Stats Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Player</th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Goals</th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Assists</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedPlayers.slice(0, 20).map((player, index) => { // Show top 20
                                    const team = getTeam(player.teamId);
                                    return (
                                        <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-medium flex items-center text-gray-900">
                                                <span className="w-6 text-center mr-2 text-gray-500">{index + 1}</span>
                                                {team && <a href={`/?teamId=${team.id}`}><img src={team.logoUrl} className="h-8 w-8 rounded-full mr-3 object-cover" alt={team.name}/></a>}
                                                <div>
                                                    <a href={`/?playerId=${player.id}`} className="hover:underline">{player.name}</a>
                                                    {team && <a href={`/?teamId=${team.id}`} className="block text-xs text-gray-500 hover:underline">{team.name}</a>}
                                                </div>
                                            </td>
                                            <td className={`px-3 py-3 text-center font-bold ${activeTab === 'goals' ? 'text-gray-800' : 'text-gray-600'}`}>{player.stats.goals}</td>
                                            <td className={`px-3 py-3 text-center font-bold ${activeTab === 'assists' ? 'text-gray-800' : 'text-gray-600'}`}>{player.stats.assists}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {sortedPlayers.length === 0 && <p className="text-center text-gray-500 p-8">No player statistics available.</p>}
                    </div>
                </div>
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

export default PublicGlobalStats;