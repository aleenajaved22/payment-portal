import { FRANCHISE_OPTIONS, getSitesForFranchises } from './franchiseSiteCatalog';

const FRANCHISES = FRANCHISE_OPTIONS;

function seedFrom(id) {
  let seed = 0;
  for (const char of String(id)) seed = (seed * 31 + char.charCodeAt(0)) % 9973;
  return seed;
}

/** Demo franchise + site tags for the user detail drawer (deterministic per user id). */
export function getUserAssociations(user) {
  if (user?.franchises?.length || user?.sites?.length) {
    const franchises = user.franchises ?? [];
    let sites = user.sites ?? [];
    if (franchises.length && sites.length === 0) {
      const pool = getSitesForFranchises(franchises);
      const seed = seedFrom(user?.id ?? '0');
      const siteCount = Math.min(pool.length, 2 + (seed % 4));
      sites = pool.slice(0, siteCount);
    }
    return { franchises, sites };
  }

  const seed = seedFrom(user?.id ?? '0');
  const franchiseCount = 1 + (seed % 2);
  const franchises = [];
  for (let i = 0; i < franchiseCount; i += 1) {
    franchises.push(FRANCHISES[(seed + i * 3) % FRANCHISES.length]);
  }

  const pool = getSitesForFranchises(franchises);
  const siteCount = Math.min(pool.length, 2 + (seed % 4));
  const sites = pool.slice(0, siteCount);

  return { franchises, sites };
}
