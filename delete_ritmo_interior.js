// Script para eliminar el proyecto "Ritmo Interior"
// Ejecutar con: node delete_ritmo_interior.js
// Requiere que las variables de entorno estén configuradas

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const bucketName = process.env.VITE_SUPABASE_BUCKET_NAME || 'portfolio-media';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteProject() {
  try {
    console.log('🔍 Buscando proyecto "Ritmo Interior"...');
    
    // Buscar el proyecto
    const { data: project, error: findError } = await supabase
      .from('projects')
      .select('id')
      .eq('title', 'Ritmo Interior')
      .single();

    if (findError || !project) {
      console.error('❌ Proyecto "Ritmo Interior" no encontrado');
      console.error('Error:', findError);
      return;
    }

    console.log(`✅ Proyecto encontrado con ID: ${project.id}`);

    // Obtener todos los archivos multimedia del proyecto
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('project_media')
      .select('file_path')
      .eq('project_id', project.id);

    if (mediaError) {
      console.warn('⚠️  Error al obtener archivos multimedia:', mediaError);
    }

    // Eliminar archivos del storage
    if (mediaFiles && mediaFiles.length > 0) {
      const filePaths = mediaFiles.map(m => m.file_path).filter(Boolean);
      console.log(`📁 Eliminando ${filePaths.length} archivo(s) del storage...`);
      
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

      if (storageError) {
        console.warn('⚠️  Error al eliminar archivos del storage:', storageError);
        console.warn('   Continuando con la eliminación de la base de datos...');
      } else {
        console.log('✅ Archivos eliminados del storage');
      }
    }

    // Eliminar el proyecto (los archivos multimedia se eliminarán automáticamente por CASCADE)
    console.log('🗑️  Eliminando proyecto de la base de datos...');
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (projectError) {
      console.error('❌ Error al eliminar el proyecto:', projectError);
      return;
    }

    console.log('✅ Proyecto "Ritmo Interior" eliminado exitosamente');
    console.log('   - Proyecto eliminado de la base de datos');
    console.log('   - Archivos multimedia eliminados automáticamente por CASCADE');
    if (mediaFiles && mediaFiles.length > 0) {
      console.log(`   - ${mediaFiles.length} archivo(s) eliminado(s) del storage`);
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

deleteProject();

