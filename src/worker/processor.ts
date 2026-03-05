import { indexJob } from "../services/elastic.service";
import { EmailJob } from "../types/tasks";

export async function processEmail(job: EmailJob) {
  console.log("processing job", job.id);
  if (!job.id || !job.data.to) {
    return;
  }
  const { to, subject, text } = job.data;

  try {
    // const info = await transporter.sendMail({
    console.log("sending email:", {
      from: "process.env.SMTP_FROM",
      to,
      subject,
      text,
    });

    const result = {
      type: "email",
      to,
      subject,
      text,
      messageId: "some-random-id",
      status: "SENT",
      timestamp: new Date().toISOString(),
    };

    await indexJob(job.id, result);
    return result;
  } catch (error: any) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export async function processNotification(job: any) {
  console.log("processing job", job.id);
  if (!job.id || !job.data.to) {
    return;
  }
  const { to, subject, text } = job.data;
  try {
    // const info = await transporter.sendMail({
    console.log("sending notification:", {
      from: "99999999",
      to,
      subject,
      text,
    });

    const result = {
      type: "notification",
      to,
      subject,
      text,
      timestamp: new Date().toISOString(),
      messageId: "some-random-id",
      status: "SENT",
    };

    await indexJob(job.id, result);
    return result;
  } catch (error: any) {
    console.error("Notification sending failed:", error);
    throw error;
  }
}
