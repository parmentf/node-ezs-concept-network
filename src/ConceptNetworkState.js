import { ConceptNetworkState, ConceptNetwork } from 'concept-network';

export default function conceptNetworkState(data, feed) {
    if (this.isFirst() && !data) {
        return feed.stop(new Error('No data passed to ConceptNetworkState'));
    }
    if (this.isLast()) {
        return feed.close();
    }
    let cns;
    if (data instanceof ConceptNetworkState) {
        cns = data;
    } else if (data instanceof ConceptNetwork) {
        cns = new ConceptNetworkState(data)
    } else {
        const obj = data;
        const cn = new ConceptNetwork();
        cn.node = obj.node;
        cn.link = obj.link;
        cn.nodeLastId = obj.nodeLastId;
        cn.labelIndex = obj.labelIndex;
        cn.fromIndex = obj.fromIndex;
        cn.toIndex = obj.toIndex;
        cns = new ConceptNetworkState(cn);
    }
    
    if (cns) {
        feed.write(cns);
    }
    feed.end();
}
