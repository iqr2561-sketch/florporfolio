# Configuración de Variables de Entorno en Vercel

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las variables de entorno.

## Pasos para configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

### Variables requeridas:

```
VITE_SUPABASE_URL=https://vefngwmjlfxnbiabmymz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZm5nd21qbGZ4bmJpYWJteW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTk3ODAsImV4cCI6MjA3ODAzNTc4MH0.HA9bVtXXUcI_p3ULIIw0z7UpC3SezliEv-oJ2sj8OYM
VITE_SUPABASE_BUCKET_NAME=portfolio-media
```

### Configuración por ambiente

Puedes configurar estas variables para diferentes ambientes:
- **Production**: Para el despliegue en producción
- **Preview**: Para las preview deployments
- **Development**: Para desarrollo local (opcional)

### Después de agregar las variables

1. Ve a **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. Esto aplicará las nuevas variables de entorno

## Verificación

Después del redeploy, verifica que:
- ✅ La aplicación carga correctamente
- ✅ Los proyectos se muestran desde Supabase
- ✅ Puedes subir archivos desde el panel de administración
- ✅ Los archivos se almacenan en el bucket de Supabase

## Notas importantes

- Las variables que empiezan con `VITE_` son expuestas al cliente (frontend)
- No uses la `SUPABASE_SERVICE_ROLE_KEY` en el frontend (es solo para backend)
- El `VITE_SUPABASE_ANON_KEY` es seguro para usar en el frontend

