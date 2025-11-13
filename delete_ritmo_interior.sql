-- ============================================
-- Script para eliminar el proyecto "Ritmo Interior"
-- Ejecutar este script en el SQL Editor de Supabase
-- ============================================

-- Paso 1: Buscar y eliminar el proyecto
-- Los archivos multimedia se eliminarán automáticamente por CASCADE
DELETE FROM projects
WHERE title = 'Ritmo Interior';

-- Paso 2: Verificar que se eliminó
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Proyecto eliminado exitosamente'
        ELSE '⚠️ El proyecto aún existe'
    END as resultado
FROM projects
WHERE title = 'Ritmo Interior';

-- NOTA IMPORTANTE: 
-- Los archivos del Storage de Supabase NO se eliminan automáticamente.
-- Debes eliminarlos manualmente desde el panel de Supabase:
-- 1. Ve a Storage > portfolio-media
-- 2. Busca la carpeta del proyecto (projects/{project_id}/)
-- 3. Elimina los archivos manualmente
