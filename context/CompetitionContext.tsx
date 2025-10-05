import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Competition, Team, Match, Arena, Player, StandingsRow, MatchEvent, PublicConfig, Article, MediaImage, Gallery, Sponsor, PortalConfig, OrganizationSettings, User, Role, Permission, Invoice, AuditLogEntry } from '../types';

// --- INITIAL MOCK DATA ---
const initialArenas: Arena[] = [
  { id: 'a1', name: 'Central Arena', location: 'Metropolis', fields: ['Field 1', 'Field 2'] },
  { id: 'a2', name: 'North Park', location: 'Star City', fields: ['Main Field'] },
];

const initialTeams: Team[] = [
  { id: 't1', name: 'FC Dynamo', logoUrl: 'https://picsum.photos/seed/dynamo/100', country: 'Rohan', playerIds: ['p1', 'p2'], homeArenaId: 'a1' },
  { id: 't2', name: 'AC Sentinel', logoUrl: 'https://picsum.photos/seed/sentinel/100', country: 'Gondor', playerIds: ['p3'], homeArenaId: 'a2' },
  { id: 't3', name: 'FC Titans', logoUrl: 'https://picsum.photos/seed/titans/100', country: 'Arnor', playerIds: [], homeArenaId: 'a1' },
  { id: 't4', name: 'Real United', logoUrl: 'https://picsum.photos/seed/united/100', country: 'Mordor', playerIds: [], homeArenaId: 'a2' },
];

const initialPlayers: Player[] = [
  { id: 'p1', name: 'John Doe', teamId: 't1', stats: { goals: 5, assists: 2, yellowCards: 1, redCards: 0 } },
  { id: 'p2', name: 'Peter Pan', teamId: 't1', stats: { goals: 2, assists: 4, yellowCards: 0, redCards: 0 } },
  { id: 'p3', name: 'Jane Smith', teamId: 't2', stats: { goals: 8, assists: 1, yellowCards: 3, redCards: 1 } },
];

const allPermissions: Permission[] = [
    'competitions:create', 'competitions:edit', 'competitions:delete',
    'teams:create', 'teams:edit', 'teams:delete',
    'players:manage', 'arenas:manage', 'matches:manage_live',
    'publish:manage_articles', 'publish:manage_media', 'publish:manage_sponsors', 'publish:customize_sites',
    'settings:manage_organization', 'users:invite', 'users:manage_roles'
];

const initialRoles: Role[] = [
    {
        id: 'role-admin',
        name: 'Administrator',
        description: 'Has full access to all features.',
        permissions: allPermissions,
    },
    {
        id: 'role-content-editor',
        name: 'Content Editor',
        description: 'Can manage articles, media, and sponsors.',
        permissions: ['publish:manage_articles', 'publish:manage_media', 'publish:manage_sponsors'],
    },
    {
        id: 'role-match-manager',
        name: 'Match Manager',
        description: 'Can manage live matches and competition schedules.',
        permissions: ['matches:manage_live', 'competitions:edit'],
    }
];

const initialUsers: User[] = [
    { id: 'u1', name: 'Super Admin', email: 'admin@futbalito.com', roleId: 'role-admin', status: 'ACTIVE' },
    { id: 'u2', name: 'Alice Editor', email: 'alice@example.com', roleId: 'role-content-editor', status: 'ACTIVE' },
    { id: 'u3', name: 'Bob Manager', email: 'bob@example.com', roleId: 'role-match-manager', status: 'INVITED' },
];

const initialArticles: Article[] = [
    {
        id: 'art1',
        competitionId: '1',
        title: 'FC Dynamo Kicks Off Season With a Win!',
        content: 'It was a thrilling start to the Premier Mini-Football League as FC Dynamo secured a 2-1 victory over rivals AC Sentinel. The match, held at the bustling Central Arena, was a testament to the high level of competition we can expect this season...',
        featuredImageUrl: 'https://picsum.photos/seed/article1/800/400',
        author: 'Super Admin',
        createdAt: new Date().toISOString(),
        status: 'published',
    },
    {
        id: 'art2',
        competitionId: '1',
        title: 'Upcoming Fixtures for Round 2',
        content: 'Get ready for more action as we head into Round 2. All eyes will be on the clash between the Titans and United. This article is currently a draft and not visible to the public.',
        featuredImageUrl: 'https://picsum.photos/seed/article2/800/400',
        author: 'Super Admin',
        createdAt: new Date().toISOString(),
        status: 'draft',
    }
];

