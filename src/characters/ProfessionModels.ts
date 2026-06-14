// Map professions to realistic model URLs
export const getModelForProfession = (profession: string): string => {
  const prof = profession.toLowerCase();

  if (prof.includes('doctor') || prof.includes('nurse')) {
    return '/models/doctor-realistic.glb';
  }
  if (prof.includes('chef') || prof.includes('cook')) {
    return '/models/chef-realistic.glb';
  }
  if (prof.includes('developer') || prof.includes('programmer')) {
    return '/models/developer-realistic.glb';
  }
  if (prof.includes('electrician') || prof.includes('mechanic')) {
    return '/models/worker-realistic.glb';
  }
  if (prof.includes('photographer')) {
    return '/models/photographer-realistic.glb';
  }
  if (prof.includes('designer')) {
    return '/models/designer-realistic.glb';
  }
  
  // Default models (male/female)
  return '/models/male-realistic.glb';
};