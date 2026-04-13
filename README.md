# 💍 Boda Match · A&A · 26/09/2026

> El Tinder de la boda. Deslizá con responsabilidad 😏

---

## ¿Qué es esto?

Una web app mobile-first para que los invitados a la boda de A&A puedan hacer match entre ellos. Inspirada en Tinder, con estilo elegante y tono argentino. Funciona en el celular desde un link, sin instalar nada.

---

## 🚀 Cómo correrlo (paso a paso, sin conocimientos técnicos)

### Paso 1 · Instalá Node.js (si no lo tenés)

1. Entrá a [nodejs.org](https://nodejs.org)
2. Descargá la versión **LTS** (la recomendada)
3. Instalala como cualquier programa

Para verificar que quedó instalado, abrí la terminal y escribí:
```
node -v
```
Debería mostrarte un número como `v20.0.0`.

---

### Paso 2 · Descargá el proyecto

Descomprimí el archivo del proyecto en una carpeta. Por ejemplo: `Documents/boda-match`.

---

### Paso 3 · Instalá las dependencias

Abrí la terminal, navegá a la carpeta del proyecto y ejecutá:

```bash
cd ruta/a/boda-match
npm install
```

Esto descarga todas las librerías necesarias. Tarda 1-2 minutos.

---

### Paso 4 · Configurá Supabase (la base de datos)

#### 4a. Crear cuenta en Supabase
1. Entrá a [supabase.com](https://supabase.com)
2. Hacé click en **"Start your project"**
3. Registrate con GitHub o email (gratis)

#### 4b. Crear un proyecto
1. Click en **"New Project"**
2. Poné un nombre: `boda-match`
3. Elegí una región: **South America (São Paulo)**
4. Creá una contraseña (guardala)
5. Click **"Create new project"** → esperá ~2 minutos

#### 4c. Crear las tablas
1. En el panel de Supabase, andá a **SQL Editor** (ícono de base de datos)
2. Click en **"New query"**
3. Copiá todo el contenido de `supabase-schema.sql` y pegalo
4. Click **"Run"** (o Ctrl+Enter)
5. Debería decir "Success" ✅

#### 4d. Obtener las credenciales
1. Andá a **Settings** → **API** (en el menú izquierdo)
2. Copiá:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **anon public key**: una cadena larga de texto

#### 4e. Crear el archivo .env
1. En la carpeta del proyecto, copiá el archivo `.env.example`
2. Renombralo a `.env`
3. Abrilo con un editor de texto (Notepad, TextEdit, VS Code)
4. Reemplazá los valores:

```
VITE_SUPABASE_URL=https://TU_URL_REAL.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_REAL_AQUI
```

---

### Paso 5 · Correr en modo desarrollo (local)

```bash
npm run dev
```

Se abre en `http://localhost:5173`. Abrilo en el navegador. ✅

> **Tip:** Para probarlo en tu celular, conectate a la misma red WiFi y usá la IP que aparece en la terminal (algo como `http://192.168.1.X:5173`)

---

### Paso 6 · Publicar online para la boda (Vercel)

#### 6a. Subir el código a GitHub
1. Creá una cuenta en [github.com](https://github.com) (gratis)
2. Creá un repositorio nuevo (privado)
3. Subí la carpeta del proyecto

#### 6b. Conectar con Vercel
1. Entrá a [vercel.com](https://vercel.com) y registrate con GitHub
2. Click en **"New Project"**
3. Seleccioná tu repositorio de GitHub
4. En **Environment Variables**, agregá:
   - `VITE_SUPABASE_URL` → tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → tu clave de Supabase
5. Click **"Deploy"**

En 2 minutos tenés un link tipo:
```
https://boda-match-aa.vercel.app
```

¡Ese link lo mandás por el grupo de la boda! 🎉

---

## 📱 Cómo funciona la app

### Pantallas

| Pantalla | Descripción |
|----------|-------------|
| 🏠 **Home** | Bienvenida con las iniciales A&A |
| 📖 **Onboarding** | Tutorial de 4 pasos: cómo swipear |
| 👤 **Crear perfil** | Formulario en 3 pasos con foto |
| 💘 **Feed** | Las cartas tipo Tinder para swipear |
| 💕 **Matches** | Tus matches y favoritos |
| 🎊 **Final** | Pantalla de cierre |

### Cómo funciona el match
- Perfil A le da like al perfil B
- Perfil B le da like al perfil A
- → ¡Match! Se desbloquea el Instagram (y WhatsApp opcional)

### Modo demo (sin Supabase)
Si no configurás Supabase, la app funciona igual pero:
- Los perfiles de otros invitados no aparecen (solo los 15 falsos de ejemplo)
- Los matches son simulados (50% de probabilidad al dar like)
- Todo se guarda en el celular del usuario

---

## 🛠️ Estructura del proyecto

```
boda-match/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── MatchScreen.jsx   # Pantalla de ¡Match! con confetti
│   │   ├── Particles.jsx     # Emojis flotantes de fondo
│   │   ├── SwipeCard.jsx     # Carta con swipe táctil
│   │   └── WeddingLogo.jsx   # Logo A&A
│   ├── data/
│   │   └── profiles.js       # 15 perfiles demo + badges + signos
│   ├── hooks/
│   │   └── useApp.jsx        # Estado global de la app
│   ├── lib/
│   │   └── supabase.js       # Conexión a la base de datos
│   ├── pages/
│   │   ├── Home.jsx          # Landing pública
│   │   ├── Onboarding.jsx    # Tutorial interactivo
│   │   ├── CrearPerfil.jsx   # Formulario en 3 pasos
│   │   ├── Feed.jsx          # Feed de swipe
│   │   ├── Matches.jsx       # Matches y favoritos
│   │   └── Final.jsx         # Pantalla final
│   ├── App.jsx               # Router principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globales + animaciones
├── supabase-schema.sql        # SQL para crear las tablas
├── .env.example               # Template de variables de entorno
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎨 Diseño

- **Tipografías:** Playfair Display (títulos) · DM Sans (cuerpo) · Dancing Script (script)
- **Colores:** Bordo/vino `#6B1530` · Champagne `#F5E6D3` · Dorado `#C9A96E`
- **Fondo:** Negro profundo con gradiente oscuro
- **Animaciones:** Swipe táctil, confetti en match, partículas flotantes

---

## ❓ Preguntas frecuentes

**¿Funciona en iPhone y Android?**
Sí, en cualquier celular con navegador moderno (Chrome, Safari).

**¿Necesita internet?**
Sí, para cargar y guardar perfiles. Para el modo demo (perfiles falsos) funciona sin internet después de cargar.

**¿Los datos son privados?**
Los perfiles son visibles para todos los que tengan el link. No hay contraseña por diseño (es para una boda, no para datos sensibles).

**¿Cuántos invitados puede manejar?**
El plan gratuito de Supabase aguanta perfectamente hasta 500+ invitados.

**¿Cómo sumo el link al grupo de WhatsApp?**
Una vez deployado en Vercel, copiás el link y lo mandás. Listo.

---

## 💕 Hecho con amor para A&A · 26/09/2026

*Después no digas que no te ayudamos 😏*
