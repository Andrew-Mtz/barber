import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv'
config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const uploadBarberImage = async filePath => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'barbers',
    transformation: [
      { width: 330, height: 450, crop: 'fill' }
    ]
  });
}

export const deleteBarberImage = async id => {
  return await cloudinary.uploader.destroy(id);
}

export const uploadHaircutsImage = async filePath => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'Haircuts',
    transformation: [
      { width: 330, height: 450, crop: 'fill' }
    ]
  });
}

export const deleteHaircutImage = async id => {
  return await cloudinary.uploader.destroy(id);
}

export const uploadHaircutByBarberImage = async (filePath, barberName) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: `HCbyBarbers/${barberName}`
  });
}

export const deleteHaircutByBarberImage = async id => {
  return await cloudinary.uploader.destroy(id);
}