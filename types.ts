
export type Page =
  | 'DASHBOARD'
  | 'BROWSE'
  | 'MANAGE_COMPETITIONS'
  | 'VIEW_COMPETITION'
  | 'LIVE_MATCH'
  | 'MANAGE_TEAMS'
  | 'MANAGE_PLAYERS'
  | 'VIEW_PLAYER'
  | 'MANAGE_ARENAS'
  | 'MANAGE_REFEREES'
  | 'MANAGE_OBSERVERS'
  | 'MANAGE_ORGANIZERS'
  | 'MANAGE_NATIONAL_TEAM'
  | 'PUBLISH'
  | 'WEB_BUILDER'
  | 'MANAGE_ARTICLES'
  | 'EDIT_ARTICLE'
  | 'MANAGE_MEDIA'
  | 'EDIT_GALLERY'
  | 'MANAGE_SPONSORS'
  | 'MANAGE_REGULATIONS'
  | 'PORTAL_BUILDER'
  | 'REPORTS'
  | 'MARKETPLACE'
  | 'SETTINGS';

export interface Competition {
    id: string;
    name: string;
    season: string;
    logoUrl: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    teamIds: string[];
    format: 'league' | 'cup' | 'mixed';
    twoLegged?: boolean;
    teamsPerGroup?: number;
    defaultArenaId?: string;
    county?: string;
    organizerId?: string;
    isPublic?: boolean;
    publicConfig?: PublicConfig;
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    country: string;
}

export interface Player {
    id: string;
    name: string;
    teamId: string;
    stats: {
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
    }
}

export interface Match {
    id: string;
    competitionId: string;
    homeTeam: Team;
    awayTeam: Team;
    date: string; // ISO string
    status: 'Not Started' | 'In Progress' | 'Finished';
    homeScore: number;
    awayScore: number;
    events: MatchEvent[];
    stage?: string;
    outcome?: 'regulation' | 'shootout';
    winnerId?: string;
    homePenaltyScore?: number;
    awayPenaltyScore?: number;
    liveStreamUrl?: string;
}

export enum MatchEventType {
    GOAL = 'Goal',
    YELLOW_CARD = 'Yellow Card',
    RED_CARD = 'Red Card',
    SUBSTITUTION = 'Substitution',
}

export interface MatchEvent {
    id: string;
    type: MatchEventType;
    minute: number;
    teamId: string;
    primaryPlayerId: string; // Scorer, carded player, player leaving
    secondaryPlayerId?: string; // Assistant, player entering
}

export interface Standing {
    teamId: string;
    teamName: string;
    logoUrl: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

export interface Arena {
    id: string;
    name: string;
    location: string;
    fields: string[];
}

export interface Referee {
    id: string;
    name: string;
}

export interface Observer {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    status: 'ACTIVE' | 'PENDING';
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

export type Permission =
    | 'competitions:create'
    | 'competitions:edit'
    | 'competitions:delete'
    | 'teams:create'
    | 'teams:edit'
    | 'teams:delete'
    | 'players:manage'
    | 'arenas:manage'
    | 'referees:manage'
    | 'observers:manage'
    | 'organizers:manage'
    | 'matches:manage_live'
    | 'publish:manage_articles'
    | 'publish:manage_media'
    | 'publish:manage_sponsors'
    | 'publish:manage_regulations'
    | 'publish:customize_sites'
    | 'settings:manage_organization'
    | 'settings:manage_counties'
    | 'users:invite'
    | 'users:manage_roles'
    | 'transfers:manage';

export interface County {
    id: string;
    name: string;
}

export interface OrganizationSettings {
    name: string;
    logoUrl: string;
    email: string;
    phone: string;
    address: string;
    defaultTimezone: string;
    defaultCompetitionFormat: 'league' | 'cup' | 'mixed';
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid';
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface Sanction {
    id: string;
    competitionId: string;
    teamId?: string;
    playerId?: string;
    reason: string;
    details: string; // e.g., "2 match suspension"
    date: string; // ISO string
}

export interface PublicConfig {
    title: string;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
    showRankings: boolean;
    showSchedule: boolean;
    showPlayerStats: boolean;
    showArticles: boolean;
    showGalleries: boolean;
    showSponsors: boolean;
    showRegulations: boolean;
    showLiveStream: boolean;
    featuredLiveMatchIds: string[];
    announcements: Announcement[];
    regulations: Regulation[];
    committee: CommitteeMember[];
}

export interface Article {
    id: string;
    competitionId: string;
    title: string;
    content: string;
    featuredImageUrl: string;
    author: string;
    createdAt: string; // ISO string
    status: 'draft' | 'published';
}

export interface MediaImage {
    id: string;
    competitionId: string;
    url: string;
    uploadedAt: string; // ISO string
}

export interface Gallery {
    id: string;
    competitionId: string;
    title: string;
    imageIds: string[];
}

export interface Sponsor {
    id: string;
    competitionId: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
}

export interface Regulation {
    id: 'statute' | 'game' | 'organization' | 'disciplinary';
    title: string;
    content: string;
    lastUpdatedAt: string; // ISO string
}

export interface Transfer {
    id: string;
    playerId: string;
    fromTeamId: string;
    toTeamId: string;
    date: string;
    fee: number;
}

export type PlayerRegistrationStatus = 'ACTIVE' | 'EXPIRED';

export interface PlayerRegistration {
    id: string;
    playerId: string;
    registrationNumber: string;
    validFrom: string;
    validUntil: string;
    status: PlayerRegistrationStatus;
}

export interface CommitteeMember {
    id: string;
    name: string;
    role: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
}

// FIX: Added missing PortalConfig interface.
export interface PortalConfig {
  title: string;
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
}
