
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Competition, Team, Match, Standing, Player, Arena, User, Role, OrganizationSettings, Invoice, AuditLog, Sanction, Referee, Observer, Article, MediaImage, Gallery, Sponsor, PublicConfig, Regulation, Transfer, PlayerRegistration, County, CommitteeMember, Announcement, PortalConfig } from '../types.ts';
import { MOCK_COMPETITIONS, MOCK_TEAMS, MOCK_MATCHES, MOCK_PLAYERS, MOCK_ARENAS, MOCK_USERS, MOCK_ROLES, MOCK_ORGANIZATION_SETTINGS, MOCK_INVOICES, MOCK_AUDIT_LOG, MOCK_SANCTIONS, MOCK_REFEREES, MOCK_OBSERVERS, MOCK_ARTICLES, MOCK_MEDIA_IMAGES, MOCK_GALLERIES, MOCK_SPONSORS, MOCK_TRANSFERS, MOCK_PLAYER_REGISTRATIONS, MOCK_COUNTIES, MOCK_PORTAL_CONFIG } from './mock_data.ts';
import { generateBergerTable } from '../utils/bergerTable.ts';

interface CompetitionContextType {
  competitions: Competition[];
  teams: Team[];
  matches: Match[];
  players: Player[];
  arenas: Arena[];
  users: User[];
  currentUser: User | null;
  roles: Role[];
  organizationSettings: OrganizationSettings;
  invoices: Invoice[];
  auditLog: AuditLog[];
  sanctions: Sanction[];
  referees: Referee[];
  observers: Observer[];
  articles: Article[];
  mediaImages: MediaImage[];
  galleries: Gallery[];
  sponsors: Sponsor[];
  transfers: Transfer[];
  playerRegistrations: PlayerRegistration[];
  counties: County[];
  portalConfig: PortalConfig;
  getCompetitionById: (id: string) => Competition | undefined;
  getMatchById: (id: string) => Match | undefined;
  getArticleById: (id: string) => Article | undefined;
  getGalleryById: (id: string) => Gallery | undefined;
  getTransfersByPlayerId: (playerId: string) => Transfer[];
  getPlayerRegistrationsByPlayerId: (playerId: string) => PlayerRegistration[];
  addCompetition: (data: any) => void;
  // FIX: Update function signature to allow for an optional logoFile property.
  updateCompetition: (data: Competition & { logoFile?: File | null }) => void;
  deleteCompetition: (id: string) => void;
  addTeam: (data: any) => void;
  updateTeam: (data: Team) => void;
  deleteTeam: (id: string) => void;
  addPlayer: (data: any) => void;
  updatePlayer: (data: Player) => void;
  deletePlayer: (id: string) => void;
  addArena: (data: any) => void;
  updateArena: (data: Arena) => void;
  deleteArena: (id: string) => void;
  addReferee: (data: any) => void;
  updateReferee: (data: Referee) => void;
  deleteReferee: (id: string) => void;
  addObserver: (data: any) => void;
  updateObserver: (data: Observer) => void;
  deleteObserver: (id: string) => void;
  addSanction: (data: Omit<Sanction, 'id'>) => void;
  updateSanction: (data: Sanction) => void;
  deleteSanction: (id: string) => void;
  updateMatch: (data: Match) => void;
  addTeamToCompetition: (competitionId: string, teamId: string) => void;
  generateBergerSchedule: (competitionId: string) => void;
  calculateStandings: (competitionId: string, stage: string) => Standing[];
  setCurrentUser: (userId: string) => void;
  inviteUser: (email: string, roleId: string) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (role: Role) => void;
  deleteRole: (roleId: string) => void;
  addCounty: (county: Omit<County, 'id'>) => void;
  updateCounty: (county: County) => void;
  deleteCounty: (countyId: string) => void;
  updateOrganizationSettings: (settings: OrganizationSettings, logoFile: File | null) => void;
  updateCompetitionPublicConfig: (competitionId: string, config: PublicConfig, logoFile: File | null) => void;
  addArticle: (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => void;
  updateArticle: (data: Article, imageFile: File | null) => void;
  deleteArticle: (articleId: string) => void;
  uploadImage: (competitionId: string, imageFile: File) => void;
  deleteImage: (imageId: string) => void;
  addGallery: (data: Omit<Gallery, 'id'>) => void;
  updateGallery: (data: Gallery) => void;
  deleteGallery: (galleryId: string) => void;
  addSponsor: (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile: File | null) => void;
  updateSponsor: (data: Sponsor, logoFile: File | null) => void;
  deleteSponsor: (sponsorId: string) => void;
  updateCompetitionRegulation: (competitionId: string, regulation: Regulation) => void;
  addTransfer: (data: Omit<Transfer, 'id'>) => void;
  updateTransfer: (data: Transfer) => void;
  deleteTransfer: (id: string) => void;
  addPlayerRegistration: (data: Omit<PlayerRegistration, 'id'>) => void;
  updatePlayerRegistration: (data: PlayerRegistration) => void;
  deletePlayerRegistration: (id: string) => void;
  updatePortalConfig: (config: PortalConfig, logoFile: File | null) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
    const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
    const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
    const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
    const [arenas, setArenas] = useState<Arena[]>(MOCK_ARENAS);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(MOCK_ORGANIZATION_SETTINGS);
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [auditLog, setAuditLog] = useState<AuditLog[]>(MOCK_AUDIT_LOG);
    const [sanctions, setSanctions] = useState<Sanction[]>(MOCK_SANCTIONS);
    const [referees, setReferees] = useState<Referee[]>(MOCK_REFEREES);
    const [observers, setObservers] = useState<Observer[]>(MOCK_OBSERVERS);
    const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
    const [mediaImages, setMediaImages] = useState<MediaImage[]>(MOCK_MEDIA_IMAGES);
    const [galleries, setGalleries] = useState<Gallery[]>(MOCK_GALLERIES);
    const [sponsors, setSponsors] = useState<Sponsor[]>(MOCK_SPONSORS);
    const [transfers, setTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
    const [playerRegistrations, setPlayerRegistrations] = useState<PlayerRegistration[]>(MOCK_PLAYER_REGISTRATIONS);
    const [counties, setCounties] = useState<County[]>(MOCK_COUNTIES);
    const [portalConfig, setPortalConfig] = useState<PortalConfig>(MOCK_PORTAL_CONFIG);

    // Getters
    const getCompetitionById = (id: string) => competitions.find(c => c.id === id);
    const getMatchById = (id: string) => matches.find(m => m.id === id);
    const getArticleById = (id: string) => articles.find(a => a.id === id);
    const getGalleryById = (id: string) => galleries.find(g => g.id === id);
    const getTransfersByPlayerId = (playerId: string) => transfers.filter(t => t.playerId === playerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const getPlayerRegistrationsByPlayerId = (playerId: string) => playerRegistrations.filter(r => r.playerId === playerId).sort((a, b) => new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime());


    // Generic CRUD helpers
    const crudHelper = <T extends { id: string }>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => ({
        add: (item: Omit<T, 'id'>) => setState(prev => [...prev, { ...item, id: `${typeof item}-${Date.now()}` } as T]),
        update: (item: T) => setState(prev => prev.map(i => i.id === item.id ? item : i)),
        remove: (id: string) => setState(prev => prev.filter(i => i.id !== id))
    });
    
    // CRUD Operations
    const handleSetCurrentUser = (userId: string) => setCurrentUser(users.find(u => u.id === userId) || null);
    
    const addCompetition = (data: any) => {
        const newComp: Competition = {
            id: `comp-${Date.now()}`,
            name: data.name,
            season: data.season,
            logoUrl: data.logoFile ? URL.createObjectURL(data.logoFile) : 'https://picsum.photos/seed/comp-logo/200',
            status: 'Upcoming',
            teamIds: [],
            format: data.format,
            twoLegged: data.twoLegged,
            teamsPerGroup: data.teamsPerGroup,
            county: data.county,
            organizerId: data.organizerId
        };
        setCompetitions(prev => [...prev, newComp]);
    };
    const updateCompetition = (data: Competition & { logoFile?: File | null }) => {
        if (data.logoFile) {
            data.logoUrl = URL.createObjectURL(data.logoFile);
            delete (data as any).logoFile;
        }
        setCompetitions(prev => prev.map(c => c.id === data.id ? data : c));
    };
    const deleteCompetition = (id: string) => setCompetitions(prev => prev.filter(c => c.id !== id));

    const addTeam = (data: any) => {
        const newTeam: Team = {
            id: `team-${Date.now()}`,
            name: data.name,
            country: data.country,
            logoUrl: data.logoFile ? URL.createObjectURL(data.logoFile) : 'https://picsum.photos/seed/team-logo/200',
        };
        setTeams(prev => [...prev, newTeam]);
    };
    const updateTeam = (data: Team & { logoFile?: File | null }) => {
        if (data.logoFile) {
            data.logoUrl = URL.createObjectURL(data.logoFile);
        }
        setTeams(prev => prev.map(t => t.id === data.id ? { id: t.id, name: data.name, country: data.country, logoUrl: data.logoUrl } : t));
    };
    const deleteTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id));
    
    const addPlayer = (data: any) => {
        const newPlayer: Player = { id: `player-${Date.now()}`, name: data.name, teamId: data.teamId, stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 } };
        setPlayers(prev => [...prev, newPlayer]);
    };
    const updatePlayer = (data: Player) => setPlayers(prev => prev.map(p => p.id === data.id ? data : p));
    const deletePlayer = (id: string) => setPlayers(prev => prev.filter(p => p.id !== id));

