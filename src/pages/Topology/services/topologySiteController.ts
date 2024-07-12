import { composePrometheusSiteLabel } from '@API/Prometheus.utils';
import { LinkResponse, SitePairsResponse, SiteResponse } from '@API/REST.interfaces';
import kubernetesIcon from '@assets/kubernetes.svg';
import podmanIcon from '@assets/podman.png';
import siteIcon from '@assets/site.svg';
import { GraphEdge, GraphNode } from '@core/components/Graph/Graph.interfaces';
import SitesController from '@pages/Sites/services';

import { TopologyLabels } from '../Topology.enum';
import { TopologyMetrics } from '../Topology.interfaces';

import { TopologyController, convertEntityToNode } from '.';

interface TopologySiteControllerProps {
  idsSelected: string[] | undefined;
  sites: SiteResponse[];
  routerLinks: LinkResponse[] | null;
  sitesPairs: SitePairsResponse[] | null;
  metrics: TopologyMetrics | null;
  options: {
    showLinkBytes: boolean;
    showLinkByteRate: boolean;
    showLinkLatency: boolean;
    showLinkLabelReverse: boolean;
  };
}

const platformsMap: Record<string, 'kubernetes' | 'podman'> = {
  kubernetes: kubernetesIcon,
  podman: podmanIcon
};

const addSiteMetricsToEdges = (links: GraphEdge[], metrics: TopologyMetrics | null) => {
  const sanitizedLinks = links.map((link) => ({
    ...link,
    //name@_@id format
    sourceName: composePrometheusSiteLabel(link.sourceName, link.source),
    targetName: composePrometheusSiteLabel(link.targetName, link.target)
  }));

  return TopologyController.addMetricsToEdges(
    sanitizedLinks,
    'sourceSite',
    'destSite',
    undefined, // no need to retrieve protocols
    metrics?.bytesByProcessPairs,
    metrics?.byteRateByProcessPairs,
    metrics?.latencyByProcessPairs
  );
};

const convertSitesToNodes = (entities: SiteResponse[]): GraphNode[] =>
  entities.map(({ identity, name, siteVersion, platform }) => {
    const iconSrc = platform && platformsMap[platform] ? platformsMap[platform] : siteIcon;
    const label = siteVersion ? `${name} (${siteVersion})` : name;

    return convertEntityToNode({
      id: identity,
      label,
      iconSrc
    });
  });

const convertRouterLinksToEdges = (sites: SiteResponse[], links: LinkResponse[]): GraphEdge[] => {
  const sitesWithLinks = SitesController.bindLinksWithSiteIds(sites, links);

  return sitesWithLinks.flatMap(({ identity: sourceId, linkSiteIds }) =>
    linkSiteIds.flatMap(({ targetId, linkCost }) => [
      {
        id: `${sourceId}-to${targetId}`,
        source: sourceId,
        target: targetId,
        label: linkCost !== undefined ? `${TopologyLabels.SiteLinkText} ${linkCost}` : '',
        type: 'SkSiteEdge'
      }
    ])
  );
};

export const TopologySiteController = {
  siteDataTransformer: ({
    idsSelected,
    sites,
    routerLinks,
    sitesPairs,
    metrics,
    options
  }: TopologySiteControllerProps) => {
    let edges: GraphEdge[] = [];

    if (sitesPairs) {
      TopologyController.transformIdsToStringIds(idsSelected),
        (edges = TopologyController.convertPairsToEdges(sitesPairs));
      edges = addSiteMetricsToEdges(edges, metrics);
      edges = TopologyController.configureEdges(edges, options);
    } else if (routerLinks) {
      edges = convertRouterLinksToEdges(sites, routerLinks);
    }

    return {
      nodeIdSelected: TopologyController.transformIdsToStringIds(idsSelected),
      nodes: convertSitesToNodes(sites),
      edges
    };
  }
};
