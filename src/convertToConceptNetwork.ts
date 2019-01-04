import { ConceptNetwork, cnAddLink, cnAddNode } from 'concept-network/lib/concept-network';

interface ConceptNetworkNode { label: string, occ: number }

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
    objects.forEach(object => {
        const documentNodes = [];
        for(let key in object) {
            const label = `${key}:${object[key]}`;
            cn = cnAddNode(cn, label);
            documentNodes.push(label);
        }
        // console.dir({documentNodes})
        const alreadyLinkedLabels = [];
        const documentLinks = [];
        documentNodes.forEach(label => {
            alreadyLinkedLabels.push(label);
            const otherNodes = cn.node.filter(otherNode => !alreadyLinkedLabels.includes(otherNode.label));
            otherNodes.forEach(otherNode => {
                if(!documentLinks.find(link => link.from === label && link.to === otherNode.label)) {
                    // console.dir({ documentLinks, label, otherNode });
                    cn = cnAddLink(cn, label, otherNode.label);
                    documentLinks.push({ from: label, to: otherNode.label });
                }
                if(!documentLinks.find(link => link.from === otherNode.label && link.to === label)) {
                    cn = cnAddLink(cn, otherNode.label, label);
                    documentLinks.push({ from: otherNode.label, to: label });
                }
            });
        });
    });
    feed.end();
}
