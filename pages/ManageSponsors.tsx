import React, { useState } from 'react';
import type { Sponsor } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SponsorForm from '../components/SponsorForm';
import { ChevronLeftIcon, PlusIcon } from '../components/icons/Icons';
import { useCompetitions } from '../context/CompetitionContext';
import usePermissions from '../hooks/usePermissions';

interface ManageSponsorsProps {
  competitionId: string;
  onBack: () => void;
}

const ManageSponsors: React.FC<ManageSponsorsProps> = ({ competitionId, onBack }) => {
  const { getCompetitionById, sponsors, addSponsor, updateSponsor, deleteSponsor } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  const competition = getCompetitionById(competitionId);
  const competitionSponsors = sponsors.filter(s => s.competitionId === competitionId);
  const canManageSponsors = hasPermission('publish:manage_sponsors');

  const openCreateModal = () => {
    setEditingSponsor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSponsor(null);
  };

  const handleSave = (data: { name: string; websiteUrl: string; logoFile?: File | null; }) => {
    if (editingSponsor) {
      updateSponsor({ ...editingSponsor, ...data }, data.logoFile);
    } else {
      addSponsor({ competitionId, ...data }, data.logoFile);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      deleteSponsor(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Sponsors: {competition?.name}</h1>
        </div>
        {canManageSponsors && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Add Sponsor</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase">Sponsor</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Website</th>{canManageSponsors && <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>}</tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitionSponsors.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td className="px-6 py-4"><div className="flex items-center"><img className="h-10 w-20 object-contain" src={sponsor.logoUrl} alt={sponsor.name} /><div className="ml-4 font-medium">{sponsor.name}</div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500"><a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{sponsor.websiteUrl}</a></td>
                  {canManageSponsors && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(sponsor)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(sponsor.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {canManageSponsors && (
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}>
                <SponsorForm sponsor={editingSponsor} onSave={handleSave} onClose={closeModal} />
            </Modal>
        )}
    </div>
  );
};

export default ManageSponsors;