    const addArena = (data: any) => {
        const newArena: Arena = { id: `arena-${Date.now()}`, name: data.name, location: data.location, fields: data.fields };
        setArenas(prev => [...prev, newArena]);
    };
    const updateArena = (data: Arena) => setArenas(prev => prev.map(a => a.id === data.id ? data : a));
    const deleteArena = (id: string) => setArenas(prev => prev.filter(a => a.id !== id));

    const addReferee = (data: any) => setReferees(prev => [...prev, { id: `ref-${Date.now()}`, name: data.name }]);
    const updateReferee = (data: Referee) => setReferees(prev => prev.map(r => r.id === data.id ? data : r));
    const deleteReferee = (id: string) => setReferees(prev => prev.filter(r => r.id !== id));

    const addObserver = (data: any) => setObservers(prev => [...prev, { id: `obs-${Date.now()}`, name: data.name }]);
    const updateObserver = (data: Observer) => setObservers(prev => prev.map(o => o.id === data.id ? data : o));
    const deleteObserver = (id: string) => setObservers(prev => prev.filter(o => o.id !== id));

    const addSanction = (data: Omit<Sanction, 'id'>) => setSanctions(prev => [...prev, { ...data, id: `sanction-${Date.now()}` }]);
    const updateSanction = (data: Sanction) => setSanctions(prev => prev.map(s => s.id === data.id ? data : s));
    const deleteSanction = (id: string) => setSanctions(prev => prev.filter(s => s.id !== id));

