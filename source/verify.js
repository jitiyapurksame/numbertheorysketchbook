#!/usr/bin/env node
/*
 * verify.js — regression checks for J.J.'s Number Theory Sketchbook
 *
 * Run from the package root:   node source/verify.js
 * (or pass a folder:           node source/verify.js /path/to/folder)
 *
 * PART A  Structure   – every module compiles, braces balance, storage keys are unique
 *                       and match index.html, index links resolve, house-rule scaffolding present.
 * PART B  Math        – every hardcoded answer used in the modules is re-derived from a live
 *                       algorithm. If you add a new number to a module, add a check here too.
 *
 * PART C  Safety net  – every module merges old saves with defaults (mergeState), and the Ship's Log
 *                       (Restore Code + backup file) round-trips without losing or inventing progress.
 *
 * Exit code 0 = all good, 1 = at least one failure.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
let failures = 0, warnings = 0, passes = 0;
const ok   = m => { passes++;   console.log('  \u2713 ' + m); };
const bad  = m => { failures++; console.log('  \u2717 ' + m); };
const warn = m => { warnings++; console.log('  ! ' + m); };

/* ---------------------------------------------------------------- PART A */
console.log('\nPART A \u2014 structure (' + root + ')');

const moduleFiles = fs.readdirSync(root)
  .filter(f => /^module\d+_.*\.html$/.test(f))
  .sort((a, b) => parseInt(a.match(/module(\d+)/)[1]) - parseInt(b.match(/module(\d+)/)[1]));

if (moduleFiles.length === 15) ok('15 module files found'); else warn(moduleFiles.length + ' module files found (expected 15)');

const keysSeen = {};
const moduleKeys = {};
moduleFiles.forEach(f => {
  const n = parseInt(f.match(/module(\d+)/)[1]);
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const label = f.padEnd(30);

  // 1. script compiles
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) { bad(label + 'no <script> block'); return; }
  try { new vm.Script(m[1]); ok(label + 'JS compiles'); }
  catch (e) { bad(label + 'JS SYNTAX ERROR: ' + e.message); }

  // 2. balance (whole file, same method used during the build)
  const count = (s, c) => s.split(c).length - 1;
  const bal = [['{', '}'], ['(', ')'], ['[', ']']].every(([o, c]) => count(html, o) === count(html, c));
  if (bal) ok(label + 'braces/parens/brackets balance'); else bad(label + 'BRACKET IMBALANCE');

  // 3. storage key
  const k = html.match(/localStorage\.getItem\('([^']+)'\)/);
  if (!k) bad(label + 'no localStorage key found');
  else {
    moduleKeys[n] = k[1];
    if (keysSeen[k[1]]) bad(label + 'DUPLICATE storage key ' + k[1] + ' (also ' + keysSeen[k[1]] + ')');
    else { keysSeen[k[1]] = f; ok(label + 'unique storage key ' + k[1]); }
  }

  // 4. house-rule scaffolding
  ['viewport-fit=cover', 'safe-area-inset', 'storageBlocked', 'STAGE_LABELS', 'BOSS_DATA', 'BONUS_STEPS', 'showme', 'min-height:44px']
    .forEach(tok => { if (!html.includes(tok)) bad(label + 'missing scaffold token: ' + tok); });

  // 5. soft warnings
  if (html.includes("\\'")) warn(label + "contains \\' \u2014 prefer \\u2019 or double-quoted strings (apostrophe gotcha)");
  if (/\b(boss_reveal)\b/.test(html) && !/bonus_reveal/.test(html)) warn(label + 'boss_reveal without bonus_reveal');
});

// index.html
try {
  const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const m = idx.match(/const MODULES = (\[[\s\S]*?\]);/);
  const MODULES = vm.runInNewContext('(' + m[1] + ')');
  try { new vm.Script(idx.match(/<script>([\s\S]*)<\/script>/)[1]); ok('index.html JS compiles'); }
  catch (e) { bad('index.html JS SYNTAX ERROR: ' + e.message); }
  if (MODULES.length === 15) ok('index lists 15 modules'); else bad('index lists ' + MODULES.length + ' modules');
  MODULES.forEach(mod => {
    if (!fs.existsSync(path.join(root, mod.file))) bad('index link missing file: ' + mod.file);
    else if (mod.key === null) warn('index shows Module ' + mod.n + ' as Coming Soon (key: null)');
    else if (moduleKeys[mod.n] !== mod.key) bad('index key mismatch for Module ' + mod.n + ': index=' + mod.key + ' file=' + moduleKeys[mod.n]);
  });
  ok('index links + keys cross-checked');
} catch (e) { bad('index.html check failed: ' + e.message); }

/* ---------------------------------------------------------------- PART B */
console.log('\nPART B \u2014 math (live algorithms vs. hardcoded answers)');

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a * b / gcd(a, b);
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const digitSum = n => String(n).split('').reduce((a, d) => a + Number(d), 0);
const digitalRoot = n => { if (n === 0) return 0; let c = n; while (c > 9) c = digitSum(c); return c; };
const tri = n => n * (n + 1) / 2;
const fib = n => { let a = 1, b = 1; for (let i = 3; i <= n; i++) [a, b] = [b, a + b]; return b; };
const factorPairs = n => range(1, Math.floor(Math.sqrt(n))).filter(d => n % d === 0).map(d => [d, n / d]);
const spf = n => { for (let p = 2; p <= n; p++) if (n % p === 0) return p; return n; };
const primeFactors = n => { const out = []; while (n > 1) { const p = spf(n); out.push(p); n /= p; } return out; };
const euclid = (a, b) => { const steps = []; while (b !== 0) { const c = Math.floor(a / b); steps.push([a, b, c, a - c * b]); [a, b] = [b, a - c * b]; } return { steps, gcf: a }; };
const solutions = (a, b, c) => range(0, Math.floor(c / a)).filter(x => (c - a * x) % b === 0).map(x => [x, (c - a * x) / b]);
const J = JSON.stringify;

