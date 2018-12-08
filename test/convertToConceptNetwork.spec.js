import from from 'from';
import ezs from 'ezs';
import statements from '../lib';
import { ConceptNetwork } from 'concept-network';

ezs.use(statements);

describe('convertToConceptNetwork', () => {
    it('should not crash when the stream is empty', (done) => {
        let res;
        from([])
            .pipe(ezs('convertToConceptNetwork'))
            .on('data', (data) => {
                res = data;
            })
            .on('end', () => {
                expect(res).not.toBeDefined();
                done();
            })
            .on('error', done)
    });

    it('should return when there is only one object', (done) => {
        let res = [];
        from([{ id: 1 }])
            .pipe(ezs('convertToConceptNetwork'))
            // .pipe(ezs('debug'))
            .on('data', (data) => {
                expect(data).not.toBeInstanceOf(Array);
                res = res.concat(data);
            })
            .on('end', () => {
                expect(res).toHaveLength(1);
                done();
            })
            .on('error', done);
    });

    it('should return when there is two objects', (done) => {
        let res = [];
        from([{ id: 1 }, { id: 2 }])
            .pipe(ezs('convertToConceptNetwork'))
            // .pipe(ezs('debug'))
            .on('data', (data) => {
                expect(data).not.toBeInstanceOf(Array);
                res = res.concat(data);
            })
            .on('end', () => {
                expect(res).toHaveLength(1);
                done();
            })
            .on('error', done);
    });

    it('should return when the input is an array', (done) => {
        let res = [];
        from([[{ id: 1 }]])
        .pipe(ezs('convertToConceptNetwork'))
        // .pipe(ezs('debug'))
        .on('data', (data) => {
            expect(data).not.toBeInstanceOf(Array);
            res = res.concat(data);
        })
        .on('end', () => {
            expect(res).toHaveLength(1);
            done();
        })
        .on('error', done);
    });

    it('should return a concept network', (done) => {
        from([{ id: 1 }])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn).toBeInstanceOf(ConceptNetwork);
            done();
        })
        .on('error', done);
    });

    it('should return a non-empty concept network', (done) => {
        from([{ id: 1 }])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn).toBeInstanceOf(ConceptNetwork);
            expect(cn.node).not.toEqual({});
            expect(cn.node[1]).toEqual({ id: 1, label: 'id:1', occ: 1});
            done();
        })
        .on('error', done);
    });

    it('should return a linked concept network', (done) => {
        from([{ title: 'Eliza', author: 'Weizenbaum' }])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn.node[1]).toEqual({ id: 1, label: 'title:Eliza', occ: 1});
            expect(cn.node[2]).toEqual({ id: 2, label: 'author:Weizenbaum', occ: 1});
            expect(cn.link).toEqual({
                '1_2': { coOcc: 1, fromId: 1, toId: 2 },
                '2_1': { coOcc: 1, fromId: 2, toId: 1 }
            });
            done();
        })
        .on('error', done);
    })
});
