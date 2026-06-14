// src/environment/BuildingTypes.ts

export interface BuildingConfig {
  id: string;
  name: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  type: string;
}

// ==================== CITY BUILDINGS ====================
export const cityBuildings: BuildingConfig[] = [
  {
    id: 'cyberpunk-city',
    name: 'Cyberpunk City',
    modelUrl: '/assets/city/cyberpunk_city_compressed.glb',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    type: 'city'
  },
  {
    id: 'cafe-1',
    name: 'Cozy Cafe',
    modelUrl: '/assets/city/cozy_morning_in_a_cafe__3d_editor_challenge.glb',
    position: [-22, 0, -18],
    rotation: [0, 0.8, 0],
    scale: [1.3, 1.3, 1.3],
    type: 'cafe'
  },
  {
    id: 'shop-1',
    name: 'Honeydukes Shop',
    modelUrl: '/assets/city/honey_dukes_shop.glb',
    position: [-12, 0, -8],
    rotation: [0, 1.2, 0],
    scale: [1.2, 1.2, 1.2],
    type: 'shop'
  },
  {
    id: 'office-1',
    name: 'Modern Office',
    modelUrl: '/assets/city/minimalistic_modern_office.glb',
    position: [28, 0, -15],
    rotation: [0, -0.5, 0],
    scale: [1.6, 1.6, 1.6],
    type: 'office'
  },
  {
    id: 'kitchen-1',
    name: 'Forgotten Kitchen',
    modelUrl: '/assets/city/forgotten_kitchen._day_4.glb',
    position: [-8, 0, 12],
    rotation: [0, -1.5, 0],
    scale: [1.2, 1.2, 1.2],
    type: 'kitchen'
  },
  {
    id: 'hotel-1',
    name: 'Haunted Hotel',
    modelUrl: '/assets/city/halloween_haunted_hotel_rooms.glb',
    position: [28, 0, 20],
    rotation: [0, -2.1, 0],
    scale: [1.7, 1.7, 1.7],
    type: 'hotel'
  },
  {
    id: 'apartment-1',
    name: 'VR Apartment',
    modelUrl: '/assets/city/vr_apartment.glb',
    position: [15, 0, 18],
    rotation: [0, 0, 0],
    scale: [1.5, 1.5, 1.5],
    type: 'apartment'
  }
];

// ==================== VILLAGE BUILDINGS ====================
export const villageBuildings: BuildingConfig[] = [
  {
    id: 'village-main',
    name: 'Village Area',
    modelUrl: '/assets/village/village_compressed.glb',
    position: [-40, 0, 25],      // ← Village is placed here (left side of the map)
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    type: 'village'
  }
];
