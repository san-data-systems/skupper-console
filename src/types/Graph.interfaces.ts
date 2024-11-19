import { LayoutOptions } from '@antv/g6';

export type GraphIconKeys =
  | 'component'
  | 'process'
  | 'site'
  | 'podman'
  | 'kubernetes'
  | 'skupper'
  | 'connector'
  | 'listener'
  | 'routingKey';

export type GraphElementNames =
  | 'SkDataEdge'
  | 'SkSiteEdge'
  | 'SkSiteEdgeDown'
  | 'SkSiteEdgePartialDown'
  | 'SkListenerConnectorEdge'
  | 'SkNode'
  | 'SkEmptyNode'
  | 'SkNodeUnexposed'
  | 'SkNodeRemote'
  | 'SkCombo';

export type GraphIconsMap = {
  [key in GraphIconKeys]: HTMLImageElement;
};

export interface GraphNode {
  id: string;
  name: string;
  type: GraphElementNames;
  label: string;
  combo?: string;
  comboName?: string;
  groupId?: string;
  groupName?: string;
  groupCount?: number;
  info?: { primary?: string; secondary?: string };
  x?: number | undefined;
  y?: number | undefined;
  persistPositionKey?: string;
  iconName: GraphIconKeys;
}

export interface GraphCombo {
  type: GraphElementNames;
  id: string;
  label: string;
}

interface GraphEdgeMetrics {
  bytes: number | undefined;
  byteRate: number | undefined;
  latency: number | undefined;
  bytesReverse: number | undefined;
  byteRateReverse: number | undefined;
  latencyReverse: number | undefined;
}

export interface GraphEdge {
  id: string;
  type: GraphElementNames;
  source: string;
  target: string | 'unknown';
  sourceName: string;
  targetName: string | null;
  label?: string;
  metricValue?: number;
  metrics?: GraphEdgeMetrics;
}

export interface GraphLayouts {
  combo: LayoutOptions;
  default: LayoutOptions;
  dagre: LayoutOptions;
}

export interface SkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  combos?: GraphCombo[];
  itemsToHighlight?: string[];
  itemSelected?: string;
  onClickNode?: (data: GraphNode | null) => void;
  onClickEdge?: (data: GraphEdge | null) => void;
  layout?: keyof GraphLayouts;
  moveToSelectedNode?: boolean;
  savePositions?: boolean;
}

export interface LocalStorageDataSavedPayload {
  x: number;
  y: number;
}

export interface LocalStorageDataSaved {
  [key: string]: LocalStorageDataSavedPayload;
}

export interface LocalStorageData extends LocalStorageDataSavedPayload {
  id: string;
}
