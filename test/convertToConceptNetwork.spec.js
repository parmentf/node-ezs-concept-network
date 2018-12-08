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
    });

    it('should return a linked concept network with right coOcc and occ', (done) => {
        from([
            { title: 'Eliza', author: 'Weizenbaum' },
            { title: 'Computing machinery and intelligence', author: 'Turing' },
            { title: 'Computer power and human reason: From judgment to calculation', author: 'Weizenbaum' }
        ])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn.node[1]).toEqual({ id: 1, label: 'title:Eliza', occ: 1 });
            expect(cn.node[2]).toEqual({ id: 2, label: 'author:Weizenbaum', occ: 2 });
            expect(cn.node[3]).toEqual({ id: 3, label: 'title:Computing machinery and intelligence', occ: 1 });
            expect(cn.node[4]).toEqual({ id: 4, label: 'author:Turing', occ: 1 });
            expect(cn.node[5]).toEqual({ id: 5, label: 'title:Computer power and human reason: From judgment to calculation', occ: 1 });
            expect(cn.link).toEqual({
                '1_2': { coOcc: 1, fromId: 1, toId: 2 },
                '2_1': { coOcc: 1, fromId: 2, toId: 1 },
                '2_5': { coOcc: 1, fromId: 2, toId: 5 },
                '3_4': { coOcc: 1, fromId: 3, toId: 4 },
                '4_3': { coOcc: 1, fromId: 4, toId: 3 },
                '5_2': { coOcc: 1, fromId: 5, toId: 2 }
            });
            done();
        })
        .on('error', done);
    })

    it('should return a linked concept network with right coOcc', (done) => {
        from([
            { title: 'Eliza', author: 'Weizenbaum', year: 1966 },
            { title: 'Computing machinery and intelligence', author: 'Turing', year: 2009 },
            { title: 'Computer power and human reason: From judgment to calculation', author: 'Weizenbaum', year: 1976 },
            { title: 'Is verbal–spatial binding in working memory impaired by a concurrent memory load?', author: 'Parmentier', year: 2009 }
        ])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn.node[1]).toEqual({ id: 1, label: 'title:Eliza', occ: 1 });
            expect(cn.node[2]).toEqual({ id: 2, label: 'author:Weizenbaum', occ: 2 });
            expect(cn.node[3]).toEqual({ id: 3, label: 'year:1966', occ: 1 });
            expect(cn.node[4]).toEqual({ id: 4, label: 'title:Computing machinery and intelligence', occ: 1 });
            expect(cn.node[5]).toEqual({ id: 5, label: 'author:Turing', occ: 1 });
            expect(cn.node[6]).toEqual({ id: 6, label: 'year:2009', occ: 2 });
            expect(cn.link['6_5']).toEqual({ coOcc: 1, fromId: 6, toId: 5 });
            expect(cn.link['6_10']).toEqual({ coOcc: 1, fromId: 6, toId: 10 });
            expect(cn.link['5_6']).toEqual({ coOcc: 1, fromId: 5, toId: 6 });
            expect(cn.link['10_6']).toEqual({ coOcc: 1, fromId: 10, toId: 6 });
            done();
        })
        .on('error', done);
    })
});
