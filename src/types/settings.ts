export interface UserSettings {
  notifications: {
    email: boolean;
    discord: boolean;
    signals: boolean;
    announcements: boolean;
    mentions: boolean;
  };
  preferences: {
    theme: 'dark' | 'light';
    timezone: string;
    language: string;
    signalAlerts: 'all' | 'important' | 'none';
    autoplayVideos: boolean;
  };
  privacy: {
    showProfile: boolean;
    showActivity: boolean;
    showProgress: boolean;
  };
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled';
    renewalDate?: Date;
  };
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    discordUsername?: string;
    bio?: string;
    avatar?: string;
  };
} 