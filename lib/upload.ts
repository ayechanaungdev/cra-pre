import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

export async function uploadImage(uri: string, bucket: string, path: string) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = result.assets[0].base64;
      const contentType = 'image/jpeg';
      const fileName = `${path}_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, decode(base64), {
          contentType,
          upsert: true
        });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return publicUrl;
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
