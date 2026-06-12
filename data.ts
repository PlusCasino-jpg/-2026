export interface GoalEvent {
  minute: number;
  team: string;
  player: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamLogo: string;
  league: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'upcoming' | 'finished';
  liveMinute?: number;
  streamUrl?: string;
  channel?: string;
  commentary: string[];
  hasReminder?: boolean;
  goalEvents: GoalEvent[];
  viewsCount?: string;
}

export interface Comment {
  id: string;
  matchId: number;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}
