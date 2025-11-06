-- ============================================
-- Configuración de Storage para portfolio-media
-- ============================================
-- Ejecutar este script DESPUÉS de crear el bucket desde el Dashboard
-- o usar este script si prefieres crearlo desde SQL

-- 1. Crear el bucket (si no lo creaste desde el Dashboard)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50 MB en bytes (ajusta según necesites)
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Eliminar políticas existentes si las hay (opcional, para empezar limpio)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- 3. Política para lectura pública (cualquiera puede ver los archivos)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

-- 4. Política para subida de archivos (público - ajusta según tus necesidades)
-- Si quieres que solo usuarios autenticados puedan subir, descomenta la siguiente sección
-- y comenta esta política

-- Opción A: Cualquiera puede subir (útil para desarrollo/admin panel)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

-- Opción B: Solo autenticados pueden subir (descomenta si prefieres esto)
-- CREATE POLICY "Authenticated users can upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- 5. Política para actualización de archivos
CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');

-- Opción con autenticación (descomenta si prefieres):
-- CREATE POLICY "Authenticated users can update"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated')
-- WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- 6. Política para eliminación de archivos
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');

-- Opción con autenticación (descomenta si prefieres):
-- CREATE POLICY "Authenticated users can delete"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- ============================================
-- Verificación
-- ============================================
-- Verifica que el bucket se creó correctamente:
-- SELECT * FROM storage.buckets WHERE id = 'portfolio-media';

-- Verifica las políticas creadas:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%portfolio%';