const checks = [
  // M1
  ['M1 rational conversions (0.75=3/4, 2.5=5/2, 3.5=7/2)', () => 0.75 === 3 / 4 && 2.5 === 5 / 2 && 3.5 === 7 / 2],
  ['M1 sqrt2 between 1 and 2; unit-square diagonal = sqrt2', () => Math.sqrt(2) > 1 && Math.sqrt(2) < 2 && Math.sqrt(1 + 1) === Math.sqrt(2)],
  ['M1 story hook: sqrt2 in tenths/hundredths/thousandths fits 14/141/1414 pieces, sliver 14%/42%/21%', () => [[10,14,14],[100,141,42],[1000,1414,21]].every(([n,k,p]) => Math.floor(Math.SQRT2*n) === k && Math.round((Math.SQRT2*n-k)*100) === p)],
  // M2
  ['M2 primes 20\u201330 = 23, 29', () => J(range(20, 30).filter(isPrime)) === '[23,29]'],
  ['M2 17 and 23 prime; 15 primes up to 50', () => isPrime(17) && isPrime(23) && range(2, 50).filter(isPrime).length === 15],
  ['M2 six twin-prime pairs up to 50', () => range(2, 48).filter(p => isPrime(p) && isPrime(p + 2)).length === 6],
  // M3
  ['M3 factor pairs 48', () => J(factorPairs(48)) === '[[1,48],[2,24],[3,16],[4,12],[6,8]]'],
  ['M3 factor pairs 36 end in [6,6]', () => J(factorPairs(36)) === '[[1,36],[2,18],[3,12],[4,9],[6,6]]'],
  ['M3 factor pairs 60 (6 pairs) and 24 (4 pairs)', () => factorPairs(60).length === 6 && factorPairs(24).length === 4],
  // M4
  ['M4 LCMs 4&6=12, 5&8=40, 3&4=12, 9&12=36, 3&6=6, 6&9=18', () => lcm(4, 6) === 12 && lcm(5, 8) === 40 && lcm(3, 4) === 12 && lcm(9, 12) === 36 && lcm(3, 6) === 6 && lcm(6, 9) === 18],
  // M5
  ['M5 digit sums 432\u21929, 275\u219214, 918\u219218, 4563\u219218', () => digitSum(432) === 9 && digitSum(275) === 14 && digitSum(918) === 18 && digitSum(4563) === 18],
  ['M5 divisibility: 432,918 by 9 yes; 275 no; 4563 by 3 and 9', () => 432 % 9 === 0 && 918 % 9 === 0 && 275 % 9 !== 0 && 4563 % 3 === 0 && 4563 % 9 === 0 && 4563 / 3 === 1521 && 4563 / 9 === 507],
  ['M5 1236: last two digits 36, 36/4=9, 1236/4=309', () => 36 / 4 === 9 && 1236 % 4 === 0 && 1236 / 4 === 309],
  ['M5 eleven-rule 2728: 8-2+7-2=11, 2728/11=248', () => 8 - 2 + 7 - 2 === 11 && 2728 % 11 === 0 && 2728 / 11 === 248],
  // M6
  ['M6 prime factorizations 72,60,84,90,48,120', () => J([72, 60, 84, 90, 48, 120].map(primeFactors)) === J([[2, 2, 2, 3, 3], [2, 2, 3, 5], [2, 2, 3, 7], [2, 3, 3, 5], [2, 2, 2, 2, 3], [2, 2, 2, 3, 5]])],
  ['M6 bonus brick counts: 100\u21924, 128\u21927', () => primeFactors(100).length === 4 && primeFactors(128).length === 7],
  // M7
  ['M7 GCF/steps for the six picker pairs', () => { const want = { '48,18': [6, 3], '36,24': [12, 2], '40,16': [8, 2], '56,24': [8, 2], '45,27': [9, 3], '72,20': [4, 4] }; return Object.keys(want).every(k => { const [a, b] = k.split(',').map(Number); const r = euclid(a, b); return r.gcf === want[k][0] && r.steps.length === want[k][1]; }); }],
  ['M7 boss: GCF(60,84)=12 \u2192 35 tiles; GCF(36,24)=12 \u2192 3 red + 2 blue; LCM(8,12)=24', () => gcd(60, 84) === 12 && (60 / 12) * (84 / 12) === 35 && gcd(36, 24) === 12 && 36 / 12 === 3 && 24 / 12 === 2 && lcm(8, 12) === 24],
  ['M7 boss cut-bars 84=1\u00d760+24, 60=2\u00d724+12, 24=2\u00d712; 12=1\u00d78+4, 8=2\u00d74', () => 84 === 60 + 24 && 60 === 2 * 24 + 12 && 24 === 2 * 12 && 12 === 8 + 4 && 8 === 2 * 4],
  ['M7 bonus: GCF(252,105)=21 in 3 cuts', () => { const r = euclid(252, 105); return r.gcf === 21 && r.steps.length === 3; }],
  // M8
  ['M8 border pattern (n+1)^2-n^2 = 2n+1 for n=3..8', () => range(3, 8).every(n => (n + 1) ** 2 - n * n === 2 * n + 1)],
  ['M8 boss: 12\u219213 adds 25; 4^3=64; 3^3=27, 6^3=216, ratio 8', () => 13 * 13 - 12 * 12 === 25 && 4 ** 3 === 64 && 3 ** 3 === 27 && 6 ** 3 === 216 && 216 / 27 === 8],
  // M9
  ['M9 mods: 53%8=5, 47%6=5, 100%9=1, 100%7=2', () => 53 % 8 === 5 && 47 % 6 === 5 && 100 % 9 === 1 && 100 % 7 === 2],
  ['M9 division identity for every picker K and modulus', () => [17, 23, 29, 34, 41].every(k => [5, 6, 7, 8, 12].every(n => Math.floor(k / n) * n + (k % n) === k))],
  // M10
  ['M10 picker parities (6,7,10,11,14,15) and scenarios 7+5 even, 8+5 odd, 8+6 even', () => [6, 10, 14].every(n => n % 2 === 0) && [7, 11, 15].every(n => n % 2 === 1) && (7 + 5) % 2 === 0 && (8 + 5) % 2 === 1 && (8 + 6) % 2 === 0],
  ['M10 sum of 7 odd numbers is always odd (deterministic 2000 trials)', () => { let s = 12345; const r = () => (s = (s * 1103515245 + 12345) % 2147483648); for (let t = 0; t < 2000; t++) { let sum = 0; for (let i = 0; i < 7; i++) sum += 2 * (r() % 10) + 1; if (sum % 2 !== 1) return false; } return 50 % 2 === 0; }],
  ['M10 pairing counts: 7 leftovers=3 pairs+1; 15=7 pairs+1; 7+5=6 pairs', () => 3 * 2 + 1 === 7 && 7 * 2 + 1 === 15 && 6 * 2 === 12],
  ['M10 chessboard: 64 squares, remove 2 same-colour corners \u2192 30 vs 32', () => 32 - 2 === 30],
  // M11
  ['M11 triangular 1..8 and T(12)=78, T(15)=120', () => J(range(1, 8).map(tri)) === '[1,3,6,10,15,21,28,36]' && tri(12) === 78 && tri(15) === 120],
  ['M11 Fibonacci F(10)=55 and sequence', () => J(range(1, 10).map(fib)) === '[1,1,2,3,5,8,13,21,34,55]'],
  ['M11 Gauss pairs 1+12=13, 2+11=13, 1+15=16, 2+14=16; pentagonal P(5)=35', () => 1 + 12 === 13 && 2 + 11 === 13 && 1 + 15 === 16 && 2 + 14 === 16 && 5 * (3 * 5 - 1) / 2 === 35],
  // M12
  ['M12 digital roots 9875\u21922, 6273\u21929, 4884\u21926, 12345\u21926, 999\u21929, 48\u21923', () => J([9875, 6273, 4884, 12345, 999, 48].map(digitalRoot)) === '[2,9,6,6,9,3]'],
  ['M12 casting out nines: 384\u00d727=10368 matches; 47\u00d786=4052 mismatches (true 4042)', () => { const chk = (a, b, c) => digitalRoot(digitalRoot(a) * digitalRoot(b)) === digitalRoot(c); return 384 * 27 === 10368 && chk(384, 27, 10368) && 47 * 86 === 4042 && !chk(47, 86, 4052); }],
  ['M12 6273 dr=9 and 6273/9=697; 9\u00d7n always dr 9', () => digitalRoot(6273) === 9 && 6273 / 9 === 697 && [7, 123, 58, 999, 4].every(n => digitalRoot(9 * n) === 9)],
  // M13
  ['M13 3x+5y=31 \u2192 (2,5),(7,2)', () => J(solutions(3, 5, 31)) === '[[2,5],[7,2]]'],
  ['M13 4x+3y=23 includes (2,5); 4x+7y=29 \u2192 only (2,3)', () => J(solutions(4, 3, 23)) === '[[2,5],[5,1]]' && J(solutions(4, 7, 29)) === '[[2,3]]'],
  ['M13 6x+9y=20 impossible (GCF 3 does not divide 20)', () => solutions(6, 9, 20).length === 0 && 20 % gcd(6, 9) !== 0],
  // M14
  ['M14 n^2+n+41 prime for n=0..39, composite at n=40 (=41^2)', () => range(0, 39).every(n => isPrime(n * n + n + 41)) && !isPrime(1681) && 1681 === 41 * 41 && 40 * 40 + 40 + 41 === 1681],
  ['M14 primes 3,5,7,11 odd; 2 even; 2+3 odd; 3+5 even; 4,6,8 composite', () => [3, 5, 7, 11].every(p => p % 2 === 1) && 2 % 2 === 0 && (2 + 3) % 2 === 1 && (3 + 5) % 2 === 0 && [4, 6, 8].every(n => !isPrime(n))],
  // M15
  ['M15 working backwards: 10\u219238 (3 hrs, /2+3) and 13\u219228 (2 hrs, /2+4)', () => { const f = (s, h, add) => { for (let i = 0; i < h; i++) s = s / 2 + add; return s; }; return f(38, 3, 3) === 10 && f(28, 2, 4) === 13; }],
  ['M15 invariants: 5 red of 8 (odd) can never reach 0/8 red; 4 of 6 (even) can reach 6', () => 5 % 2 === 1 && 0 % 2 === 0 && 8 % 2 === 0 && 4 % 2 === 0 && 6 % 2 === 0],
];

