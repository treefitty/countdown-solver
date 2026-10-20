
# Countdown solver

Countdown is a TV show that had a segment where the contestants would be asked to select a random set of predetermined numbers and a random target value, then write a formula (with only the common arithmetic operations) to get as close to the target as possible.

## Execute

Install dependencies

```bash
npm i
```

To run the demo set

```bash
npm start
```

To invoke with your own set pass space (or comma) separated positive integers and a target value, like so:

```bash
$> node index.js --set '3 6 10' --target 9
Input values: 3,6,10
Target: 9
Solutions:
(3 + 6) = 9
Found: 1
```

If the target can't be reached exactly, the closest results are shown instead:

```bash
$> node index.js --set '1 1' --target 5
Input values: 1,1
Target: 5
No exact solution, closest is 3 away:
(1 + 1) = 2
Found: 1
```

Run the checks with `npm test`.

## Example

Given the set `[50, 8, 3, 7, 2, 10]`, reaching `556` has plenty of solutions:

```
Input values: 50,8,3,7,2,10
Target: 556
Solutions:
((((50 + 8) - 2) * 10) - (7 - 3)) = 556
(((((50 + 8) - 2) * 10) + 3) - 7) = 556
(((((50 + 8) - 2) * 10) - 7) + 3) = 556
((((2 * 3) + 7) * (50 - 8)) + 10) = 556
((((50 - 8) - 3) * (2 * 7)) + 10) = 556
(((((50 - 8) - 3) * 7) * 2) + 10) = 556
...
Found: 62
```

These equations can of course be independently verified by running them in the Chrome console (or evaluating them in Javascript).

## The solution

Still brute force, but it follows the real rules:

1. Pick any two remaining numbers, combine them with `+`, `-`, `*` or `/`, and recurse on the result plus whatever is left. Any grouping, such as `(a + b) * (c + d)`, falls out of this.
1. Every intermediate result must be a positive integer, as in the show: no negatives, no fractions.
1. Every result along the way is a candidate, so a subset of the numbers can be used.
1. Only the results closest to the target are kept, so an exact match is simply distance 0.
1. Equivalent expressions (`a + b` vs `b + a`) are de-duplicated.
