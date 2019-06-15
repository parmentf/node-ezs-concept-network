export class ConceptNetwork {
    constructor();
    addNode(label: string, inc?: number): { id: number, label: string, occ: number };
    addLink(fromId: number, toId: number, inc?: number): {fromId: number, toId: number, coOcc: number};
}
