import { ConceptNetwork, cnAddLink, cnAddNode } from 'concept-network/lib/concept-network';
import { forEach, forEachObjIndexed } from 'ramda';

let cn: ConceptNetwork;
export default function convertToConceptNetwork(data: object | object[], feed): void {
    if (this.isLast()) {
        feed.write(cn);
        return feed.close();
    }
    const objects: object[] = Array.isArray(data) ? data : [data];
    // transform these objects into one ConceptNetwork
    if (this.isFirst()) {
        cn = {};
    }
    forEach((object) => {
        let previousNodes: string[] = [];
        forEachObjIndexed((value, key) => {
            const label = `${key}:${value}`;
            cn = cnAddNode(cn, label);
            forEach((otherNode) => {
                cn = cnAddLink(cn, otherNode, label);
                cn = cnAddLink(cn, label, otherNode);
            }, previousNodes);
            previousNodes = [...previousNodes, label];
        }, object);
    }, objects);
    feed.end();
}
