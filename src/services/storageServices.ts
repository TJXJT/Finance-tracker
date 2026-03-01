import { supabase } from "../supabaseClient";

/**
 * Upload an image file to Supabase Storage
 * @param userId - ID of the current user
 * @param file - File object from input
 */
export const uploadImage = async (userId: string, file: File): Promise<string> => {
  // Generate a unique path for the file
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload file
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("inventory-images")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // Get public URL
  const { data } = supabase.storage
    .from("inventory-images")
    .getPublicUrl(filePath);

  // TypeScript sees `data` as { publicUrl: string }
  return data.publicUrl;
};