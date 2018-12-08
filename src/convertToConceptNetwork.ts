export default function convertToConceptNetwork(data: object | object[], feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const objects: object[] = Array.isArray(data) ? data : [data];
    
    feed.end();
}
