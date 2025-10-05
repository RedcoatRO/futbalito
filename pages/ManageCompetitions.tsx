import React, { useState } from 'react';
import type { Page, Competition } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CompetitionForm from '../components/CompetitionForm';
import { PlusIcon } from '../components/icons/Icons';
import { useCompetitions } from '../context/CompetitionContext';
import usePermissions from '../hooks/usePermissions';


interface ManageCompetitionsProps {
    setPage: (page: Page) => void;
    onViewCompetition: (id: string) => void;
}

const ManageCompetitions: React.FC<ManageCompetitionsProps> = ({setPage, onViewCompetition}) => {
  const { competitions, matches, addCompetition, updateCompetition, deleteCompetition } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  const openCreateModal = () => {
    setEditingCompetition(null);
    setIsModalOpen(true);
  };

  const openEditModal = (competition: Competition) => {
    setEditingCompetition(competition);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompetition(null);
  };

  const handleSave = (data: { 
    name: string; 
    season: string; 
    logoFile?: File | null;
    format: 'league' | 'cup' | 'mixed';
    twoLegged?: boolean;
    fullBracket?: boolean;
    teamsPerGroup?: number;
  }) => {
    if (editingCompetition) {
      updateCompetition({ ...editingCompetition, ...data });
    } else {
      addCompetition(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this competition? This action cannot be undone.')) {
      deleteCompetition(id);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Competitions</h1>
            <p className="mt-2 text-gray-600">Create, edit, and oversee all competitions and seasons.</p>
        </div>
        {hasPermission('competitions:create') && (
            <Button onClick={openCreateModal}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Competition
            </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
                {(hasPermission('competitions:edit') || hasPermission('competitions:delete')) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitions.map((comp) => (
                <tr key={comp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <img className="h-10 w-10 rounded-full object-cover" src={comp.logoUrl} alt={comp.name} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onViewCompetition(comp.id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {comp.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.season}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      comp.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                      comp.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{comp.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.teamIds.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{matches.filter(m => m.competitionId === comp.id).length}</td>
                  {(hasPermission('competitions:edit') || hasPermission('competitions:delete')) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        {hasPermission('competitions:edit') && <button onClick={() => openEditModal(comp)} className="text-indigo-600 hover:text-indigo-900">Edit</button>}
                        {hasPermission('competitions:delete') && <button onClick={() => handleDelete(comp.id)} className="text-red-600 hover:text-red-900">Delete</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCompetition ? 'Edit Competition' : 'Create New Competition'}>
        <CompetitionForm 
          competition={editingCompetition}
          onSave={handleSave}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ManageCompetitions;