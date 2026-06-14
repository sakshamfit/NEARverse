# NEARverse - Safe Code Update Instructions

## ⚠️ IMPORTANT: Your Assets Will NOT Be Overwritten

This ZIP contains **only the source code**.  
Your existing files in `public/assets/` (including `cyberpunk_city_compressed.glb`, `village_compressed.glb`, characters, etc.) will **remain safe**.

---

## How to Safely Update Your Project

### Step 1: Backup (Recommended)

Before updating, copy your entire `NEARverse` folder to a safe location.

### Step 2: Extract This ZIP

Extract `NEARverse-CODE-ONLY.zip` into a **temporary folder**.

### Step 3: Replace These Files Only

Copy and replace **only** these files/folders from the extracted ZIP into your existing `NEARverse` project:

#### Files to Replace:
- `src/components/GameWorld.tsx`
- `src/environment/BuildingTypes.ts`
- `src/environment/BuildingZone.tsx`
- `src/environment/CityArea.tsx`
- `src/environment/VillageArea.tsx`
- `src/environment/WorldLayout.tsx`
- `src/characters/RealisticPlayer.tsx`
- `src/characters/usePlayerAnimation.ts`
- `src/characters/ProfessionModels.ts`

#### Optional (if you want the latest):
- `package.json`
- `vite.config.ts`
- `vercel.json`

### Step 4: Keep These Folders As They Are

**Do NOT replace** these folders (your assets are here):

- `public/assets/city/` ← Your cyberpunk_city_compressed.glb
- `public/assets/village/` ← Your village_compressed.glb
- `public/assets/characters/` ← All your character models
- `public/assets/props/` ← bench.glb, street_lamp.glb, etc.

### Step 5: Run the Project

```bash
npm install
npm run dev:all
```

---

## What This Update Includes

- Realistic GLB character system
- Big unified world (City + Village)
- All your asset names mapped correctly
- Animation system (Idle, Walk, Run, Wave)
- Profession-based model selection
- Google Auth + Username setup

---

## If Something Goes Wrong

1. Delete the replaced files
2. Restore from your backup
3. Contact support

---

**Your large GLB files are safe.** This update only changes the code.