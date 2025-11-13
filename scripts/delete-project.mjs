// Script para eliminar el proyecto "Ritmo Interior"
// Ejecutar con: node scripts/delete-project.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno del archivo .env
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(__dirname, '../.env'), 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
    return env;
  } catch (error) {
    console.warn('No se encontró archivo .env, usando variables de entorno del sistema');
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const bucketName = env.VITE_SUPABASE_BUCKET_NAME || process.env.VITE_SUPABASE_BUCKET_NAME || 'portfolio-media';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configuradas');
  console.error('   Crea un archivo .env en la raíz del proyecto con:');
  console.error('   VITE_SUPABASE_URL=tu_url');
  console.error('   VITE_SUPABASE_ANON_KEY=tu_key');
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
      if (findError) console.error('   Error:', findError.message);
      return;
    }

    console.log(`✅ Proyecto encontrado con ID: ${project.id}`);

    // Obtener todos los archivos multimedia del proyecto
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('project_media')
      .select('file_path')
      .eq('project_id', project.id);

    if (mediaError) {
      console.warn('⚠️  Error al obtener archivos multimedia:', mediaError.message);
    }

    // Eliminar archivos del storage
    if (mediaFiles && mediaFiles.length > 0) {
      const filePaths = mediaFiles.map(m => m.file_path).filter(Boolean);
      console.log(`📁 Eliminando ${filePaths.length} archivo(s) del storage...`);
      
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

      if (storageError) {
        console.warn('⚠️  Error al eliminar archivos del storage:', storageError.message);
        console.warn('   Continuando con la eliminación de la base de datos...');
      } else {
        console.log('✅ Archivos eliminados del storage');
      }
    } else {
      console.log('ℹ️  No se encontraron archivos multimedia asociados');
    }

    // Eliminar el proyecto (los archivos multimedia se eliminarán automáticamente por CASCADE)
    console.log('🗑️  Eliminando proyecto de la base de datos...');
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (projectError) {
      console.error('❌ Error al eliminar el proyecto:', projectError.message);
      return;
    }

    console.log('\n✅ Proyecto "Ritmo Interior" eliminado exitosamente');
    console.log('   ✓ Proyecto eliminado de la base de datos');
    console.log('   ✓ Archivos multimedia eliminados automáticamente por CASCADE');
    if (mediaFiles && mediaFiles.length > 0) {
      console.log(`   ✓ ${mediaFiles.length} archivo(s) eliminado(s) del storage`);
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

deleteProject();