    const updateMatch = (data: Match) => setMatches(prev => prev.map(m => m.id === data.id ? data : m));

    const addTeamToCompetition = (competitionId: string, teamId: string) => {
        setCompetitions(prev => prev.map(c => c.id === competitionId ? { ...c, teamIds: [...c.teamIds, teamId] } : c));
    };

    const generateBergerSchedule = (competitionId: string) => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return;

        const competitionTeams = teams.filter(t => competition.teamIds.includes(t.id));
        if (competitionTeams.length < 2) {
            alert("Not enough teams to generate a schedule.");
            return;
        }

        const schedule = generateBergerTable(competitionTeams);
        const newMatches: Match[] = [];
        let matchDate = new Date();

        schedule.forEach((round, roundIndex) => {
            round.forEach(pairing => {
                if (pairing.home.id !== 'bye' && pairing.away.id !== 'bye') {
                    const homeTeam = pairing.home as Team;
                    const awayTeam = pairing.away as Team;
                    newMatches.push({
                        id: `match-${competitionId}-${homeTeam.id}-${awayTeam.id}`,
                        competitionId,
                        homeTeam,
                        awayTeam,
                        date: new Date(matchDate.getTime() + (roundIndex * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                        status: 'Not Started',
                        homeScore: 0,
                        awayScore: 0,
                        events: [],
                        stage: `Round ${roundIndex + 1}`
                    });
                }
            });
        });

        // Remove old schedule for this competition and add new one
        setMatches(prev => [...prev.filter(m => m.competitionId !== competitionId), ...newMatches]);
    };
    
    const calculateStandings = (competitionId: string, stage: string): Standing[] => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return [];

        const competitionTeams = teams.filter(t => competition.teamIds.includes(t.id));
        const competitionMatches = matches.filter(m => m.competitionId === competitionId && m.status === 'Finished');

        const standingsMap: { [teamId: string]: Standing } = {};

        competitionTeams.forEach(team => {
            standingsMap[team.id] = {
                teamId: team.id,
                teamName: team.name,
                logoUrl: team.logoUrl,
                played: 0, wins: 0, draws: 0, losses: 0,
                goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
            };
        });

        competitionMatches.forEach(match => {
            const home = standingsMap[match.homeTeam.id];
            const away = standingsMap[match.awayTeam.id];
            
            if (!home || !away) return;

            home.played++; away.played++;
            home.goalsFor += match.homeScore; away.goalsFor += match.awayScore;
            home.goalsAgainst += match.awayScore; away.goalsAgainst += match.homeScore;
            home.goalDifference = home.goalsFor - home.goalsAgainst;
            away.goalDifference = away.goalsFor - away.goalsAgainst;

            if (match.homeScore > match.awayScore) {
                home.wins++; away.losses++; home.points += 3;
            } else if (match.awayScore > match.homeScore) {
                away.wins++; home.losses++; away.points += 3;
            } else {
                home.draws++; away.draws++; home.points++; away.points++;
            }
        });

        return Object.values(standingsMap).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.teamName.localeCompare(b.teamName));
    };

    const inviteUser = (email: string, roleId: string) => {
        const newUser: User = { id: `user-${Date.now()}`, name: email.split('@')[0], email, roleId, status: 'PENDING' };
        setUsers(prev => [...prev, newUser]);
    };
    const updateUser = (user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    const deleteUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));

    const addRole = (role: Omit<Role, 'id'>) => setRoles(prev => [...prev, { ...role, id: `role-${Date.now()}` }]);
    const updateRole = (role: Role) => setRoles(prev => prev.map(r => r.id === role.id ? role : r));
    const deleteRole = (roleId: string) => setRoles(prev => prev.filter(r => r.id !== roleId));

    const addCounty = (county: Omit<County, 'id'>) => setCounties(prev => [...prev, { ...county, id: `county-${Date.now()}` }]);
    const updateCounty = (county: County) => setCounties(prev => prev.map(c => c.id === county.id ? county : c));
    const deleteCounty = (countyId: string) => setCounties(prev => prev.filter(c => c.id !== countyId));

    const updateOrganizationSettings = (settings: OrganizationSettings, logoFile: File | null) => {
        const newSettings = { ...settings };
        if (logoFile) {
            newSettings.logoUrl = URL.createObjectURL(logoFile);
        }
        setOrganizationSettings(newSettings);
    };

    const updateCompetitionPublicConfig = (competitionId: string, config: PublicConfig, logoFile: File | null) => {
        setCompetitions(prev => prev.map(c => {
            if (c.id === competitionId) {
                const newConfig = { ...c.publicConfig, ...config };
                if (logoFile) {
                    newConfig.logoUrl = URL.createObjectURL(logoFile);
                }
                return { ...c, publicConfig: newConfig };
            }
            return c;
        }));
    };
    
    const addArticle = (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => {
        const newArticle: Article = {
            ...data,
            id: `article-${Date.now()}`,
            featuredImageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://picsum.photos/seed/article/800/400',
            author: currentUser?.name || 'Admin',
            createdAt: new Date().toISOString()
        };
        setArticles(prev => [newArticle, ...prev]);
    };
    const updateArticle = (data: Article, imageFile: File | null) => {
        const updatedArticle = { ...data };
        if (imageFile) {
            updatedArticle.featuredImageUrl = URL.createObjectURL(imageFile);
        }
        setArticles(prev => prev.map(a => a.id === data.id ? updatedArticle : a));
    };
    const deleteArticle = (articleId: string) => setArticles(prev => prev.filter(a => a.id !== articleId));

    const uploadImage = (competitionId: string, imageFile: File) => {
        const newImage: MediaImage = {
            id: `media-${Date.now()}`,
            competitionId,
            url: URL.createObjectURL(imageFile),
            uploadedAt: new Date().toISOString(),
        };
        setMediaImages(prev => [newImage, ...prev]);
    };
    const deleteImage = (imageId: string) => {
        setMediaImages(prev => prev.filter(img => img.id !== imageId));
        setGalleries(prev => prev.map(g => ({ ...g, imageIds: g.imageIds.filter(id => id !== imageId) })));
    };

    const addGallery = (data: Omit<Gallery, 'id'>) => setGalleries(prev => [{ ...data, id: `gallery-${Date.now()}`}, ...prev]);
    const updateGallery = (data: Gallery) => setGalleries(prev => prev.map(g => g.id === data.id ? data : g));
    const deleteGallery = (galleryId: string) => setGalleries(prev => prev.filter(g => g.id !== galleryId));
    
    const addSponsor = (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile: File | null) => {
        const newSponsor: Sponsor = {
            ...data,
            id: `sponsor-${Date.now()}`,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : 'https://picsum.photos/seed/sponsor/200/100',
        };
        setSponsors(prev => [...prev, newSponsor]);
    };
    const updateSponsor = (data: Sponsor, logoFile: File | null) => {
        const updatedSponsor = { ...data };
        if (logoFile) {
            updatedSponsor.logoUrl = URL.createObjectURL(logoFile);
        }
        setSponsors(prev => prev.map(s => s.id === data.id ? updatedSponsor : s));
    };
    const deleteSponsor = (sponsorId: string) => setSponsors(prev => prev.filter(s => s.id !== sponsorId));

    const updateCompetitionRegulation = (competitionId: string, regulation: Regulation) => {
        setCompetitions(prev => prev.map(c => {
            if (c.id === competitionId) {
                const existingRegs = c.publicConfig?.regulations || [];
                const newRegs = existingRegs.find(r => r.id === regulation.id)
                    ? existingRegs.map(r => r.id === regulation.id ? regulation : r)
                    : [...existingRegs, regulation];
                return { ...c, publicConfig: { ...c.publicConfig!, regulations: newRegs } };
            }
            return c;
        }));
    };
    
    const addTransfer = (data: Omit<Transfer, 'id'>) => {
        setTransfers(prev => [{ ...data, id: `transfer-${Date.now()}`}, ...prev]);
        // Also update the player's team
        setPlayers(prev => prev.map(p => p.id === data.playerId ? { ...p, teamId: data.toTeamId } : p));
    };
    const updateTransfer = (data: Transfer) => setTransfers(prev => prev.map(t => t.id === data.id ? data : t));
    const deleteTransfer = (id: string) => setTransfers(prev => prev.filter(t => t.id !== id));
    
    const addPlayerRegistration = (data: Omit<PlayerRegistration, 'id'>) => setPlayerRegistrations(prev => [{...data, id: `reg-${Date.now()}`}, ...prev]);
    const updatePlayerRegistration = (data: PlayerRegistration) => setPlayerRegistrations(prev => prev.map(r => r.id === data.id ? data : r));
    const deletePlayerRegistration = (id: string) => setPlayerRegistrations(prev => prev.filter(r => r.id !== id));

    const updatePortalConfig = (config: PortalConfig, logoFile: File | null) => {
        const newConfig = { ...config };
        if (logoFile) {
            newConfig.logoUrl = URL.createObjectURL(logoFile);
        }
        setPortalConfig(newConfig);
    };

    const value: CompetitionContextType = {
        competitions, teams, matches, players, arenas, users, currentUser, roles, organizationSettings, invoices, auditLog, sanctions, referees, observers, articles, mediaImages, galleries, sponsors, transfers, playerRegistrations, counties, portalConfig,
        getCompetitionById, getMatchById, getArticleById, getGalleryById, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId,
        addCompetition, updateCompetition, deleteCompetition,
        addTeam, updateTeam, deleteTeam,
        addPlayer, updatePlayer, deletePlayer,
        addArena, updateArena, deleteArena,
        addReferee, updateReferee, deleteReferee,
        addObserver, updateObserver, deleteObserver,
        addSanction, updateSanction, deleteSanction,
        updateMatch,
        addTeamToCompetition, generateBergerSchedule, calculateStandings,
        setCurrentUser: handleSetCurrentUser,
        inviteUser, updateUser, deleteUser,
        addRole, updateRole, deleteRole,
        addCounty, updateCounty, deleteCounty,
        updateOrganizationSettings,
        updateCompetitionPublicConfig,
        addArticle, updateArticle, deleteArticle,
        uploadImage, deleteImage,
        addGallery, updateGallery, deleteGallery,
        addSponsor, updateSponsor, deleteSponsor,
        updateCompetitionRegulation,
        addTransfer, updateTransfer, deleteTransfer,
        addPlayerRegistration, updatePlayerRegistration, deletePlayerRegistration,
        updatePortalConfig,
    };

    return (
        <CompetitionContext.Provider value={value}>
            {children}
        </CompetitionContext.Provider>
    );
};

export const useCompetitions = () => {
    const context = useContext(CompetitionContext);
    if (context === undefined) {
        throw new Error('useCompetitions must be used within a CompetitionProvider');
    }
    return context;
};
