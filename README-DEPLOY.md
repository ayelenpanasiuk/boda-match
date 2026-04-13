# 💍 Boda Match · Guía de deploy paso a paso
### A&A · 26/09/2026

---

## ¿Qué vas a lograr?

Al terminar esta guía tenés un link tipo  
`https://boda-match-aa.vercel.app`  
que mandás al grupo de WhatsApp y **cualquier invitado lo abre en el celu sin instalar nada**.

---

## PARTE 1 · Configurar Supabase (la base de datos)
*~10 minutos · gratis*

### Paso 1 — Crear cuenta
1. Entrá a **https://supabase.com**
2. Click en **"Start your project"** → registrate con Google o email

### Paso 2 — Crear proyecto
1. Click en **"New project"**
2. Nombre: `boda-match`
3. Región: **South America (São Paulo)**  ← importante para velocidad
4. Contraseña: cualquiera (guardala por las dudas)
5. Click **"Create new project"** → esperá ~2 minutos

### Paso 3 — Crear las tablas
1. En el menú izquierdo click en **"SQL Editor"**
2. Click en **"New query"**
3. Abrí el archivo `supabase-schema.sql` con el Bloc de Notas
4. Seleccioná todo el texto (Ctrl+A) → copialo (Ctrl+C)
5. Pegalo en Supabase (Ctrl+V)
6. Click en **"Run"** (botón verde)
7. Tiene que decir **"Success. No rows returned"** ✅

### Paso 4 — Copiar las credenciales
1. En el menú izquierdo click en **"Settings"** (ícono de engranaje)
2. Click en **"API"**
3. Copiá y guardá en un bloc de notas:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public** → cadena larga que empieza con `eyJ...`

### Paso 5 — Crear el archivo .env
1. Dentro de la carpeta `boda-match`, buscá el archivo `.env.example`
2. Copialo y renombrá la copia como `.env` (sin el `.example`)
3. Abrilo con el Bloc de Notas
4. Reemplazá los valores:

```
VITE_SUPABASE_URL=https://TU_URL_REAL.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_REAL
```

5. Guardá el archivo

---

## PARTE 2 · Publicar en Vercel
*~5 minutos · gratis*

### Paso 6 — Subir el código a GitHub
1. Entrá a **https://github.com** → creá una cuenta gratis si no tenés
2. Click en **"New repository"** (botón verde)
3. Nombre: `boda-match` · Visibilidad: **Private** · Click **"Create repository"**
4. En la página que aparece, click en **"uploading an existing file"**
5. Arrastrá **toda la carpeta** `boda-match` al área que dice "Drag files here"
6. Click **"Commit changes"** (botón verde abajo)

### Paso 7 — Conectar con Vercel
1. Entrá a **https://vercel.com** → registrate con GitHub (mismo mail)
2. Click en **"Add New Project"**
3. Buscá tu repositorio `boda-match` → click **"Import"**

### Paso 8 — Configurar variables de entorno
En la pantalla de configuración de Vercel, **antes de hacer deploy**:
1. Abrí la sección **"Environment Variables"**
2. Agregá las dos variables:

| Nombre | Valor |
|--------|-------|
| `VITE_SUPABASE_URL` | tu Project URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | tu anon key de Supabase |

3. Click **"Deploy"**

### Paso 9 — ¡Listo! 🎉
En ~2 minutos Vercel te da un link como:
```
https://boda-match-aa.vercel.app
```

**Ese es el link que mandás a los invitados.** Nada más.

---

## Cómo funciona para los invitados

```
Invitado recibe el link por WhatsApp
       ↓
Abre el link en el celu (Safari / Chrome)
       ↓
Ve la pantalla de bienvenida con A&A
       ↓
Tutorial rápido de 4 pasos
       ↓
Crea su perfil (foto + datos)
       ↓
Empieza a swipear entre los invitados
       ↓
Si hay match → se desbloquea el Instagram
       ↓
🎉 El resto es entre ellos
```

---

## Preguntas frecuentes

**¿Funciona en iPhone y Android?**  
Sí, en cualquier celular moderno con Chrome o Safari.

**¿Los invitados tienen que instalar algo?**  
No. Solo abren el link en el navegador.

**¿Qué pasa si no configuro Supabase?**  
La app igual funciona, pero cada invitado solo ve los 15 perfiles demo. Los matches entre personas reales no funcionan.

**¿Cuántos invitados puede manejar?**  
El plan gratuito de Supabase aguanta perfectamente 200–500 invitados.

**¿Cómo actualizo algo después del deploy?**  
Modificás el archivo, lo subís de nuevo a GitHub, y Vercel se actualiza solo en 1 minuto.

**¿Los datos son privados?**  
Solo quienes tengan el link pueden ver los perfiles. Para más privacidad podés agregar una contraseña simple en el futuro.

---

## Estructura del proyecto

```
boda-match/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          ← Pantalla de bienvenida A&A
│   │   ├── Onboarding.jsx    ← Tutorial de 4 pasos
│   │   ├── CrearPerfil.jsx   ← Formulario en 3 pasos con foto
│   │   ├── Feed.jsx          ← Feed de swipe (la principal)
│   │   ├── Matches.jsx       ← Tus matches y favoritos
│   │   └── Final.jsx         ← Pantalla de cierre
│   ├── components/
│   │   ├── SwipeCard.jsx     ← Carta con swipe táctil real
│   │   ├── MatchScreen.jsx   ← ¡Match! con confetti
│   │   └── Shared.jsx        ← Logo, partículas, confetti
│   ├── hooks/
│   │   └── useApp.jsx        ← Estado global (matches, likes...)
│   ├── data/
│   │   └── profiles.js       ← 15 perfiles demo divertidos
│   └── lib/
│       └── supabase.js       ← Conexión a la base de datos
├── supabase-schema.sql        ← SQL para crear las tablas
├── .env.example               ← Template de credenciales
└── README-DEPLOY.md           ← Esta guía
```

---

*Hecho con amor para A&A · 26/09/2026 💍*  
*Después no digas que no te ayudamos 😏*
