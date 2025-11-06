import { supabase, type ProjectRow, type ProjectMediaRow } from './supabase';
import type { Project, UploadedFile } from '../types';

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET_NAME || 'portfolio-media';

// Convertir ProjectRow de Supabase a Project del frontend
const projectRowToProject = (row: ProjectRow, media: ProjectMediaRow[]): Project => {
  const uploadedFiles: UploadedFile[] = media.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    url: m.file_url,
  }));

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tools: row.tools,
    thumbnailUrl: row.thumbnail_url,
    externalUrl: row.external_url,
    media: uploadedFiles,
  };
};

// Obtener todos los proyectos con sus archivos multimedia
export const getProjects = async (): Promise<Project[]> => {
  try {
    // Obtener proyectos
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;
    if (!projects) return [];

    // Obtener todos los archivos multimedia
    const { data: media, error: mediaError } = await supabase
      .from('project_media')
      .select('*');

    if (mediaError) throw mediaError;

    // Agrupar media por project_id
    const mediaByProject = (media || []).reduce((acc, m) => {
      if (!acc[m.project_id]) acc[m.project_id] = [];
      acc[m.project_id].push(m);
      return acc;
    }, {} as Record<number, ProjectMediaRow[]>);

    // Combinar proyectos con sus archivos
    return projects.map(project => 
      projectRowToProject(project, mediaByProject[project.id] || [])
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (id: number): Promise<Project | null> => {
  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;
    if (!project) return null;

    const { data: media, error: mediaError } = await supabase
      .from('project_media')
      .select('*')
      .eq('project_id', id);

    if (mediaError) throw mediaError;

    return projectRowToProject(project, media || []);
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

// Actualizar un proyecto
export const updateProject = async (project: Partial<Project>): Promise<Project | null> => {
  try {
    const { id, media, ...projectData } = project;
    if (!id) throw new Error('Project ID is required');

    const updateData: Partial<ProjectRow> = {
      title: projectData.title,
      category: projectData.category,
      description: projectData.description,
      tools: projectData.tools,
      thumbnail_url: projectData.thumbnailUrl,
      external_url: projectData.externalUrl,
    };

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null;

    // Obtener media actualizado
    const { data: mediaData } = await supabase
      .from('project_media')
      .select('*')
      .eq('project_id', id);

    return projectRowToProject(data, mediaData || []);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Subir un archivo a Supabase Storage
export const uploadFile = async (
  file: File,
  projectId: number
): Promise<UploadedFile | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;
    if (!uploadData) return null;

    // Obtener URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Guardar referencia en la base de datos
    const mediaData: Omit<ProjectMediaRow, 'id' | 'created_at'> = {
      project_id: projectId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      file_path: filePath,
      file_url: publicUrl,
    };

    const { data: mediaRow, error: dbError } = await supabase
      .from('project_media')
      .insert(mediaData)
      .select()
      .single();

    if (dbError) throw dbError;
    if (!mediaRow) return null;

    return {
      id: mediaRow.id,
      name: mediaRow.name,
      type: mediaRow.type,
      url: mediaRow.file_url,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Obtener imagen de perfil
export const getProfileImage = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profile_settings')
      .select('profile_image_url')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data?.profile_image_url || null;
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return null;
  }
};

// Subir imagen de perfil
export const uploadProfileImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    // Eliminar imagen anterior si existe
    const { data: oldData } = await supabase
      .from('profile_settings')
      .select('profile_image_url')
      .single();

    if (oldData?.profile_image_url) {
      const oldUrlParts = oldData.profile_image_url.split('/');
      const bucketIndex = oldUrlParts.findIndex(part => part === 'public');
      if (bucketIndex !== -1) {
        const oldFilePath = oldUrlParts.slice(bucketIndex + 1).join('/');
        await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
      }
    }

    // Subir nueva imagen
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;
    if (!uploadData) return null;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Guardar en la base de datos
    const { error: dbError } = await supabase
      .from('profile_settings')
      .upsert({ 
        id: 1, 
        profile_image_url: publicUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (dbError) throw dbError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Eliminar un archivo
export const deleteFile = async (fileId: string, filePath?: string): Promise<boolean> => {
  try {
    // Si no se proporciona filePath, obtenerlo de la base de datos
    let actualFilePath = filePath;
    
    if (!actualFilePath) {
      const { data: media, error: fetchError } = await supabase
        .from('project_media')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;
      if (!media) throw new Error('File not found in database');
      
      actualFilePath = media.file_path;
    }

    // Eliminar de Storage
    if (actualFilePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([actualFilePath]);

      if (storageError) {
        console.warn('Error deleting from storage (continuing):', storageError);
        // Continuamos aunque falle el storage, para eliminar de la BD
      }
    }

    // Eliminar de la base de datos
    const { error: dbError } = await supabase
      .from('project_media')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

