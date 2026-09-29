import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockReports } from '../data/mockReports';

/**
 * The reports the portal is currently showing, and which of them have been read.
 *
 * `isNew` used to be a fixed property of the mock data, so the "New" badge and
 * the dashboard's "1 new" count were permanent decoration: opening a report
 * changed nothing, and the badge kept claiming the report was unread forever.
 * Holding the collection in state lets opening one actually clear it, which is
 * the whole contract a "new" badge makes with the reader.
 *
 * In memory only, matching [InvoicesContext] — a reload restores the seed data
 * so the demo can be walked again from the top.
 */

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(mockReports);

  const markReportRead = useCallback((reportId) => {
    setReports((previous) =>
      previous.map((report) => (report.id === reportId ? { ...report, isNew: false } : report)),
    );
  }, []);

  const markAllReportsRead = useCallback(() => {
    setReports((previous) => previous.map((report) => (report.isNew ? { ...report, isNew: false } : report)));
  }, []);

  const newCount = useMemo(() => reports.filter((report) => report.isNew).length, [reports]);

  const value = useMemo(
    () => ({ reports, newCount, markReportRead, markAllReportsRead }),
    [reports, newCount, markReportRead, markAllReportsRead],
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return ctx;
}
