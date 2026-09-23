/**
 * Site reports, dated relative to today.
 *
 * The dashboard surfaces these as "latest reports", so fixed dates would make
 * the panel lie as soon as the demo aged — it previously showed August 2025
 * whatever the day. Deriving them from the clock keeps "latest" honest, and
 * matches how mockInvoices and subscriptionMock already work.
 */
function daysAgo(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

function reportDate(days) {
  const date = daysAgo(days);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

export const mockReports = [
  {
    id: '2',
    site: 'KFC Owen Tech',
    reportType: 'Site Summary',
    ...reportDate(2),
    isNew: true,
  },
  {
    id: '3',
    site: 'KFC Lakeview',
    reportType: 'Site Summary',
    ...reportDate(5),
    isNew: false,
  },
  {
    id: '5',
    site: 'KFC Fremont',
    reportType: 'Site Summary',
    ...reportDate(9),
    isNew: false,
  },
  {
    id: '7',
    site: 'KFC Lakeview',
    reportType: 'Site Summary',
    ...reportDate(16),
    isNew: false,
  },
];

export const siteFilterOptions = ['All sites', 'KFC Owen Tech', 'KFC Lakeview', 'KFC Fremont'];
export const reportTypeFilterOptions = ['All types', 'Site Summary'];
export const weekFilterOptions = ['This Week', 'Last Week', 'This Month'];
