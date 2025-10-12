
import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';
import Card from '../components/ui/Card.tsx';

interface PlayerDetailProps {
  playerId: string;
  onBack: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ playerId, onBack }) => {
  const { players, teams, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId } = useCompetitions();

  const player = useMemo(() => players.find(p => p.id === playerId), [playerId, players]);
  const team = useMemo(() => teams.find(t => t.id === player?.teamId), [player, teams]);
  const transfers = useMemo(() => getTransfersByPlayerId(playerId), [playerId, getTransfersByPlayerId]);
  const registrations = useMemo(() => getPlayerRegistrationsByPlayerId(playerId), [playerId, getPlayerRegistrationsByPlayerId]);

  if (!player) {
    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Players</button>
            <Card><p>Player not found.</p></Card>
        </div>
    );
  }

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown Team';

  return (
    <div>
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Players
        </button>
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                {player.name.charAt(0)}
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{player.name}</h1>
                <div className="flex items-center mt-1">
                    {team && <img src={team.logoUrl} alt={team.name} className="h-6 w-6 rounded-full mr-2"/>}
                    <p className="text-lg text-gray-600">{team?.name || 'Unassigned'}</p>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration History</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Registration #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Valid Until</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {registrations.length > 0 ? registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td className="px-6 py-4 text-sm font-mono">{reg.registrationNumber}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(reg.validUntil).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No registration history.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transfer History</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transfers.length > 0 ? transfers.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{getTeamName(t.fromTeamId)}</td>
                                    <td className="px-6 py-4 text-sm">{getTeamName(t.toTeamId)}</td>
                                    <td className="px-6 py-4 text-sm">{t.fee > 0 ? `$${t.fee.toLocaleString()}` : 'Free'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No transfer history for this player.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PlayerDetail;
