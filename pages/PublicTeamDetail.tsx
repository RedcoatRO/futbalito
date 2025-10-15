import React, { useMemo, useState } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Competition, Match, Player, Standing, Team } from '../types.ts';
import Tabs from '../components/ui/Tabs.tsx';

interface PublicTeamDetailProps {
  teamId: string;
}

/**
 * Renders a detailed public profile page for a specific team.
 * It aggregates and displays information like squad, matches, and standings.
 * @param {PublicTeamDetailProps} props The component props containing the teamId.
 * @returns {JSX.Element} The rendered team detail page.
 */
const PublicTeamDetail: React.FC<PublicTeamDetailProps> = ({ teamId }) => {
  const { teams, players, matches, competitions, calculateStandings, portalConfig } = useCompetitions();
  const [activeTab, setActiveTab] = useState('Overview');

  // Memoize all data lookups for performance
  const team = useMemo(() => teams.find(t => t.id === teamId), [teamId, teams]);
  const squad = useMemo(() => players.filter(p => p.teamId === teamId), [teamId, players]);
  const teamMatches = useMemo(() => 
    matches
      .filter(m => m.homeTeam.id === teamId || m.awayTeam.id === teamId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [teamId, matches]
  );

  // Find the most relevant competition (ongoing, public) for the team to display standings
  const relevantCompetition = useMemo(() => {
    return competitions.find(c => c.isPublic && c.teamIds.includes(teamId) && c.status === 'Ongoing' && c.format !== 'cup') 
        || competitions.find(c => c.isPublic && c.teamIds.includes(teamId) && c.format !== 'cup');
  }, [competitions, teamId]);
  
  const standings = useMemo(() => {
    if (!relevantCompetition) return null;
    return calculateStandings(relevantCompetition.id, 'Group Stage');
  }, [relevantCompetition, calculateStandings]);

  const teamStanding = useMemo(() => standings?.find(s => s.teamId === teamId), [standings, teamId]);

  if (!team || !portalConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Team Not Found</h1>
        </div>
      </div>
    );
  }

  const recentMatches = teamMatches.filter(m => m.status === 'Finished').slice(0, 5);
  const upcomingMatches = teamMatches.filter(m => m.status !== 'Finished').reverse().slice(0, 5);

  const portalNavItems = [
    { name: 'Home', href: '/?portal=true' },
    { name: 'News', href: '/?portal=true&portal_page=news' },
    { name: 'Matches', href: '/?portal=true&portal_page=matches' },
    { name: 'Stats', href: '/?portal=true&portal_page=stats' },
    { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
  ];

  const tabItems = ['Overview', 'Squad', 'Matches'];

  return (
    <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={portalConfig.logoUrl}
        title={portalConfig.title}
        primaryColor={portalConfig.primaryColor}
        navItems={portalNavItems}
      />
      <main className="container mx-auto py-12 px-6">
        {/* Team Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img src={team.logoUrl} alt={team.name} className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"/>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 text-center sm:text-left">{team.name}</h1>
            <p className="text-gray-500 text-center sm:text-left">{team.country}</p>
          </div>
        </div>
        
        <Tabs tabs={tabItems} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-8">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Matches */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Recent Results</h3>
                  <div className="bg-white rounded-lg shadow-md divide-y">
                    {recentMatches.length > 0 ? recentMatches.map(m => <MatchRow key={m.id} match={m} teamId={teamId} />) : <p className="p-4 text-gray-500">No recent matches.</p>}
                  </div>
                </div>
                {/* Upcoming Matches */}
                 <div>
                  <h3 className="text-xl font-bold mb-4">Upcoming Fixtures</h3>
                   <div className="bg-white rounded-lg shadow-md divide-y">
                    {upcomingMatches.length > 0 ? upcomingMatches.map(m => <MatchRow key={m.id} match={m} teamId={teamId} />) : <p className="p-4 text-gray-500">No upcoming fixtures.</p>}
                  </div>
                </div>
              </div>
              {/* Standings */}
              {teamStanding && relevantCompetition && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{relevantCompetition.name} Standings</h3>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <StandingsTable standings={standings!} highlightTeamId={teamId}/>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'Squad' && <SquadList squad={squad} />}
          
          {activeTab === 'Matches' && (
            <div>
              <h3 className="text-xl font-bold mb-4">All Matches</h3>
              <div className="bg-white rounded-lg shadow-md divide-y">
                  {teamMatches.length > 0 ? teamMatches.map(m => <MatchRow key={m.id} match={m} teamId={teamId} />) : <p className="p-4 text-gray-500">No matches scheduled.</p>}
              </div>
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

// --- Child Components for PublicTeamDetail ---

const MatchRow: React.FC<{match: Match, teamId: string}> = ({ match, teamId }) => {
    const isHome = match.homeTeam.id === teamId;
    const result = match.status === 'Finished' ? (match.homeScore === match.awayScore ? 'D' : (isHome && match.homeScore > match.awayScore) || (!isHome && match.awayScore > match.homeScore) ? 'W' : 'L') : '-';
    const resultColor = result === 'W' ? 'bg-green-100 text-green-800' : result === 'L' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';

    return (
        <div className="p-4 flex items-center justify-between">
            <div className="text-xs text-gray-500 w-24">{new Date(match.date).toLocaleDateString()}</div>
            <a href={`/?teamId=${match.homeTeam.id}`} className="flex items-center justify-end w-1/3 hover:underline">
                <span className="font-semibold text-right mr-2 hidden sm:inline">{match.homeTeam.name}</span>
                <img src={match.homeTeam.logoUrl} className="h-6 w-6 rounded-full" />
            </a>
            <div className="text-center font-bold mx-4">{match.status === 'Finished' ? `${match.homeScore} - ${match.awayScore}` : 'vs'}</div>
             <a href={`/?teamId=${match.awayTeam.id}`} className="flex items-center justify-start w-1/3 hover:underline">
                <img src={match.awayTeam.logoUrl} className="h-6 w-6 rounded-full" />
                <span className="font-semibold text-left ml-2 hidden sm:inline">{match.awayTeam.name}</span>
            </a>
            <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded-full ml-4 ${resultColor}`}>{result}</div>
        </div>
    );
};

const SquadList: React.FC<{squad: Player[]}> = ({ squad }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Goals</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assists</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {squad.map(player => (
                    <tr key={player.id}>
                        <td className="px-6 py-4">
                            <a href={`/?playerId=${player.id}`} className="font-medium text-blue-600 hover:underline">{player.name}</a>
                        </td>
                        <td className="px-6 py-4 text-center">{player.stats.goals}</td>
                        <td className="px-6 py-4 text-center">{player.stats.assists}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const StandingsTable: React.FC<{standings: Standing[], highlightTeamId: string}> = ({ standings, highlightTeamId }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead><tr><th className="p-2 text-left">Team</th><th className="p-2 text-center">P</th><th className="p-2 text-center">W-D-L</th><th className="p-2 text-center">Pts</th></tr></thead>
            <tbody>
                {standings.map((s, i) => (
                    <tr key={s.teamId} className={`${s.teamId === highlightTeamId ? 'bg-blue-50 font-bold' : ''}`}>
                        <td className="p-2 flex items-center"><span className="w-6 text-center">{i+1}</span><img src={s.logoUrl} className="h-5 w-5 rounded-full mx-2"/><a href={`/?teamId=${s.teamId}`} className="hover:underline truncate">{s.teamName}</a></td>
                        <td className="p-2 text-center">{s.played}</td>
                        <td className="p-2 text-center">{`${s.wins}-${s.draws}-${s.losses}`}</td>
                        <td className="p-2 text-center">{s.points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default PublicTeamDetail;