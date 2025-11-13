// Script para eliminar el proyecto "Ritmo Interior"
// Ejecutar con: npx tsx delete_project_script.ts

import { deleteProjectByTitle } from './lib/projectsService.ts';

async function main() {
  try {
    console.log('Buscando proyecto "Ritmo Interior"...');
    const deleted = await deleteProjectByTitle('Ritmo Interior');
    
    if (deleted) {
      console.log('✅ Proyecto "Ritmo Interior" eliminado exitosamente');
      console.log('   - Proyecto eliminado de la base de datos');
      console.log('   - Archivos multimedia eliminados del storage');
    } else {
      console.log('❌ No se pudo eliminar el proyecto');
    }
  } catch (error) {
    console.error('❌ Error al eliminar el proyecto:', error);
    process.exit(1);
  }
}

main();

