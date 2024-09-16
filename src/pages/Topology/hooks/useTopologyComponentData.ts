import { useSuspenseQueries } from '@tanstack/react-query';

import { RESTApi } from '@API/REST.api';
import { Role } from '@API/REST.enum';
import { UPDATE_INTERVAL } from '@config/config';
import { QueriesComponent } from '@pages/ProcessGroups/Components.enum';

import { QueriesTopology } from '../Topology.enum';

const componentQueryParams = {
  processGroupRole: [Role.Remote, Role.External],
  endTime: 0
};

const useTopologyComponentData = () => {
  const [{ data: components }, { data: componentsPairs }] = useSuspenseQueries({
    queries: [
      {
        queryKey: [QueriesComponent.GetComponents, componentQueryParams],
        queryFn: () => RESTApi.fetchComponents(componentQueryParams),
        refetchInterval: UPDATE_INTERVAL
      },

      {
        queryKey: [QueriesTopology.GetProcessGroupsPairs],
        queryFn: () => RESTApi.fetchComponentsPairs(),
        refetchInterval: UPDATE_INTERVAL
      }
    ]
  });

  return {
    components: components.results,
    componentsPairs: componentsPairs.results
  };
};

export default useTopologyComponentData;
