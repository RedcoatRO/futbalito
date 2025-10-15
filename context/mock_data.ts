// FIX: Replaced placeholder content with mock data to resolve module errors.
import type { Competition, Team, Match, Standing, Player, Arena, User, Role, OrganizationSettings, Invoice, AuditLog, Sanction, Referee, Observer, Article, MediaImage, Gallery, Sponsor, PublicConfig, Regulation, Transfer, PlayerRegistration, County, CommitteeMember, Announcement, PortalConfig } from '../types.ts';
import { MatchEventType } from '../types.ts';

export const MOCK_ORGANIZATION_SETTINGS: OrganizationSettings = {
    name: "Futbalito",
    logoUrl: "https://i.imgur.com/Jv9g296.png",
    email: "contact@futbalito.com",
    phone: "123-456-7890",
    address: "123 Futbalito Way, Sportsville, 12345",
    defaultTimezone: "Europe/Bucharest",
    defaultCompetitionFormat: "league",
};

export const MOCK_PORTAL_CONFIG: PortalConfig = {
    title: "Futbalito Central Portal",
    logoUrl: "https://i.imgur.com/Jv9g296.png",
    primaryColor: "#2563eb",
    backgroundColor: "#f3f4f6",
};

export const MOCK_ROLES: Role[] = [
    { id: 'role-admin', name: 'Super Admin', description: 'Has all permissions.', permissions: [
        'competitions:create', 'competitions:edit', 'competitions:delete', 'teams:create', 'teams:edit', 'teams:delete', 'players:manage', 'arenas:manage', 'referees:manage', 'observers:manage', 'matches:manage_live', 'publish:manage_articles', 'publish:manage_media', 'publish:manage_sponsors', 'publish:manage_regulations', 'publish:customize_sites', 'settings:manage_organization', 'settings:manage_counties', 'users:invite', 'users:manage_roles', 'organizers:manage', 'transfers:manage'
    ]},
    { id: 'role-content-editor', name: 'Content Editor', description: 'Manages public content like articles and media.', permissions: [
        'publish:manage_articles', 'publish:manage_media', 'publish:manage_sponsors', 'publish:manage_regulations', 'publish:customize_sites'
    ]},
    { id: 'role-match-manager', name: 'Match Manager', description: 'Manages live matches and competition data.', permissions: [
        'competitions:edit', 'teams:edit', 'players:manage', 'matches:manage_live'
    ]}
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Super Admin', email: 'admin@futbalito.com', roleId: 'role-admin', status: 'ACTIVE'},
    { id: 'user-2', name: 'Alice Editor', email: 'alice@futbalito.com', roleId: 'role-content-editor', status: 'ACTIVE'},
    { id: 'user-3', name: 'Bob Manager', email: 'bob@futbalito.com', roleId: 'role-match-manager', status: 'PENDING'},
];

export const MOCK_TEAMS: Team[] = [
    { id: "team-1", name: "FC Steaua București", country: "Romania", logoUrl: "https://i.imgur.com/8f8e0e6.png" },
    { id: "team-2", name: "FC Dinamo București", country: "Romania", logoUrl: "https://i.imgur.com/k4d2h2q.png" },
    { id: "team-3", name: "FC Rapid București", country: "Romania", logoUrl: "https://i.imgur.com/v0j3t5E.png" },
    { id: "team-4", name: "CFR 1907 Cluj", country: "Romania", logoUrl: "https://i.imgur.com/8i9b3d2.png" },
    { id: "team-5", name: "Universitatea Craiova", country: "Romania", logoUrl: "https://i.imgur.com/4h2j3n1.png" },
    { id: "team-6", name: "FCSB", country: "Romania", logoUrl: "https://i.imgur.com/N7b0q2c.png" },
    { id: "team-7", name: "FC Voluntari", country: "Romania", logoUrl: "https://i.imgur.com/P5e6f8G.png" },
    { id: "team-8", name: "Sepsi OSK", country: "Romania", logoUrl: "https://i.imgur.com/tH8j3f5.png" },
];

export const MOCK_PLAYERS: Player[] = [
    { id: "player-1", name: "Florinel Coman", teamId: "team-6", stats: { goals: 12, assists: 8, yellowCards: 5, redCards: 1 } },
    { id: "player-2", name: "Ciprian Deac", teamId: "team-4", stats: { goals: 8, assists: 10, yellowCards: 3, redCards: 0 } },
    { id: "player-3", name: "Alexandru Mitriță", teamId: "team-5", stats: { goals: 15, assists: 5, yellowCards: 7, redCards: 0 } },
    { id: "player-4", name: "Dennis Man", teamId: "team-1", stats: { goals: 9, assists: 3, yellowCards: 2, redCards: 0 } },
];

const MOCK_PUBLIC_CONFIG_1: PublicConfig = {
    title: "SuperLiga Romania",
    logoUrl: "https://i.imgur.com/wJ2x9P6.png",
    primaryColor: "#0033a0",
    backgroundColor: "#f0f2f5",
    showRankings: true, showSchedule: true, showPlayerStats: true, showArticles: true,
    showGalleries: true, showSponsors: true, showRegulations: true, showLiveStream: true,
    featuredLiveMatchIds: ['match-1-1-2'],
    announcements: [
        {id: 'ann-1', title: 'Season Start Announcement', content: 'The new season will kick off on August 1st! Get ready for exciting matches.', date: new Date().toISOString()}
    ],
    committee: [
        {id: 'cm-1', name: 'Gică Popescu', role: 'President'},
        {id: 'cm-2', name: 'Miodrag Belodedici', role: 'Secretary'},
    ],
    regulations: [
        {id: 'statute', title: 'Statute', content: 'This is the official statute of the competition.', lastUpdatedAt: new Date().toISOString()}
    ]
};

