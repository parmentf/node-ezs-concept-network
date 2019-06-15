import from from 'from';
import ezs from 'ezs';
import statements from '../lib';
import { ConceptNetworkState } from 'concept-network';

ezs.use(statements);

describe('ConceptNetworkState', () => {
    it('should error when no ConceptNetwork is given', (done) => {
        from([])
        .pipe(ezs('ConceptNetworkState'))
        .on('data', () => {
            done(new Error('Should not work without any ConceptNetwork'));
        })
        .on('end', () => {
            done(new Error('Should not work without any ConceptNetwork'));
        })
        .on('error', (err) => done());
    });

    it('should return a ConceptNetworkState', (done) => {
        from([{
            node: [
                { id: 1, label: 'First', occ: 1},
                { id: 2, label: 'Second', occ: 1},
            ],
            link: { '1_2': { fromId: 1, toId: 2, coOcc: 1 } },
            nodeLastId: 2,
            labelIndex: { 'First': 1, 'Second': 2 },
            fromIndex:  Array.from({ 1: ['1_2'] }),
            toIndex: Array.from({ 2: ['1_2'] }),
        }])
        .pipe(ezs('ConceptNetworkState'))
        .on('data', (data) => {
            expect(data).toBeInstanceOf(ConceptNetworkState);
            done();
        })
        .on('error', done);
    });

    it('should return a ConceptNetworkState with activated node', (done) => {
        from([{
            node: [
                { id: 1, label: 'First', occ: 1},
                { id: 2, label: 'Second', occ: 1},
            ],
            link: { '1_2': { fromId: 1, toId: 2, coOcc: 1 } },
            nodeLastId: 2,
            labelIndex: { 'First': 1, 'Second': 2 },
            fromIndex:  Array.from({ 1: ['1_2'] }),
            toIndex: Array.from({ 2: ['1_2'] }),
        }])
        .pipe(ezs('ConceptNetworkState', { activate: [1] }))
        .on('data', (data) => {
            expect(data).toBeInstanceOf(ConceptNetworkState);
            expect(data.nodeState).toBeDefined();
            expect(data.nodeState[1]).toEqual(100);
            done();
        })
        .on('error', done);
    });

    it('should return a ConceptNetworkState with activated nodes', (done) => {
        from([{
            node: [
                { id: 1, label: 'First', occ: 1},
                { id: 2, label: 'Second', occ: 1},
            ],
            link: { '1_2': { fromId: 1, toId: 2, coOcc: 1 } },
            nodeLastId: 2,
            labelIndex: { 'First': 1, 'Second': 2 },
            fromIndex:  Array.from({ 1: ['1_2'] }),
            toIndex: Array.from({ 2: ['1_2'] }),
        }])
        .pipe(ezs('ConceptNetworkState', { activate: [1, 2] }))
        .on('data', (data) => {
            expect(data).toBeInstanceOf(ConceptNetworkState);
            expect(data.nodeState).toBeDefined();
            expect(data.nodeState[1]).toEqual(100);
            expect(data.nodeState[2]).toEqual(100);
            done();
        })
        .on('error', done);
    });

    it('should return a ConceptNetworkState with activated node', (done) => {
        from([{
            node: [
                { id: 1, label: 'First', occ: 1},
                { id: 2, label: 'Second', occ: 1},
            ],
            link: { '1_2': { fromId: 1, toId: 2, coOcc: 1 } },
            nodeLastId: 2,
            labelIndex: { 'First': 1, 'Second': 2 },
            fromIndex:  Array.from({ 1: ['1_2'] }),
            toIndex: Array.from({ 2: ['1_2'] }),
        }])
        .pipe(ezs('ConceptNetworkState', { activate: [1], propagate: 'true' }))
        .on('data', (data) => {
            expect(data).toBeInstanceOf(ConceptNetworkState);
            expect(data.nodeState).toBeDefined();
            expect(data.nodeState[2]).toBeDefined();
            expect(data.nodeState[2]).toBeGreaterThan(0);
            done();
        })
        .on('error', done);
    });
});
