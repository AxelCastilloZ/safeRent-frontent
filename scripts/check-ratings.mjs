import assert from 'node:assert/strict';
import { ratingSummary } from '../src/Modules/Comments/utils/ratings.ts';

assert.deepEqual(ratingSummary([]), { count: 0, average: null });
assert.deepEqual(ratingSummary([{ rating: null }, {}, { rating: 0 }, { rating: 6 }, { rating: 2.5 }]), { count: 0, average: null });
assert.deepEqual(ratingSummary([{ rating: 5 }, { rating: 4 }, { rating: null }, {}]), { count: 2, average: 4.5 });
assert.deepEqual(ratingSummary([{ rating: 1 }, { rating: 5 }]), { count: 2, average: 3 });
console.log('Ratings: empty, legacy, invalid and scored comments passed.');
