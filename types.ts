export type Page = 
  | 'DASHBOARD' 
  | 'BROWSE' 
  | 'MANAGE_COMPETITIONS'
  | 'COMPETITION_DETAIL'
  | 'MANAGE_TEAMS'
  | 'MANAGE_PLAYERS'
  | 'MANAGE_ARENAS'
  | 'PUBLISH' 
  | 'WEB_BUILDER'
  | 'PORTAL_BUILDER'
  | 'MANAGE_ARTICLES'
  | 'EDIT_ARTICLE'
  | 'MANAGE_MEDIA'
  | 'EDIT_GALLERY'
  | 'MANAGE_SPONSORS'
  | 'SETTINGS' 
  | 'MARKETPLACE'
  | 'LIVE_MATCH';

export interface OrganizationSettings {
  name: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  defaultTimezone: string;
  defaultCompetitionFormat: 'league' | 'cup' | 'mixed';
}

export type Permission =
  // Competitions
  | 'competitions:create'
  | 'competitions:edit'
  | 'competitions:delete'
  | 'teams:create'
  | 'teams:edit'
  | 'teams:delete'
  | 'players:manage'
  | 'arenas:manage'
  | 'matches:manage_live'
  // Publishing
  | 'publish:manage_articles'
  | 'publish:manage_media'
  | 'publish:manage_sponsors'
  | 'publish:customize_sites'
  // Administration
  | 'settings:manage_organization'
  | 'users:invite'
  | 'users:manage_roles';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export type UserStatus = 'ACTIVE' | 'INVITED';

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: UserStatus;
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
  };
}

export interface Arena {
  id: string;
  name: string;
  location: string;
  fields: string[]; // e.g., ['Field 1', 'Field 2']
}

export interface Article {
    id: string;
    competitionId: string;
    title: string;
    content: string;
    featuredImageUrl: string;
    author: string;
    createdAt: string;
    status: 'draft' | 'published';
}

export interface MediaImage {
    id: string;
    competitionId: string;
    url: string;
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


export interface PublicConfig {
  title: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
  showSchedule?: boolean;
  showRankings?: boolean;
  showArticles?: boolean;
  showGalleries?: boolean;
  showSponsors?: boolean;
  showSponsorsInFooter?: boolean;
  showPlayerStats?: boolean;
  showLiveStream?: boolean;
  featuredLiveMatchIds?: string[];
  footerText?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

export interface PortalConfig {
  title: string;
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
}

export interface Competition {
  id: string;
  name: string;
  season: string;
  logoUrl: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  teamIds: string[];
  defaultArenaId?: string;
  
  // New properties for advanced formats
  format: 'league' | 'cup' | 'mixed';
  twoLegged?: boolean; // For league and mixed groups
  fullBracket?: boolean; // For cup
  teamsPerGroup?: number; // For mixed
  isPublic?: boolean;
  publicConfig?: PublicConfig;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  country: string;
  homeArenaId?: string;
  playerIds: string[];
}

export enum MatchEventType {
    GOAL = 'Goal',
    YELLOW_CARD = 'Yellow Card',
    RED_CARD = 'Red Card',
    SUBSTITUTION = 'Substitution',
}

export interface MatchEvent {
    id: string;
    minute: number;
    type: MatchEventType;
    teamId: string;
    primaryPlayerId: string; // The player who scored, got a card, or is subbed OUT
    secondaryPlayerId?: string; // The player who is subbed IN
}

export interface Match {
    id: string;
    competitionId: string;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number;
    awayScore: number;
    homePenaltyScore?: number;
    awayPenaltyScore?: number;
    outcome?: 'regulation' | 'shootout';
    winnerId?: string;
    status: 'Not Started' | 'In Progress' | 'Half Time' | 'Finished';
    date: string;
    stage: string; // e.g., "Round 1", "Quarter-finals", "Group A - Round 1"
    arenaId?: string;
    field?: string;
    events: MatchEvent[];
    liveStreamUrl?: string;
}

export interface StandingsRow {
    teamId: string;
    teamName: string;
    logoUrl: string;
    played: number;
    wins: number;
    winsShootout: number;
    losses: number;

    lossesShootout: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
}