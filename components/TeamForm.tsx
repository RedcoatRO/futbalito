import React, { useState, useEffect } from 'react';
import type { Team } from '../types';
import Button from './ui/Button';
import { useCompetitions } from '../context/CompetitionContext';

interface TeamFormProps {
  team?: Team | null;
  onSave: (data: { name: string; country: string; logoFile?: File | null; homeArenaId?: string }) => void;
  onClose: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSave, onClose }) => {
  const { arenas } = useCompetitions();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [homeArenaId, setHomeArenaId] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setCountry(team.country);
      setPreviewUrl(team.logoUrl);
      setHomeArenaId(team.homeArenaId);
    } else {
      setName('');
      setCountry('');
      setPreviewUrl(null);
      setHomeArenaId(undefined);
    }
    setLogoFile(null);
    setError('');
  }, [team]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) {
      setError('Both name and country fields are required.');
      return;
    }
    onSave({ name, country, logoFile, homeArenaId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        {/* Logo upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Team Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {previewUrl ? <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001 2.993zM10.771 5.223c-.486-.486-1.278-.486-1.764 0l-4.5 4.5a.5.5 0 00.353.854h9.282a.5.5 0 00.353-.854l-4.5-4.5z" /></svg>}
            </span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>{team ? 'Change' : 'Upload'}</span><input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>
        {/* Name and Country */}
        <div><label htmlFor="name" className="block text-sm font-medium">Team Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" /></div>
        <div><label htmlFor="country" className="block text-sm font-medium">Country</label><input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" /></div>
        {/* Home Arena */}
        <div>
            <label htmlFor="homeArena" className="block text-sm font-medium text-gray-700">Home Arena</label>
            <select id="homeArena" value={homeArenaId || ''} onChange={e => setHomeArenaId(e.target.value || undefined)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="">None</option>
                {arenas.map(arena => <option key={arena.id} value={arena.id}>{arena.name}</option>)}
            </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default TeamForm;