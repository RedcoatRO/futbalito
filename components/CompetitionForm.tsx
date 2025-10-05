import React, { useState, useEffect } from 'react';
import type { Competition } from '../types';
import Button from './ui/Button';
import { useCompetitions } from '../context/CompetitionContext';

interface CompetitionFormProps {
  competition?: Competition | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ competition, onSave, onClose }) => {
  const { arenas } = useCompetitions();
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'league' | 'cup' | 'mixed'>('league');
  const [twoLegged, setTwoLegged] = useState(false);
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [defaultArenaId, setDefaultArenaId] = useState<string | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (competition) {
      setName(competition.name);
      setSeason(competition.season);
      setPreviewUrl(competition.logoUrl);
      setFormat(competition.format);
      setTwoLegged(competition.twoLegged ?? false);
      setTeamsPerGroup(competition.teamsPerGroup ?? 4);
      setDefaultArenaId(competition.defaultArenaId);
      setIsPublic(competition.isPublic ?? false);
    } else {
      setName(''); setSeason(''); setPreviewUrl(null); setFormat('league'); setTwoLegged(false); setTeamsPerGroup(4); setDefaultArenaId(undefined); setIsPublic(false);
    }
    setLogoFile(null); setError('');
  }, [competition]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !season.trim()) {
      setError('Name and season are required.');
      return;
    }
    onSave({ name, season, logoFile, format, twoLegged, teamsPerGroup, defaultArenaId, isPublic });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">{previewUrl ? <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001 2.993zM10.771 5.223c-.486-.486-1.278-.486-1.764 0l-4.5 4.5a.5.5 0 00.353.854h9.282a.5.5 0 00.353-.854l-4.5-4.5z" /></svg>}</span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"><span>{competition ? 'Change' : 'Upload'}</span><input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label>
          </div>
        </div>
        <div><label htmlFor="name" className="block text-sm font-medium">Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div><label htmlFor="season" className="block text-sm font-medium">Season</label><input type="text" id="season" value={season} onChange={(e) => setSeason(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div>
          <label htmlFor="defaultArena" className="block text-sm font-medium text-gray-700">Default Arena</label>
          <select id="defaultArena" value={defaultArenaId || ''} onChange={e => setDefaultArenaId(e.target.value || undefined)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">None (assign per match)</option>
              {arenas.map(arena => <option key={arena.id} value={arena.id}>{arena.name}</option>)}
          </select>
        </div>
        <hr/>
        <div><label className="block text-sm font-medium">Format</label><select value={format} onChange={(e) => setFormat(e.target.value as any)} className="mt-1 block w-full border rounded-md p-2"><option value="league">League</option><option value="cup">Cup</option><option value="mixed">Mixed</option></select></div>
        {format === 'league' && <div className="flex items-center"><input id="twoLegged" type="checkbox" checked={twoLegged} onChange={(e) => setTwoLegged(e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="twoLegged" className="ml-2">Two-legged matches</label></div>}
        {format === 'mixed' && (<div className="space-y-4 p-4 bg-gray-50 rounded-md"><div><label htmlFor="teamsPerGroup" className="block text-sm font-medium">Teams per group</label><input type="number" id="teamsPerGroup" value={teamsPerGroup} onChange={(e) => setTeamsPerGroup(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full border rounded-md p-2" min="2"/></div><div className="flex items-center"><input id="twoLeggedGroups" type="checkbox" checked={twoLegged} onChange={(e) => setTwoLegged(e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="twoLeggedGroups" className="ml-2">Two-legged matches in groups</label></div></div>)}
        <hr />
         <div className="flex items-center">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 rounded" />
            <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">Make this competition public on the main portal</label>
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

export default CompetitionForm;