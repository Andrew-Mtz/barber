import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dmusin0l0',
  api_key: '248116635722344',
  api_secret: 'S9FydhonFZu4hgimuElVNLz8WOA'
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