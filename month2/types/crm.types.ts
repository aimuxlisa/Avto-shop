export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  is_active: boolean | number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export type LeadStatus = 'new' | 'in_progress' | 'waiting' | 'won' | 'lost';
export type LeadSource = 'website_form' | 'telegram_bot' | 'phone' | 'referral' | 'manual' | 'other';

export interface Lead {
  id: string;
  client_id: string;
  source: LeadSource;
  status: LeadStatus;
  assigned_to: string | null;  // user.id
  value: number | null;         // потенциальная сумма сделки
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  client_name?: string;
  client_phone?: string;
  client_email?: string | null;
  assigned_name?: string;
  assigned_avatar?: string | null;
}

export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  lead_id: string | null;
  client_id: string | null;
  assigned_to: string;          // user.id
  title: string;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
  // joined fields
  assigned_name?: string;
  client_name?: string;
  lead_title?: string;
}

export interface AnalyticsResponse {
  leadsOverTime: { date: string; count: number }[];
  statusBreakdown: { status: LeadStatus; count: number }[];
  sourceBreakdown: { source: LeadSource; count: number }[];
  conversionRate: number;
  totalLeads: number;
  totalValue: number;
  avgDealTimeDays?: number;
  teamPerformance?: { userId: string; userName: string; won: number; total: number; totalValue: number }[];
}
