import { ConceptNetwork } from 'concept-network';

let cn;
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
                cn.addLink(node.id, otherNode.id);
                cn.addLink(otherNode.id, node.id);
            })
        })
    });
    feed.end();
}
