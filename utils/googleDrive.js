import { google } from 'googleapis';
import { Readable } from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export const getDriveService = (refreshToken) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

export const createFolderIfNotExist = async (drive, folderName) => {
  const response = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  return folder.data.id;
};

export const uploadFileToDrive = async (drive, folderId, fileName, base64Data, mimeType) => {
  // Remove the data aspect of the base64 string
  const base64Content = base64Data.split(';base64,').pop();
  const buffer = Buffer.from(base64Content, 'base64');

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: readableStreamFromBuffer(buffer),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  // Make the file readable by anyone with the link
  await drive.permissions.create({
    fileId: file.data.id,
    resource: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return file.data;
};

export const uploadImageToDrive = async (drive, folderId, fileName, base64Data) => {
  return uploadFileToDrive(drive, folderId, fileName, base64Data, 'image/jpeg');
};

// Helper to convert buffer to readable stream for googleapis
function readableStreamFromBuffer(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export const deleteFileFromDrive = async (drive, fileId) => {
  try {
    await drive.files.delete({ fileId: fileId });
    return true;
  } catch (error) {
    console.error('Error deleting file from Drive:', error);
    return false;
  }
};
