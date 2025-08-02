let profilesCache = null;

export async function loadProfiles() {
  if (profilesCache) return profilesCache;

  const url = import.meta.env.VITE_PROFILE_DATA_URL;
  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to load profiles');
  profilesCache = await response.json();
  return profilesCache;
}
