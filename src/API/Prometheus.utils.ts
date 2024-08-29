import { PROMETHEUS_URL } from '@config/config';
import { PrometheusLabelsV2, prometheusSiteNameAndIdSeparator } from '@config/prometheus';
import {
  MetricData as MetricValuesAndLabels,
  PrometheusLabels,
  PrometheusMetric
} from '@sk-types/Prometheus.interfaces';
import { skAxisXY } from '@sk-types/SkChartArea.interfaces';

export const gePrometheusQueryPATH = (queryType: 'single' | 'range' = 'range') =>
  queryType === 'range' ? `${PROMETHEUS_URL}/rangequery/` : `${PROMETHEUS_URL}/query/`;

export function convertToPrometheusQueryParams({
  sourceSite,
  sourceProcess,
  destSite,
  destProcess,
  service,
  protocol,
  direction,
  code
}: PrometheusLabels) {
  let queryFilters: string[] = [];

  if (sourceSite) {
    queryFilters = [
      ...queryFilters,
      `${PrometheusLabelsV2.SourceSiteName}=~"${decomposePrometheusSiteLabel(sourceSite)}"`
    ];
  }

  if (destSite) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.DestSiteName}=~"${decomposePrometheusSiteLabel(destSite)}"`];
  }

  if (sourceProcess) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.SourceProcess}=~"${sourceProcess}"`];
  }

  if (destProcess) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.DestProcess}=~"${destProcess}"`];
  }

  if (service) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.Address}=~"${service}"`];
  }

  if (protocol) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.Protocol}=~"${protocol}"`];
  }

  if (code) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.Code}=~"${code}"`];
  }

  if (direction) {
    queryFilters = [...queryFilters, `${PrometheusLabelsV2.Direction}=~"${direction}"`];
  }

  return queryFilters.join(',');
}

export function getTimeSeriesValuesFromPrometheusData(data: PrometheusMetric<'matrix'>[] | []): skAxisXY[][] | null {
  // Prometheus can retrieve empty arrays wich are not valid data for us
  if (!data.length) {
    return null;
  }

  return data.map(({ values }) =>
    values.map((value) => ({
      x: Number(value[0]),
      // y should be a numeric value, we sanitize 'NaN' in 0
      y: isNaN(Number(value[1])) ? 0 : Number(value[1])
    }))
  );
}

/**
 * Converts an array of Prometheus result objects to a two-dimensional array of metric labels.
 */
export function getTimeSeriesLabelsFromPrometheusData(data: PrometheusMetric<'matrix'>[] | []): string[] | null {
  // Validate the input
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Map the input array to an array of label arrays using array destructuring
  return data.flatMap(({ metric }) => Object.values(metric));
}

export function getTimeSeriesFromPrometheusData(data: PrometheusMetric<'matrix'>[] | []): MetricValuesAndLabels | null {
  if (!data.length) {
    return null;
  }

  const values = getTimeSeriesValuesFromPrometheusData(data) as skAxisXY[][];
  const labels = getTimeSeriesLabelsFromPrometheusData(data) as string[];

  return { values, labels };
}

// prometheus site label has this format: siteName@_@siteId
export const composePrometheusSiteLabel = (name?: string, id?: string) =>
  (name || '') + (prometheusSiteNameAndIdSeparator || '') + (id || '');

export const decomposePrometheusSiteLabel = (name?: string) => name?.split(prometheusSiteNameAndIdSeparator)[0];