const initialMediaImages: MediaImage[] = [
    { id: 'img1', competitionId: '1', url: 'https://picsum.photos/seed/match-day-1/600/400' },
    { id: 'img2', competitionId: '1', url: 'https://picsum.photos/seed/match-day-2/600/400' },
    { id: 'img3', competitionId: '1', url: 'https://picsum.photos/seed/fans-cheering/600/400' },
];

const initialGalleries: Gallery[] = [
    { id: 'gal1', competitionId: '1', title: 'Highlights from Round 1', imageIds: ['img1', 'img3'] },
];

const initialSponsors: Sponsor[] = [
    { id: 'sp1', competitionId: '1', name: 'TechCorp', logoUrl: 'https://picsum.photos/seed/techcorp/200/100', websiteUrl: 'https://example.com' },
    { id: 'sp2', competitionId: '1', name: 'ProSport Gear', logoUrl: 'https://picsum.photos/seed/prosport/200/100', websiteUrl: 'https://example.com' },
];

const initialCompetitions: Competition[] = [
  { 
    id: '1', name: 'Premier Mini-Football League', season: '2024 Autumn', logoUrl: 'https://picsum.photos/seed/premier-league/100', 
    status: 'Ongoing', teamIds: ['t1', 't2', 't3', 't4'], format: 'league', twoLegged: true, defaultArenaId: 'a1',
    isPublic: true,
    publicConfig: {
        title: 'Premier Mini-Football League Official Site',
        description: 'Welcome to the official home of the PMFL. Follow all the action, results, and news here.',
        logoUrl: 'https://picsum.photos/seed/premier-league/100',
        primaryColor: '#3B82F6',
        backgroundColor: '#F9FAFB',
        showSchedule: true,
        showRankings: true,
        showArticles: true,
        showGalleries: true,
        showSponsors: true,
        showSponsorsInFooter: true,
        showPlayerStats: true,
        footerText: '© 2024 Premier Mini-Football League. All Rights Reserved.',
        facebookUrl: 'https://facebook.com',
        twitterUrl: 'https://twitter.com',
        instagramUrl: 'https://instagram.com',
    }
  },
  { id: '2', name: 'City Cup', season: '2024', logoUrl: 'https://picsum.photos/seed/city-cup/100', status: 'Completed', teamIds: [], format: 'cup', fullBracket: true, isPublic: true },
  { id: '3', name: 'Summer Friendly Tournament', season: '2024 Summer', logoUrl: 'https://picsum.photos/seed/summer-friendly/100', status: 'Upcoming', teamIds: [], format: 'mixed', teamsPerGroup: 4, twoLegged: false, isPublic: false },
];

const initialMatches: Match[] = [
    {
        id: 'm1',
        competitionId: '1',
        homeTeam: initialTeams[0],
        awayTeam: initialTeams[1],
        homeScore: 2,
        awayScore: 1,
        status: 'Finished',
        date: '2024-10-26T19:00:00Z',
        stage: 'Round 1',
        outcome: 'regulation',
        winnerId: 't1',
        arenaId: 'a1',
        field: 'Field 1',
        events: [],
    },
    {
        id: 'm2',
        competitionId: '1',
        homeTeam: initialTeams[2],
        awayTeam: initialTeams[3],
        homeScore: 0,
        awayScore: 0,
        status: 'Not Started',
        date: '2024-10-26T19:00:00Z',
        stage: 'Round 1',
        arenaId: 'a1',
        field: 'Field 2',
        events: [],
    }
];

const initialPortalConfig: PortalConfig = {
    title: 'Futbalito Competition Portal',
    logoUrl: 'https://picsum.photos/seed/portal-logo/100',
    primaryColor: '#16A34A',
    backgroundColor: '#F0FDF4',
};

const initialOrganizationSettings: OrganizationSettings = {
  name: 'Futbalito Main League',
  logoUrl: 'https://picsum.photos/seed/org-logo/100',
  email: 'contact@futbalito.com',
  phone: '+1 (555) 123-4567',
  address: '123 Futbalito Ave, Sportsville, 90210',
  defaultTimezone: 'Europe/Bucharest',
  defaultCompetitionFormat: 'league',
};

