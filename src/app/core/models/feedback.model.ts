export interface Feedback {
  id: number;
  grievanceId: number;
  citizenId: number;
  rating: number;
  comments: string;
  reopenRequested: boolean;
  reopenReason: string;
  createdAt: string;
}

export interface CreateFeedbackRequest {
  grievanceId: number;
  rating: number;
  comments: string;
  reopenRequested: boolean;
  reopenReason?: string;
}
