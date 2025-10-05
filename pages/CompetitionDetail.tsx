import React, { useState, useMemo } from 'react';
import type { Match, StandingsRow } from '../types';
import { useCompetitions } from '../context/CompetitionContext';
import usePermissions from '../hooks/usePermissions';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { ChevronLeftIcon } from '../components/icons/Icons';

interface CompetitionDetailProps {
  competitionId: string;
  onBack: () => void;
  onManageLiveMatch: (matchId: string) => void;
}

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competitionId, onBack, onManageLiveMatch }) => {
  const { getCompetitionById, teams, matches, addTeamToCompetition, generateMatchesForCompetition, calculateStandings, arenas, updateMatch } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('Schedule');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  
  const competition = useMemo(() => getCompetitionById(competitionId), [competitionId, getCompetitionById]);
  
  const canEditCompetition = hasPermission('competitions:edit');
  const canManageLiveMatch = hasPermission('matches:manage_live');

  // FIX: Replaced `any` with a generic type to improve type safety and fix an inference issue
  // that caused a downstream error.
  const handleMatchUpdate = <K extends keyof Match>(matchId: string, field: K, value: Match[K]) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
        // The cast is necessary because TypeScript can't guarantee that the new object
        // with a dynamic key satisfies the Match type, even with generics.
        updateMatch({ ...match, [field]: value } as Match);
    }
  };

  if (!competition) return <Card><p>Competition not found.</p></Card>;

  const competitionTeams = teams.filter(team => competition.teamIds.includes(team.id));
  const availableTeams = teams.filter(team => !competition.teamIds.includes(team.id));

  const competitionMatches = matches.filter(m => m.competitionId === competitionId);
  
  const groupedMatches = useMemo(() => {
    return competitionMatches.reduce<Record<string, Match[]>>((acc, match) => {
      const stage = match.stage || 'Uncategorized';
      if (!acc[stage]) acc[stage] = [];
      acc[stage].push(match);
      return acc;
    }, {});
  }, [competitionMatches]);
  
  const stages = Object.keys(groupedMatches);
  const standingsByStage = stages.reduce<Record<string, StandingsRow[]>>((acc, stage) => {
      if(competition.format !== 'cup') {
          acc[stage] = calculateStandings(competitionId, stage);
      }
      return acc;
  }, {});

  const handleAddTeam = () => {
    if (selectedTeam) {
      addTeamToCompetition(competitionId, selectedTeam);
      setSelectedTeam('');
    }
  };

  return (
    <div>
        <div className="flex justify-between items-start mb-6">
            <div>
                <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"><ChevronLeftIcon className="h-4 w-4 mr-1" /> Back</button>
                <div className="flex items-center gap-4">
                    <img src={competition.logoUrl} alt={competition.name} className="h-16 w-16 rounded-full object-cover" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{competition.name}</h1>
                        <p className="mt-1 text-gray-600">Season: {competition.season} &bull; Status: {competition.status} &bull; Format: <span className="font-semibold capitalize">{competition.format}</span></p>
                    </div>
                </div>
            </div>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={['Schedule', 'Rankings', 'Teams']} />

        <div className="mt-6">
            {activeTab === 'Schedule' && (
                <Card className="!p-0"><div className="p-4 flex justify-between items-center"><h2 className="text-xl font-bold">Match Schedule</h2>{canEditCompetition && <Button onClick={() => generateMatchesForCompetition(competitionId)} disabled={competitionTeams.length < 2} variant="secondary">Generate Matches</Button>}</div><div className="p-4 space-y-6 overflow-x-auto">{Object.keys(groupedMatches).length > 0 ? Object.entries(groupedMatches).sort(([a], [b]) => a.localeCompare(b, undefined, {numeric: true})).map(([stage, matchesInStage]: [string, Match[]]) => (<div key={stage}><h3 className="text-md font-semibold text-gray-700 mb-2">{stage}</h3><table className="min-w-full text-sm"><tbody>{matchesInStage.map(match => {
                  const arenaForMatch = arenas.find(a => a.id === match.arenaId);
                  return (<tr key={match.id} className="border-t"><td className="py-2 pr-2">{match.homeTeam.name} vs {match.awayTeam.name}</td><td className="py-2 px-2"><input type="datetime-local" value={match.date ? new Date(match.date).toISOString().slice(0, 16) : ''} onChange={(e) => handleMatchUpdate(match.id, 'date', new Date(e.target.value).toISOString())} className="p-1 border rounded-md text-xs" disabled={!canEditCompetition}/></td><td className="py-2 px-2"><select value={match.arenaId || ''} onChange={(e) => handleMatchUpdate(match.id, 'arenaId', e.target.value)} className="p-1 border rounded-md text-xs" disabled={!canEditCompetition}><option value="">Arena</option>{arenas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></td><td className="py-2 px-2"><select value={match.field || ''} onChange={(e) => handleMatchUpdate(match.id, 'field', e.target.value)} className="p-1 border rounded-md text-xs" disabled={!match.arenaId || !canEditCompetition}><option value="">Field</option>{
                    // FIX: Ensure arena fields are an array before mapping to prevent type errors.
                    (arenaForMatch?.fields || []).map((f: string) => <option key={f} value={f}>{f}</option>)
                  }</select></td><td className="py-2 pl-2 text-right">{match.status !== 'Finished' && canManageLiveMatch && <button onClick={() => onManageLiveMatch(match.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">Manage Live</button>}</td></tr>);
                })}</tbody></table></div>)) : <p className="py-8 text-center text-gray-500">No matches generated.</p>}</div></Card>
            )}
            {activeTab === 'Rankings' && (
                <div className="space-y-6">{Object.entries(standingsByStage).filter(([,standings]) => standings.length > 0).map(([stage, standings]) => (<Card key={stage} className="!p-0"><h3 className="text-lg font-bold p-4 border-b">{stage} Rankings</h3><table className="min-w-full"><thead><tr className="bg-gray-50"><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">P</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">W</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">W-S</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">L-S</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">L</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">GF:GA</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">GD</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Pts</th></tr></thead><tbody className="divide-y">{standings.map(s => (<tr key={s.teamId}><td className="px-4 py-2 font-medium flex items-center"><img src={s.logoUrl} className="h-6 w-6 rounded-full mr-2"/>{s.teamName}</td><td className="px-4 py-2 text-center">{s.played}</td><td className="px-4 py-2 text-center">{s.wins}</td><td className="px-4 py-2 text-center">{s.winsShootout}</td><td className="px-4 py-2 text-center">{s.lossesShootout}</td><td className="px-4 py-2 text-center">{s.losses}</td><td className="px-4 py-2 text-center">{s.goalsFor}:{s.goalsAgainst}</td><td className="px-4 py-2 text-center">{s.goalDifference}</td><td className="px-4 py-2 text-center font-bold">{s.points}</td></tr>))}</tbody></table></Card>))}</div>
            )}
            {activeTab === 'Teams' && (
                <Card>
                    {canEditCompetition && (
                        <div className="flex items-center gap-2 mb-4"><select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="flex-grow border rounded-md p-2"><option value="">Select a team to add...</option>{availableTeams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}</select><Button onClick={handleAddTeam} disabled={!selectedTeam}>Add Team</Button></div>
                    )}
                    <ul className="space-y-2">{competitionTeams.length > 0 ? competitionTeams.map(team => (<li key={team.id} className="flex items-center bg-gray-50 p-2 rounded-md"><img src={team.logoUrl} alt={team.name} className="h-8 w-8 rounded-full mr-3" /><span>{team.name}</span></li>)) : <p className="text-center text-gray-500 py-4">No teams added.</p>}</ul>
                </Card>
            )}
        </div>
    </div>
  );
};

export default CompetitionDetail;