import { AxiosRequestConfig } from 'axios';

export interface DataResponse {
    sites: DataSiteResponse[];
    services: DataServicesResponse[];
}

export type FetchWithTimeoutOptions = AxiosRequestConfig;

export interface ServiceConnections {
    id: string;
    client: string;
    start_time: number;
    last_out: number;
    last_in: number;
    bytes_in: number;
    bytes_out: number;
    latency_max: number;
    details?: Record<string, string>;
    requests?: number;
}

interface ServiceDetails {
    [key: string]: {
        [key: string]: ServiceConnections;
    };
}

export interface ServiceRequestReceivedResponse {
    site_id: string;
    by_client: Record<string, ServiceConnections>;
}

export interface ServiceRequestHandledResponse {
    site_id: string;
    by_server: ServiceDetails;
    by_originating_site: ServiceDetails;
}

export interface DataServicesResponse {
    address: string;
    protocol: string;
    targets: [
        {
            name: string;
            target: string;
            site_id: string;
        },
    ];
    connections_ingress?: {
        site_id: string;
        connections: Record<string, ServiceConnections>;
    }[];
    connections_egress?: {
        site_id: string;
        connections: Record<string, ServiceConnections>;
    }[];
    requests_handled?: ServiceRequestHandledResponse[];
    requests_received?: ServiceRequestReceivedResponse[];
    derived?: boolean;
    isExternal?: boolean;
}

export interface DataSiteResponse {
    site_name: string;
    site_id: string;
    version: string;
    connected: string[];
    namespace: string;
    url: string;
    edge: boolean;
    gateway: boolean;
}

interface DeploymentLinksStreamPoints {
    key: string;
    site: { site_id: string; site_name: string };
}

export interface DeploymentLinksResponse {
    key: string;
    request: ServiceConnections;
    source: DeploymentLinksStreamPoints;
    target: DeploymentLinksStreamPoints;
}

export interface DeploymentTopologyResponse {
    key: string;
    service: DataServicesResponse;
    site: DataSiteResponse;
}

export interface DataAdapterResponse {
    sites: DataSiteResponse[];
    services: DataServicesResponse[];
    deployments: DeploymentTopologyResponse[];
    deploymentLinks: DeploymentLinksResponse[];
}

// SITES
export interface SiteResponse {
    siteId: string;
    siteName: string;
    edge?: boolean;
    version: string;
    url: string;
    connected: string[];
    namespace: string;
    gateway?: boolean;
}

// SERVICES
export interface ServiceResponse {
    id: string;
    name: string;
    protocol: string;
}

// DEPLOYMENTS
export interface DeploymentResponse {
    id: string;
    name: string;
    protocol: string;
    numConnectionsIn: number;
    numConnectionsOut: number;
    sites: { name: string; url: string }[];
}

// FLOWS
interface FlowsRouterResponse {
    startTime: number;
    hostname: string;
    name: string;
    buildVersion: string;
    rtype: string;
    id: string;
}

interface FlowsLinkResponse {
    parent: string;
    startTime: number;
    mode: string;
    name: string;
    linkCost: number;
    direction: string;
    rtype: string;
    id: string;
}

export interface FlowsDeviceResponse {
    parent: string;
    startTime: number;
    destHost: string;
    protocol: string;
    destPort: number;
    vanAddress: string;
    name: string;
    rtype: string;
    id: string;
}

export interface FlowResponse {
    parent: string;
    startTime: number;
    octets: number;
    sourceHost: string;
    sourcePort: string;
    counterflow: string;
    trace: string;
    latency: number;
    endTime: number;
    rtype: string;
    id: string;
}

export type FlowsDataResponse = FlowsRouterResponse &
    FlowsLinkResponse &
    FlowsDeviceResponse &
    FlowResponse;

interface FlowAdapterResponse {
    sourceHost: string;
    sourcePort: string;
    id: string;
    octets: number;
    latency: number;
    counterflow?: string | null;
    connectedTo?: FlowAdapterResponse & { parent: string };
    startTime: number;
    endTime?: number;
    parent: string;
    rtype: string;
    trace?: string;
}

export interface FlowsResponse {
    hostname: string;
    siteName: string;
    name: string;
    rtype: string;
    protocol: string;
    destHost: string;
    destPort: number;
    vanAddress: string;
    id: string;
    deviceNameConnectedTo?: string;
    flows: FlowAdapterResponse[];
    parent: string;
    startTime: number;
    endTime?: number;
}

export interface NetworkStatsResponse {
    id: string;
    name: string;
    routersAssociated: string;
    totalDevices: number;
    totalFlows: number;
    totalBytes: number;
}

interface LinkStatsResponse {
    direction: string;
    id: string;
    linkCost: number;
    mode: string;
    name: string;
    parent: string;
    rtype: string;
    startTime: number;
}

export interface RouterStatsResponse {
    id: string;
    name: string;
    totalVanAddress: number;
    totalFlows: number;
    totalBytes: number;
    connectedTo: LinkStatsResponse[];
}

export interface MonitoringStatsResponse {
    totalVanAddress: number;
    totalFlows: number;
    totalBytes: number;
    totalRouters: number;
    totalLinks: number;
}

interface MonitoringRoutersTopologyLink {
    source: string;
    target: string;
    mode: string;
    cost: string;
}

export interface MonitoringRoutersTopologyResponse {
    nodes: FlowsDataResponse[];
    links: MonitoringRoutersTopologyLink[];
}
