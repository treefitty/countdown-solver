const argv = require('minimist')(process.argv.slice(2));

// Countdown rules: every intermediate result must be a positive integer.
// Each op takes a >= b and returns 0 when the result isn't allowed.
const ops = [
    ['+', (a, b) => a + b],
    ['*', (a, b) => a * b],
    ['-', (a, b) => a - b],
    ['/', (a, b) => (a % b === 0 ? a / b : 0)],
];

// An item is { val, e } where e is a number or [op, left, right].
// Strings are only built for results worth reporting.
// + and * sort their operands so a + b and b + a de-duplicate.
function str(e) {
    if (typeof e === 'number') return String(e);
    const [op, l, r] = e;
    const parts = [str(l), str(r)];
    if (op === '+' || op === '*') parts.sort();
    return `(${parts[0]} ${op} ${parts[1]})`;
}

/**
 * Finds the expressions closest to `target` using any subset of `nums`.
 * Repeatedly combines any two remaining items with any op, and records
 * every item produced along the way (so subsets come for free).
 *
 * @returns {{ distance: number, solutions: { expr: string, val: number }[] }}
 */
function solve(nums, target) {
    let best = Infinity;
    const found = new Map(); // expr -> val

    const record = ({ val, e }) => {
        const d = Math.abs(val - target);
        if (d > best) return;
        if (d < best) {
            best = d;
            found.clear();
        }
        found.set(str(e), val);
    };

    const search = items => {
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const [x, y] = items[i].val >= items[j].val ? [items[i], items[j]] : [items[j], items[i]];
                const rest = items.filter((_, k) => k !== i && k !== j);

                for (const [op, fn] of ops) {
                    const val = fn(x.val, y.val);
                    if (val <= 0) continue;

                    const item = { val, e: [op, x.e, y.e] };
                    record(item);
                    if (rest.length) search([...rest, item]);
                }
            }
        }
    };

    const items = nums.map(n => ({ val: n, e: n }));
    items.forEach(record);
    search(items);

    return { distance: best, solutions: [...found].map(([expr, val]) => ({ expr, val })) };
}

function fail(msg) {
    console.error(`ERROR: ${msg}\n\n` +
        'Usage: node index.js [--set "<numbers>" --target <number>]\n' +
        '--set     Space or comma separated positive integers\n' +
        '--target  Integer to reach (required if --set is given)');
    process.exit(1);
}

function main() {
    let set = argv.set, target = argv.target;

    if (set === undefined) {
        set = '50 8 3 7 2 10';
        target = 556;
        console.log('Parameters not provided, using demo set -> [50 8 3 7 2 10] and target -> 556');
    }

    const nums = String(set).split(/[\s,]+/).filter(Boolean).map(Number);
    if (!nums.length || !nums.every(n => Number.isInteger(n) && n > 0)) fail('--set must be positive integers');
    if (!Number.isInteger(target)) fail('--target must be an integer');

    const { distance, solutions } = solve(nums, target);

    console.log(`Input values: ${nums}`);
    console.log(`Target: ${target}`);
    console.log(distance === 0 ? 'Solutions:' : `No exact solution, closest is ${distance} away:`);
    solutions.forEach(s => console.log(`${s.expr} = ${s.val}`));
    console.log(`Found: ${solutions.length}`);
}

if (require.main === module) main();

module.exports = { solve };
