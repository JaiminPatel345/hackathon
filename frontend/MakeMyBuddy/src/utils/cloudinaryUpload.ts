import Constants from 'expo-constants';

// Get the values from .env via Expo's Constants manifest
const EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME =  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET =  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  
  try {
    // Create form data for upload
    const formData = new FormData();
    
    // Convert the image uri to a file
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    // @ts-ignore
    formData.append('file', {
      uri,
      name: filename,
      type,
    });
    
    formData.append('upload_preset', EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    // Upload to Cloudinary
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
}; 