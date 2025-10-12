
import React, { useState } from 'react';
// FIX: Added .ts extension to module import.
import type { Player } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import PlayerForm from '../components/PlayerForm.tsx';
// FIX: Added .tsx extension to module import.
import { PlusIcon } from '../components/icons/Icons.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';

interface ManagePlayersProps {
    onViewPlayerDetail: (id: string) => void;
}

const ManagePlayers: React.FC<ManagePlayersProps> = ({ onViewPlayerDetail }) => {
  const { players, teams, addPlayer, updatePlayer, deletePlayer } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const canManage = hasPermission('players:manage');

  const openCreateModal = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  const handleSave = (data: { name: string; teamId: string; }) => {
    if (editingPlayer) {
      updatePlayer({ ...editingPlayer, ...data });
    } else {
      addPlayer(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      deletePlayer(id);
    }
  };

  const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || 'Unassigned';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Players</h1>
          <p className="mt-2 text-gray-600">Add, edit, and manage all players in your organization.</p>
        </div>
        {canManage && (
          <Button onClick={openCreateModal}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Player
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goals</th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 font-medium">
                    <button onClick={() => onViewPlayerDetail(player.id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {player.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{getTeamName(player.teamId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{player.stats.goals}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                      <button onClick={() => openEditModal(player)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleDelete(player.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPlayer ? 'Edit Player' : 'Add New Player'}>
        <PlayerForm 
          player={editingPlayer}
          onSave={handleSave}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ManagePlayers;
