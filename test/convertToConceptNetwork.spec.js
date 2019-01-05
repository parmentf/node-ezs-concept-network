import from from 'from';
import ezs from 'ezs';
import statements from '../lib';
import { cnGetLink } from 'concept-network/lib/concept-network';

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
            expect(cn).toEqual({
                node: [{ label: 'id:1', occ: 1}]
            });
            done();
        })
        .on('error', done);
    });

    it('should return a non-empty concept network', (done) => {
        from([{ id: 1 }])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn).toHaveProperty('node');
            expect(cn.node).not.toEqual({});
            expect(cn).toEqual({
                node: [{ label: 'id:1', occ: 1 }]
            })
            done();
        })
        .on('error', done);
    });

    it('should return a linked concept network', (done) => {
        from([{ title: 'Eliza', author: 'Weizenbaum' }])
        .pipe(ezs('convertToConceptNetwork'))
        .on('data', (cn) => {
            expect(cn.node[0]).toEqual({ label: 'title:Eliza', occ: 1});
            expect(cn.node[1]).toEqual({ label: 'author:Weizenbaum', occ: 1});
            expect(cn.link).toEqual([
                { coOcc: 1, from: 0, to: 1 },
                { coOcc: 1, from: 1, to: 0 }
            ]);
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
            expect(cn.node[0]).toEqual({ label: 'title:Eliza', occ: 1 });
            expect(cn.node[1]).toEqual({ label: 'author:Weizenbaum', occ: 2 });
            expect(cn.node[2]).toEqual({ label: 'title:Computing machinery and intelligence', occ: 1 });
            expect(cn.node[3]).toEqual({ label: 'author:Turing', occ: 1 });
            expect(cn.node[4]).toEqual({ label: 'title:Computer power and human reason: From judgment to calculation', occ: 1 });
            expect(cnGetLink(cn, 'title:Eliza', 'author:Weizenbaum')).toEqual({ coOcc: 1, from: 0, to: 1 });
            expect(cnGetLink(cn, 'author:Weizenbaum', 'title:Eliza')).toEqual({ coOcc: 1, from: 1, to: 0 });
            expect(cnGetLink(cn, 'author:Weizenbaum', 'title:Computer power and human reason: From judgment to calculation'))
                .toEqual({ coOcc: 1, from: 1, to: 4 });
            expect(cnGetLink(cn, 'title:Computing machinery and intelligence', 'author:Turing'))
                .toEqual({ coOcc: 1, from: 2, to: 3 });
            expect(cnGetLink(cn, 'author:Turing', 'title:Computing machinery and intelligence'))
                .toEqual({ coOcc: 1, from: 3, to: 2 });
            expect(cnGetLink(cn, 'title:Computer power and human reason: From judgment to calculation', 'author:Weizenbaum'))
                .toEqual({ coOcc: 1, from: 4, to: 1 });
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
        // .pipe(ezs('debug'))
        .on('data', (cn) => {
            expect(cn.node[0]).toEqual({ label: 'title:Eliza', occ: 1 });
            expect(cn.node[1]).toEqual({ label: 'author:Weizenbaum', occ: 2 });
            expect(cn.node[2]).toEqual({ label: 'year:1966', occ: 1 });
            expect(cn.node[3]).toEqual({ label: 'title:Computing machinery and intelligence', occ: 1 });
            expect(cn.node[4]).toEqual({ label: 'author:Turing', occ: 1 });
            expect(cn.node[5]).toEqual({ label: 'year:2009', occ: 2 });
            expect(cnGetLink(cn, 'year:2009', 'author:Turing')).toEqual({ coOcc: 1, from: 5, to: 4 });
            expect(cnGetLink(cn, 'year:2009', 'author:Parmentier')).toEqual({ coOcc: 1, from: 5, to: 9 });
            expect(cnGetLink(cn, 'author:Turing', 'year:2009')).toEqual({ coOcc: 1, from: 4, to: 5 });
            expect(cnGetLink(cn, 'author:Parmentier', 'year:2009')).toEqual({ coOcc: 1, from: 9, to: 5 });
            done();
        })
        .on('error', done);
    })
});
