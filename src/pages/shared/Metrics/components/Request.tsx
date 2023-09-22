import { FC, useCallback, useEffect, useState } from 'react';

import { Card, CardBody, CardExpandableContent, CardHeader, CardTitle } from '@patternfly/react-core';
import { useQuery } from '@tanstack/react-query';

import { isPrometheusActive } from '@config/config';

import { MetricsLabels } from '../Metrics.enum';
import { SelectedFilters } from '../Metrics.interfaces';
import RequestCharts from '../RequestCharts';
import ResponseCharts from '../ResponseCharts';
import MetricsController from '../services';
import { QueriesMetrics } from '../services/services.interfaces';

export interface RequestProps {
  selectedFilters: SelectedFilters;
  openSections?: boolean;
  forceUpdate?: number;
  refetchInterval?: number;
}

const Request: FC<RequestProps> = function ({ selectedFilters, forceUpdate, openSections, refetchInterval }) {
  const [isExpanded, setIsExpanded] = useState(openSections || false);
  const { data, refetch } = useQuery(
    [QueriesMetrics.GetRequest, selectedFilters],
    () => MetricsController.getRequest(selectedFilters),
    {
      enabled: isPrometheusActive,
      refetchInterval,
      keepPreviousData: true
    }
  );

  const { data: response, refetch: refetchResponse } = useQuery(
    [QueriesMetrics.GetResponse, selectedFilters],
    () => MetricsController.getResponse(selectedFilters),
    {
      enabled: isPrometheusActive,
      refetchInterval,
      keepPreviousData: true
    }
  );

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  //Filters: refetch manually the prometheus API
  const handleRefetchMetrics = useCallback(() => {
    if (isPrometheusActive) {
      refetch();
      refetchResponse();
    }
  }, [refetch, refetchResponse]);

  useEffect(() => {
    if (forceUpdate) {
      handleRefetchMetrics();
    }
  }, [forceUpdate, handleRefetchMetrics]);

  if (!data?.requestRateData || !response) {
    return null;
  }

  const { requestRateData, totalRequestsInterval, avgRequestRateInterval } = data;
  const isSectionActive = !!requestRateData?.flatMap(({ data: values }) => values.find(({ y }) => y > 0) || []).length;

  const { responseData, responseRateData } = response;

  return (
    <Card isExpanded={isSectionActive && isExpanded} className={!isSectionActive ? 'metric-disabled' : undefined}>
      <CardHeader onExpand={isSectionActive ? handleExpand : () => null}>
        <CardTitle>{MetricsLabels.RequestsTitle}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        {!!requestRateData?.length && (
          <>
            <CardBody>
              <RequestCharts
                requestRateData={requestRateData}
                totalRequestsInterval={totalRequestsInterval}
                avgRequestRateInterval={avgRequestRateInterval}
              />
            </CardBody>

            {responseData && (
              <CardBody>
                <CardTitle>{MetricsLabels.HttpStatus}</CardTitle>
                <ResponseCharts responseData={responseData} responseRateData={responseRateData} />
              </CardBody>
            )}
          </>
        )}
      </CardExpandableContent>
    </Card>
  );
};

export default Request;
