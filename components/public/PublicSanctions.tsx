import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext.tsx';
import type { Sanction } from '../../types.ts';

interface PublicSanctionsProps {
  competitionId: string;
}

const PublicSanctions: React.FC<PublicSanctionsProps> = ({ competitionId }) => {
  const { sanctions, players, teams } = useCompetitions();
  const competitionSanctions = sanctions.filter(s => s.competitionId === competitionId);

  if (competitionSanctions.length === 0) {
    return null;
  }
  
  /**
   * Generates a JSX element with links for the sanctioned party.
   * If it's a player, it links to both the player and their team.
   * If it's a team, it links to the team page.
   * @param {Sanction} sanction The sanction object.
   * @returns {React.ReactElement} The name of the sanctioned party as a link.
   */
  // FIX: Changed return type from JSX.Element to React.ReactElement to resolve namespace error.
  const getSanctionTargetLink = (sanction: Sanction): React.ReactElement => {
    if (sanction.playerId) {
        const player = players.find(p => p.id === sanction.playerId);
        const team = teams.find(t => t.id === player?.teamId);
        return (
            <span>
                <a href={`/?playerId=${sanction.playerId}`} className="text-blue-600 hover:underline">{player?.name || 'Unknown Player'}</a>
                {team && (
                    <span className="text-gray-500 text-xs"> (<a href={`/?teamId=${team.id}`} className="hover:underline">{team.name}</a>)</span>
                )}
            </span>
        );
    }
    if (sanction.teamId) { 
        const team = teams.find(t => t.id === sanction.teamId);
        return <a href={`/?teamId=${sanction.teamId}`} className="text-blue-600 hover:underline">{team?.name || 'Unknown Team'}</a>;
    }
    return <span>N/A</span>;
  };

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Official Decisions & Sanctions</h2>
       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Party</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitionSanctions.map(s => (
                <tr key={s.id}>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{getSanctionTargetLink(s)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PublicSanctions;
