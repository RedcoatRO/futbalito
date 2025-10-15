// The main pages of the application
export type Page =
  | 'DASHBOARD'
  | 'BROWSE'
  | 'MANAGE_COMPETITIONS'
  | 'COMPETITION_DETAIL'
  | 'LIVE_MATCH'
  | 'MANAGE_TEAMS'
  | 'MANAGE_PLAYERS'
  | 'PLAYER_DETAIL'
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
  | 'REPORTS'
  | 'MARKETPLACE'
  | 'SETTINGS'
  | 'PORTAL_BUILDER';

// Represents a single team
export interface Team {
  id: string;
  name: string;
  country: string;
  logoUrl: string;
}

// Represents a player
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

// Represents a single match event (goal, card, substitution)
export enum MatchEventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SUBSTITUTION = 'SUBSTITUTION',
  COMMENTARY = 'COMMENTARY',
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  teamId: string;
  primaryPlayerId: string;
  secondaryPlayerId?: string; // For substitutions (player in)
  commentary?: string; // For commentary events
}

// Represents a match between two teams
export interface Match {
  id: string;
  competitionId: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Finished' | 'Postponed';
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stage?: string;
  arenaId?: string;
  refereeId?: string;
  observerId?: string;
  liveStreamUrl?: string;
}

// Represents standings for a team in a league
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

// Represents an arena/stadium
export interface Arena {
    id: string;
    name: string;
    location: string;
    fields: string[];
}

// Represents a user of the admin system
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'ACTIVE' | 'PENDING';
}

// Defines a permission string
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
  | 'organizers:manage'
  | 'transfers:manage';

// Represents a user role with a set of permissions
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Represents organization-wide settings
export interface OrganizationSettings {
    name: string;
    logoUrl: string;
    email: string;
    phone: string;
    address: string;
    defaultTimezone: string;
    defaultCompetitionFormat: 'league' | 'cup' | 'mixed';
}

// Represents a financial invoice
export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending';
}

// Represents an entry in the audit log
export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
}

// Represents a disciplinary sanction
export interface Sanction {
    id: string;
    competitionId: string;
    teamId?: string;
    playerId?: string;
    reason: string;
    details: string; // e.g., "2 match suspension"
    date: string;
}

// Represents a referee
export interface Referee {
    id: string;
    name: string;
}

// Represents a match observer
export interface Observer {
    id: string;
    name: string;
}

// Represents a news article
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

// Represents an image in the media library
export interface MediaImage {
    id: string;
    competitionId: string;
    url: string;
    uploadedAt: string;
}

// Represents a photo gallery
export interface Gallery {
    id: string;
    competitionId: string;
    title: string;
    imageIds: string[];
}

// Represents a sponsor
export interface Sponsor {
    id: string;
    competitionId: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
}

// Represents an official regulation document
export interface Regulation {
    id: string;
    title: string;
    content: string;
    lastUpdatedAt: string;
}

// Represents a player transfer between teams
export interface Transfer {
    id: string;
    playerId: string;
    fromTeamId: string;
    toTeamId: string;
    date: string;
    fee: number;
}

export type PlayerRegistrationStatus = 'ACTIVE' | 'EXPIRED';

// Represents a player's official registration
export interface PlayerRegistration {
    id: string;
    playerId: string;
    registrationNumber: string;
    validFrom: string;
    validUntil: string;
    status: PlayerRegistrationStatus;
}

// Represents a county or region
export interface County {
    id: string;
    name: string;
}

// Represents a member of an organizing committee
export interface CommitteeMember {
    id: string;
    name: string;
    role: string;
}

// Represents a public announcement
export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
}


// Configuration for a public-facing competition website
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
    committee: CommitteeMember[];
    regulations: Regulation[];
}

// Represents a competition
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
  isPublic?: boolean;
  county?: string;
  organizerId?: string;
  publicConfig?: PublicConfig;
}

// Configuration for the main public portal
export interface PortalConfig {
    title: string;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
}
