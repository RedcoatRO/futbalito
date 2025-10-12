

import React, { useState, useMemo } from 'react';
// FIX: Added .ts extension to module import.
import type { MatchEvent } from '../types.ts';
// FIX: Added .ts extension to module import.
import { MatchEventType } from '../types.ts';
import Card from '../components/ui/Card.tsx';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import EventForm from '../components/EventForm.tsx';
// FIX: Added .tsx extension to module import.
import { PlayIcon, PauseIcon, ArrowPathIcon, ChevronLeftIcon, PencilSquareIcon, XMarkIcon, VideoCameraIcon } from '../components/icons/Icons.tsx';
// FIX: Added .ts extension to module import.
import useTimer from '../hooks/useTimer.ts';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';

interface LiveMatchProps {
    matchId: string;
    onBack: () => void;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matchId, onBack }) => {
    const { getMatchById, updateMatch, updateCompetition, competitions, players } = useCompetitions();
    
    const liveMatch = getMatchById(matchId);

    const [showShootout, setShowShootout] = useState(false);
    const [penaltyHome, setPenaltyHome] = useState(0);
    const [penaltyAway, setPenaltyAway] = useState(0);

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<MatchEvent | null>(null);
    const [eventDefaults, setEventDefaults] = useState<{type: MatchEventType, teamId: string} | null>(null);
    
    const [liveStreamUrl, setLiveStreamUrl] = useState(liveMatch?.liveStreamUrl || '');
    
    const { time, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0);

    const homeScore = useMemo(() => liveMatch?.events.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.homeTeam.id).length || 0, [liveMatch]);
    const awayScore = useMemo(() => liveMatch?.events.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.awayTeam.id).length || 0, [liveMatch]);

    const handleStartMatch = () => {
        if (!liveMatch) return;
        handleStart();
        updateMatch({ ...liveMatch, status: 'In Progress' });
        const competition = competitions.find(c => c.id === liveMatch.competitionId);
        if (competition && competition.status === 'Upcoming') {
            updateCompetition({ ...competition, status: 'Ongoing' });
        }
    };
    
    const handleSaveStreamUrl = () => {
        if (!liveMatch) return;
        updateMatch({ ...liveMatch, liveStreamUrl });
        alert('Live stream URL saved!');
    };

    const handleFinishMatch = () => {
        if (!liveMatch) return;
        handlePause();
        if (homeScore === awayScore) {
            setShowShootout(true);
        } else {
            const winnerId = homeScore > awayScore ? liveMatch.homeTeam.id : liveMatch.awayTeam.id;
            updateMatch({ ...liveMatch, status: 'Finished', outcome: 'regulation', winnerId, homeScore, awayScore });
        }
    };
    
    const handleFinishShootout = (winner: 'home' | 'away') => {
        if(!liveMatch) return;
        const winnerId = winner === 'home' ? liveMatch.homeTeam.id : liveMatch.awayTeam.id;
        updateMatch({ 
            ...liveMatch, 
            status: 'Finished', 
            outcome: 'shootout', 
            winnerId,
            homeScore,
            awayScore,
            homePenaltyScore: penaltyHome,
            awayPenaltyScore: penaltyAway
        });
        setShowShootout(false);
    }

    const openEventModal = (type: MatchEventType, teamId: string) => {
        setEditingEvent(null);
        setEventDefaults({ type, teamId });
        setIsEventModalOpen(true);
    };

    const openEditEventModal = (event: MatchEvent) => {
        setEditingEvent(event);
        setEventDefaults(null);
        setIsEventModalOpen(true);
    };

    const closeEventModal = () => {
        setIsEventModalOpen(false);
        setEditingEvent(null);
        setEventDefaults(null);
    };

    const handleSaveEvent = (eventData: Omit<MatchEvent, 'id' | 'minute'>) => {
        if (!liveMatch) return;
        let updatedEvents: MatchEvent[];
        if (editingEvent) {
            updatedEvents = liveMatch.events.map(e => e.id === editingEvent.id ? { ...editingEvent, ...eventData } : e);
        } else {
            const newEvent: MatchEvent = {
                ...eventData,
                id: `evt-${Date.now()}`,
                minute: Math.floor(time / 60)
            };
            updatedEvents = [newEvent, ...liveMatch.events];
        }
        
        const newHomeScore = updatedEvents.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.homeTeam.id).length;
        const newAwayScore = updatedEvents.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.awayTeam.id).length;

        updateMatch({ ...liveMatch, events: updatedEvents, homeScore: newHomeScore, awayScore: newAwayScore });
        closeEventModal();
    };
    
    const handleDeleteEvent = (eventId: string) => {
        if (!liveMatch) return;
        if(window.confirm('Are you sure you want to delete this event?')) {
            const updatedEvents = liveMatch.events.filter(e => e.id !== eventId);
            const newHomeScore = updatedEvents.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.homeTeam.id).length;
            const newAwayScore = updatedEvents.filter(e => e.type === MatchEventType.GOAL && e.teamId === liveMatch.awayTeam.id).length;
            updateMatch({ ...liveMatch, events: updatedEvents, homeScore: newHomeScore, awayScore: newAwayScore });
        }
    };
    
    if (!liveMatch) return <Card><p>Match Not Found.</p></Card>;

    const { homeTeam, awayTeam, status, events } = liveMatch;
    const isFinished = status === 'Finished';

    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown Player';
    
    const eventIcons: Record<MatchEventType, string> = {
        [MatchEventType.GOAL]: '⚽️',
        [MatchEventType.YELLOW_CARD]: '🟨',
        [MatchEventType.RED_CARD]: '🟥',
        [MatchEventType.SUBSTITUTION]: '🔄',
    };

    return (
        <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Competition</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Match Administration</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="!p-0">
                        <div className="flex items-center justify-around p-6 bg-gray-800 text-white rounded-t-lg relative">
                             {isFinished && <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10"><h3 className="text-4xl font-bold text-white tracking-widest">MATCH FINISHED</h3></div>}
                            <div className="flex flex-col items-center w-1/3"><img src={homeTeam.logoUrl} alt={homeTeam.name} className="h-20 w-20 rounded-full border-4 border-gray-600" /><h2 className="mt-2 text-2xl font-bold text-center">{homeTeam.name}</h2></div>
                            <div className="text-6xl font-mono font-bold"><span>{homeScore}</span><span className="mx-4">:</span><span>{awayScore}</span>{liveMatch.outcome === 'shootout' && <p className="text-xl text-center mt-2">({liveMatch.homePenaltyScore} - {liveMatch.awayPenaltyScore})</p>}</div>
                            <div className="flex flex-col items-center w-1/3"><img src={awayTeam.logoUrl} alt={awayTeam.name} className="h-20 w-20 rounded-full border-4 border-gray-600" /><h2 className="mt-2 text-2xl font-bold text-center">{awayTeam.name}</h2></div>
                        </div>

                        {showShootout && !isFinished && (
                            <div className="p-6 bg-gray-100 border-b"><h3 className="text-xl font-bold text-center mb-4">Penalty Shootout</h3><div className="flex justify-around items-center"><div className="text-center"><label className="font-semibold">{homeTeam.name}</label><input type="number" value={penaltyHome} onChange={(e) => setPenaltyHome(parseInt(e.target.value) || 0)} className="w-20 text-center text-2xl p-2 border rounded-md mt-1"/></div><div className="text-center"><label className="font-semibold">{awayTeam.name}</label><input type="number" value={penaltyAway} onChange={(e) => setPenaltyAway(parseInt(e.target.value) || 0)} className="w-20 text-center text-2xl p-2 border rounded-md mt-1"/></div></div><div className="mt-4 text-center"><p className="mb-2 font-medium">Declare winner:</p><Button onClick={() => handleFinishShootout('home')} className="mr-2">Home Wins</Button><Button onClick={() => handleFinishShootout('away')} variant='secondary'>Away Wins</Button></div></div>
                        )}
                        
                        <div className="flex flex-col items-center p-6 border-y border-gray-200"><p className="text-6xl font-mono font-bold text-gray-800 tracking-wider">{String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}</p><div className="mt-4 flex space-x-4">{!isActive && status === 'Not Started' && <Button onClick={handleStartMatch} variant="primary" className="bg-green-500 hover:bg-green-600"><PlayIcon className="h-5 w-5 mr-2" /> Start Match</Button>}{isActive && !isFinished && (isPaused ? <Button onClick={handleResume} variant="primary" className="bg-green-500 hover:bg-green-600"><PlayIcon className="h-5 w-5 mr-2" /> Resume</Button> : <Button onClick={handlePause} variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white"><PauseIcon className="h-5 w-5 mr-2" /> Pause</Button>)}<Button onClick={handleReset} variant="outline" disabled={isFinished}><ArrowPathIcon className="h-5 w-5 mr-2" /> Reset</Button>{status === 'In Progress' && !isFinished && <Button onClick={handleFinishMatch} variant="danger">Finish Match</Button>}</div></div>

                        <div className="p-6"><h3 className="text-lg font-semibold mb-4 text-center">Add Match Event</h3><div className="grid grid-cols-2 gap-x-8 gap-y-4"><div className="space-y-2"><Button className="w-full" onClick={() => openEventModal(MatchEventType.GOAL, homeTeam.id)} disabled={isFinished}>Goal Home</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.YELLOW_CARD, homeTeam.id)} disabled={isFinished} variant="secondary">Yellow Card Home</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.RED_CARD, homeTeam.id)} disabled={isFinished} variant="danger">Red Card Home</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.SUBSTITUTION, homeTeam.id)} disabled={isFinished} variant="outline">Substitution Home</Button></div><div className="space-y-2"><Button className="w-full" onClick={() => openEventModal(MatchEventType.GOAL, awayTeam.id)} disabled={isFinished}>Goal Away</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.YELLOW_CARD, awayTeam.id)} disabled={isFinished} variant="secondary">Yellow Card Away</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.RED_CARD, awayTeam.id)} disabled={isFinished} variant="danger">Red Card Away</Button><Button className="w-full" onClick={() => openEventModal(MatchEventType.SUBSTITUTION, awayTeam.id)} disabled={isFinished} variant="outline">Substitution Away</Button></div></div></div>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card className="flex flex-col !p-0"><h3 className="text-xl font-bold p-4 border-b border-gray-200">Match Events</h3><div className="flex-1 overflow-y-auto p-4 space-y-4">{events.length === 0 ? <p className="text-gray-500 text-center mt-8">No events yet.</p> : [...events].sort((a,b) => b.minute - a.minute).map(event => (<div key={event.id} className="flex items-start"><div className="text-sm font-bold text-gray-700 w-12">{event.minute}'</div><div className={`flex-1 pl-4 border-l-2 ${event.teamId === homeTeam.id ? 'border-blue-500' : 'border-red-500'}`}><div className="flex justify-between items-start"><div><p className="font-semibold">{eventIcons[event.type]} {event.type}</p><p className="text-sm text-gray-600">{event.type === MatchEventType.SUBSTITUTION ? `IN: ${getPlayerName(event.secondaryPlayerId!)} / OUT: ${getPlayerName(event.primaryPlayerId)}` : getPlayerName(event.primaryPlayerId)}</p></div><div className="flex space-x-2">{!isFinished && <> <button onClick={() => openEditEventModal(event)} className="p-1 text-gray-400 hover:text-gray-600"><PencilSquareIcon className="h-4 w-4"/></button><button onClick={() => handleDeleteEvent(event.id)} className="p-1 text-gray-400 hover:text-red-600"><XMarkIcon className="h-4 w-4"/></button></>}</div></div></div></div>))}</div></Card>
                    <Card>
                        <h3 className="text-xl font-bold flex items-center mb-4"><VideoCameraIcon className="h-6 w-6 mr-2 text-red-500"/> Live Stream</h3>
                        <div>
                            <label htmlFor="liveStreamUrl" className="block text-sm font-medium text-gray-700">YouTube URL</label>
                            <input
                                type="url"
                                id="liveStreamUrl"
                                value={liveStreamUrl}
                                onChange={e => setLiveStreamUrl(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="https://www.youtube.com/watch?v=..."
                                disabled={isFinished}
                            />
                        </div>
                        <Button onClick={handleSaveStreamUrl} className="w-full mt-4" disabled={isFinished}>Save URL</Button>
                    </Card>
                </div>
            </div>
            {isEventModalOpen && (
                <Modal isOpen={isEventModalOpen} onClose={closeEventModal} title={editingEvent ? 'Edit Event' : 'Add New Event'}>
                    <EventForm
                        event={editingEvent}
                        eventDefaults={eventDefaults}
                        match={liveMatch}
                        onSave={handleSaveEvent}
                        onClose={closeEventModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default LiveMatch;