export const MOCK_COMPETITIONS: Competition[] = [
    { id: "comp-1", name: "SuperLiga", season: "2023/2024", logoUrl: "https://i.imgur.com/wJ2x9P6.png", status: "Ongoing", teamIds: ["team-1", "team-2", "team-3", "team-4", "team-5", "team-6"], format: 'league', county: 'București', organizerId: 'user-3', isPublic: true, publicConfig: MOCK_PUBLIC_CONFIG_1 },
    { id: "comp-2", name: "Cupa României", season: "2023/2024", logoUrl: "https://i.imgur.com/Y8b3f2a.png", status: "Upcoming", teamIds: ["team-7", "team-8"], format: 'cup', isPublic: true, publicConfig: {...MOCK_PUBLIC_CONFIG_1, title: 'Cupa României'} }
];

export const MOCK_MATCHES: Match[] = [
    { id: "match-1-1-2", competitionId: "comp-1", homeTeam: MOCK_TEAMS[0], awayTeam: MOCK_TEAMS[1], date: new Date().toISOString(), status: 'Finished', homeScore: 2, awayScore: 1, events: [
        { id: 'evt-1', minute: 25, type: MatchEventType.GOAL, teamId: 'team-1', primaryPlayerId: 'player-4' }
    ], liveStreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: "match-1-3-4", competitionId: "comp-1", homeTeam: MOCK_TEAMS[2], awayTeam: MOCK_TEAMS[3], date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', homeScore: 0, awayScore: 0, events: [] },
    { id: "match-1-5-6", competitionId: "comp-1", homeTeam: MOCK_TEAMS[4], awayTeam: MOCK_TEAMS[5], date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', homeScore: 0, awayScore: 0, events: [] },
];

export const MOCK_ARENAS: Arena[] = [
    { id: 'arena-1', name: 'Arena Națională', location: 'Bucharest', fields: ['Main Field'] },
    { id: 'arena-2', name: 'Stadionul Dr. Constantin Rădulescu', location: 'Cluj-Napoca', fields: ['Main Field'] },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv-1', date: '2024-07-01', amount: '$49.00', status: 'Paid' },
    { id: 'inv-2', date: '2024-06-01', amount: '$49.00', status: 'Paid' },
];

export const MOCK_AUDIT_LOG: AuditLog[] = [
    { id: 'log-1', userId: 'user-1', userName: 'Super Admin', action: 'User Invite', details: 'Invited alice@futbalito.com', timestamp: new Date().toISOString() },
    { id: 'log-2', userId: 'user-2', userName: 'Alice Editor', action: 'Article Publish', details: 'Published "Season Kick-off!"', timestamp: new Date().toISOString() },
];

export const MOCK_SANCTIONS: Sanction[] = [
    { id: 'sanction-1', competitionId: 'comp-1', playerId: 'player-1', reason: 'Red Card', details: '2 match suspension', date: new Date().toISOString() }
];

export const MOCK_REFEREES: Referee[] = [
    { id: 'ref-1', name: 'István Kovács' },
    { id: 'ref-2', name: 'Ovidiu Hațegan' }
];

export const MOCK_OBSERVERS: Observer[] = [
    { id: 'obs-1', name: 'Ion Crăciunescu' }
];

export const MOCK_ARTICLES: Article[] = [
    { id: 'art-1', competitionId: 'comp-1', title: 'Derby Win for Steaua!', content: 'A fantastic match ended with a victory for the home team...', featuredImageUrl: 'https://picsum.photos/seed/article1/800/400', author: 'Alice Editor', createdAt: new Date().toISOString(), status: 'published'},
    { id: 'art-2', competitionId: 'comp-1', title: 'Upcoming Matches Preview', content: 'Here is what to expect in the next round...', featuredImageUrl: 'https://picsum.photos/seed/article2/800/400', author: 'Alice Editor', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'published'},
];

export const MOCK_MEDIA_IMAGES: MediaImage[] = [
    { id: 'media-1', competitionId: 'comp-1', url: 'https://picsum.photos/seed/gallery1/600/400', uploadedAt: new Date().toISOString() },
    { id: 'media-2', competitionId: 'comp-1', url: 'https://picsum.photos/seed/gallery2/600/400', uploadedAt: new Date().toISOString() },
];

export const MOCK_GALLERIES: Gallery[] = [
    { id: 'gallery-1', competitionId: 'comp-1', title: 'Derby Day Photos', imageIds: ['media-1', 'media-2'] }
];

export const MOCK_SPONSORS: Sponsor[] = [
    { id: 'sponsor-1', competitionId: 'comp-1', name: 'eMAG', logoUrl: 'https://i.imgur.com/f2T6iG9.png', websiteUrl: 'https://emag.ro' },
    { id: 'sponsor-2', competitionId: 'comp-1', name: 'Betano', logoUrl: 'https://i.imgur.com/U3v4Q3E.png', websiteUrl: 'https://betano.ro' },
];

export const MOCK_TRANSFERS: Transfer[] = [
    { id: 'transfer-1', playerId: 'player-4', fromTeamId: 'team-6', toTeamId: 'team-1', date: new Date().toISOString(), fee: 1000000 },
];

export const MOCK_PLAYER_REGISTRATIONS: PlayerRegistration[] = [
    { id: 'reg-1', playerId: 'player-1', registrationNumber: 'RO-12345', validFrom: new Date().toISOString(), validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), status: 'ACTIVE'}
];

export const MOCK_COUNTIES: County[] = [
    { id: 'county-1', name: 'București' },
    { id: 'county-2', name: 'Cluj' },
];
