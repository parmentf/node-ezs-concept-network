import from from 'from';
import ezs from 'ezs';
import statements from '../lib';

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
    })
});
