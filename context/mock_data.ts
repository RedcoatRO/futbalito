import type { Competition, Team, Match, Player, Arena, User, Role, OrganizationSettings, Invoice, AuditLog, Sanction, Referee, Observer, Article, MediaImage, Gallery, Sponsor, Transfer, PlayerRegistration, County, PortalConfig } from '../types.ts';

export const MOCK_ORGANIZATION_SETTINGS: OrganizationSettings = {
    name: 'Futbalito',
    logoUrl: 'https://i.imgur.com/2qG1Bf3.png',
    email: 'contact@futbalito.com',
    phone: '+40 123 456 789',
    address: '123 Sport St, Bucharest, Romania',
    defaultTimezone: 'Europe/Bucharest',
    defaultCompetitionFormat: 'league'
};

export const MOCK_ROLES: Role[] = [
    { id: 'role-admin', name: 'Super Admin', description: 'Has all permissions.', permissions: [
        'competitions:create', 'competitions:edit', 'competitions:delete',
        'teams:create', 'teams:edit', 'teams:delete',
        'players:manage', 'arenas:manage', 'referees:manage', 'observers:manage',
        'matches:manage_live', 'publish:manage_articles', 'publish:manage_media',
        'publish:manage_sponsors', 'publish:manage_regulations', 'publish:customize_sites',
        'settings:manage_organization', 'users:invite', 'users:manage_roles', 'transfers:manage',
        'settings:manage_counties', 'organizers:manage'
    ] },
    { id: 'role-content-editor', name: 'Content Editor', description: 'Can manage public content.', permissions: ['publish:manage_articles', 'publish:manage_media'] },
    { id: 'role-match-manager', name: 'Match Manager', description: 'Can manage live matches.', permissions: ['matches:manage_live'] }
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Super Admin', email: 'admin@futbalito.com', roleId: 'role-admin', status: 'ACTIVE' },
    { id: 'user-2', name: 'John Doe', email: 'john@futbalito.com', roleId: 'role-content-editor', status: 'ACTIVE' },
    { id: 'user-3', name: 'Jane Smith', email: 'jane@futbalito.com', roleId: 'role-match-manager', status: 'PENDING' }
];

export const MOCK_TEAMS: Team[] = [
    { id: 'team-1', name: 'FC North', logoUrl: 'https://i.imgur.com/f3je5I4.png', country: 'Romania' },
    { id: 'team-2', name: 'South United', logoUrl: 'https://i.imgur.com/J3523a0.png', country: 'Romania' },
    { id: 'team-3', name: 'East Albion', logoUrl: 'https://i.imgur.com/2s7sU3N.png', country: 'Romania' },
    { id: 'team-4', name: 'West Wanderers', logoUrl: 'https://i.imgur.com/e3B3wVv.png', country: 'Romania' },
    // Add a new team for the second competition
    { id: 'team-5', name: 'Central City', logoUrl: 'https://i.imgur.com/O6pva2e.png', country: 'Romania' },
];

