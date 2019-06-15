import { ConceptNetwork } from 'concept-network';

interface ConceptNetworkNode { id: number, label: string, occ: number }
interface ConceptNetworkLink { fromId: number, toId: number, coOcc: number }
interface ConceptNetwork {
    node: { [index: number]: ConceptNetworkNode }
    link: { [index: string]: ConceptNetworkLink }
    nodeLastId: ConceptNetworkNode['id']
    labelIndex: { [index: string]: ConceptNetworkNode['id'] }
    fromIndex: { [index: number]: string[] }
    toIndex: { [index: number]: string[] }
    addNode(label: string, inc?: number): ConceptNetworkNode
    addLink(fromId: ConceptNetworkNode['id'], toId: ConceptNetworkNode['id'], inc?: number): ConceptNetworkLink
}

let cn: ConceptNetwork;
export default function convertToConceptNetwork(data: object | object[], feed): void {
    if (this.isLast()) {
        feed.write(cn);
        return feed.close();
    }
    const objects: object[] = Array.isArray(data) ? data : [data];
    // transform these objects into one ConceptNetwork
    if (this.isFirst()) {
        cn = new ConceptNetwork();
    }
    objects.forEach(object => {
        const nodes: ConceptNetworkNode[] = [];
        for(let key in object) {
            nodes.push(cn.addNode(`${key}:${object[key]}`));
        }
        nodes.forEach(node => {
            const otherNodes = nodes.filter(otherNode => otherNode.id > node.id);
            otherNodes.forEach(otherNode => {
                // console.log(`${node.id} <-> ${otherNode.id}`)
                cn.addLink(node.id, otherNode.id);
                cn.addLink(otherNode.id, node.id);
            })
        })
    });
    feed.end();
}
