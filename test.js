const assert = require('assert');
const { solve } = require('./index');

// subsets are allowed: 3 + 6 without the 10
assert(solve([3, 6, 10], 9).solutions.some(s => s.expr === '(3 + 6)'));

// (a op b) op (c op d) shapes: 22 and 23 are only reachable this way
assert.strictEqual(solve([1, 2, 3, 4], 22).distance, 0);
assert.strictEqual(solve([1, 2, 3, 4], 23).distance, 0);

// unreachable target falls back to the closest result
assert.strictEqual(solve([1, 1], 5).distance, 3);

// every reported expression really evaluates to its value, as integers all the way
const { solutions } = solve([50, 8, 3, 7, 2, 10], 556);
assert(solutions.length > 0);
solutions.forEach(s => {
    assert.strictEqual(s.val, 556);
    assert.strictEqual(eval(s.expr), 556);
    assert(!s.expr.includes('(7 / 2)'));
});

console.log('ok');
