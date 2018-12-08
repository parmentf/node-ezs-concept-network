import { ConceptNetwork } from 'concept-network';

let cn: {
    addNode(label: string, inc?: number): { id: number, label: string, occ: number };
    addLink(fromId: number, toId: number, inc?: number): {fromId: number, toId: number, coOcc: number};
};
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
        const nodes: {id: number, label: string, occ: number}[] = [];
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
