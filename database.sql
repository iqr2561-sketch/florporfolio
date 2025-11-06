-- ============================================
-- Base de datos para Portfolio de Florencia
-- ============================================

-- 1. Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    tools TEXT[] DEFAULT '{}',
    thumbnail_url TEXT NOT NULL,
    external_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de archivos multimedia
CREATE TABLE IF NOT EXISTS project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 4. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger para actualizar updated_at en projects
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para projects (lectura pública, escritura autenticada)
CREATE POLICY "Projects are viewable by everyone"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Projects are insertable by authenticated users"
    ON projects FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Projects are updatable by authenticated users"
    ON projects FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Projects are deletable by authenticated users"
    ON projects FOR DELETE
    USING (true);

-- 8. Políticas RLS para project_media (lectura pública, escritura autenticada)
CREATE POLICY "Project media is viewable by everyone"
    ON project_media FOR SELECT
    USING (true);

CREATE POLICY "Project media is insertable by authenticated users"
    ON project_media FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Project media is updatable by authenticated users"
    ON project_media FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Project media is deletable by authenticated users"
    ON project_media FOR DELETE
    USING (true);

-- 9. Insertar proyectos iniciales
INSERT INTO projects (id, title, category, description, tools, thumbnail_url, external_url) VALUES
(1, 'Cortometraje "Amanecer"', 'Video', 'Pieza audiovisual experimental que explora la relación entre la luz y la melancolía.', 
 ARRAY['Adobe Premiere Pro', 'DaVinci Resolve', 'Canon EOS R5'], 
 'https://picsum.photos/seed/amanecer/600/400', '#'),
(2, 'Fotografía de Producto "Esencia"', 'Fotografía', 'Serie fotográfica para una marca de cosméticos naturales, enfocada en la textura y la calidez.', 
 ARRAY['Adobe Photoshop', 'Lightroom', 'Sony A7III'], 
 'https://picsum.photos/seed/esencia/600/400', '#'),
(3, 'Diseño Sonoro "Ciudad Latente"', 'Sonido', 'Composición sonora que captura el pulso de la ciudad durante la noche.', 
 ARRAY['Ableton Live', 'Pro Tools', 'Zoom H6'], 
 'https://picsum.photos/seed/ciudad/600/400', '#'),
(4, 'Video Institucional "Innovar"', 'Video', 'Producción para una startup tecnológica, comunicando su visión y valores de forma dinámica.', 
 ARRAY['Adobe After Effects', 'Premiere Pro'], 
 'https://picsum.photos/seed/innovar/600/400', '#'),
(5, 'Videoclip "Ritmo Interior"', 'Video', 'Dirección y montaje para el videoclip de un artista emergente, con foco en el storytelling visual.', 
 ARRAY['Final Cut Pro', 'DaVinci Resolve'], 
 'https://picsum.photos/seed/ritmo/600/400', '#'),
(6, 'Instalación Audiovisual "Memorias"', 'Instalación', 'Proyecto inmersivo que combina video proyecciones y sonido envolvente.', 
 ARRAY['TouchDesigner', 'Resolume Arena', 'Ableton Live'], 
 'https://picsum.photos/seed/memorias/600/400', '#'),
(7, 'Flyer Evento Musical', 'Flyers', 'Diseño de flyer para festival de música indie, enfocado en una estética vibrante y juvenil.', 
 ARRAY['Adobe Illustrator', 'Adobe Photoshop'], 
 'https://picsum.photos/seed/flyer1/600/400', '#')
ON CONFLICT (id) DO NOTHING;

-- 10. Resetear la secuencia de IDs para que continúe desde 8
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- ============================================
-- STORAGE: Crear bucket para archivos multimedia
-- ============================================
-- NOTA: Este comando debe ejecutarse en el SQL Editor de Supabase
-- o a través de la API de Storage

-- Crear el bucket 'portfolio-media' (ejecutar en Supabase Dashboard > Storage)
-- O usar la función de Supabase para crear el bucket programáticamente

-- Configuración recomendada del bucket:
-- - Nombre: portfolio-media
-- - Público: Sí (para que las imágenes sean accesibles)
-- - Tamaño máximo de archivo: 50MB (o según tus necesidades)
-- - Tipos de archivo permitidos: image/*, video/*

-- ============================================
-- POLÍTICAS DE STORAGE (ejecutar después de crear el bucket)
-- ============================================

-- Permitir lectura pública del bucket
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('portfolio-media', 'portfolio-media', true)
-- ON CONFLICT (id) DO NOTHING;

-- Política para permitir lectura pública
-- CREATE POLICY "Public Access"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'portfolio-media');

-- Política para permitir subida de archivos (autenticados)
-- CREATE POLICY "Authenticated users can upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- Política para permitir actualización de archivos (autenticados)
-- CREATE POLICY "Authenticated users can update"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- Política para permitir eliminación de archivos (autenticados)
-- CREATE POLICY "Authenticated users can delete"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