checks.forEach(([label, fn]) => {
  let res = false;
  try { res = !!fn(); } catch (e) { res = false; }
  if (res) ok(label); else bad(label);
});


/* ---------------------------------------------------------------- PART C */
console.log('\nPART C \u2014 safety net (safe merge, Restore Code, backup file)');

// C1. every module merges saved progress with defaults, and the merge behaves
moduleFiles.forEach(f => {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const label = f.padEnd(30);
  if (!/function mergeState\(/.test(html) || !/const DEFAULT_STATE = /.test(html) || !/mergeState\(DEFAULT_STATE, loadState\(\)\)/.test(html)) { bad(label + 'safe merge missing (mergeState / DEFAULT_STATE)'); return; }
  try {
    const fn = html.match(/function mergeState\([\s\S]*?\n\}\n/)[0];
    const def = html.match(/const DEFAULT_STATE = (\{[\s\S]*?\n\});/)[1];
    const ctx = vm.createContext({});
    vm.runInContext(fn + '\nconst DEFAULT_STATE = ' + def + ';', ctx);
    const run = code => JSON.parse(vm.runInContext('JSON.stringify(' + code + ')', ctx));
    const D = run('DEFAULT_STATE');
    const old = { stage: 3, completed: [true, true, true, false, false], boss_reveal: { 1: 2 }, brandNewField: 'kept' };
    vm.runInContext('var OLD = ' + JSON.stringify(old) + ';', ctx);
    const m1 = run('mergeState(DEFAULT_STATE, OLD)');
    const good =
      m1.stage === 3 && J(m1.completed) === '[true,true,true,false,false]' && m1.boss_reveal[1] === 2 &&
      m1.boss_reveal[2] === 0 && m1.boss_reveal[3] === 0 &&                         // missing sub-keys filled from defaults
      m1.brandNewField === 'kept' &&
      Object.keys(D).every(k => k in m1) &&                                         // every default field present
      J(run('mergeState(DEFAULT_STATE, null)')) === J(D) &&                         // first visit = defaults
      J(run('mergeState(DEFAULT_STATE, 42)')) === J(D) &&                           // junk in storage = defaults
      J(run('mergeState(DEFAULT_STATE, {completed:[true]})').completed) === '[true,false,false,false,false]';
    if (good) ok(label + 'safe merge keeps saved progress, fills new fields'); else bad(label + 'safe merge behaves wrongly');
    // a save with every field must come back unchanged
    vm.runInContext('var FULL = JSON.parse(JSON.stringify(DEFAULT_STATE)); FULL.completed = [true,true,false,true,false];', ctx);
    if (run('mergeState(DEFAULT_STATE, FULL)') && J(run('mergeState(DEFAULT_STATE, FULL)')) === J(run('FULL'))) ok(label + 'complete save passes through unchanged');
    else bad(label + 'complete save was altered by the merge');
  } catch (e) { bad(label + 'merge test crashed: ' + e.message); }
});

// C2. Ship's Log core (Restore Code + backup bundle)
try {
  const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const core = idx.match(/\/\/ ==BACKUP-CORE-START==([\s\S]*?)\/\/ ==BACKUP-CORE-END==/)[1];
  const ctx = vm.createContext({});
  vm.runInContext(core + '\nthis.api = {encodeRestoreCode, decodeRestoreCode, mergeCodeIntoRaw, buildBundle, readBundle, CODE_ALPHABET};', ctx);
  const A = ctx.api;
  let seed = 987654321; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const rand = () => Array.from({ length: 15 }, () => Array.from({ length: 5 }, () => rnd() < 0.5));
  const allF = Array.from({ length: 15 }, () => [false, false, false, false, false]);
  const allT = Array.from({ length: 15 }, () => [true, true, true, true, true]);

  const mats = [allF, allT].concat(Array.from({ length: 300 }, rand));
  const roundTrip = mats.every(mx => { const r = A.decodeRestoreCode(A.encodeRestoreCode(mx)); return r.ok && J(r.completed) === J(mx); });
  if (roundTrip) ok('Restore Code round-trips 302 progress patterns exactly'); else bad('Restore Code round-trip failed');

  const sample = A.encodeRestoreCode(rand());
  if (/^NTS(-[0-9A-HJKMNP-TV-Z]{5}){4}$/.test(sample)) ok('Restore Code looks like ' + sample); else bad('Restore Code format wrong: ' + sample);

  const lower = sample.toLowerCase().replace(/-/g, ' ');
  const sloppy = A.decodeRestoreCode('  ' + lower + '  ');
  if (sloppy.ok && J(sloppy.completed) === J(A.decodeRestoreCode(sample).completed)) ok('code accepts lowercase, spaces, missing dashes'); else bad('code is not forgiving about case/spaces');

  const mixed = A.decodeRestoreCode(sample.replace(/0/g, 'O').replace(/1/g, 'I'));
  if (mixed.ok && J(mixed.completed) === J(A.decodeRestoreCode(sample).completed)) ok('code reads O as 0 and I/L as 1'); else bad('code not forgiving of O/0, I/1');

  // any single wrong character must be refused (or, for the 4 padding bits, decode to identical data)
  const sampleMx = rand(), code = A.encodeRestoreCode(sampleMx);
  const chars = code.replace(/^NTS-/, '').replace(/-/g, '');
  let wrongAccepted = 0, tried = 0;
  for (let p = 0; p < chars.length; p++) for (const c of A.CODE_ALPHABET) {
    if (c === chars[p]) continue;
    tried++;
    const r = A.decodeRestoreCode('NTS' + chars.slice(0, p) + c + chars.slice(p + 1));
    if (r.ok && J(r.completed) !== J(sampleMx)) wrongAccepted++;
  }
  if (wrongAccepted === 0) ok('all ' + tried + ' one-character typos are refused or harmless'); else bad(wrongAccepted + ' typos silently changed the progress');

  if (!A.decodeRestoreCode('NTS-ABCDE').ok && !A.decodeRestoreCode('').ok && !A.decodeRestoreCode('NTS-UUUUU-UUUUU-UUUUU-UUUUU').ok) ok('short, empty and invalid-letter codes are refused'); else bad('a bad code was accepted');

  // adding a code never removes progress and keeps module fields
  const raw = JSON.stringify({ stage: 2, completed: [true, false, true, false, false], s1_number: 24 });
  const merged = JSON.parse(A.mergeCodeIntoRaw(raw, [false, true, false, false, false]));
  const fresh = JSON.parse(A.mergeCodeIntoRaw(null, [true, true, false, false, false]));
  const junk = JSON.parse(A.mergeCodeIntoRaw('{{not json', [false, false, true, false, false]));
  if (J(merged.completed) === '[true,true,true,false,false]' && merged.s1_number === 24 && merged.stage === 2 &&
      J(fresh.completed) === '[true,true,false,false,false]' && J(junk.completed) === '[false,false,true,false,false]') ok('adding a code only adds stages, keeps other saved fields');
  else bad('code merge lost or invented progress');

  // backup file round trip through a fake iPad
  const keys = Object.keys(moduleKeys).map(n => moduleKeys[n]);
  const device = {};
  keys.forEach((k, i) => { if (i % 3 !== 2) device[k] = JSON.stringify({ stage: i % 5, completed: [i % 2 === 0, true, false, i % 3 === 0, false], boss_reveal: { 1: 1, 2: 0, 3: 2 }, extra: ['a', i] }); });
  const compList = keys.map(k => { const o = device[k] ? JSON.parse(device[k]) : { completed: [] }; return [0, 1, 2, 3, 4].map(i => !!o.completed[i]); });
  const rawByKey = {}; keys.forEach(k => rawByKey[k] = device[k] || null);
  const bundleText = A.buildBundle(rawByKey, compList, '2026-11-21T00:00:00.000Z');
  const rb = A.readBundle(bundleText, keys);
  const restored = {}; if (rb.ok) Object.keys(rb.data).forEach(k => restored[k] = rb.data[k]);
  const sameKeys = J(Object.keys(restored).sort()) === J(Object.keys(device).sort());
  const sameText = Object.keys(device).every(k => restored[k] === device[k]);
  if (rb.ok && sameKeys && sameText && rb.skipped === 0) ok('backup file restores every saved module byte-for-byte (' + Object.keys(device).length + ' modules)'); else bad('backup file round-trip failed');
  const embedded = JSON.parse(bundleText).code;
  if (J(A.decodeRestoreCode(embedded).completed) === J(compList)) ok('backup file also carries a matching Restore Code'); else bad('code inside backup file does not match progress');

  const junkBundles = ['not json', '{}', '{"app":"other","data":{}}', J({ app: 'jj-number-theory-backup', data: {} }), J({ app: 'jj-number-theory-backup', data: { [keys[0]]: '{"stage":1}' } })];
  if (junkBundles.every(t => !A.readBundle(t, keys).ok)) ok('junk, foreign and empty backup files are refused'); else bad('a junk backup file was accepted');
  const partial = A.readBundle(J({ app: 'jj-number-theory-backup', data: { [keys[0]]: raw, [keys[1]]: 'garbage', 'evil_key': raw } }), keys);
  if (partial.ok && partial.skipped === 1 && J(Object.keys(partial.data)) === J([keys[0]])) ok('damaged entries are skipped; unknown keys are never written'); else bad('partial backup handled wrongly');

  // the page itself is wired up
  ['id="btn-copy"', 'id="btn-export"', 'id="file-import"', 'id="code-input"', 'navigator.share', 'safe-area-inset'].forEach(t => { if (!idx.includes(t)) bad('index.html missing: ' + t); });
  ok('Ship\u2019s Log controls present on index.html');
} catch (e) { bad('Ship\u2019s Log checks crashed: ' + e.message); }


/* ---------------------------------------------------------------- PART D */
console.log('\nPART D \u2014 Story Hooks & Name Tags (modules 2-15)');
const KNOWN_VIS = ['grids','strip','dial','pairs','stairs','double','chips','log','lights'];
moduleFiles.filter(f => !f.startsWith('module1_')).forEach(f => {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const label = f.padEnd(30);
  const m = html.match(/const SHK_DATA = (\{[\s\S]*?\});\n/);
  if (!m || !/function renderShk\(/.test(html) || !/state\.stage === 2 \? renderShk\(\)/.test(html)) { bad(label + 'Story Hook not wired in'); return; }
  try {
    const D = JSON.parse(m[1]);
    const steps = D.hook.steps;
    const okShape = steps.length === 3 && steps[2].note === true && !steps[0].note && !steps[1].note &&
      steps.every(st => typeof st.text === 'string' && st.text.length > 20 && (!st.vis || KNOWN_VIS.includes(st.vis.t))) &&
      D.tags.length >= 1 && D.tags.every(t => t.word && t.why && t.ex.length && t.eng);
    if (okShape) ok(label + 'hook (3 steps, ends in Engineer\u2019s Note) + ' + D.tags.length + ' name tag(s)'); else bad(label + 'hook/tag data malformed');
  } catch (e) { bad(label + 'SHK_DATA unreadable: ' + e.message); }
});
const gcdD = (a, b) => b ? gcdD(b, a % b) : a;
const factorsOf = n => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };
const primeFac = n => { const r = []; for (let p = 2; n > 1; p++) while (n % p === 0) { r.push(p); n /= p; } return r; };
const root9 = n => { while (n > 9) n = String(n).split('').reduce((a, d) => a + +d, 0); return n; };
const triple = [
  ['M2 hooks: 13 only 1x13; 12 splits 2x6 and 3x4; 2 is the only even prime', () => factorsOf(13).length === 2 && 12 % 2 === 0 && 12 / 2 === 6 && 12 % 3 === 0 && 12 / 3 === 4 && [2,3,5,7,11,13].filter(p => factorsOf(p).length === 2 && p % 2 === 0).join() === '2'],
  ['M3 hooks: factor pairs of 12 are 1x12, 2x6, 3x4 then repeat', () => J(factorsOf(12)) === '[1,2,3,4,6,12]' && 3 * 4 === 12 && 4 > Math.sqrt(12)],
  ['M4 hooks: Mario(4) and Luigi(6) first meet on 12, then 24', () => { const both = []; for (let k = 1; k <= 24; k++) if (k % 4 === 0 && k % 6 === 0) both.push(k); return J(both) === '[12,24]'; }],
  ['M5 hooks: 4+3+2=9, 432/9=48, 275 digit sum 14, 275 not divisible by 9', () => 4+3+2 === 9 && 432 / 9 === 48 && 2+7+5 === 14 && 275 % 9 === 5],
  ['M6 hooks: 60 = 6x10 = 4x15 = 2x2x3x5', () => J(primeFac(60)) === '[2,2,3,5]' && 6*10 === 60 && 4*15 === 60 && J(primeFac(6).concat(primeFac(10)).sort()) === '[2,2,3,5]' && J(primeFac(4).concat(primeFac(15)).sort()) === '[2,2,3,5]'],
  ['M7 hooks: GCF(48,18)=6, tiles 8 across 3 down, common sizes 1,2,3,6', () => gcdD(48, 18) === 6 && 48 / 6 === 8 && 18 / 6 === 3 && J(factorsOf(48).filter(x => 18 % x === 0)) === '[1,2,3,6]'],
  ['M8 hooks: 2^4=16 (not 2x4=8), 3^2=9, 3^3=27', () => 2 ** 4 === 16 && 2 * 4 === 8 && 3 ** 2 === 9 && 3 ** 3 === 27],
  ['M9 hooks: 100 = 14 laps of 7 + 2, so 100 mod 7 = 2', () => 14 * 7 === 98 && 100 - 98 === 2 && 100 % 7 === 2 && Math.floor(100 / 7) === 14],
  ['M10 hooks: 8 coins = 4 pairs; 7 = 3 pairs + 1; odd+odd is even', () => 8 / 2 === 4 && Math.floor(7 / 2) === 3 && 7 % 2 === 1 && (3 + 5) % 2 === 0],
  ['M11 hooks: 1+2+3+4=10, 4x5/2=10, Fibonacci 1,1,2,3,5,8', () => 1+2+3+4 === 10 && 4*5/2 === 10 && [1,1,2,3,5].every((v, i, a) => i < 2 || v === a[i-1] + a[i-2]) && 3 + 5 === 8],
  ['M12 hooks: 9875 -> 29 -> 11 -> 2; 47x86=4042; roots 2x5 -> 1 vs 4052 -> 2', () => 9+8+7+5 === 29 && 2+9 === 11 && 1+1 === 2 && 47*86 === 4042 && root9(47) === 2 && root9(86) === 5 && root9(2*5) === 1 && root9(4052) === 2 && root9(4042) === 1],
  ['M13 hooks: 3x2+5x5=31, 3x7+5x2=31, trading 5 threes for 3 fives', () => 3*2+5*5 === 31 && 3*7+5*2 === 31 && 3*5 === 5*3 && 2+5 === 7 && 5-3 === 2],
  ['M14 hooks: 3,5,7,11 are odd primes; 2 is the even prime', () => [3,5,7,11].every(p => factorsOf(p).length === 2 && p % 2 === 1) && factorsOf(2).length === 2 && 2 % 2 === 0],
  ['M15 hooks: flipping 2 lights changes reds by -2, 0 or +2; 5 is odd, 0 is even', () => { const d = new Set(); [[1,1],[1,0],[0,1],[0,0]].forEach(([a, b]) => d.add((a ? -1 : 1) + (b ? -1 : 1))); return J([...d].sort((x, y) => x - y)) === '[-2,0,2]' && 5 % 2 === 1 && 0 % 2 === 0; }]
];
triple.forEach(([name, fn]) => { let r = false; try { r = fn(); } catch (e) {} if (r) ok(name); else bad(name + ' \u2014 FAILED'); });


/* ---------------------------------------------------------------- PART E */
console.log('\nPART E \u2014 the cargo ship on the Ship\u2019s Bridge');
try {
  const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const core = idx.match(/\/\/ ==SHIP-CORE-START==([\s\S]*?)\/\/ ==SHIP-CORE-END==/)[1];
  const ctx = vm.createContext({});
  vm.runInContext(core + '\nthis.api = {SHIP_PARTS, shipStats};', ctx);
  const { SHIP_PARTS, shipStats } = ctx.api;
  const zeros = Array(15).fill(0), none = Array(15).fill(false);

  if (SHIP_PARTS.length === 15 && SHIP_PARTS.every((p, i) => p.n === i + 1) && new Set(SHIP_PARTS.map(p => p.id)).size === 15) ok('15 distinct ship parts, one per module'); else bad('ship parts are not 1-per-module');

  const shapeIds = [...idx.matchAll(/^  (\w+):'<(?:path|rect|circle)/gm)].map(m => m[1]);
  const shapesBlock = idx.match(/const SHIP_SHAPES = \{([\s\S]*?)\n\};/)[1];
  const missing = SHIP_PARTS.filter(p => !new RegExp('\\n  ' + p.id + ":'").test('\n' + shapesBlock)).map(p => p.id);
  if (!missing.length) ok('every part has a drawing'); else bad('parts without a drawing: ' + missing.join(','));

  const svgOk = SHIP_PARTS.every(p => {
    const m = shapesBlock.match(new RegExp('\\n  ' + p.id + ":'([^']*)'"));
    if (!m) return false; const t = m[1];
    const opens = (t.match(/<(path|rect|circle)\b/g) || []).length, closes = (t.match(/\/>/g) || []).length;
    return opens > 0 && opens === closes && !/<(g|svg)\b/.test(t);
  });
  if (svgOk) ok('every drawing is made of closed shapes only'); else bad('a ship drawing has an unclosed shape');

  const s0 = shipStats(zeros, none);
  if (s0.pct === 0 && s0.certified === 0 && s0.mode === 'start' && s0.next === 1 && s0.parts.every(p => p.op === 0)) ok('empty ship: 0%, Step 1 points at Module 1, nothing drawn yet'); else bad('empty-ship maths wrong');

  const st = shipStats(zeros.map((v, i) => i === 3 ? 1 : 0), none.map((v, i) => i === 3));
  if (st.parts[3].op >= 0.5 && st.pct > 0 && st.mode === 'keep' && st.next === 4) ok('ONE stage lights a visible piece (Step 1 beats perfection)'); else bad('first stage does not light a visible piece');

  const sg = shipStats(zeros, none.map((v, i) => i === 6));
  if (sg.parts[6].op > 0 && sg.parts[6].op < 0.5 && sg.pct === 0) ok('just opening a module draws a faint sketch, 0% built'); else bad('started-module sketch wrong');

  const half = shipStats([5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], none.map((v, i) => i < 3));
  if (half.certified === 2 && half.mode === 'keep' && half.next === 3 && half.pct === Math.round(((2 + 0.4) / 15) * 100)) ok('mixed progress: certified count, next part and percent are right'); else bad('mixed-progress maths wrong: ' + J(half));

  const all = shipStats(Array(15).fill(5), Array(15).fill(true));
  if (all.pct === 100 && all.certified === 15 && all.mode === 'launch' && all.next === null && all.parts.every(p => p.op === 1)) ok('finished ship: 100%, launch message'); else bad('finished-ship maths wrong');

  const monotone = shipStats([0, 1, 2, 3, 4, 5].concat(Array(9).fill(0)), none).parts.slice(0, 6).every((p, i, a) => i === 0 || p.op >= a[i - 1].op);
  if (monotone) ok('a part only gets clearer as stages are finished'); else bad('part brightness goes backwards');

  const clamp = shipStats(Array(15).fill(99), Array(15).fill(true));
  if (clamp.pct === 100) ok('odd saved values cannot push the ship past 100%'); else bad('stage count not clamped');

  ['id="shipcard"', 'renderShipCard()', 'function pickPart(', 'function cycleDemo(', 'PREVIEW ONLY'].forEach(t => { if (!idx.includes(t)) bad('index.html missing: ' + t); });
  ok('ship card, part picker and parent preview are wired in');
} catch (e) { bad('ship checks crashed: ' + e.message); }


/* ---------------------------------------------------------------- PART F */
console.log('\nPART F \u2014 Send to hub (Sketchbook code  ->  Hub snapshot)');
try {
  const hubPath = path.join(__dirname, 'hub-index.html');
  if (!fs.existsSync(hubPath)) throw new Error('source/hub-index.html is missing');
  const hub = fs.readFileSync(hubPath, 'utf8');
  const app = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  // app side: the real encoder + ship list
  const aCtx = vm.createContext({});
  vm.runInContext(app.match(/\/\/ ==SHIP-CORE-START==([\s\S]*?)\/\/ ==SHIP-CORE-END==/)[1] + app.match(/\/\/ ==BACKUP-CORE-START==([\s\S]*?)\/\/ ==BACKUP-CORE-END==/)[1] + '\nthis.api={SHIP_PARTS,encodeRestoreCode,decodeRestoreCode};', aCtx);
  const A = aCtx.api;
  const appShapes = vm.runInContext('(' + app.match(/const SHIP_SHAPES = (\{[\s\S]*?\n\});/)[1] + ')', vm.createContext({}));

  // hub side: the real receiving code, with a fake storage
  const start = hub.indexOf('var NTS_KEY = ');
  const end = hub.indexOf('// Link from the Sketchbook');
  if (start < 0 || end < 0) throw new Error('hub sync block not found');
  const store = {};
  const hCtx = vm.createContext({ SHIP_KEY: 'jj-hub-ship-v1', storageOk: true, window: {}, document: { getElementById: () => null },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } } });
  vm.runInContext(hub.slice(start, end) + '\nthis.api={ntsDecode,ntsStore,ntsLoad,ntsCounts,ntsClean,ntsReceive,ntsShipSvg,NTS_PART_IDS,NTS_SHAPES,EXTRA_KEYS,NTS_KEY};', hCtx);
  const H = hCtx.api;

  let seed = 424242; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const rand = () => Array.from({ length: 15 }, () => Array.from({ length: 5 }, () => rnd() < 0.5));
  const mats = Array.from({ length: 200 }, rand);
  if (mats.every(mx => { const d = H.ntsDecode(A.encodeRestoreCode(mx)); return d && J(d) === J(mx); })) ok('hub reads 200 codes made by the Sketchbook, exactly'); else bad('hub and Sketchbook disagree on the code format');

  if (J(H.NTS_PART_IDS) === J(A.SHIP_PARTS.map(p => p.id)) && A.SHIP_PARTS.every(p => hCtx.api.NTS_SHAPES[p.id] === appShapes[p.id])) ok('hub draws the very same 15 ship parts as the Sketchbook'); else bad('hub ship drawing differs from the Sketchbook ship');

  const svg = H.ntsShipSvg(rand());
  if ((svg.match(/<g style=/g) || []).length === 15 && (svg.match(/class="nts-o"/g) || []).length === 15 && svg.includes('<svg')) ok('fleet ship has 15 built parts + 15 outlines'); else bad('fleet ship drawing is wrong');

  const lo = Array.from({ length: 15 }, (v, m) => [m < 2, false, false, false, false]);
  const hi = Array.from({ length: 15 }, (v, m) => [m < 4, m < 4, m < 1, false, false]);
  const r1 = H.ntsReceive(A.encodeRestoreCode(hi)); const c1 = H.ntsCounts(H.ntsLoad().completed);
  const r2 = H.ntsReceive(A.encodeRestoreCode(lo)); const c2 = H.ntsCounts(H.ntsLoad().completed);
  if (r1.ok && r2.ok && c1.stages === 9 && c1.parts === 0 && J(c1) === J(c2)) ok('sending an older, smaller code never removes stages from the hub'); else bad('hub lost progress when an older code arrived');

  const before = store['jj-hub-nts-v1'];
  const bad1 = H.ntsReceive('NTS-AAAAA-AAAAA-AAAAA-AAAAB'), bad2 = H.ntsReceive(''), bad3 = H.ntsReceive('hello');
  if (!bad1.ok && !bad2.ok && !bad3.ok && store['jj-hub-nts-v1'] === before) ok('wrong or empty codes are refused and change nothing'); else bad('a wrong code changed the hub snapshot');

  const full = Array.from({ length: 15 }, () => [true, true, true, true, true]);
  H.ntsReceive(A.encodeRestoreCode(full)); const cf = H.ntsCounts(H.ntsLoad().completed);
  if (cf.stages === 75 && cf.parts === 15) ok('a finished ship reads 75/75 stages, 15/15 parts'); else bad('full ship counts wrong');

  if (H.ntsClean(null) === null && H.ntsClean({ completed: [[true]] }) === null && H.ntsClean('x') === null && H.ntsClean({ completed: Array(15).fill([1, 0, 'y']) }).completed[0].join() === 'true,false,true,false,false') ok('backup snapshots are cleaned; junk is refused'); else bad('snapshot cleaning is wrong');

  if (H.EXTRA_KEYS.includes('jj-hub-nts-v1') && H.EXTRA_KEYS.includes('jj-hub-ship-v1')) ok('the snapshot is part of the hub backup'); else bad('snapshot is not in the hub backup list');

  // the link the app builds is the link the hub reads
  const code = A.encodeRestoreCode(rand());
  const hash = '#nts=' + encodeURIComponent(code);
  const hubRe = hub.match(/\/\^#nts=\(\[\^&\]\+\)\//) ;
  const m = /^#nts=([^&]+)/.exec(hash);
  if (hubRe && m && decodeURIComponent(m[1]) === code && /HUB_URL \+ '#nts=' \+ encodeURIComponent\(/.test(app)) ok('the Send-to-hub link and the hub\u2019s link reader match'); else bad('link format mismatch between Sketchbook and hub');

  // voyage total
  const tot = [...hub.matchAll(/^      total: (\d+),$/gm)].map(x => +x[1]).reduce((a, b) => a + b, 0);
  if (hub.includes('id="voyage-num">0 / ' + (tot + 75) + '<')) ok('hub voyage bar starts at 0 / ' + (tot + 75) + ' (' + tot + ' on-site + 75 Number Theory stages)'); else bad('voyage default text does not match the totals (' + tot + ' + 75)');
} catch (e) { bad('send-to-hub checks crashed: ' + e.message); }

/* ---------------------------------------------------------------- SUMMARY */
console.log('\n' + passes + ' passed, ' + failures + ' failed, ' + warnings + ' warnings');
if (failures) { console.log('FAIL'); process.exit(1); }
console.log('ALL CLEAR');
