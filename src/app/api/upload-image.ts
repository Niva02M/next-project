import cloudinary from 'lib/coudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb' // allow up to 5MB images
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image } = req.body; // this should be a Base64-encoded image

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'user_profiles' // optional folder name
    });

    return res.status(200).json({
      url: uploadResponse.secure_url
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
}
