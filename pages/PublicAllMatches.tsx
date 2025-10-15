import React, { useMemo, useState } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Match, Competition, Team } from '../types.ts';

/**
 * A single match item component used to display match details consistently.
 */
const MatchItem: React.FC<{ match: Match; competitions: Competition[] }> = ({ match, competitions }) => {
    const getCompetitionName = (id: string) => competitions.find(c => c.id === id)?.name || 'N/A';
    
    return (
      <li className="p-4 grid grid-cols-3 items-center gap-4">
        <div className="flex items-center justify-end text-right">
          <span className="font-semibold text-gray-800 hidden sm:inline">{match.homeTeam.name}</span>
          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-10 w-10 rounded-full ml-3 object-cover"/>
        </div>
        <div className="text-center">
          {match.status === 'Finished' ? (
             <div className="text-2xl font-bold text-gray-900">{match.homeScore} - {match.awayScore}</div>
          ) : (
             <div className="text-sm text-gray-500">{new Date(match.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
          )}
          <p className="text-xs text-gray-400 truncate mt-1">{getCompetitionName(match.competitionId)}</p>
        </div>
        <div className="flex items-center justify-start">
          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-10 w-10 rounded-full mr-3 object-cover"/>
           <span className="font-semibold text-gray-800 hidden sm:inline">{match.awayTeam.name}</span>
        </div>
      </li>
    );
};

/**
 * Renders the aggregated matches hub, displaying all matches from public competitions
 * with filtering capabilities.
 */
const PublicAllMatches: React.FC = () => {
    const { competitions, matches, teams, portalConfig } = useCompetitions();
    const [competitionFilter, setCompetitionFilter] = useState<string>('all');
    const [teamFilter, setTeamFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'past' | 'future'>('all');

    // Memoize public competitions and teams for filtering
    const publicCompetitions = useMemo(() => competitions.filter(c => c.isPublic), [competitions]);
    const publicTeams = useMemo(() => {
        const publicTeamIds = new Set(publicCompetitions.flatMap(c => c.teamIds));
        return teams.filter(t => publicTeamIds.has(t.id));
    }, [publicCompetitions, teams]);

    // Apply filters to find the matches to display
    const filteredMatches = useMemo(() => {
        const publicCompetitionIds = publicCompetitions.map(c => c.id);
        return matches
            .filter(match => {
                // Initial filter: must be in a public competition
                if (!publicCompetitionIds.includes(match.competitionId)) return false;

                // Competition filter
                if (competitionFilter !== 'all' && match.competitionId !== competitionFilter) return false;

                // Team filter
                if (teamFilter !== 'all' && match.homeTeam.id !== teamFilter && match.awayTeam.id !== teamFilter) return false;
                
                // Date filter
                const now = new Date();
                const matchDate = new Date(match.date);
                if (dateFilter === 'past' && matchDate >= now) return false;
                if (dateFilter === 'future' && matchDate < now) return false;

                return true;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [matches, publicCompetitions, competitionFilter, teamFilter, dateFilter]);

    if (!portalConfig) return <p>Portal not configured.</p>;

    const { title, logoUrl, primaryColor, backgroundColor } = portalConfig;

    const portalNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal=true&portal_page=news' },
        { name: 'Matches', href: '/?portal=true&portal_page=matches' },
        { name: 'Stats', href: '/?portal=true&portal_page=stats' },
        { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
    ];

    return (
        <div style={{ backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={logoUrl}
                title={title}
                primaryColor={primaryColor}
                navItems={portalNavItems}
                activePage="Matches"
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Match Center</h1>
                
                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value as any)} className="border-gray-300 rounded-md shadow-sm p-2 text-sm w-full sm:w-auto">
                        <option value="all">All Dates</option>
                        <option value="past">Past Matches</option>
                        <option value="future">Upcoming Matches</option>
                    </select>
                    <select value={competitionFilter} onChange={e => setCompetitionFilter(e.target.value)} className="border-gray-300 rounded-md shadow-sm p-2 text-sm w-full sm:w-auto">
                        <option value="all">All Competitions</option>
                        {publicCompetitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="border-gray-300 rounded-md shadow-sm p-2 text-sm w-full sm:w-auto">
                        <option value="all">All Teams</option>
                        {publicTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>

                {/* Matches List */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {filteredMatches.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                           {filteredMatches.map(match => <MatchItem key={match.id} match={match} competitions={publicCompetitions} />)}
                        </ul>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No matches found for the selected filters.</p>
                        </div>
                    )}
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

export default PublicAllMatches;
