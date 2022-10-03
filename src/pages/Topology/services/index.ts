import { RESTApi } from 'API/REST';
import {
    DeploymentLinkTopology,
    ProcessGroupResponse,
    ProcessResponse,
    SiteDataResponse,
} from 'API/REST.interfaces';

import { TopologyNode } from '../Topology.interfaces';
import { ProcessesMetrics, ProcessGroupMetrics, SitesMetrics } from './services.interfaces';

export const TopologyController = {
    getProcessesLinks: async (): Promise<DeploymentLinkTopology[]> => {
        const links = await RESTApi.fetchFlowAggregatesProcesses();

        const processesLinks = links.map(({ identity, sourceId, destinationId }) => ({
            key: identity,
            source: sourceId,
            target: destinationId,
        }));

        return processesLinks;
    },

    getProcessGroupsLinks: async (): Promise<DeploymentLinkTopology[]> => {
        const links = await RESTApi.fetchFlowAggregatesProcessgroups();

        const processGroupsLinks = links.map(({ identity, sourceId, destinationId }) => ({
            key: identity,
            source: sourceId,
            target: destinationId,
        }));

        return processGroupsLinks;
    },

    getSiteMetrics: async (id: string): Promise<SitesMetrics> => {
        const site = await RESTApi.fetchSite(id);
        const flowAggregatesPairs = await RESTApi.fetchFlowAggregatesSites();

        const flowAggregatesOutgoingPairsIds = flowAggregatesPairs
            .filter(({ sourceId }) => id === sourceId)
            .map(({ identity }) => identity);

        const flowAggregatesIncomingPairsIds = flowAggregatesPairs
            .filter(({ destinationId }) => id === destinationId)
            .map(({ identity }) => identity);

        const flowAggregatesOutgoingPairs = await Promise.all(
            flowAggregatesOutgoingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesSite(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        const flowAggregatesIncomingPairs = await Promise.all(
            flowAggregatesIncomingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesSite(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        return {
            ...site,
            tcpConnectionsOut: flowAggregatesOutgoingPairs,
            tcpConnectionsIn: flowAggregatesIncomingPairs,
        };
    },

    getProcessMetrics: async (id: string): Promise<ProcessesMetrics> => {
        const process = await RESTApi.fetchProcess(id);
        const flowAggregatesPairs = await RESTApi.fetchFlowAggregatesProcesses();

        const flowAggregatesOutgoingPairsIds = flowAggregatesPairs
            .filter(({ sourceId }) => id === sourceId)
            .map(({ identity }) => identity);

        const flowAggregatesIncomingPairsIds = flowAggregatesPairs
            .filter(({ destinationId }) => id === destinationId)
            .map(({ identity }) => identity);

        const flowAggregatesOutgoingPairs = await Promise.all(
            flowAggregatesOutgoingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesProcess(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        const flowAggregatesIncomingPairs = await Promise.all(
            flowAggregatesIncomingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesProcess(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        return {
            ...process,
            tcpConnectionsOut: flowAggregatesOutgoingPairs,
            tcpConnectionsIn: flowAggregatesIncomingPairs,
        };
    },

    getProcessGroupMetrics: async (id: string): Promise<ProcessGroupMetrics> => {
        const process = await RESTApi.fetchProcessGroup(id);
        const flowAggregatesPairs = await RESTApi.fetchFlowAggregatesProcessgroups();

        const flowAggregatesOutgoingPairsIds = flowAggregatesPairs
            .filter(({ sourceId }) => id === sourceId)
            .map(({ identity }) => identity);

        const flowAggregatesIncomingPairsIds = flowAggregatesPairs
            .filter(({ destinationId }) => id === destinationId)
            .map(({ identity }) => identity);

        const flowAggregatesOutgoingPairs = await Promise.all(
            flowAggregatesOutgoingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesProcessGroup(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        const flowAggregatesIncomingPairs = await Promise.all(
            flowAggregatesIncomingPairsIds.map(async (flowAggregatesPairsId) =>
                RESTApi.fetchFlowAggregatesProcessGroup(flowAggregatesPairsId),
            ),
        ).catch((error) => Promise.reject(error));

        return {
            ...process,
            tcpConnectionsOut: flowAggregatesOutgoingPairs,
            tcpConnectionsIn: flowAggregatesIncomingPairs,
        };
    },

    getSiteNodes: (sites: SiteDataResponse[]) =>
        sites
            ?.sort((a, b) => a.siteId.localeCompare(b.siteId))
            .map((node, index) => {
                const positions = localStorage.getItem(node.siteId);
                const fx = positions ? JSON.parse(positions).fx : null;
                const fy = positions ? JSON.parse(positions).fy : null;

                return {
                    id: node.siteId,
                    name: node.siteName,
                    x: fx || 0,
                    y: fy || 0,
                    fx,
                    fy,
                    type: 'site',
                    groupName: node.siteName,
                    group: index,
                    color: getColor(index),
                };
            }),

    getSiteLinks: (sites: SiteDataResponse[]) =>
        sites?.flatMap(({ siteId: sourceId, connected }) =>
            connected.flatMap((targetId) => [
                {
                    source: sourceId,
                    target: targetId,
                    type: 'linkSite',
                },
            ]),
        ),

    getProcessGroupNodes: (processGroups: ProcessGroupResponse[]) =>
        processGroups
            ?.sort((a, b) => a.identity.localeCompare(b.identity))
            .map((node, index) => {
                const positions = localStorage.getItem(node.identity);
                const fx = positions ? JSON.parse(positions).fx : null;
                const fy = positions ? JSON.parse(positions).fy : null;

                return {
                    id: node.identity,
                    name: node.name,
                    x: fx || 0,
                    y: fy || 0,
                    fx,
                    fy,
                    type: 'processgroups',
                    groupName: node.name,
                    group: index,
                    color: getColor(index),
                };
            }),

    getProcessGroupNodesLinks: (deploymentsLinks: DeploymentLinkTopology[]) =>
        deploymentsLinks?.flatMap(({ source, target }) => ({
            source,
            target,
            type: 'linkService',
        })),

    getProcessNodes: (deployments: ProcessResponse[], siteNodes: TopologyNode[]) =>
        deployments
            ?.map((node) => {
                const positions = localStorage.getItem(node.identity);
                const fx = positions ? JSON.parse(positions).fx : null;
                const fy = positions ? JSON.parse(positions).fy : null;

                const site = siteNodes?.find(({ id }) => id === node.parent);
                const groupIndex = site?.group || 0;

                return {
                    id: node.identity,
                    name: node.name,
                    x: fx || 0,
                    y: fy || 0,
                    fx,
                    fy,
                    type: 'service',
                    groupName: site?.name || '',
                    group: groupIndex,
                    color: getColor(groupIndex),
                };
            })
            .sort((a, b) => a.group - b.group),

    getProcessLinks: (deploymentsLinks: DeploymentLinkTopology[]) =>
        deploymentsLinks?.flatMap(({ source, target }) => ({
            source,
            target,
            type: 'linkService',
        })),
};

const getColor = (index: number) => {
    const colors = [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
        '#ffbb78',
        '#98df8a',
        '#ff9896',
        '#c5b0d5',
        '#c49c94',
        '#f7b6d2',
        '#c7c7c7',
        '#dbdb8d',
        '#9edae5',
        '#aec7e8',
    ];

    return colors[index % colors.length];
};
