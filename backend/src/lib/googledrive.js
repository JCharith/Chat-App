import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

// Initialize OAuth2 client with credentials from .env
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Authenticate using the refresh token from .env
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Initialize the Google Drive API client with a 60-second timeout
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
  timeout: 60000,
});

// Uploads chat backup data directly to Google Drive without saving locally
export const uploadChatBackup = async (chatData, userId) => {
  try {
    // Create a unique file name for the backup
    const fileName = `chat_backup_${userId}_${Date.now()}.json`;

    // Create a memory stream from the JSON string of chatData
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(JSON.stringify(chatData, null, 2)));

    // Define file metadata for the backup file
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    // Configure the media object to use the memory stream
    const media = {
      mimeType: "application/json",
      body: bufferStream,
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    console.log(`✅ Chat backup uploaded successfully! File ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ Error uploading chat backup:", error.message);
    throw error;
  }
};
