# ✅ Checklist de Configuración Final

## Base de Datos y Storage (Supabase)

### Paso 1: Ejecutar Scripts SQL
- [ ] Ir a Supabase Dashboard: https://supabase.com/dashboard
- [ ] Seleccionar tu proyecto
- [ ] Ir a **SQL Editor**
- [ ] Copiar y pegar el contenido de `database.sql`
- [ ] Ejecutar el script
- [ ] Verificar que las tablas `projects` y `project_media` se crearon
- [ ] Verificar que los 7 proyectos iniciales se insertaron

### Paso 2: Crear Bucket de Storage
**Opción A: Desde el Dashboard (Recomendado)**
- [ ] Ir a **Storage** en el menú lateral
- [ ] Clic en **New bucket**
- [ ] Nombre: `portfolio-media`
- [ ] Marcar como **Public bucket** ✅
- [ ] File size limit: 50 MB (o según necesites)
- [ ] Allowed MIME types: `image/*,video/*`
- [ ] Clic en **Create bucket**

**Opción B: Desde SQL Editor**
- [ ] Ejecutar el script `storage_setup.sql` en el SQL Editor

### Paso 3: Verificar Políticas
- [ ] Verificar que el bucket `portfolio-media` es público
- [ ] Verificar que las políticas de Storage están activas
- [ ] Probar subir un archivo de prueba desde el Dashboard

## Variables de Entorno (Vercel)

### Paso 4: Configurar Variables en Vercel
- [ ] Ir a Vercel Dashboard: https://vercel.com/dashboard
- [ ] Seleccionar tu proyecto `florporfolio`
- [ ] Ir a **Settings** → **Environment Variables**
- [ ] Agregar las siguientes variables:

```
VITE_SUPABASE_URL=https://vefngwmjlfxnbiabmymz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZm5nd21qbGZ4bmJpYWJteW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTk3ODAsImV4cCI6MjA3ODAzNTc4MH0.HA9bVtXXUcI_p3ULIIw0z7UpC3SezliEv-oJ2sj8OYM
VITE_SUPABASE_BUCKET_NAME=portfolio-media
```

- [ ] Seleccionar **Production**, **Preview** y **Development** para cada variable
- [ ] Guardar los cambios

### Paso 5: Redeploy en Vercel
- [ ] Ir a **Deployments**
- [ ] Clic en los tres puntos (⋯) del último deployment
- [ ] Seleccionar **Redeploy**
- [ ] Esperar a que el deployment se complete

## Verificación Final

### Paso 6: Probar la Aplicación
- [ ] Abrir la aplicación desplegada en Vercel
- [ ] Verificar que los proyectos se cargan correctamente
- [ ] Ir a la sección "Panel" (panel de administración)
- [ ] Probar subir una imagen a un proyecto
- [ ] Verificar que la imagen se muestra después de subirla
- [ ] Probar eliminar un archivo
- [ ] Verificar que el archivo se elimina correctamente

### Paso 7: Verificar en Supabase
- [ ] Ir a Supabase Dashboard → **Table Editor**
- [ ] Verificar que los proyectos están en la tabla `projects`
- [ ] Verificar que los archivos subidos aparecen en `project_media`
- [ ] Ir a **Storage** → `portfolio-media`
- [ ] Verificar que los archivos están almacenados correctamente

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu aplicación estará completamente integrada con Supabase y funcionando en producción.

## 📝 Notas

- Si encuentras errores, revisa la consola del navegador (F12)
- Los errores comunes suelen ser por variables de entorno no configuradas
- Asegúrate de que el bucket sea público para que las imágenes se muestren
- Las políticas RLS permiten escritura sin autenticación (puedes ajustarlas según necesites)