const initialInvoices: Invoice[] = [
    { id: 'inv-003', date: '2024-07-01', amount: '$49.00', status: 'Paid' },
    { id: 'inv-002', date: '2024-06-01', amount: '$49.00', status: 'Paid' },
    { id: 'inv-001', date: '2024-05-01', amount: '$49.00', status: 'Paid' },
];

const initialAuditLog: AuditLogEntry[] = [
    { id: 'log-1', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: 'u2', userName: 'Alice Editor', action: 'Publish Article', details: 'Published article "FC Dynamo Kicks Off Season With a Win!"' },
    { id: 'log-2', timestamp: new Date(Date.now() - 172800000).toISOString(), userId: 'u1', userName: 'Super Admin', action: 'Create Competition', details: 'Created competition "Premier Mini-Football League"' },
];


// --- CONTEXT DEFINITION ---
interface CompetitionContextState {
  competitions: Competition[];
  teams: Team[];
  matches: Match[];
  arenas: Arena[];
  players: Player[];
  articles: Article[];
  mediaImages: MediaImage[];
  galleries: Gallery[];
  sponsors: Sponsor[];
  portalConfig: PortalConfig;
  organizationSettings: OrganizationSettings;
  users: User[];
  roles: Role[];
  invoices: Invoice[];
  auditLog: AuditLogEntry[];
  currentUser: User | null;
  setCurrentUser: (userId: string) => void;
  addRole: (roleData: Omit<Role, 'id'>) => void;
  updateRole: (updatedRole: Role) => void;
  deleteRole: (roleId: string) => void;
  inviteUser: (email: string, roleId: string) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  updateOrganizationSettings: (settings: Partial<OrganizationSettings>, logoFile?: File | null) => void;
  updatePortalConfig: (config: Partial<PortalConfig>, logoFile?: File | null) => void;
  addCompetition: (data: any) => void;
  updateCompetition: (data: any) => void;
  deleteCompetition: (id: string) => void;
  getCompetitionById: (id: string) => Competition | undefined;
  updateCompetitionPublicConfig: (competitionId: string, config: Partial<PublicConfig>, logoFile?: File | null) => void;
  addTeam: (data: any) => void;
  updateTeam: (data: any) => void;
  deleteTeam: (id: string) => void;
  addTeamToCompetition: (competitionId: string, teamId: string) => void;
  generateMatchesForCompetition: (competitionId: string) => void;
  getMatchById: (id: string) => Match | undefined;
  updateMatch: (match: Match) => void;
  addArena: (data: any) => void;
  updateArena: (data: any) => void;
  deleteArena: (id: string) => void;
  addPlayersToTeam: (teamId: string, playerNames: string[]) => void;
  calculateStandings: (competitionId: string, stageFilter?: string) => StandingsRow[];
  getArticleById: (id: string) => Article | undefined;
  addArticle: (data: Omit<Article, 'id' | 'createdAt' | 'author' | 'featuredImageUrl'>, imageFile?: File | null) => void;
  updateArticle: (data: Article, imageFile?: File | null) => void;
  deleteArticle: (id: string) => void;
  getGalleryById: (id: string) => Gallery | undefined;
  addGallery: (data: Omit<Gallery, 'id'>) => void;
  updateGallery: (data: Gallery) => void;
  deleteGallery: (id: string) => void;
  uploadImage: (competitionId: string, file: File) => void;
  deleteImage: (id: string) => void;
  addSponsor: (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile?: File | null) => void;
  updateSponsor: (data: Sponsor, logoFile?: File | null) => void;
  deleteSponsor: (id: string) => void;
}

