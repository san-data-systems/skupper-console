import React, { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { xml } from 'd3-fetch';
import { useNavigate } from 'react-router-dom';

import siteSVG from '@assets/site.svg';
import { GraphEdge, GraphNode } from '@core/components/Graph/Graph.interfaces';
import { ErrorRoutesPaths, HttpStatusErrors } from '@pages/shared/Errors/errors.constants';
import LoadingPage from '@pages/shared/Loading';
import { UPDATE_INTERVAL } from 'config';

import { TopologyController } from '../services';
import { QueriesTopology } from '../services/services.enum';
import TopologySiteDetails from './DetailsSite';
import TopologyPanel from './TopologyPanel';

const TopologySite = function () {
    const navigate = useNavigate();
    const [refetchInterval, setRefetchInterval] = useState<number>(UPDATE_INTERVAL);

    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphEdge[]>([]);
    const [nodeIdSelected, setNodeIdSelected] = useState<string | null>(null);

    const { data: sites, isLoading: isLoading } = useQuery(
        [QueriesTopology.GetSitesWithLinksCreated],
        TopologyController.getSitesWithLinksCreated,
        {
            refetchInterval,
            onError: handleError,
        },
    );

    function handleError({ httpStatus }: { httpStatus?: HttpStatusErrors }) {
        const route = httpStatus
            ? ErrorRoutesPaths.error[httpStatus]
            : ErrorRoutesPaths.ErrConnection;

        setRefetchInterval(0);
        navigate(route);
    }

    function handleGetSelectedNode(id: string) {
        if (id !== nodeIdSelected) {
            setNodeIdSelected(id);
        }
    }

    // Refresh topology data
    const updateTopologyData = useCallback(async () => {
        if (sites) {
            const siteXML = await xml(siteSVG);
            const siteNodes = TopologyController.getNodesFromEntities(sites).map((node) => ({
                ...node,
                img: siteXML,
            }));

            setNodes(siteNodes);
            setLinks(TopologyController.getEdgesFromSitesConnected(sites));
        }
    }, [sites]);

    useEffect(() => {
        updateTopologyData();
    }, [updateTopologyData]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <TopologyPanel nodes={nodes} links={links} onGetSelectedNode={handleGetSelectedNode}>
            {nodeIdSelected && <TopologySiteDetails id={nodeIdSelected} />}
        </TopologyPanel>
    );
};

export default TopologySite;
