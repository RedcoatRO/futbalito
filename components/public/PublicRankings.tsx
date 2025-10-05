import React, { useMemo } from 'react';
import type { StandingsRow } from '../../types';
import { useCompetitions } from '../../context/CompetitionContext';

interface PublicRankingsProps {
  competitionId: string;
}

const PublicRankings: React.FC<PublicRankingsProps> = ({ competitionId }) => {
  const { getCompetitionById, matches, calculateStandings } = useCompetitions();
  const competition = getCompetitionById(competitionId);

  const standingsByStage = useMemo(() => {
    if (!competition || competition.format === 'cup') return {};

    const competitionMatches = matches.filter(m => m.competitionId === competitionId);
    const stages = [...new Set(competitionMatches.map(m => m.stage.split(' - ')[0].split('Round ')[0].trim()))];

    return stages.reduce<Record<string, StandingsRow[]>>((acc, stage) => {
      const stageStandings = calculateStandings(competitionId, stage);
      if (stageStandings.length > 0) {
        acc[stage] = stageStandings;
      }
      return acc;
    }, {});
  }, [competition, matches, calculateStandings, competitionId]);

  if (!competition || Object.keys(standingsByStage).length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Rankings</h2>
      <div className="space-y-10">
        {/* FIX: Add explicit type to resolve 'unknown' type from Object.entries */}
        {Object.entries(standingsByStage).map(([stage, standings]: [string, StandingsRow[]]) => (
          <div key={stage} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">{stage}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Team</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Played">P</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Wins">W</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Wins by Shootout">W-S</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Losses by Shootout">L-S</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Losses">L</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Goals For:Goals Against">GF:GA</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Goal Difference">GD</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase" title="Points">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {standings.map((s, index) => (
                    <tr key={s.teamId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium flex items-center text-gray-900">
                        <img src={s.logoUrl} className="h-8 w-8 rounded-full mr-3 object-cover" alt={s.teamName}/>
                        {s.teamName}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.played}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.wins}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.winsShootout}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.lossesShootout}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.losses}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.goalsFor}:{s.goalsAgainst}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                      <td className="px-3 py-3 text-center font-bold text-gray-900">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicRankings;
