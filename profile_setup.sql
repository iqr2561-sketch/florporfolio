-- ============================================
-- Tabla para configuración de perfil
-- ============================================

-- Crear tabla de configuración de perfil
CREATE TABLE IF NOT EXISTS profile_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Habilitar RLS
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Profile settings are viewable by everyone"
    ON profile_settings FOR SELECT
    USING (true);

CREATE POLICY "Profile settings are updatable by authenticated users"
    ON profile_settings FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Profile settings are insertable by authenticated users"
    ON profile_settings FOR INSERT
    WITH CHECK (true);

