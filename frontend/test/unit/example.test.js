// example test
const assert = require('assert');

describe(
    'Frontend unit test',
    () => {
        it('should return true', () => {
            assert.equal(1, true)
        })
        it('should return false', () => {
            assert.equal(0, false);
        })
    }
)