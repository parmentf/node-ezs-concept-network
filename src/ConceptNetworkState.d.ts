import { ConceptNetworkState, ConceptNetwork } from 'concept-network';
interface ConceptNetworkNode {
    id: number;
    label: string;
    occ: number;
}
interface ConceptNetworkLink {
    fromId: number;
    toId: number;
    coOcc: number;
}
interface ConceptNetwork {
    node: {
        [index: number]: ConceptNetworkNode;
    };
    link: {
        [index: string]: ConceptNetworkLink;
    };
    nodeLastId: ConceptNetworkNode['id'];
    labelIndex: {
        [index: string]: ConceptNetworkNode['id'];
    };
    fromIndex: {
        [index: number]: string[];
    };
    toIndex: {
        [index: number]: string[];
    };
    addNode(label: string, inc?: number): ConceptNetworkNode;
    addLink(fromId: ConceptNetworkNode['id'], toId: ConceptNetworkNode['id'], inc?: number): ConceptNetworkLink;
}
interface ConceptNetworkState {
    nodeState: {
        [index: number]: number;
    };
    cn: ConceptNetwork;
    normalNumberComingLinks: number;
    constructor(cn: ConceptNetwork): ConceptNetworkState;
    activate(nodeId: number): void;
    getActivationValue(nodeId: number): number;
    setActivationValue(nodeId: number, value: number): void;
    getOldActivationValue(nodeId: number): number;
    getMaximumActivationValue(filter: string | RegExp): number;
    getActivatedTypedNodes(filter: string | RegExp, threshold: number): {
        node: ConceptNetworkNode;
        activationValue: number;
    }[];
    propagate(options: {
        decay: number;
        memoryPerf: number;
    }): void;
}
export default function conceptNetworkState(data: ConceptNetworkState | ConceptNetwork, feed: any): void;
export {};
