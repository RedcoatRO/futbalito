import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Team, Transfer, PlayerRegistration } from '../types.ts';

interface PublicPlayerDetailProps {
  playerId: string;
}

/**
 * Renders a detailed public profile page for a specific player.
 * It aggregates and displays performance stats, registration history, and transfers.
 * @param {PublicPlayerDetailProps} props The component props containing the playerId.
 * @returns {JSX.Element} The rendered player detail page.
 */
const PublicPlayerDetail: React.FC<PublicPlayerDetailProps> = ({ playerId }) => {
  const { players, teams, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId, portalConfig } = useCompetitions();

  // Memoize data lookups for performance
  const player = useMemo(() => players.find(p => p.id === playerId), [playerId, players]);
  const team = useMemo(() => teams.find(t => t.id === player?.teamId), [player, teams]);
  const transfers = useMemo(() => getTransfersByPlayerId(playerId), [playerId, getTransfersByPlayerId]);
  const registrations = useMemo(() => getPlayerRegistrationsByPlayerId(playerId), [playerId, getPlayerRegistrationsByPlayerId]);

  if (!player || !portalConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Player Not Found</h1>
        </div>
      </div>
    );
  }

  const portalNavItems = [
    { name: 'Home', href: '/?portal=true' },
    { name: 'News', href: '/?portal=true&portal_page=news' },
    { name: 'Matches', href: '/?portal=true&portal_page=matches' },
    { name: 'Stats', href: '/?portal=true&portal_page=stats' },
    { name: 'Galleries', href: '/?portal=true&portal_page=galleries' },
  ];

  return (
    <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={portalConfig.logoUrl}
        title={portalConfig.title}
        primaryColor={portalConfig.primaryColor}
        navItems={portalNavItems}
      />
      <main className="container mx-auto py-12 px-6">
        {/* Player Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
          {team && <img src={team.logoUrl} alt={team.name} className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"/>}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 text-center sm:text-left">{player.name}</h1>
            {team && (
              <a href={`/?teamId=${team.id}`} className="text-lg text-gray-500 hover:underline text-center sm:text-left block">
                {team.name}
              </a>
            )}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard label="Goals" value={player.stats.goals} />
            <StatCard label="Assists" value={player.stats.assists} />
            <StatCard label="Yellow Cards" value={player.stats.yellowCards} color="text-yellow-500" />
            <StatCard label="Red Cards" value={player.stats.redCards} color="text-red-500" />
        </div>
        
        {/* History Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RegistrationHistory registrations={registrations} />
            <TransferHistory transfers={transfers} teams={teams} />
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

// --- Child Components for PublicPlayerDetail ---

const StatCard: React.FC<{label: string, value: number, color?: string}> = ({ label, value, color = 'text-gray-900' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

const RegistrationHistory: React.FC<{registrations: PlayerRegistration[]}> = ({ registrations }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration History</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50"><tr><th className="p-3 text-left text-xs uppercase">Reg #</th><th className="p-3 text-left text-xs uppercase">Expires</th><th className="p-3 text-left text-xs uppercase">Status</th></tr></thead>
                <tbody className="divide-y">
                    {registrations.length > 0 ? registrations.map(reg => (
                        <tr key={reg.id}>
                            <td className="p-3 text-sm font-mono">{reg.registrationNumber}</td>
                            <td className="p-3 text-sm">{new Date(reg.validUntil).toLocaleDateString()}</td>
                            <td className="p-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${reg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
                        </tr>
                    )) : <tr><td colSpan={3} className="p-6 text-center text-gray-500">No registration history.</td></tr>}
                </tbody>
            </table>
        </div>
    </div>
);

const TransferHistory: React.FC<{transfers: Transfer[], teams: Team[]}> = ({ transfers, teams }) => {
    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'N/A';
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transfer History</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50"><tr><th className="p-3 text-left text-xs uppercase">Date</th><th className="p-3 text-left text-xs uppercase">From</th><th className="p-3 text-left text-xs uppercase">To</th></tr></thead>
                    <tbody className="divide-y">
                        {transfers.length > 0 ? transfers.map(t => (
                            <tr key={t.id}>
                                <td className="p-3 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-3 text-sm"><a href={`/?teamId=${t.fromTeamId}`} className="text-blue-600 hover:underline">{getTeamName(t.fromTeamId)}</a></td>
                                <td className="p-3 text-sm"><a href={`/?teamId=${t.toTeamId}`} className="text-blue-600 hover:underline">{getTeamName(t.toTeamId)}</a></td>
                            </tr>
                        )) : <tr><td colSpan={3} className="p-6 text-center text-gray-500">No transfer history.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PublicPlayerDetail;