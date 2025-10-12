import React, { useState, useEffect, useMemo } from 'react';
import type { PublicConfig } from '../types';
import { useCompetitions } from '../context/CompetitionContext';
import Button from '../components/ui/Button';
import { ChevronLeftIcon, FacebookIcon, TwitterIcon, InstagramIcon } from '../components/icons/Icons';
import PublicRankings from '../components/public/PublicRankings';
import PublicSchedule from '../components/public/PublicSchedule';
import PublicArticlesList from '../components/public/PublicArticlesList';
import PublicGalleriesList from '../components/public/PublicGalleriesList';
import PublicSponsors from '../components/public/PublicSponsors';
import PublicPlayerStats from '../components/public/PublicPlayerStats';
import PublicRegulations from '../components/public/PublicRegulations';

interface WebBuilderProps {
  competitionId: string;
  onBack: () => void;
}

const WebBuilder: React.FC<WebBuilderProps> = ({ competitionId, onBack }) => {
  const { getCompetitionById, updateCompetitionPublicConfig, matches } = useCompetitions();
  const competition = useMemo(() => getCompetitionById(competitionId), [competitionId, getCompetitionById]);
  
  const defaultConfig: PublicConfig = {
    title: '', description: '', logoUrl: '', primaryColor: '#3B82F6', backgroundColor: '#F9FAFB',
    showSchedule: false, showRankings: false, showArticles: false, showGalleries: false,
    showSponsors: false, showSponsorsInFooter: false, showPlayerStats: false, showLiveStream: false, showRegulations: false, featuredLiveMatchIds: [],
    footerText: '', facebookUrl: '', twitterUrl: '', instagramUrl: ''
  };

  const [config, setConfig] = useState<PublicConfig>(defaultConfig);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const availableLiveMatches = matches.filter(m => m.competitionId === competitionId && m.status === 'In Progress' && m.liveStreamUrl);

  useEffect(() => {
    if (competition) {
      setConfig({
        ...defaultConfig,
        title: competition.name,
        description: `Official website for the ${competition.name}, ${competition.season} season.`,
        logoUrl: competition.logoUrl,
        ...competition.publicConfig,
      });
    }
  }, [competition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    setConfig(prev => ({ ...prev, [name]: isCheckbox ? e.target.checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, logoUrl: previewUrl }));
    }
  };
  
  const handleFeaturedMatchChange = (matchId: string, checked: boolean) => {
    setConfig(prev => {
        const currentIds = prev.featuredLiveMatchIds || [];
        if (checked) {
            if (currentIds.length < 5) {
                return { ...prev, featuredLiveMatchIds: [...currentIds, matchId] };
            } else {
                alert('You can only feature up to 5 live matches.');
                return prev;
            }
        } else {
            return { ...prev, featuredLiveMatchIds: currentIds.filter(id => id !== matchId) };
        }
    });
  };

  const handleSave = () => {
    updateCompetitionPublicConfig(competitionId, config, logoFile);
    alert('Site settings saved!');
  };

  const publicUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Web Builder: {competition?.name}</h1>
        </div>
        <div className="flex space-x-2">
            <Button onClick={() => window.open(publicUrl, '_blank')} variant="outline">View Public Site</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold border-b pb-3">Site Settings</h2>
          {/* ... existing fields */}
          <div><label className="block text-sm font-medium">Site Title</label><input type="text" name="title" value={config.title} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
          <div><label className="block text-sm font-medium">Description</label><textarea name="description" value={config.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border rounded-md p-2"/></div>
          <div>
            <label className="block text-sm font-medium">Logo</label>
            <div className="mt-1 flex items-center space-x-4">
                <img src={config.logoUrl} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover bg-gray-100" />
                <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Appearance</h2>
          {/* ... existing fields */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Primary Color</label>
            <input type="color" name="primaryColor" value={config.primaryColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Background Color</label>
            <input type="color" name="backgroundColor" value={config.backgroundColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/>
          </div>

          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Content Modules</h2>
            <div className="space-y-3">
              <label className="flex items-center"><input type="checkbox" name="showLiveStream" checked={config.showLiveStream} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Live Stream Section</span></label>
              <label className="flex items-center"><input type="checkbox" name="showArticles" checked={config.showArticles} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show News Section</span></label>
              <label className="flex items-center"><input type="checkbox" name="showGalleries" checked={config.showGalleries} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Photo Galleries</span></label>
              <label className="flex items-center"><input type="checkbox" name="showSchedule" checked={config.showSchedule} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Match Schedule</span></label>
              <label className="flex items-center"><input type="checkbox" name="showRankings" checked={config.showRankings} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Rankings Table</span></label>
              <label className="flex items-center"><input type="checkbox" name="showPlayerStats" checked={config.showPlayerStats} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Player Statistics</span></label>
              <label className="flex items-center"><input type="checkbox" name="showRegulations" checked={config.showRegulations} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Regulations Section</span></label>
            </div>
            
          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Featured Live Streams</h2>
            <div>
              <p className="text-sm text-gray-600 mb-2">Select up to 5 active matches to feature on your site. The first selected match will be shown on the main page.</p>
              <div className="space-y-2">
                {availableLiveMatches.length > 0 ? availableLiveMatches.map(match => (
                    <label key={match.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <input
                            type="checkbox"
                            checked={config.featuredLiveMatchIds?.includes(match.id)}
                            onChange={(e) => handleFeaturedMatchChange(match.id, e.target.checked)}
                            className="h-4 w-4 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-800">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                    </label>
                )) : <p className="text-sm text-gray-500">No matches currently in progress with a live stream URL.</p>}
              </div>
            </div>

          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Sponsors</h2>
            <div className="space-y-3">
              <label className="flex items-center"><input type="checkbox" name="showSponsors" checked={config.showSponsors} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Sponsors Section</span></label>
              <label className="flex items-center"><input type="checkbox" name="showSponsorsInFooter" checked={config.showSponsorsInFooter} onChange={handleInputChange} className="h-4 w-4 rounded" /><span className="ml-2 text-sm font-medium">Show Sponsors in Footer</span></label>
            </div>

          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Footer Settings</h2>
            <div><label className="block text-sm font-medium">Footer Text</label><input type="text" name="footerText" value={config.footerText} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
            <div><label className="block text-sm font-medium">Facebook URL</label><input type="url" name="facebookUrl" value={config.facebookUrl} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
            <div><label className="block text-sm font-medium">Twitter URL</label><input type="url" name="twitterUrl" value={config.twitterUrl} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
            <div><label className="block text-sm font-medium">Instagram URL</label><input type="url" name="instagramUrl" value={config.instagramUrl} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="w-full h-[80vh] border-4 border-gray-300 rounded-lg shadow-inner overflow-hidden">
            <div 
              className="w-full h-full flex flex-col transition-colors duration-300" 
              style={{ backgroundColor: config.backgroundColor }}
            >
              {/* Preview Header */}
              <header className="p-4 flex-shrink-0" style={{borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover"/>}
                        <h2 className="ml-3 text-lg font-bold" style={{ color: config.primaryColor }}>{config.title}</h2>
                    </div>
                  </div>
              </header>
              {/* Preview Body */}
              <div className="p-8 flex-1 flex flex-col items-center justify-start overflow-y-auto" style={{ color: '#333' }}>
                  <div className="text-center w-full max-w-4xl">
                      <h1 className="text-4xl font-bold" style={{ color: config.primaryColor }}>{config.title}</h1>
                      <p className="mt-4 text-lg max-w-2xl mx-auto">{config.description}</p>
                  </div>
                  <div className="mt-10 w-full max-w-4xl space-y-12">
                     {config.showArticles && <PublicArticlesList competitionId={competitionId} />}
                     {config.showGalleries && <PublicGalleriesList competitionId={competitionId} />}
                     {config.showSponsors && <PublicSponsors competitionId={competitionId} />}
                     {config.showRegulations && <PublicRegulations competitionId={competitionId} />}
                     {config.showRankings && competition && (competition.format === 'league' || competition.format === 'mixed') && <PublicRankings competitionId={competitionId} />}
                     {config.showSchedule && <PublicSchedule competitionId={competitionId} />}
                     {config.showPlayerStats && <PublicPlayerStats competitionId={competitionId} />}
                  </div>
              </div>
               {/* Preview Footer */}
                <footer className="py-6 px-4 border-t flex-shrink-0" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
                    <div className="text-center text-gray-500 text-sm">
                        <p>{config.footerText}</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            {config.facebookUrl && <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer"><FacebookIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
                            {config.twitterUrl && <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer"><TwitterIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
                            {config.instagramUrl && <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer"><InstagramIcon className="h-6 w-6 text-gray-400 hover:text-gray-600"/></a>}
                        </div>
                        {config.showSponsorsInFooter && <div className="mt-4"><PublicSponsors competitionId={competitionId} isFooter={true} /></div>}
                    </div>
                </footer>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">Live Preview</p>
        </div>
      </div>
    </div>
  );
};

export default WebBuilder;