import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { 
    Team, Competition, Match, Player, OrganizationSettings, User, Role,
    Invoice, AuditLog, County, Arena, Sanction, Referee, Observer,
    Article, MediaImage, Gallery, Sponsor, Transfer, PlayerRegistration,
    Standing, PortalConfig, PublicConfig, NationalTeam, NationalSquadPlayer, Comment
} from '../types.ts';
import { 
    mockTeams, mockCompetitions, mockMatches, mockPlayers, mockOrganizationSettings,
    mockUsers, mockRoles, mockInvoices, mockAuditLog, mockCounties, mockArenas,
    mockSanctions, mockReferees, mockObservers, mockArticles, mockMediaImages,
    mockGalleries, mockSponsors, mockTransfers, mockPlayerRegistrations, mockPortalConfig,
    MOCK_NATIONAL_TEAM, MOCK_NATIONAL_SQUAD, MOCK_INTERNATIONAL_MATCHES
} from './mock_data.ts';
import { generateBergerTable } from '../utils/bergerTable.ts';

// Define the shape of the context value
interface CompetitionContextType {
    teams: Team[];
    addTeam: (data: { name: string; country: string; logoFile?: File | null }) => void;
    updateTeam: (team: Team) => void;
    deleteTeam: (id: string) => void;
    competitions: Competition[];
    getCompetitionById: (id: string) => Competition | undefined;
    addCompetition: (data: any) => void;
    updateCompetition: (competition: Competition) => void;
    deleteCompetition: (id: string) => void;
    addTeamToCompetition: (competitionId: string, teamId: string) => void;
    matches: Match[];
    getMatchById: (id: string) => Match | undefined;
    updateMatch: (match: Match) => void;
    generateBergerSchedule: (competitionId: string) => void;
    players: Player[];
    addPlayer: (data: { name: string; teamId: string }) => void;
    updatePlayer: (player: Player) => void;
    deletePlayer: (id: string) => void;
    getTransfersByPlayerId: (playerId: string) => Transfer[];
    getPlayerRegistrationsByPlayerId: (playerId: string) => PlayerRegistration[];
    organizationSettings: OrganizationSettings;
    updateOrganizationSettings: (settings: OrganizationSettings, logoFile?: File | null) => void;
    currentUser: User | null;
    users: User[];
    setCurrentUser: (id: string) => void;
    inviteUser: (email: string, roleId: string) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    roles: Role[];
    addRole: (data: Omit<Role, 'id'>) => void;
    updateRole: (role: Role) => void;
    deleteRole: (id: string) => void;
    invoices: Invoice[];
    auditLog: AuditLog[];
    counties: County[];
    addCounty: (data: { name: string }) => void;
    updateCounty: (county: County) => void;
    deleteCounty: (id: string) => void;
    arenas: Arena[];
    addArena: (data: { name: string; location: string; fields: string[] }) => void;
    updateArena: (arena: Arena) => void;
    deleteArena: (id: string) => void;
    sanctions: Sanction[];
    addSanction: (data: Omit<Sanction, 'id'>) => void;
    updateSanction: (sanction: Sanction) => void;
    deleteSanction: (id: string) => void;
    referees: Referee[];
    addReferee: (data: { name: string }) => void;
    updateReferee: (referee: Referee) => void;
    deleteReferee: (id: string) => void;
    observers: Observer[];
    addObserver: (data: { name: string }) => void;
    updateObserver: (observer: Observer) => void;
    deleteObserver: (id: string) => void;
    calculateStandings: (competitionId: string, stage: string) => Standing[];
    articles: Article[];
    getArticleById: (id: string) => Article | undefined;
    addArticle: (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => void;
    updateArticle: (article: Article, imageFile: File | null) => void;
    deleteArticle: (id: string) => void;
    mediaImages: MediaImage[];
    uploadImage: (competitionId: string, file: File) => void;
    deleteImage: (id: string) => void;
    galleries: Gallery[];
    getGalleryById: (id: string) => Gallery | undefined;
    addGallery: (data: Omit<Gallery, 'id'>) => void;
    updateGallery: (gallery: Gallery) => void;
    deleteGallery: (id: string) => void;
    sponsors: Sponsor[];
    addSponsor: (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile?: File | null) => void;
    updateSponsor: (sponsor: Sponsor, logoFile?: File | null) => void;
    deleteSponsor: (id: string) => void;
    updateCompetitionPublicConfig: (competitionId: string, config: PublicConfig, logoFile?: File | null) => void;
    updateCompetitionRegulation: (competitionId: string, regulation: any) => void;
    portalConfig: PortalConfig;
    updatePortalConfig: (config: PortalConfig, logoFile?: File | null) => void;
    transfers: Transfer[];
    addTransfer: (data: Omit<Transfer, 'id'>) => void;
    updateTransfer: (transfer: Transfer) => void;
    deleteTransfer: (id: string) => void;
    playerRegistrations: PlayerRegistration[];
    addPlayerRegistration: (data: Omit<PlayerRegistration, 'id'>) => void;
    updatePlayerRegistration: (reg: PlayerRegistration) => void;
    deletePlayerRegistration: (id: string) => void;
    // National Team
    nationalTeam: NationalTeam;
    nationalSquad: NationalSquadPlayer[];
    addPlayerToSquad: (playerId: string) => void;
    removePlayerFromSquad: (playerId: string) => void;
    // Comments
    comments: Comment[];
    addComment: (data: { articleId: string, author: string, content: string }) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // All state managed here
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [competitions, setCompetitions] = useState<Competition[]>(mockCompetitions);
    const [matches, setMatches] = useState<Match[]>([...mockMatches, ...MOCK_INTERNATIONAL_MATCHES]);
    const [players, setPlayers] = useState<Player[]>(mockPlayers);
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(mockOrganizationSettings);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUserState] = useState<User | null>(mockUsers[0]);
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [invoices] = useState<Invoice[]>(mockInvoices);
    const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLog);
    const [counties, setCounties] = useState<County[]>(mockCounties);
    const [arenas, setArenas] = useState<Arena[]>(mockArenas);
    const [sanctions, setSanctions] = useState<Sanction[]>(mockSanctions);
    const [referees, setReferees] = useState<Referee[]>(mockReferees);
    const [observers, setObservers] = useState<Observer[]>(mockObservers);
    const [articles, setArticles] = useState<Article[]>(mockArticles);
    const [mediaImages, setMediaImages] = useState<MediaImage[]>(mockMediaImages);
    const [galleries, setGalleries] = useState<Gallery[]>(mockGalleries);
    const [sponsors, setSponsors] = useState<Sponsor[]>(mockSponsors);
    const [portalConfig, setPortalConfig] = useState<PortalConfig>(mockPortalConfig);
    const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
    const [playerRegistrations, setPlayerRegistrations] = useState<PlayerRegistration[]>(mockPlayerRegistrations);
    const [nationalTeam, setNationalTeam] = useState<NationalTeam>(MOCK_NATIONAL_TEAM);
    const [nationalSquad, setNationalSquad] = useState<NationalSquadPlayer[]>(MOCK_NATIONAL_SQUAD);
    const [comments, setComments] = useState<Comment[]>([]);

    // Effect to load comments from localStorage on initial render
    useEffect(() => {
        try {
            const storedComments = localStorage.getItem('futbalito_comments');
            if (storedComments) {
                setComments(JSON.parse(storedComments));
            }
        } catch (error) {
            console.error("Failed to load comments from localStorage", error);
        }
    }, []);

    const logAction = (action: string, details: string) => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            userId: currentUser!.id,
            userName: currentUser!.name,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        setAuditLog(prev => [newLog, ...prev]);
    }
    
    // Simple CRUD operations
    const addTeam = (data: { name: string; country: string; logoFile?: File | null }) => {
        const newTeam: Team = {
            id: `team-${Date.now()}`,
            name: data.name,
            country: data.country,
            logoUrl: data.logoFile ? URL.createObjectURL(data.logoFile) : `https://picsum.photos/seed/${Date.now()}/200`
        };
        setTeams(prev => [...prev, newTeam]);
        logAction('Create Team', `Created team: ${data.name}`);
    };

    const updateTeam = (updatedTeam: Team) => {
        setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
        logAction('Update Team', `Updated team: ${updatedTeam.name}`);
    };

    const deleteTeam = (id: string) => {
        const teamName = teams.find(t=> t.id === id)?.name || 'Unknown';
        setTeams(prev => prev.filter(t => t.id !== id));
        logAction('Delete Team', `Deleted team: ${teamName} (ID: ${id})`);
    };

    const addCompetition = (data: any) => {
        const newComp: Competition = {
            id: `comp-${Date.now()}`,
            name: data.name,
            season: data.season,
            logoUrl: data.logoFile ? URL.createObjectURL(data.logoFile) : `https://picsum.photos/seed/${data.name}/200`,
            status: 'Upcoming',
            teamIds: [],
            ...data
        };
        setCompetitions(prev => [...prev, newComp]);
        logAction('Create Competition', `Created competition: ${data.name}`);
    };
    
    const updateCompetition = (updatedComp: Competition) => {
        setCompetitions(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
        logAction('Update Competition', `Updated competition: ${updatedComp.name}`);
    };

    const deleteCompetition = (id: string) => {
        const compName = competitions.find(c => c.id === id)?.name || 'Unknown';
        setCompetitions(prev => prev.filter(c => c.id !== id));
        logAction('Delete Competition', `Deleted competition: ${compName} (ID: ${id})`);
    };

    const addPlayer = (data: { name: string; teamId: string; }) => {
        const newPlayer: Player = {
            id: `player-${Date.now()}`,
            name: data.name,
            teamId: data.teamId,
            stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        };
        setPlayers(prev => [...prev, newPlayer]);
        logAction('Add Player', `Added player: ${data.name}`);
    };

    const updatePlayer = (updatedPlayer: Player) => {
        setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
        logAction('Update Player', `Updated player: ${updatedPlayer.name}`);
    };

    const deletePlayer = (id: string) => {
        const playerName = players.find(p => p.id === id)?.name || 'Unknown';
        setPlayers(prev => prev.filter(p => p.id !== id));
        logAction('Delete Player', `Deleted player: ${playerName} (ID: ${id})`);
    };
    
    const getCompetitionById = useCallback((id: string) => competitions.find(c => c.id === id), [competitions]);
    const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);

    const updateMatch = (updatedMatch: Match) => {
        setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        // Avoid logging for every tick of a live match, only log significant status changes
        if (updatedMatch.events.length > (matches.find(m=>m.id === updatedMatch.id)?.events.length ?? 0)) {
            logAction('Update Match', `Event added to ${updatedMatch.homeTeam.name} vs ${updatedMatch.awayTeam.name}`);
        }
    };
    
    const addTeamToCompetition = (competitionId: string, teamId: string) => {
        setCompetitions(prev => prev.map(c => c.id === competitionId ? { ...c, teamIds: [...c.teamIds, teamId] } : c));
    };

    const updateOrganizationSettings = (settings: OrganizationSettings, logoFile?: File | null) => {
        if (logoFile) {
            settings.logoUrl = URL.createObjectURL(logoFile);
        }
        setOrganizationSettings(settings);
        logAction('Update Settings', 'Updated organization settings');
    };
    
    const setCurrentUser = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) setCurrentUserState(user);
    };

    const inviteUser = (email: string, roleId: string) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0], // Simple name generation
            email,
            roleId,
            status: 'PENDING'
        };
        setUsers(prev => [...prev, newUser]);
        logAction('Invite User', `Invited user: ${email}`);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        logAction('Update User', `Updated user: ${updatedUser.name}`);
    };
    
    const deleteUser = (id: string) => {
        const userName = users.find(u => u.id === id)?.name || 'Unknown';
        setUsers(prev => prev.filter(u => u.id !== id));
        logAction('Delete User', `Deleted user: ${userName}`);
    };
    
    const addRole = (data: Omit<Role, 'id'>) => {
        const newRole: Role = { id: `role-${Date.now()}`, ...data };
        setRoles(prev => [...prev, newRole]);
        logAction('Create Role', `Created role: ${data.name}`);
    };

    const updateRole = (updatedRole: Role) => {
        setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
        logAction('Update Role', `Updated role: ${updatedRole.name}`);
    };

    const deleteRole = (id: string) => {
        const roleName = roles.find(r => r.id === id)?.name || 'Unknown';
        setRoles(prev => prev.filter(r => r.id !== id));
        logAction('Delete Role', `Deleted role: ${roleName}`);
    };
    
    const addCounty = (data: { name: string }) => {
        setCounties(prev => [...prev, { id: `county-${Date.now()}`, ...data }]);
    };
    const updateCounty = (county: County) => {
        setCounties(prev => prev.map(c => c.id === county.id ? county : c));
    };
    const deleteCounty = (id: string) => {
        setCounties(prev => prev.filter(c => c.id !== id));
    };
    
    const addArena = (data: { name: string; location: string; fields: string[] }) => {
        setArenas(prev => [...prev, { id: `arena-${Date.now()}`, ...data }]);
    };
    const updateArena = (arena: Arena) => {
        setArenas(prev => prev.map(a => a.id === arena.id ? arena : a));
    };
    const deleteArena = (id: string) => {
        setArenas(prev => prev.filter(a => a.id !== id));
    };

    const addSanction = (data: Omit<Sanction, 'id'>) => {
        setSanctions(prev => [...prev, { id: `sanction-${Date.now()}`, ...data }]);
    };
    const updateSanction = (sanction: Sanction) => {
        setSanctions(prev => prev.map(s => s.id === sanction.id ? sanction : s));
    };
    const deleteSanction = (id: string) => {
        setSanctions(prev => prev.filter(s => s.id !== id));
    };

    const addReferee = (data: {name: string}) => setReferees(prev => [...prev, {id: `ref-${Date.now()}`, ...data}]);
    const updateReferee = (ref: Referee) => setReferees(prev => prev.map(r => r.id === ref.id ? ref : r));
    const deleteReferee = (id: string) => setReferees(prev => prev.filter(r => r.id !== id));

    const addObserver = (data: {name: string}) => setObservers(prev => [...prev, {id: `obs-${Date.now()}`, ...data}]);
    const updateObserver = (obs: Observer) => setObservers(prev => prev.map(o => o.id === obs.id ? obs : o));
    const deleteObserver = (id: string) => setObservers(prev => prev.filter(o => o.id !== id));

    const getTransfersByPlayerId = (playerId: string) => transfers.filter(t => t.playerId === playerId);
    const getPlayerRegistrationsByPlayerId = (playerId: string) => playerRegistrations.filter(pr => pr.playerId === playerId);

    const calculateStandings = (competitionId: string, stage: string): Standing[] => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return [];
        const competitionMatches = matches.filter(m => m.competitionId === competitionId && m.status === 'Finished');
        const standingsMap: { [teamId: string]: Standing } = {};

        competition.teamIds.forEach(teamId => {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                standingsMap[teamId] = {
                    teamId, teamName: team.name, logoUrl: team.logoUrl, played: 0, wins: 0, losses: 0, draws: 0,
                    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
                };
            }
        });

        competitionMatches.forEach(match => {
            const home = standingsMap[match.homeTeam.id];
            const away = standingsMap[match.awayTeam.id];
            if (!home || !away) return;

            home.played++; away.played++;
            home.goalsFor += match.homeScore; away.goalsFor += match.awayScore;
            home.goalsAgainst += match.awayScore; away.goalsAgainst += match.homeScore;

            if (match.homeScore > match.awayScore) {
                home.wins++; away.losses++; home.points += 3;
            } else if (match.awayScore > match.homeScore) {
                away.wins++; home.losses++; away.points += 3;
            } else {
                home.draws++; away.draws++; home.points++; away.points++;
            }
        });

        return Object.values(standingsMap).map(s => ({...s, goalDifference: s.goalsFor - s.goalsAgainst}))
            .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
    };
    
    const generateBergerSchedule = (competitionId: string) => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return;
        
        const competitionTeams = teams.filter(t => competition.teamIds.includes(t.id));
        const schedule = generateBergerTable(competitionTeams);
        
        const newMatches: Match[] = [];
        let date = new Date();
        
        schedule.forEach((round, roundIndex) => {
            date.setDate(date.getDate() + 7); // Advance by one week for each round
            round.forEach(pairing => {
                if (pairing.home.id !== 'bye' && pairing.away.id !== 'bye') {
                    newMatches.push({
                        id: `match-${competitionId}-${pairing.home.id}-${pairing.away.id}`,
                        competitionId,
                        homeTeam: pairing.home as Team,
                        awayTeam: pairing.away as Team,
                        homeScore: 0,
                        awayScore: 0,
                        date: new Date(date).toISOString(),
                        status: 'Not Started',
                        events: [],
                        stage: `Round ${roundIndex + 1}`
                    });
                }
            });
        });
        
        // Remove old schedule and add new one
        setMatches(prev => [...prev.filter(m => m.competitionId !== competitionId), ...newMatches]);
        logAction('Generate Schedule', `Generated schedule for ${competition.name}`);
    };

    const getArticleById = (id: string) => articles.find(a => a.id === id);
    const addArticle = (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => {
        const newArticle: Article = {
            id: `art-${Date.now()}`,
            featuredImageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://picsum.photos/seed/article/800/400',
            author: currentUser?.name || 'Admin',
            createdAt: new Date().toISOString(),
            ...data
        };
        setArticles(prev => [...prev, newArticle]);
    };
    const updateArticle = (article: Article, imageFile: File | null) => {
        if (imageFile) {
            article.featuredImageUrl = URL.createObjectURL(imageFile);
        }
        setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    };
    const deleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));

    const uploadImage = (competitionId: string, file: File) => {
        const newImage: MediaImage = {
            id: `img-${Date.now()}`,
            competitionId,
            url: URL.createObjectURL(file)
        };
        setMediaImages(prev => [newImage, ...prev]);
    };
    const deleteImage = (id: string) => {
        setMediaImages(prev => prev.filter(img => img.id !== id));
        // Also remove from any galleries
        setGalleries(prev => prev.map(g => ({...g, imageIds: g.imageIds.filter(imgId => imgId !== id) })));
    };
    
    const getGalleryById = (id: string) => galleries.find(g => g.id === id);
    const addGallery = (data: Omit<Gallery, 'id'>) => {
        const newGallery: Gallery = { id: `gal-${Date.now()}`, ...data };
        setGalleries(prev => [...prev, newGallery]);
    };
    const updateGallery = (gallery: Gallery) => {
        setGalleries(prev => prev.map(g => g.id === gallery.id ? gallery : g));
    };
    const deleteGallery = (id: string) => setGalleries(prev => prev.filter(g => g.id !== id));
    
    const addSponsor = (data: Omit<Sponsor, 'id'|'logoUrl'>, logoFile?: File | null) => {
        const newSponsor: Sponsor = {
            id: `spn-${Date.now()}`,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : 'https://picsum.photos/seed/sponsor/200/100',
            ...data
        };
        setSponsors(prev => [...prev, newSponsor]);
    };
    const updateSponsor = (sponsor: Sponsor, logoFile?: File | null) => {
        if (logoFile) {
            sponsor.logoUrl = URL.createObjectURL(logoFile);
        }
        setSponsors(prev => prev.map(s => s.id === sponsor.id ? sponsor : s));
    };
    const deleteSponsor = (id: string) => setSponsors(prev => prev.filter(s => s.id !== id));

    const updateCompetitionPublicConfig = (competitionId: string, config: PublicConfig, logoFile?: File | null) => {
        if (logoFile) {
            config.logoUrl = URL.createObjectURL(logoFile);
        }
        setCompetitions(prev => prev.map(c => c.id === competitionId ? {...c, publicConfig: config} : c));
    };
    
    const updateCompetitionRegulation = (competitionId: string, regulation: any) => {
        setCompetitions(prev => prev.map(c => {
            if (c.id === competitionId && c.publicConfig) {
                const regs = c.publicConfig.regulations;
                const regIndex = regs.findIndex(r => r.id === regulation.id);
                if (regIndex > -1) {
                    regs[regIndex] = regulation;
                } else {
                    regs.push(regulation);
                }
                return {...c, publicConfig: {...c.publicConfig, regulations: regs }};
            }
            return c;
        }));
    };

    const updatePortalConfig = (config: PortalConfig, logoFile?: File | null) => {
        if (logoFile) {
            config.logoUrl = URL.createObjectURL(logoFile);
        }
        setPortalConfig(config);
    };
    
    const addTransfer = (data: Omit<Transfer, 'id'>) => {
        setTransfers(prev => [...prev, { id: `trn-${Date.now()}`, ...data }]);
        // Also update the player's team
        setPlayers(prev => prev.map(p => p.id === data.playerId ? {...p, teamId: data.toTeamId} : p));
    };
    const updateTransfer = (transfer: Transfer) => {
        setTransfers(prev => prev.map(t => t.id === transfer.id ? transfer : t));
    };
    const deleteTransfer = (id: string) => {
        setTransfers(prev => prev.filter(t => t.id !== id));
    };

    const addPlayerRegistration = (data: Omit<PlayerRegistration, 'id'>) => {
        setPlayerRegistrations(prev => [...prev, { id: `reg-${Date.now()}`, ...data }]);
    };
    const updatePlayerRegistration = (reg: PlayerRegistration) => {
        setPlayerRegistrations(prev => prev.map(r => r.id === reg.id ? reg : r));
    };
    const deletePlayerRegistration = (id: string) => {
        setPlayerRegistrations(prev => prev.filter(r => r.id !== id));
    };
    
    // National Team Functions
    const addPlayerToSquad = (playerId: string) => {
        if (!nationalSquad.some(p => p.playerId === playerId)) {
            const newSquadPlayer: NationalSquadPlayer = { playerId, caps: 0, goals: 0 };
            setNationalSquad(prev => [...prev, newSquadPlayer]);
            logAction('National Team', `Added player ${players.find(p=>p.id === playerId)?.name} to squad.`);
        }
    };
    
    const removePlayerFromSquad = (playerId: string) => {
        setNationalSquad(prev => prev.filter(p => p.playerId !== playerId));
        logAction('National Team', `Removed player ${players.find(p=>p.id === playerId)?.name} from squad.`);
    };
    
    // Comments Functions
    const addComment = (data: { articleId: string, author: string, content: string }) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...data
        };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        try {
            localStorage.setItem('futbalito_comments', JSON.stringify(updatedComments));
        } catch (error) {
            console.error("Failed to save comments to localStorage", error);
        }
    };

    const value = {
        teams, addTeam, updateTeam, deleteTeam,
        competitions, getCompetitionById, addCompetition, updateCompetition, deleteCompetition, addTeamToCompetition,
        matches, getMatchById, updateMatch, generateBergerSchedule,
        players, addPlayer, updatePlayer, deletePlayer, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId,
        organizationSettings, updateOrganizationSettings,
        currentUser, users, setCurrentUser, inviteUser, updateUser, deleteUser,
        roles, addRole, updateRole, deleteRole,
        invoices, auditLog,
        counties, addCounty, updateCounty, deleteCounty,
        arenas, addArena, updateArena, deleteArena,
        sanctions, addSanction, updateSanction, deleteSanction,
        referees, addReferee, updateReferee, deleteReferee,
        observers, addObserver, updateObserver, deleteObserver,
        calculateStandings,
        articles, getArticleById, addArticle, updateArticle, deleteArticle,
        mediaImages, uploadImage, deleteImage,
        galleries, getGalleryById, addGallery, updateGallery, deleteGallery,
        sponsors, addSponsor, updateSponsor, deleteSponsor,
        updateCompetitionPublicConfig, updateCompetitionRegulation,
        portalConfig, updatePortalConfig,
        transfers, addTransfer, updateTransfer, deleteTransfer,
        playerRegistrations, addPlayerRegistration, updatePlayerRegistration, deletePlayerRegistration,
        nationalTeam, nationalSquad, addPlayerToSquad, removePlayerFromSquad,
        comments, addComment,
    };

    return (
        <CompetitionContext.Provider value={value}>
            {children}
        </CompetitionContext.Provider>
    );
};

// Custom hook to use the context
export const useCompetitions = (): CompetitionContextType => {
    const context = useContext(CompetitionContext);
    if (context === undefined) {
        throw new Error('useCompetitions must be used within a CompetitionProvider');
    }
    return context;
};