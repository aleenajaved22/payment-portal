import { siteFilterOptions } from './mockReports';

const PORTAL_KFC_SITES = siteFilterOptions.filter((option) => option !== 'All sites');

/** Franchise units selectable in Add/Edit User — CBX Figma + portal KFC scope. */
export const FRANCHISE_OPTIONS = [
  '#1012 - Wichita, KS',
  '#342 - Manchester, NH',
  '#884 - Omaha, NE',
  '#1205 - Austin, TX',
  'KBP Brands',
  'FilterGo Partners',
];

/** Sites available per franchise (union when multiple franchises are selected). */
export const SITES_BY_FRANCHISE = {
  '#1012 - Wichita, KS': ['Milwaukee tools', 'Zorinski Lake', 'Cosmic Munchies'],
  '#342 - Manchester, NH': [
    'Interstellar Eats',
    'Celestial Cuisine',
    'Astral Delights',
    'Universal Bites',
  ],
  '#884 - Omaha, NE': ['KFC Owen Tech', 'KFC Fremont'],
  '#1205 - Austin, TX': ['KFC Lakeview'],
  'KBP Brands': [...PORTAL_KFC_SITES],
  'FilterGo Partners': [
    'Milwaukee tools',
    'Zorinski Lake',
    'Cosmic Munchies',
    'Interstellar Eats',
    'Celestial Cuisine',
    'Astral Delights',
    'Universal Bites',
  ],
};

export const ALL_FRANCHISES_FILTER = 'All franchises';

export const userFranchiseFilterOptions = [ALL_FRANCHISES_FILTER, ...FRANCHISE_OPTIONS];

/** Toolbar site filter — scoped to the selected franchise when one is chosen. */
export function getUserSiteFilterOptions(franchiseFilter) {
  const allSitesLabel = 'All sites';
  const franchises =
    franchiseFilter && franchiseFilter !== ALL_FRANCHISES_FILTER
      ? [franchiseFilter]
      : FRANCHISE_OPTIONS;
  return [allSitesLabel, ...getSitesForFranchises(franchises)];
}

export function getSitesForFranchises(franchiseNames) {
  const selected = franchiseNames ?? [];
  if (selected.length === 0) return [];

  const seen = new Set();
  const sites = [];
  for (const franchise of selected) {
    const list = SITES_BY_FRANCHISE[franchise] ?? [];
    for (const site of list) {
      if (!seen.has(site)) {
        seen.add(site);
        sites.push(site);
      }
    }
  }
  return sites.sort((a, b) => a.localeCompare(b));
}

/** Figma Edit User (266:945) — reference selection for demos. */
export const FIGMA_EDIT_USER_ASSOCIATIONS = {
  franchises: ['#1012 - Wichita, KS', '#342 - Manchester, NH'],
  sites: [
    'Milwaukee tools',
    'Zorinski Lake',
    'Cosmic Munchies',
    'Interstellar Eats',
    'Celestial Cuisine',
    'Astral Delights',
    'Universal Bites',
  ],
};
