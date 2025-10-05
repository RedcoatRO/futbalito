import React, { useState } from 'react';
import type { Team } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TeamForm from '../components/TeamForm';
import { PlusIcon } from '../components/icons/Icons';
import { useCompetitions } from '../context/CompetitionContext';
import usePermissions from '../hooks/usePermissions';

const ManageTeams: React.FC = () => {
  const { teams, addTeam, updateTeam, deleteTeam, addPlayersToTeam } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [managingPlayersForTeam, setManagingPlayersForTeam] = useState<Team | null>(null);
  const [playerNames, setPlayerNames] = useState('');

  const openCreateModal = () => {
    setEditingTeam(null);
    setIsTeamModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setIsTeamModalOpen(true);
  };
  
  const openPlayerManager = (team: Team) => {
    setManagingPlayersForTeam(team);
    setIsPlayerModalOpen(true);
  };
  
  const closeModal = () => {
    setIsTeamModalOpen(false);
    setEditingTeam(null);
    setIsPlayerModalOpen(false);
    setManagingPlayersForTeam(null);
    setPlayerNames('');
  };

  const handleSaveTeam = (data: any) => {
    if (editingTeam) updateTeam({ ...editingTeam, ...data });
    else addTeam(data);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure? This will remove the team from all competitions and delete their matches.')) {
      deleteTeam(id);
    }
  };

  const handleImportPlayers = () => {
    if (managingPlayersForTeam && playerNames.trim()) {
      const names = playerNames.split('\n').filter(name => name.trim() !== '');
      addPlayersToTeam(managingPlayersForTeam.id, names);
      closeModal();
    }
  };

  const handleDownloadTemplate = () => {
    const content = "John Doe\nJane Smith\nPeter Jones";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'player_import_template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canManageTeams = hasPermission('teams:edit') || hasPermission('teams:delete') || hasPermission('players:manage');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Teams</h1>
            <p className="mt-2 text-gray-600">Add new teams and edit existing ones.</p>
        </div>
        {hasPermission('teams:create') && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Create Team</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Players</th>{canManageTeams && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}</tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4"><div className="flex items-center"><img className="h-10 w-10 rounded-full object-cover" src={team.logoUrl} alt={team.name} /><div className="ml-4 font-medium">{team.name}</div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{team.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{team.playerIds.length}</td>
                  {canManageTeams && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        {hasPermission('players:manage') && <button onClick={() => openPlayerManager(team)} className="text-green-600 hover:text-green-900">Manage Players</button>}
                        {hasPermission('teams:edit') && <button onClick={() => openEditModal(team)} className="text-indigo-600 hover:text-indigo-900">Edit</button>}
                        {hasPermission('teams:delete') && <button onClick={() => handleDelete(team.id)} className="text-red-600 hover:text-red-900">Delete</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isTeamModalOpen} onClose={closeModal} title={editingTeam ? 'Edit Team' : 'Create New Team'}>
        <TeamForm team={editingTeam} onSave={handleSaveTeam} onClose={closeModal}/>
      </Modal>
      
      <Modal isOpen={isPlayerModalOpen} onClose={closeModal} title={`Manage Players for ${managingPlayersForTeam?.name}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="playerNames" className="block text-sm font-medium text-gray-700">Import Players</label>
            <Button type="button" variant="outline" onClick={handleDownloadTemplate} className="text-xs !py-1 !px-2">Download Template</Button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Enter one player name per line. They will be added to the team roster. Existing players will be ignored.</p>
          <textarea id="playerNames" value={playerNames} onChange={(e) => setPlayerNames(e.target.value)} rows={10} className="w-full border border-gray-300 rounded-md p-2" placeholder="John Smith&#10;Peter Jones&#10;..."></textarea>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse"><Button onClick={handleImportPlayers}>Import Players</Button></div>
      </Modal>
    </div>
  );
};

export default ManageTeams;