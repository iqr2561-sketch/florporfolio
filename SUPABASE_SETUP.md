# Configuración de Supabase para el Portfolio

## Pasos para configurar Supabase

### 1. Ejecutar el SQL de la base de datos

1. Ve a tu proyecto en Supabase Dashboard: https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `database.sql`
4. Ejecuta el script completo

### 2. Crear el bucket de almacenamiento

#### Opción A: Desde el Dashboard (Recomendado)

1. Ve a **Storage** en el menú lateral
2. Haz clic en **New bucket**
3. Configura el bucket:
   - **Name**: `portfolio-media`
   - **Public bucket**: ✅ Activado (para que las imágenes sean accesibles públicamente)
   - **File size limit**: 50 MB (o según tus necesidades)
   - **Allowed MIME types**: `image/*,video/*`
4. Haz clic en **Create bucket**

#### Opción B: Desde SQL Editor

Ejecuta este comando en el SQL Editor:

```sql
-- Crear el bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50 MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
-- Lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

-- Subida de archivos (puedes ajustar según tus necesidades de autenticación)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

-- Actualización de archivos
CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media');

-- Eliminación de archivos
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=https://vefngwmjlfxnbiabmymz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZm5nd21qbGZ4bmJpYWJteW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTk3ODAsImV4cCI6MjA3ODAzNTc4MH0.HA9bVtXXUcI_p3ULIIw0z7UpC3SezliEv-oJ2sj8OYM
VITE_SUPABASE_BUCKET_NAME=portfolio-media
```

**Importante**: Para Vercel, también necesitas agregar estas variables en:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las mismas variables con el prefijo `VITE_`

### 4. Verificar la configuración

Después de ejecutar el SQL y crear el bucket, verifica que:

- ✅ La tabla `projects` existe y tiene los 7 proyectos iniciales
- ✅ La tabla `project_media` existe
- ✅ El bucket `portfolio-media` está creado y es público
- ✅ Las políticas RLS están activas
- ✅ Las políticas de Storage están configuradas

### 5. Estructura de la base de datos

#### Tabla: `projects`
- `id`: SERIAL (Primary Key)
- `title`: TEXT
- `category`: TEXT
- `description`: TEXT
- `tools`: TEXT[] (array de herramientas)
- `thumbnail_url`: TEXT
- `external_url`: TEXT (nullable)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### Tabla: `project_media`
- `id`: UUID (Primary Key)
- `project_id`: INTEGER (Foreign Key → projects.id)
- `name`: TEXT
- `type`: TEXT ('image' o 'video')
- `file_path`: TEXT (ruta en storage)
- `file_url`: TEXT (URL pública)
- `created_at`: TIMESTAMP

### Notas importantes

- El bucket `portfolio-media` debe ser público para que las imágenes se muestren en el frontend
- Las políticas RLS permiten lectura pública pero escritura requiere autenticación (puedes ajustar según tus necesidades)
- Los archivos se almacenarán en: `portfolio-media/projects/{project_id}/{filename}`
- El tamaño máximo de archivo por defecto es 50MB, puedes ajustarlo según tus necesidades

