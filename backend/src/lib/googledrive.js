import { google } from "googleapis";
import fs from "fs";
import fsPromises from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export const uploadChatBackup = async (chatData, userId) => {
  const fileName = `chat_backup_${userId}_${Date.now()}.json`;
  const filePath = `./backups/${fileName}`;

  try {
    if (!fs.existsSync("./backups")) {
      await fsPromises.mkdir("./backups", { recursive: true }); // Ensures directory exists
    }

    await fsPromises.writeFile(filePath, JSON.stringify(chatData, null, 2)); // Async file write

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };
    const media = {
      mimeType: "application/json",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    console.log(`✅ Chat backup uploaded successfully! File ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ Error uploading chat backup:", error);
    throw error;
  }
};
