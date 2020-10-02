// example test
describe(
    'Frontend end to end API test',
    () => {
        it('should return true', () => {
            const val = true
            expect(val).toBeTruthy()
            expect(val).toEqual(true);
        });
    }
);