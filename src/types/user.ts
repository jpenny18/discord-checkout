export interface UserProfile {
  id: string;
  firstName: string;
  email: string;
  roles?: string[];
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
  };
  createdAt: Date;
  updatedAt: Date;
} 