import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  await mongooseConnect(); 
  await isAdminRequest (req, res); 

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log('Files:', files.file.length);

  const links = [];
  for (const file of files.file) {
    const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
      public_id: `${Date.now()}`, // Use a timestamp for the public ID to avoid conflicts
    });
    links.push(uploadResult.secure_url);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
