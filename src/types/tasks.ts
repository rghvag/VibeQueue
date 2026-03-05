import { Job } from "bullmq";
export interface Task {
  type: "email" | "notification";
  payload: any;
  priority?: number;
  scheduledAt?: number;
}
export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export type EmailJob = Job<EmailPayload>;
