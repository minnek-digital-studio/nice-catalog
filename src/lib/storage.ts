import { supabase } from './supabase';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

async function validateImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('File size must be less than 2MB');
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid image type. Allowed types: JPG, PNG, GIF, WebP');
  }

  return true;
}

async function generateUniqueFileName(file: File): Promise<string> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}

async function uploadImage(file: File, bucket: string, folder: string): Promise<string> {
  try {
    // Validate the image
    await validateImage(file);

    // Generate a unique file name
    const fileName = await generateUniqueFileName(file);
    const filePath = `${folder}/${fileName}`;

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    if (!data?.path) {
      throw new Error('No file path returned from upload');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, 'products', 'product-images');
}

export async function uploadBrandLogo(file: File): Promise<string> {
  return uploadImage(file, 'brands', 'brand-logos');
}

export async function uploadProfileLogo(file: File): Promise<string> {
  return uploadImage(file, 'profiles', 'profile-logos');
}

export async function deleteImage(url: string, bucket: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
    
    if (!pathMatch?.[1]) {
      throw new Error('Invalid image URL format');
    }

    const filePath = decodeURIComponent(pathMatch[1]);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
}

export async function deleteProductImage(url: string): Promise<void> {
  return deleteImage(url, 'products');
}

export async function deleteBrandLogo(url: string): Promise<void> {
  return deleteImage(url, 'brands');
}

export async function deleteProfileLogo(url: string): Promise<void> {
  return deleteImage(url, 'profiles');
}

export function getImageUrl(path: string, bucket: string): string {
  if (!path) return '';
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return '';
  }
}