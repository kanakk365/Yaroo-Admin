export interface User {
    id: string;
    username: string;
    password?: string;
    email: string;
    address?: string;
    phone: string;
    dob?: string;
    referral_code?: string;
    region?: string;
    wallet_balance: number;
    completed_cashback?: number;
    pending_cashback?: number;
    total_cashback: number;
  }
  
  export interface UserStatsData {
    total_users: number;
    active_users: number;
    total_withdrawals: number;
    total_cashback_amount: number;
    users: User[];
  }
  
  export interface TimeFilterProps {
    timeFilter: string;
    setTimeFilter: (value: string) => void;
  }
  