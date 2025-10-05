import React from 'react';
import { useCompetitions } from '../context/CompetitionContext';

const ManagePlayers: React.FC = () => {
  const { players, teams } = useCompetitions();

  const getTeamName = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || 'N/A';
  };

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Players</h1>
            <p className="mt-2 text-gray-600">View all registered players across all teams.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Goals</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assists</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Y/R Cards</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                    <tr key={player.id}>
                        <td className="px-6 py-4 font-medium">{player.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{getTeamName(player.teamId)}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{player.stats.goals}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{player.stats.assists}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                            <span className="font-semibold text-yellow-600">{player.stats.yellowCards}</span> / 
                            <span className="font-semibold text-red-600">{player.stats.redCards}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
  );
};

export default ManagePlayers;