export const MOCK_PLAYERS: Player[] = [
    { id: 'player-1', name: 'Alex Popescu', teamId: 'team-1', stats: { goals: 5, assists: 2, yellowCards: 1, redCards: 0 } },
    { id: 'player-2', name: 'Mihai Ionescu', teamId: 'team-1', stats: { goals: 2, assists: 4, yellowCards: 0, redCards: 0 } },
    { id: 'player-3', name: 'Andrei Vasile', teamId: 'team-2', stats: { goals: 6, assists: 1, yellowCards: 2, redCards: 1 } },
    { id: 'player-4', name: 'Gheorghe Radu', teamId: 'team-2', stats: { goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
    // Add a player for the new team
    { id: 'player-5', name: 'Cristian Manea', teamId: 'team-5', stats: { goals: 3, assists: 3, yellowCards: 0, redCards: 0 } },
];

export const MOCK_MATCHES: Match[] = [
    { id: 'match-1', competitionId: 'comp-1', homeTeam: MOCK_TEAMS[0], awayTeam: MOCK_TEAMS[1], date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Finished', homeScore: 2, awayScore: 1, events: [], stage: 'Round 1' },
    { id: 'match-2', competitionId: 'comp-1', homeTeam: MOCK_TEAMS[2], awayTeam: MOCK_TEAMS[3], date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'Finished', homeScore: 0, awayScore: 0, events: [], stage: 'Round 1' },
    { id: 'match-3', competitionId: 'comp-1', homeTeam: MOCK_TEAMS[0], awayTeam: MOCK_TEAMS[2], date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', homeScore: 0, awayScore: 0, events: [], stage: 'Round 2', liveStreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    // Add more matches for testing
    { id: 'match-4', competitionId: 'comp-2', homeTeam: MOCK_TEAMS[1], awayTeam: MOCK_TEAMS[4], date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Finished', homeScore: 3, awayScore: 3, events: [], stage: 'Semi-Final' },
    { id: 'match-5', competitionId: 'comp-1', homeTeam: MOCK_TEAMS[1], awayTeam: MOCK_TEAMS[3], date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', homeScore: 0, awayScore: 0, events: [], stage: 'Round 2' },
    { id: 'match-6', competitionId: 'comp-2', homeTeam: MOCK_TEAMS[0], awayTeam: MOCK_TEAMS[2], date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', homeScore: 0, awayScore: 0, events: [], stage: 'Final' },
];

export const MOCK_COMPETITIONS: Competition[] = [
    { id: 'comp-1', name: 'Liga 1', season: '2024-2025', logoUrl: 'https://i.imgur.com/sfa33Sg.png', status: 'Ongoing', teamIds: ['team-1', 'team-2', 'team-3', 'team-4'], format: 'league', twoLegged: true, county: 'București', organizerId: 'user-2', isPublic: true, publicConfig: {
        title: 'Liga 1 Public Site',
        logoUrl: 'https://i.imgur.com/sfa33Sg.png',
        primaryColor: '#003366',
        backgroundColor: '#f4f6f8',
        showRankings: true,
        showSchedule: true,
        showPlayerStats: true,
        showArticles: true,
        showGalleries: true,
        showSponsors: true,
        showRegulations: true,
        showLiveStream: true,
        featuredLiveMatchIds: ['match-3'],
        announcements: [{ id: 'ann-1', title: 'Welcome to the new season!', content: 'The 2024-2025 season is officially underway. Good luck to all teams!', date: new Date().toISOString() }],
        regulations: [],
        committee: [{ id: 'cm-1', name: 'John Chairman', role: 'President' }]
    } },
    // Make Cup public for portal testing
    { id: 'comp-2', name: 'Cupa Romaniei', season: '2024', logoUrl: 'https://i.imgur.com/nJ4a5bV.png', status: 'Ongoing', teamIds: ['team-1', 'team-2', 'team-3', 'team-4', 'team-5'], format: 'cup', isPublic: true, publicConfig: {
        title: 'Cupa Romaniei Official',
        logoUrl: 'https://i.imgur.com/nJ4a5bV.png',
        primaryColor: '#c8102e',
        backgroundColor: '#ffffff',
        showRankings: false,
        showSchedule: true,
        showPlayerStats: false,
        showArticles: true,
        showGalleries: true,
        showSponsors: true,
        showRegulations: false,
        showLiveStream: false,
        featuredLiveMatchIds: [],
        announcements: [],
        regulations: [],
        committee: []
    }}
];

export const MOCK_ARENAS: Arena[] = [{ id: 'arena-1', name: 'National Arena', location: 'Bucharest', fields: ['Main Field'] }];
export const MOCK_REFEREES: Referee[] = [{ id: 'ref-1', name: 'Ovidiu Hategan' }];
export const MOCK_OBSERVERS: Observer[] = [{ id: 'obs-1', name: 'Ion Craciunescu' }];
export const MOCK_INVOICES: Invoice[] = [{ id: 'INV-001', date: '2024-07-01', amount: '$49.00', status: 'Paid' }];
export const MOCK_AUDIT_LOG: AuditLog[] = [{ id: 'log-1', userId: 'user-1', userName: 'Super Admin', action: 'Login', details: 'User logged in successfully.', timestamp: new Date().toISOString() }];
export const MOCK_SANCTIONS: Sanction[] = [{ id: 'sanction-1', competitionId: 'comp-1', playerId: 'player-3', reason: 'Red Card', details: '1 match suspension', date: new Date().toISOString() }];
export const MOCK_ARTICLES: Article[] = [{ id: 'article-1', competitionId: 'comp-1', title: 'Season Kick-off!', content: 'The new season has begun with exciting matches.', featuredImageUrl: 'https://picsum.photos/seed/news1/800/400', author: 'John Doe', createdAt: new Date().toISOString(), status: 'published' }];
export const MOCK_MEDIA_IMAGES: MediaImage[] = [{ id: 'media-1', competitionId: 'comp-1', url: 'https://picsum.photos/seed/img1/600/400', uploadedAt: new Date().toISOString() }];
export const MOCK_GALLERIES: Gallery[] = [{ id: 'gallery-1', competitionId: 'comp-1', title: 'Round 1 Highlights', imageIds: ['media-1'] }];
export const MOCK_SPONSORS: Sponsor[] = [{ id: 'sponsor-1', competitionId: 'comp-1', name: 'Main Sponsor', logoUrl: 'https://i.imgur.com/e3B3wVv.png', websiteUrl: 'https://example.com' }];
export const MOCK_TRANSFERS: Transfer[] = [{ id: 'tr-1', playerId: 'player-4', fromTeamId: 'team-2', toTeamId: 'team-3', date: new Date().toISOString(), fee: 10000 }];
export const MOCK_PLAYER_REGISTRATIONS: PlayerRegistration[] = [{ id: 'reg-1', playerId: 'player-1', registrationNumber: 'RO-12345', validFrom: new Date().toISOString(), validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), status: 'ACTIVE' }];
export const MOCK_COUNTIES: County[] = [{ id: 'county-1', name: 'București' }, { id: 'county-2', name: 'Cluj' }];

export const MOCK_PORTAL_CONFIG: PortalConfig = {
    title: 'Futbalito National Portal',
    logoUrl: 'https://i.imgur.com/2qG1Bf3.png',
    primaryColor: '#1a3a6e',
    backgroundColor: '#f0f2f5',
};