const CompetitionContext = createContext<CompetitionContextState | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [arenas, setArenas] = useState<Arena[]>(initialArenas);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [mediaImages, setMediaImages] = useState<MediaImage[]>(initialMediaImages);
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [portalConfig, setPortalConfig] = useState<PortalConfig>(initialPortalConfig);
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(initialOrganizationSettings);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditLog);
  const [currentUser, _setCurrentUser] = useState<User | null>(initialUsers[0]);
  
  const setCurrentUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    _setCurrentUser(user || null);
  };
  
  // --- Audit Log ---
  const logAction = (action: string, details: string) => {
      if (!currentUser) return;
      const newLog: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          action,
          details,
      };
      setAuditLog(prev => [newLog, ...prev]);
  };


  // Role Management
  const addRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = { ...roleData, id: `role-${Date.now()}` };
    setRoles(prev => [...prev, newRole]);
    logAction('Create Role', `Created new role: "${newRole.name}"`);
  };
  const updateRole = (updatedRole: Role) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    logAction('Update Role', `Updated role: "${updatedRole.name}"`);
  };
  const deleteRole = (roleId: string) => {
    const roleToDelete = roles.find(r => r.id === roleId);
    if(roleToDelete) {
        logAction('Delete Role', `Deleted role: "${roleToDelete.name}"`);
    }
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };


  // User Management
  const inviteUser = (email: string, roleId: string) => {
    const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        roleId,
        name: email.split('@')[0], // Simple name generation
        status: 'INVITED',
    };
    setUsers(prev => [...prev, newUser]);
    logAction('Invite User', `Invited user: "${email}"`);
  };
  const updateUser = (updatedUser: User) => {
    const oldUser = users.find(u => u.id === updatedUser.id);
    if(oldUser && oldUser.roleId !== updatedUser.roleId) {
        const oldRole = roles.find(r => r.id === oldUser.roleId)?.name;
        const newRole = roles.find(r => r.id === updatedUser.roleId)?.name;
        logAction('Update User Role', `Changed role for ${updatedUser.name} from "${oldRole}" to "${newRole}"`);
    }
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const deleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if(userToDelete) {
        logAction('Delete User', `Deleted user: "${userToDelete.name}" (${userToDelete.email})`);
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };


  const updateOrganizationSettings = (settings: Partial<OrganizationSettings>, logoFile?: File | null) => {
    setOrganizationSettings(prev => {
        let newLogoUrl = prev.logoUrl;
        if (logoFile) {
            if (newLogoUrl && newLogoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(newLogoUrl);
            }
            newLogoUrl = URL.createObjectURL(logoFile);
        }
        return { ...prev, ...settings, logoUrl: newLogoUrl };
    });
    logAction('Update Settings', `Updated organization settings`);
  };

  const updatePortalConfig = (config: Partial<PortalConfig>, logoFile?: File | null) => {
    setPortalConfig(prev => {
        let newLogoUrl = prev.logoUrl;
        if (logoFile) {
            if (newLogoUrl && newLogoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(newLogoUrl);
            }
            newLogoUrl = URL.createObjectURL(logoFile);
        }
        return { ...prev, ...config, logoUrl: newLogoUrl };
    });
  };

    const addCompetition = (competitionData: any) => {
    let logoUrl = `https://picsum.photos/seed/${competitionData.name.toLowerCase().replace(/\s+/g, '-')}/100`;
    if (competitionData.logoFile) {
        logoUrl = URL.createObjectURL(competitionData.logoFile);
    }
    const newCompetition: Competition = { 
      id: Date.now().toString(), ...competitionData, logoUrl, status: 'Upcoming', teamIds: []
    };
    setCompetitions(prev => [...prev, newCompetition]);
    logAction('Create Competition', `Created competition: "${newCompetition.name}"`);
  };
  const updateCompetition = (updatedCompetition: any) => {
    setCompetitions(prev => prev.map(c => {
        if (c.id === updatedCompetition.id) {
            let newLogoUrl = c.logoUrl;
            if (updatedCompetition.logoFile) {
                if (c.logoUrl.startsWith('blob:')) URL.revokeObjectURL(c.logoUrl);
                newLogoUrl = URL.createObjectURL(updatedCompetition.logoFile);
            }
            return { ...c, ...updatedCompetition, logoUrl: newLogoUrl };
        }
        return c;
    }));
    logAction('Update Competition', `Updated competition: "${updatedCompetition.name}"`);
  };
  const deleteCompetition = (id: string) => {
    const compToDelete = competitions.find(c => c.id === id);
    if(compToDelete) {
        logAction('Delete Competition', `Deleted competition: "${compToDelete.name}"`);
    }
    setCompetitions(prev => prev.filter(c => c.id !== id));
    setMatches(prev => prev.filter(m => m.competitionId !== id));
  };
  const getCompetitionById = (id: string) => competitions.find(c => c.id === id);
  
  const updateCompetitionPublicConfig = (competitionId: string, config: Partial<PublicConfig>, logoFile?: File | null) => {
    setCompetitions(prev => prev.map(c => {
        if (c.id === competitionId) {
            const currentConfig = c.publicConfig || { 
                title: c.name, 
                description: '', 
                logoUrl: c.logoUrl, 
                primaryColor: '#000000', 
                backgroundColor: '#FFFFFF',
                showSchedule: false,
                showRankings: false,
                showArticles: false,
                showGalleries: false,
                showSponsors: false,
                showSponsorsInFooter: false,
                showPlayerStats: false,
                footerText: '',
                facebookUrl: '',
                twitterUrl: '',
                instagramUrl: '',
            };
            let newLogoUrl = currentConfig.logoUrl;
            if (logoFile) {
                if (newLogoUrl && newLogoUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(newLogoUrl);
                }
                newLogoUrl = URL.createObjectURL(logoFile);
            }
            return { ...c, publicConfig: { ...currentConfig, ...config, logoUrl: newLogoUrl } };
        }
        return c;
    }));
    const comp = competitions.find(c => c.id === competitionId);
    if(comp) logAction('Customize Public Site', `Updated public site for "${comp.name}"`);
  };

  const addTeam = (teamData: any) => {
    let logoUrl = `https://picsum.photos/seed/${teamData.name.toLowerCase().replace(/\s+/g, '-')}/100`;
    if (teamData.logoFile) logoUrl = URL.createObjectURL(teamData.logoFile);
    const newTeam: Team = { id: `t-${Date.now()}`, ...teamData, logoUrl, playerIds: [] };
    setTeams(prev => [...prev, newTeam]);
    logAction('Create Team', `Created team: "${newTeam.name}"`);
  };
  const updateTeam = (updatedTeam: any) => {
    setTeams(prev => prev.map(t => {
      if (t.id === updatedTeam.id) {
        let newLogoUrl = t.logoUrl;
        if (updatedTeam.logoFile) {
          if (t.logoUrl.startsWith('blob:')) URL.revokeObjectURL(t.logoUrl);
          newLogoUrl = URL.createObjectURL(updatedTeam.logoFile);
        }
        return { ...t, ...updatedTeam, logoUrl: newLogoUrl };
      }
      return t;
    }));
    logAction('Update Team', `Updated team: "${updatedTeam.name}"`);
  };
  const deleteTeam = (id: string) => {
    const teamToDelete = teams.find(t => t.id === id);
     if(teamToDelete) {
        logAction('Delete Team', `Deleted team: "${teamToDelete.name}"`);
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    setCompetitions(prev => prev.map(c => ({...c, teamIds: c.teamIds.filter(teamId => teamId !== id)})));
    setMatches(prev => prev.filter(m => m.homeTeam.id !== id && m.awayTeam.id !== id));
  };
  const addTeamToCompetition = (competitionId: string, teamId: string) => {
    setCompetitions(prev => prev.map(c => {
      if (c.id === competitionId && !c.teamIds.includes(teamId)) return { ...c, teamIds: [...c.teamIds, teamId] };
      return c;
    }));
  };
  const generateMatchesForCompetition = (competitionId: string) => {
    const competition = competitions.find(c => c.id === competitionId);
    if (!competition || competition.teamIds.length < 2) return;

    const competitionTeams = teams.filter(t => competition.teamIds.includes(t.id));
    
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    let newMatches: Match[] = [];
    const baseMatchProps = {
        competitionId,
        homeScore: 0,
        awayScore: 0,
        status: 'Not Started' as 'Not Started',
        date: new Date().toISOString(),
        events: [],
    };
    
    const generateRoundRobin = (teamList: Team[], stagePrefix: string) => {
        const localTeams = [...teamList];
        if (localTeams.length % 2 !== 0) {
            const dummyTeam: Team = { id: 'dummy', name: 'BYE', logoUrl: '', country: '', playerIds: [] };
            localTeams.push(dummyTeam);
        }
        const numRounds = localTeams.length - 1;
        const halfSize = localTeams.length / 2;
        const generatedMatches: Match[] = [];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < halfSize; i++) {
                const home = localTeams[i];
                const away = localTeams[localTeams.length - 1 - i];
                if (home.id !== 'dummy' && away.id !== 'dummy') {
                    generatedMatches.push({
                        id: `m-${Date.now()}-${Math.random()}`,
                        ...baseMatchProps,
                        homeTeam: home,
                        awayTeam: away,
                        stage: `${stagePrefix}Round ${round + 1}`,
                        arenaId: competition.defaultArenaId || home.homeArenaId,
                    });
                }
            }
            localTeams.splice(1, 0, localTeams.pop()!);
        }
        return generatedMatches;
    }

    switch (competition.format) {
        case 'league': {
            newMatches = generateRoundRobin(competitionTeams, '');
            if (competition.twoLegged) {
                const returnLegs = newMatches.map(match => ({
                    ...match,
                    id: `m-${Date.now()}-${Math.random()}-return`,
                    homeTeam: match.awayTeam,
                    awayTeam: match.homeTeam,
                    stage: `Round ${parseInt(match.stage.split(' ')[1]) + (competitionTeams.length - 1)}`,
                    arenaId: competition.defaultArenaId || match.awayTeam.homeArenaId,
                }));
                newMatches.push(...returnLegs);
            }
            break;
        }
        case 'cup': {
            const shuffledTeams = shuffleArray([...competitionTeams]);
            for (let i = 0; i < Math.floor(shuffledTeams.length / 2); i++) {
                newMatches.push({
                    id: `m-${Date.now()}-${Math.random()}`,
                    ...baseMatchProps,
                    homeTeam: shuffledTeams[i*2],
                    awayTeam: shuffledTeams[i*2+1],
                    stage: 'First Round',
                    arenaId: competition.defaultArenaId,
                });
            }
            break;
        }
        case 'mixed': {
            const shuffled = shuffleArray([...competitionTeams]);
            const teamsPerGroup = competition.teamsPerGroup || 4;
            const numGroups = Math.ceil(shuffled.length / teamsPerGroup);
            const groupLetters = Array.from({ length: numGroups }, (_, i) => String.fromCharCode(65 + i));

            for (let i = 0; i < numGroups; i++) {
                const groupTeams = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
                const groupName = `Group ${groupLetters[i]} - `;
                let groupMatches = generateRoundRobin(groupTeams, groupName);

                if (competition.twoLegged) {
                     const returnLegs = groupMatches.map(match => ({
                        ...match,
                        id: `m-${Date.now()}-${Math.random()}-return`,
                        homeTeam: match.awayTeam,
                        awayTeam: match.homeTeam,
                        stage: `${groupName}Round ${parseInt(match.stage.split('Round ')[1]) + (groupTeams.length - 1)}`,
                        arenaId: competition.defaultArenaId || match.awayTeam.homeArenaId,
                    }));
                    groupMatches.push(...returnLegs);
                }
                newMatches.push(...groupMatches);
            }
            break;
        }
    }

    setMatches(prev => [...prev.filter(m => m.competitionId !== competitionId), ...newMatches]);
    logAction('Generate Matches', `Generated ${newMatches.length} matches for "${competition.name}"`);
  };
  const getMatchById = (id: string) => matches.find(m => m.id === id);
  const updateMatch = (updatedMatch: Match) => {
    const oldMatch = matches.find(m => m.id === updatedMatch.id);
    if(oldMatch) {
        if (oldMatch.homeScore !== updatedMatch.homeScore || oldMatch.awayScore !== updatedMatch.awayScore) {
            logAction('Update Match Score', `Updated score for ${oldMatch.homeTeam.name} vs ${oldMatch.awayTeam.name} from ${oldMatch.homeScore}-${oldMatch.awayScore} to ${updatedMatch.homeScore}-${updatedMatch.awayScore}`);
        }
         if (oldMatch.status !== 'Finished' && updatedMatch.status === 'Finished') {
            logAction('Finish Match', `Finished match: ${updatedMatch.homeTeam.name} vs ${updatedMatch.awayTeam.name}`);
        }
    }
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
  };

  // Arena Management
  const addArena = (data: { name: string, location: string, fields: string[] }) => {
    const newArena: Arena = { id: `a-${Date.now()}`, ...data };
    setArenas(prev => [...prev, newArena]);
    logAction('Create Arena', `Created arena: "${newArena.name}"`);
  };
  const updateArena = (updatedArena: Arena) => {
    setArenas(prev => prev.map(a => a.id === updatedArena.id ? updatedArena : a));
    logAction('Update Arena', `Updated arena: "${updatedArena.name}"`);
  };
  const deleteArena = (id: string) => {
    const arenaToDelete = arenas.find(a => a.id === id);
    if(arenaToDelete) {
        logAction('Delete Arena', `Deleted arena: "${arenaToDelete.name}"`);
    }
    setArenas(prev => prev.filter(a => a.id !== id));
  };

  // Player Management
  const addPlayersToTeam = (teamId: string, playerNames: string[]) => {
    const newPlayers: Player[] = playerNames.map(name => ({
      id: `p-${Date.now()}-${Math.random()}`,
      name,
      teamId,
      stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
    }));
    setPlayers(prev => [...prev, ...newPlayers]);
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, playerIds: [...t.playerIds, ...newPlayers.map(p => p.id)] } : t));
  };
  
  // Standings Calculation
  const calculateStandings = (competitionId: string, stageFilter?: string): StandingsRow[] => {
    const competition = competitions.find(c => c.id === competitionId);
    if (!competition) return [];
    
    const relevantMatches = matches.filter(m => m.competitionId === competitionId && m.status === 'Finished' && (!stageFilter || m.stage.startsWith(stageFilter)));
    const teamIds = new Set<string>();
    relevantMatches.forEach(m => {
        teamIds.add(m.homeTeam.id);
        teamIds.add(m.awayTeam.id);
    });
    
    const standings: Record<string, StandingsRow> = {};
    Array.from(teamIds).forEach(id => {
        const team = teams.find(t => t.id === id);
        if(team) {
            standings[id] = { teamId: id, teamName: team.name, logoUrl: team.logoUrl, played: 0, wins: 0, winsShootout: 0, losses: 0, lossesShootout: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 };
        }
    });

    relevantMatches.forEach(match => {
        const home = standings[match.homeTeam.id];
        const away = standings[match.awayTeam.id];
        if (!home || !away) return;

        home.played++;
        away.played++;
        home.goalsFor += match.homeScore;
        away.goalsFor += match.awayScore;
        home.goalsAgainst += match.awayScore;
        away.goalsAgainst += match.homeScore;

        if (match.winnerId) {
            const winner = standings[match.winnerId];
            const loserId = match.winnerId === match.homeTeam.id ? match.awayTeam.id : match.homeTeam.id;
            const loser = standings[loserId];

            if (match.outcome === 'shootout') {
                winner.winsShootout++;
                loser.lossesShootout++;
                winner.points += 2;
                loser.points += 1;
            } else {
                winner.wins++;
                loser.losses++;
                winner.points += 3;
            }
        }
    });

    return Object.values(standings)
        .map(s => ({ ...s, goalDifference: s.goalsFor - s.goalsAgainst }))
        .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.teamName.localeCompare(b.teamName));
  };

  // Article Management
  const getArticleById = (id: string) => articles.find(a => a.id === id);

  const addArticle = (data: Omit<Article, 'id' | 'createdAt' | 'author' | 'featuredImageUrl'>, imageFile?: File | null) => {
    let imageUrl = `https://picsum.photos/seed/${data.title.toLowerCase().replace(/\s+/g, '-')}/800/400`;
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }
    const newArticle: Article = {
        ...data,
        id: `art-${Date.now()}`,
        createdAt: new Date().toISOString(),
        author: currentUser?.name || 'Admin',
        featuredImageUrl: imageUrl,
    };
    setArticles(prev => [newArticle, ...prev]);
    logAction('Create Article', `Created article: "${newArticle.title}"`);
    if(newArticle.status === 'published') {
        logAction('Publish Article', `Published article: "${newArticle.title}"`);
    }
  };
  
  const updateArticle = (updatedArticle: Article, imageFile?: File | null) => {
    const oldArticle = articles.find(a => a.id === updatedArticle.id);
    setArticles(prev => prev.map(a => {
        if (a.id === updatedArticle.id) {
            let newImageUrl = a.featuredImageUrl;
            if (imageFile) {
                if (a.featuredImageUrl.startsWith('blob:')) URL.revokeObjectURL(a.featuredImageUrl);
                newImageUrl = URL.createObjectURL(imageFile);
            }
            return { ...updatedArticle, featuredImageUrl: newImageUrl };
        }
        return a;
    }));
    if(oldArticle && oldArticle.status !== 'published' && updatedArticle.status === 'published') {
        logAction('Publish Article', `Published article: "${updatedArticle.title}"`);
    } else {
        logAction('Update Article', `Updated article: "${updatedArticle.title}"`);
    }
  };
  
  const deleteArticle = (id: string) => {
    const articleToDelete = articles.find(a => a.id === id);
    if(articleToDelete) {
        logAction('Delete Article', `Deleted article: "${articleToDelete.title}"`);
    }
    setArticles(prev => prev.filter(a => a.id !== id));
  };
  
  // Media and Gallery Management
    const uploadImage = (competitionId: string, file: File) => {
        const newImage: MediaImage = {
            id: `img-${Date.now()}`,
            competitionId,
            url: URL.createObjectURL(file),
        };
        setMediaImages(prev => [newImage, ...prev]);
    };

    const deleteImage = (id: string) => {
        const imageToDelete = mediaImages.find(img => img.id === id);
        if (imageToDelete && imageToDelete.url.startsWith('blob:')) {
            URL.revokeObjectURL(imageToDelete.url);
        }
        setMediaImages(prev => prev.filter(img => img.id !== id));
        // Also remove from any galleries
        setGalleries(prev => prev.map(g => ({ ...g, imageIds: g.imageIds.filter(imgId => imgId !== id) })));
    };

    const getGalleryById = (id: string) => galleries.find(g => g.id === id);
    
    const addGallery = (data: Omit<Gallery, 'id'>) => {
        const newGallery: Gallery = { ...data, id: `gal-${Date.now()}` };
        setGalleries(prev => [newGallery, ...prev]);
    };

    const updateGallery = (updatedGallery: Gallery) => {
        setGalleries(prev => prev.map(g => g.id === updatedGallery.id ? updatedGallery : g));
    };

    const deleteGallery = (id: string) => {
        setGalleries(prev => prev.filter(g => g.id !== id));
    };

    // Sponsor Management
    const addSponsor = (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile?: File | null) => {
        let logoUrl = `https://picsum.photos/seed/${data.name.toLowerCase().replace(/\s+/g, '-')}/200/100`;
        if (logoFile) {
            logoUrl = URL.createObjectURL(logoFile);
        }
        const newSponsor: Sponsor = {
            ...data,
            id: `sp-${Date.now()}`,
            logoUrl,
        };
        setSponsors(prev => [newSponsor, ...prev]);
    };

    const updateSponsor = (updatedSponsor: Sponsor, logoFile?: File | null) => {
        setSponsors(prev => prev.map(s => {
            if (s.id === updatedSponsor.id) {
                let newLogoUrl = s.logoUrl;
                if (logoFile) {
                    if (s.logoUrl.startsWith('blob:')) URL.revokeObjectURL(s.logoUrl);
                    newLogoUrl = URL.createObjectURL(logoFile);
                }
                return { ...updatedSponsor, logoUrl: newLogoUrl };
            }
            return s;
        }));
    };

    const deleteSponsor = (id: string) => {
        const sponsorToDelete = sponsors.find(s => s.id === id);
        if (sponsorToDelete && sponsorToDelete.logoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(sponsorToDelete.logoUrl);
        }
        setSponsors(prev => prev.filter(s => s.id !== id));
    };


  const value = {
    competitions, teams, matches, arenas, players, articles, mediaImages, galleries, sponsors, portalConfig, organizationSettings, users, roles,
    invoices, auditLog,
    currentUser, setCurrentUser,
    addRole, updateRole, deleteRole,
    inviteUser, updateUser, deleteUser,
    updateOrganizationSettings,
    updatePortalConfig,
    addCompetition, updateCompetition, deleteCompetition, getCompetitionById,
    updateCompetitionPublicConfig,
    addTeam, updateTeam, deleteTeam, addTeamToCompetition, generateMatchesForCompetition,
    getMatchById, updateMatch,
    addArena, updateArena, deleteArena,
    addPlayersToTeam,
    calculateStandings,
    getArticleById, addArticle, updateArticle, deleteArticle,
    getGalleryById, addGallery, updateGallery, deleteGallery, uploadImage, deleteImage,
    addSponsor, updateSponsor, deleteSponsor,
  };

  return <CompetitionContext.Provider value={value}>{children}</CompetitionContext.Provider>;
};

export const useCompetitions = (): CompetitionContextState => {
  const context = useContext(CompetitionContext);
  if (context === undefined) throw new Error('useCompetitions must be used within a CompetitionProvider');
  return context;
};