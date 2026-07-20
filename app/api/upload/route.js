import { google } from 'googleapis';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const maxDuration = 60;

function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return Response.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || undefined;

    const uploaded = [];
    for (const file of files) {
      if (!file.type || !file.type.startsWith('image/')) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      const res = await drive.files.create({
        requestBody: {
          name: file.name || `foto-${Date.now()}.jpg`,
          parents: folderId ? [folderId] : undefined,
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields: 'id, name',
      });

      uploaded.push(res.data.name);
    }

    if (uploaded.length === 0) {
      return Response.json({ error: 'Geçerli bir resim dosyası bulunamadı' }, { status: 400 });
    }

    return Response.json({ success: true, uploaded });
  } catch (err) {
    console.error('Drive yükleme hatası:', err);
    return Response.json({ error: 'Yükleme başarısız oldu' }, { status: 500 });
  }
}
