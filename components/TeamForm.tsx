

import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Team } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';

interface TeamFormProps {
  team?: Team | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setCountry(team.country);
      setPreviewUrl(team.logoUrl);
    } else {
        setName('');
        setCountry('');
        setPreviewUrl(null);
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
      setError('Name and country are required.');
      return;
    }
    onSave({ name, country, logoFile });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {previewUrl ? (
                <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001 2.993zM10.771 5.223c-.486-.486-1.278-.486-1.764 0l-4.5 4.5a.5.5 0 00.353.854h9.282a.5.5 0 00.353-.854l-4.5-4.5z" />
                </svg>
              )}
            </span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span>{team ? 'Change' : 'Upload'}</span>
              <input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium">Country</label>
          <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
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
