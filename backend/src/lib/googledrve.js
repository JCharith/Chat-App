import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export const uploadFile = async (filePath, fileName) => {
  const fileMetadata = {
    name: fileName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
  };
  const media = {
    mimeType: "application/octet-stream",
    body: fs.createReadStream(filePath)
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id"
    });
    console.log("File uploaded successfully:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error.message);
    throw error;
  }
};

export const listFiles = async () => {
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name)"
    });
    console.log("Files:", response.data.files);
    return response.data.files;
  } catch (error) {
    console.error("Error listing files from Google Drive:", error.message);
    throw error;
  }
};
