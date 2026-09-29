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
    /* Something the technician flagged on the day. Most visits have none, which
       is why this sits on the record rather than being derived — an exception is
       a fact about what happened, not a property of the report's id. */
    exception: {
      title: 'Airflow below target on RTU-3',
      detail:
        'Return-side restriction cleared and the filter replaced. Recommend a follow-up reading at the next scheduled visit.',
    },
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
/**
 * FilterSelect treats the first option as the clear-all sentinel — it is the one
 * that maps to an empty value. Without "All dates" leading, picking "This Week"
 * would silently mean "no date filter", which is the opposite of what it says.
 */
export const weekFilterOptions = ['All dates', 'This Week', 'Last Week', 'This Month'];
