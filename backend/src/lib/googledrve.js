import { google } from "googleapis";
import fs from "fs";

const CLIENT_ID =
  "23584416504-8pa46bkhrhl9nohgndgd1grn9ptisuen.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:5173";
const REFRESH_TOKEN =
  "1//0gZ5qiyv4GOdaCgYIARAAGBASNwF-L9IrT_XfISjosSe4KxuIuUyRdGNmnNxDATnDHNUZPdFVnSEQJN51t4Ga9aEis25sm1EBAhw";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export const uploadFile = async (filePath, fileName) => {
  const fileMetadata = {
    name: fileName,
    parents: ["YOUR_GOOGLE_DRIVE_FOLDER_ID"] // Optional: Specify a folder in Drive
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
    return response.data.files;
  } catch (error) {
    console.error("Error listing files from Google Drive:", error.message);
    throw error;
  }
};
