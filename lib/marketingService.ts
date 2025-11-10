import { supabase } from './supabase';
import type { MarketingItem } from '../types.ts';

// Obtener todos los elementos de marketing
export const getMarketingItems = async (): Promise<MarketingItem[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching marketing items:', error);
    throw error;
  }
};

// Crear un nuevo elemento de marketing
export const createMarketingItem = async (
  title: string,
  description: string,
  imageUrl: string
): Promise<MarketingItem | null> => {
  try {
    // Obtener el máximo order_index para agregar al final
    const { data: existingItems } = await supabase
      .from('marketing_items')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    const maxOrder = existingItems && existingItems.length > 0 
      ? existingItems[0].order_index + 1 
      : 0;

    const { data, error } = await supabase
      .from('marketing_items')
      .insert({
        title,
        description,
        image_url: imageUrl,
        order_index: maxOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating marketing item:', error);
    throw error;
  }
};

// Actualizar un elemento de marketing
export const updateMarketingItem = async (
  id: number,
  updates: Partial<MarketingItem>
): Promise<MarketingItem | null> => {
  try {
    const { data, error } = await supabase
      .from('marketing_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating marketing item:', error);
    throw error;
  }
};

// Eliminar un elemento de marketing
export const deleteMarketingItem = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('marketing_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting marketing item:', error);
    throw error;
  }
};

// Subir imagen de marketing
export const uploadMarketingImage = async (
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `marketing-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `marketing/${fileName}`;

    const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET_NAME || 'portfolio-media';

    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;
    if (!uploadData) return null;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading marketing image:', error);
    throw error;
  }
};

