export interface Notification {
  id: number;
  userId: number;
  grievanceId: number;
  grievanceNumber: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
}

export enum NotificationType {
  GRIEVANCE_CREATED = 'GRIEVANCE_CREATED',
  GRIEVANCE_ASSIGNED = 'GRIEVANCE_ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  GRIEVANCE_RESOLVED = 'GRIEVANCE_RESOLVED',
  GRIEVANCE_ESCALATED = 'GRIEVANCE_ESCALATED'
}
