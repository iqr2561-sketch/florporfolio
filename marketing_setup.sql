-- ============================================
-- Tabla para elementos de Marketing
-- ============================================

-- Crear tabla de elementos de marketing
CREATE TABLE IF NOT EXISTS marketing_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_marketing_items_order ON marketing_items(order_index);
CREATE INDEX IF NOT EXISTS idx_marketing_items_created_at ON marketing_items(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_marketing_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en marketing_items
CREATE TRIGGER update_marketing_items_updated_at 
    BEFORE UPDATE ON marketing_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_marketing_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE marketing_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para marketing_items (lectura pública, escritura autenticada)
CREATE POLICY "Marketing items are viewable by everyone"
    ON marketing_items FOR SELECT
    USING (true);

CREATE POLICY "Marketing items are insertable by authenticated users"
    ON marketing_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Marketing items are updatable by authenticated users"
    ON marketing_items FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Marketing items are deletable by authenticated users"
    ON marketing_items FOR DELETE
    USING (true);

