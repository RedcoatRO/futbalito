import React, { useState } from 'react';
import type { Match, Competition } from '../../types.ts';

interface MatchTickerProps {
  recentMatches: Match[];
  upcomingMatches: Match[];
  competitions: Competition[];
}

// FIX: Defined a props interface and used React.FC to correctly handle props, including the special 'key' prop.
interface MatchItemProps {
  match: Match;
  competitions: Competition[];
}

/**
 * A single match item component for the ticker.
 * Team names and logos are now links to their respective detail pages.
 * @param {object} props The component props.
 * @returns {JSX.Element} A single row in the match ticker.
 */
const MatchItem: React.FC<MatchItemProps> = ({ match, competitions }) => {
  const getCompetitionName = (id: string) => competitions.find(c => c.id === id)?.name || 'N/A';
  
  return (
    <div className="p-4 grid grid-cols-3 items-center gap-2">
        <a href={`/?teamId=${match.homeTeam.id}`} className="flex items-center justify-end text-right group">
          <span className="font-semibold text-gray-800 text-sm md:text-base hidden sm:inline group-hover:underline">{match.homeTeam.name}</span>
          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-8 w-8 rounded-full ml-3 object-cover" />
        </a>
        <div className="text-center">
          {match.status === 'Finished' ? (
            <div className="text-xl font-bold text-gray-900">{match.homeScore} - {match.awayScore}</div>
          ) : (
            <div className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
          )}
          <p className="text-xs text-gray-400 truncate mt-1">{getCompetitionName(match.competitionId)}</p>
        </div>
        <a href={`/?teamId=${match.awayTeam.id}`} className="flex items-center justify-start group">
          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-8 w-8 rounded-full mr-3 object-cover" />
          <span className="font-semibold text-gray-800 text-sm md:text-base hidden sm:inline group-hover:underline">{match.awayTeam.name}</span>
        </a>
    </div>
  );
};

/**
 * A component to display recent and upcoming matches in a tabbed view.
 * @param {MatchTickerProps} props Component props.
 * @returns {JSX.Element} The rendered match ticker.
 */
const MatchTicker: React.FC<MatchTickerProps> = ({ recentMatches, upcomingMatches, competitions }) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');

  if (recentMatches.length === 0 && upcomingMatches.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('recent')} 
            className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Recent Results
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')} 
            className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Upcoming Fixtures
          </button>
        </div>
        <div>
          {activeTab === 'recent' && (
            <div className="divide-y">
              {recentMatches.length > 0 ? recentMatches.map(m => <MatchItem key={m.id} match={m} competitions={competitions} />) : <p className="text-center text-gray-500 p-8">No recent matches.</p>}
            </div>
          )}
          {activeTab === 'upcoming' && (
            <div className="divide-y">
              {upcomingMatches.length > 0 ? upcomingMatches.map(m => <MatchItem key={m.id} match={m} competitions={competitions} />) : <p className="text-center text-gray-500 p-8">No upcoming matches.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MatchTicker;
