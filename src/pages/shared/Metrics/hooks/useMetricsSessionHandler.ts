import { useCallback } from 'react';

import { getDataFromSession, storeDataToSession } from '../../../../core/utils/persistData';
import { ExpandedMetricSections, QueryMetricsParams } from '../../../../types/Metrics.interfaces';

const PREFIX_METRIC_FILTERS_KEY = 'metric-filters';
const PREFIX_VISIBLE_METRICS_KEY = `metric-sections`;

export const useMetricSessionHandlers = (id: string) => {
  const setSelectedFilters = useCallback(
    (filters: QueryMetricsParams) =>
      storeDataToSession<QueryMetricsParams>(`${PREFIX_METRIC_FILTERS_KEY}-${id}`, filters),
    [id]
  );

  const setVisibleMetrics = useCallback(
    (sections: ExpandedMetricSections) =>
      storeDataToSession<ExpandedMetricSections>(`${PREFIX_VISIBLE_METRICS_KEY}-${id}`, sections),
    [id]
  );

  const selectedFilters = getDataFromSession<QueryMetricsParams>(`${PREFIX_METRIC_FILTERS_KEY}-${id}`);
  const visibleMetrics = getDataFromSession<ExpandedMetricSections>(`${PREFIX_VISIBLE_METRICS_KEY}-${id}`) || undefined;

  return {
    setSelectedFilters,
    setVisibleMetrics,
    selectedFilters,
    visibleMetrics
  };
};
