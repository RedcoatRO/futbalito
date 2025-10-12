import React, { useState, useEffect } from 'react';
import type { Player } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from './ui/Button.tsx';

interface PlayerFormProps {
  player?: Player | null;
  onSave: (data: { name: string; teamId: string; }) => void;
  onClose: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSave, onClose }) => {
  const { teams } = useCompetitions();
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');

  /**
   * Effect to populate the form fields when editing an existing player
   * or reset them when creating a new one.
   */
  useEffect(() => {
    if (player) {
      setName(player.name);
      setTeamId(player.teamId);
    } else {
      setName('');
      // Default to the first team in the list if available
      setTeamId(teams.length > 0 ? teams[0].id : '');
    }
    setError('');
  }, [player, teams]);

  /**
   * Handles form submission, performs validation, and calls the onSave callback.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamId) {
      setError('Player name and team selection are required.');
      return;
    }
    onSave({ name, teamId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Player Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">Team</label>
          <select 
            id="teamId" 
            value={teamId} 
            onChange={(e) => setTeamId(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {teams.length === 0 ? (
                <option disabled>No teams available</option>
            ) : (
                teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                ))
            )}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse border-t">
        <Button type="submit">Save Player</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default PlayerForm;