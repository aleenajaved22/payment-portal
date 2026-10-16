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
    return {
      franchises: user.franchises ?? [],
      sites: user.sites ?? [],
    };
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
