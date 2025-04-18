export interface HelpRequest {
    id: string;
    user_id: string;
    title: string;
    description: string;
    is_callback: boolean;
    status: 'pending' | 'in_progress' | 'resolved';
    created_at: string;
    updated_at: string;
  }
  
  export interface HelpRequestResponse {
    success: boolean;
    data: HelpRequest[];
    message: string;
  }
  