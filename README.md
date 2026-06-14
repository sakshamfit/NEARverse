# NEARVERSE

**"Play Online. Work Offline."**

A real-time multiplayer 3D social world inspired by Messenger by Abeto.

**NEARVERSE** — Where real people meet, chat, and complete real-life tasks inside a beautiful virtual Uttar Pradesh.

## Features

- ✅ Real-time multiplayer with Socket.IO
- ✅ Proximity-based chat (only hear people nearby)
- ✅ Supabase Authentication + Unique usernames
- ✅ Profession-based avatars
- ✅ Task Marketplace
- ✅ Fully installable PWA (Progressive Web App)
- ✅ Works on mobile & desktop

---

## Quick Start (Local Development)

```bash
npm install
npm run dev:all
```

---

## Deploy to Vercel (Production)

### 1. Push to GitHub

```bash
git remote set-url origin https://github.com/sakshamfit/NEARverse.git
git push -u origin master
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repo: `sakshamfit/NEARverse`
4. Add these **Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://ciwwfdypldrsstyljrmg.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_wfL4xzPLMPxvrznf46D7wA_WTfWmgtw
   ```
5. Click **Deploy**

Vercel will automatically detect it's a Vite + React project.

---

## Turn into Mobile App (PWA)

NEARverse is already configured as a **Progressive Web App**.

### After deploying to Vercel:

1. Open your live site in Chrome/Safari
2. Click the **install icon** in the address bar
3. Or go to **⋮ → Install NEARverse**
4. It will install like a native app!

### PWA Features:
- Works offline (cached)
- Installable on Android & iOS
- Full screen experience
- Push notification ready (future)

---

## Supabase Setup (Required)

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable auth
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  profession TEXT,
  avatar_color TEXT DEFAULT '#7c3aed',
  trust_score INTEGER DEFAULT 50,
  connect_coins INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

---

## Tech Stack

- **Frontend**: React + TypeScript + Three.js + React Three Fiber
- **Auth & Database**: Supabase
- **Real-time**: Socket.IO
- **PWA**: Vite PWA Plugin
- **Deployment**: Vercel

---

Made with ❤️ for meaningful local connections.

## Features Implemented

✅ **Real-time Multiplayer** with Socket.IO  
✅ **Proximity-based Chat** — only hear people close to you (like messenger.abeto.co)  
✅ **Live Player Movement** synced across all clients  
✅ **Emoji Reactions** that everyone nearby can see  
✅ **Stylized Low-Poly Uttar Pradesh** world  
✅ **Profession-based Avatars**  
✅ **Task Marketplace** for real-life jobs  
✅ **Cozy, friendly UI**

---

## How to Run

### 1. Start Everything (Recommended)

```bash
npm run dev:all
```

### 2. Manual Start

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

Open **multiple browser tabs** to test real-time multiplayer.

---

## How Proximity Chat Works

- When you are within ~18 world units of another player, you can see and chat with them
- Messages are only sent to players who are nearby
- A green "Nearby • Chat enabled" indicator appears above players within range
- This mimics the magical feeling of **messenger.abeto.co**

---

## Controls

- **WASD** — Move
- **Shift** — Run
- **Mouse** — Rotate camera (or use OrbitControls)
- **Scroll** — Zoom
- **Chat panel** — Type or use emoji reactions

---

## Tech Stack

- **Frontend**: React + TypeScript + Three.js + React Three Fiber
- **Backend**: Node.js + Express + Socket.IO
- **State**: Zustand
- **Styling**: Custom cozy dark theme

---

## Next Steps (Future Features)

- [ ] User avatar customization
- [ ] Home building system
- [ ] Reputation & badges
- [ ] Real task hiring flow
- [ ] Mobile touch controls
- [ ] Voice proximity chat
- [ ] Seasonal events (Diwali, Holi)

---

Made with ❤️ for meaningful local connections.