export default function convertToConceptNetwork(data: object | object[], feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const objects: object[] = Array.isArray(data) ? data : [data];
    // TODO transform these objects into one ConceptNetwork
    feed.write(objects);
    feed.end();
}
