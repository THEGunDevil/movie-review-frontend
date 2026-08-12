export interface AppNotification  {
  id: string;       // UUID as string
  title: string;
  message: string;
  read: boolean;
  created_at: string; // or Date if you parse it
  event_id?: string;  // optional, matches Go's omitempty
}