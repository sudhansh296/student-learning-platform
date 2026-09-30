/* WebDev Atlas — tiny Jest / node:test compatible runner (describe, it, expect, jest.fn, hooks).
 * Tests register while your script runs and execute automatically once it finishes. Requires sim-core.js. */
(function (G) {
  'use strict';
  var sim = G.__sim, inspect = sim.inspect, isDeep = sim.isDeep, post = sim.post;

  var root = { name: '', tests: [], suites: [], before: [], after: [], beforeAll: [], afterAll: [], parent: null, only: false, skip: false };
  var cur = root, registered = 0;
  function suite(name, fn, skip) {
    var s = { name: name, tests: [], suites: [], before: [], after: [], beforeAll: [], afterAll: [], parent: cur, skip: skip || cur.skip };
    cur.suites.push(s); var prev = cur; cur = s; registered++;
    try { fn(); } catch (e) { post('e', 'Error in describe("' + name + '"): ' + e.message); } finally { cur = prev; }
  }
  function test(name, fn, opts) {
    if (typeof name === 'function') { fn = name; name = fn.name || '<anonymous>'; }
    if (typeof fn === 'object' && fn) { var t = fn; fn = opts; opts = t; }
    cur.tests.push({ name: name, fn: fn, skip: cur.skip || (opts && opts.skip) || !fn, todo: opts && opts.todo, timeout: (opts && opts.timeout) || 5000 }); registered++;
  }
  function describe(n, f) { suite(n, f, false); }
  describe.skip = function (n, f) { suite(n, f, true); };
  describe.only = describe;
  describe.each = function (rows) { return function (n, f) { rows.forEach(function (r) { var a = [].concat(r); suite(sim.format.apply(null, [n].concat(a)), function () { f.apply(null, a); }); }); }; };
  var it = function (n, f, o) { test(n, f, o); };
  it.skip = function (n, f) { test(n, f, { skip: true }); };
  it.todo = function (n) { test(n, null, { todo: true }); };
  it.only = it;
  it.each = function (rows) { return function (n, f) { rows.forEach(function (r) { var a = [].concat(r); test(sim.format.apply(null, [n].concat(a)), function () { return f.apply(null, a); }); }); }; };
  var T = function (n, f, o) { test(n, f, o); }; T.skip = it.skip; T.todo = it.todo; T.only = it; T.each = it.each; T.describe = describe; T.it = it; T.test = T;
  T.before = function (f) { cur.beforeAll.push(f); }; T.after = function (f) { cur.afterAll.push(f); }; T.beforeEach = function (f) { cur.before.push(f); }; T.afterEach = function (f) { cur.after.push(f); };

  /* ───── expect ───── */
  function asym(match, desc) { return { $$asym: true, match: match, toString: function () { return desc; } }; }
  function fmtv(v) { return inspect(v); }
  function makeExpect(actual, neg, mode) {
    var api = {};
    function check(pass, msg, exp) {
      if (neg ? pass : !pass) {
        var e = new sim.AssertionError({ message: (neg ? 'expect(received).not.' : 'expect(received).') + msg + '\n\nReceived: ' + fmtv(actual) + (exp !== undefined ? '\nExpected: ' + (neg ? 'not ' : '') + fmtv(exp) : ''), actual: actual, expected: exp, operator: msg });
        throw e;
      }
    }
    var M = {
      toBe: function (x) { check(Object.is(actual, x), 'toBe(expected)', x); },
      toEqual: function (x) { check(isDeep(actual, x, false), 'toEqual(expected)', x); },
      toStrictEqual: function (x) { check(isDeep(actual, x, true), 'toStrictEqual(expected)', x); },
      toBeTruthy: function () { check(!!actual, 'toBeTruthy()'); }, toBeFalsy: function () { check(!actual, 'toBeFalsy()'); },
      toBeNull: function () { check(actual === null, 'toBeNull()'); }, toBeUndefined: function () { check(actual === undefined, 'toBeUndefined()'); }, toBeDefined: function () { check(actual !== undefined, 'toBeDefined()'); },
      toBeNaN: function () { check(actual !== actual, 'toBeNaN()'); },
      toBeGreaterThan: function (x) { check(actual > x, 'toBeGreaterThan(expected)', x); }, toBeGreaterThanOrEqual: function (x) { check(actual >= x, 'toBeGreaterThanOrEqual(expected)', x); },
      toBeLessThan: function (x) { check(actual < x, 'toBeLessThan(expected)', x); }, toBeLessThanOrEqual: function (x) { check(actual <= x, 'toBeLessThanOrEqual(expected)', x); },
      toBeCloseTo: function (x, d) { check(Math.abs(actual - x) < Math.pow(10, -(d === undefined ? 2 : d)) / 2, 'toBeCloseTo(expected)', x); },
      toContain: function (x) { check(actual != null && (typeof actual === 'string' ? actual.indexOf(x) >= 0 : Array.from(actual).indexOf(x) >= 0), 'toContain(expected)', x); },
      toContainEqual: function (x) { check(Array.from(actual).some(function (v) { return isDeep(v, x, false); }), 'toContainEqual(expected)', x); },
      toHaveLength: function (n) { check(actual != null && actual.length === n, 'toHaveLength(expected)', n); },
      toHaveProperty: function (p, v) { var parts = Array.isArray(p) ? p : String(p).split('.'), o = actual, ok = o != null; parts.forEach(function (k) { if (ok && o != null && k in Object(o)) o = o[k]; else ok = false; }); check(ok && (arguments.length < 2 || isDeep(o, v, false)), 'toHaveProperty(path' + (arguments.length > 1 ? ', value' : '') + ')', arguments.length > 1 ? v : p); },
      toMatch: function (x) { check(typeof x === 'string' ? String(actual).indexOf(x) >= 0 : x.test(String(actual)), 'toMatch(expected)', x); },
      toMatchObject: function (x) { function m(a, b) { if (b && b.$$asym) return b.match(a); if (typeof b !== 'object' || b === null) return isDeep(a, b, false); return a != null && typeof a === 'object' && Object.keys(b).every(function (k) { return m(a[k], b[k]); }); } check(m(actual, x), 'toMatchObject(expected)', x); },
      toBeInstanceOf: function (C) { check(actual instanceof C, 'toBeInstanceOf(expected)', C); },
      toThrow: function (x) {
        var threw = false, err; try { actual(); } catch (e) { threw = true; err = e; }
        var ok = threw && (x === undefined || (typeof x === 'string' ? String(err && err.message).indexOf(x) >= 0 : x instanceof RegExp ? x.test(String(err && err.message)) : typeof x === 'function' ? err instanceof x : true));
        check(ok, 'toThrow(expected)', x);
      },
      toHaveBeenCalled: function () { check(actual.mock.calls.length > 0, 'toHaveBeenCalled()'); },
      toHaveBeenCalledTimes: function (n) { check(actual.mock.calls.length === n, 'toHaveBeenCalledTimes(expected)', n); },
      toHaveBeenCalledWith: function () { var a = Array.prototype.slice.call(arguments); check(actual.mock.calls.some(function (c) { return isDeep(c, a, false); }), 'toHaveBeenCalledWith(...args)', a); },
      toHaveBeenLastCalledWith: function () { var a = Array.prototype.slice.call(arguments), c = actual.mock.calls; check(c.length > 0 && isDeep(c[c.length - 1], a, false), 'toHaveBeenLastCalledWith(...args)', a); },
      toHaveReturnedWith: function (v) { check(actual.mock.results.some(function (r) { return isDeep(r.value, v, false); }), 'toHaveReturnedWith(expected)', v); }
    };
    M.toBeCalled = M.toHaveBeenCalled; M.toBeCalledWith = M.toHaveBeenCalledWith; M.toThrowError = M.toThrow;
    Object.keys(M).forEach(function (k) {
      api[k] = mode ? function () { var a = arguments; return Promise.resolve(actual).then(function (v) { if (mode === 'rejects') throw new Error('Received promise resolved instead of rejected\nResolved to value: ' + fmtv(v)); return makeExpect(v, neg)[k].apply(null, a); }, function (e) { if (mode === 'resolves') throw e; return makeExpect(mode === 'rejects' ? (k === 'toThrow' ? function () { throw e; } : e) : e, neg)[k].apply(null, a); }); } : M[k];
    });
    return api;
  }
  function expect(actual) {
    var a = makeExpect(actual, false);
    a.not = makeExpect(actual, true);
    a.resolves = makeExpect(actual, false, 'resolves'); a.rejects = makeExpect(actual, false, 'rejects');
    a.rejects.not = makeExpect(actual, true, 'rejects'); a.resolves.not = makeExpect(actual, true, 'resolves');
    return a;
  }
  expect.any = function (C) { return asym(function (v) { return C === Number ? typeof v === 'number' : C === String ? typeof v === 'string' : C === Boolean ? typeof v === 'boolean' : C === Function ? typeof v === 'function' : v instanceof C; }, 'Any<' + (C && C.name) + '>'); };
  expect.anything = function () { return asym(function (v) { return v !== null && v !== undefined; }, 'Anything'); };
  expect.objectContaining = function (o) { return asym(function (v) { return v != null && Object.keys(o).every(function (k) { return isDeep(v[k], o[k], false); }); }, 'ObjectContaining'); };
  expect.arrayContaining = function (a) { return asym(function (v) { return Array.isArray(v) && a.every(function (x) { return v.some(function (y) { return isDeep(y, x, false); }); }); }, 'ArrayContaining'); };
  expect.stringContaining = function (s) { return asym(function (v) { return typeof v === 'string' && v.indexOf(s) >= 0; }, 'StringContaining'); };
  expect.stringMatching = function (r) { return asym(function (v) { return typeof v === 'string' && new RegExp(r).test(v); }, 'StringMatching'); };

  /* ───── jest.fn / spyOn ───── */
  function fn(impl) {
    var once = [], base = impl, retVal, hasRet = false;
    var mock = function () {
      var args = Array.prototype.slice.call(arguments), r, res;
      mock.mock.calls.push(args); mock.mock.instances.push(this);
      try {
        if (once.length) r = once.shift().apply(this, args); else if (hasRet) r = retVal; else if (base) r = base.apply(this, args);
        res = { type: 'return', value: r };
      } catch (e) { res = { type: 'throw', value: e }; mock.mock.results.push(res); throw e; }
      mock.mock.results.push(res); return r;
    };
    mock._isMock = true; mock.mock = { calls: [], results: [], instances: [] };
    mock.mockImplementation = function (f) { base = f; hasRet = false; return mock; };
    mock.mockImplementationOnce = function (f) { once.push(f); return mock; };
    mock.mockReturnValue = function (v) { retVal = v; hasRet = true; return mock; };
    mock.mockReturnValueOnce = function (v) { once.push(function () { return v; }); return mock; };
    mock.mockResolvedValue = function (v) { return mock.mockImplementation(function () { return Promise.resolve(v); }); };
    mock.mockResolvedValueOnce = function (v) { return mock.mockImplementationOnce(function () { return Promise.resolve(v); }); };
    mock.mockRejectedValue = function (v) { return mock.mockImplementation(function () { return Promise.reject(v); }); };
    mock.mockRejectedValueOnce = function (v) { return mock.mockImplementationOnce(function () { return Promise.reject(v); }); };
    mock.mockClear = function () { mock.mock = { calls: [], results: [], instances: [] }; return mock; };
    mock.mockReset = function () { mock.mockClear(); base = undefined; hasRet = false; once = []; return mock; };
    mock.mockRestore = mock.mockReset;
    mock.getMockName = function () { return 'jest.fn()'; };
    return mock;
  }
  var spies = [];
  var jest = {
    fn: fn, mock: function () { }, unmock: function () { }, clearAllMocks: function () { }, resetAllMocks: function () { }, restoreAllMocks: function () { spies.forEach(function (r) { r(); }); spies = []; },
    spyOn: function (obj, name) { var orig = obj[name], m = fn(function () { return orig.apply(this, arguments); }); m.mockRestore = function () { obj[name] = orig; }; obj[name] = m; spies.push(function () { obj[name] = orig; }); return m; },
    setTimeout: function () { }, useFakeTimers: function () { return jest; }, useRealTimers: function () { return jest; }, isMockFunction: function (f) { return !!(f && f._isMock); }
  };

  /* ───── runner ───── */
  function timeoutP(p, ms, name) { return new Promise(function (res, rej) { var t = setTimeout(function () { rej(new Error('Timeout: "' + name + '" did not finish within ' + ms + ' ms')); }, ms); Promise.resolve(p).then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); }); }); }
  function call(f, name, ms) {
    return timeoutP(new Promise(function (res, rej) {
      if (f.length > 0) { try { f(function (e) { if (e) rej(e); else res(); }); } catch (e) { rej(e); } }
      else { try { res(f()); } catch (e) { rej(e); } }
    }), ms || 5000, name);
  }
  function chain(s, key) { var out = [], p = s; while (p) { out = (key === 'before' ? p[key].concat(out) : out.concat(p[key])); p = p.parent; } return out; }
  var stats = { pass: 0, fail: 0, skip: 0, todo: 0 }, failures = [];
  async function runSuite(s, depth) {
    var pad = '  '.repeat(depth);
    if (s.name) post('l', pad + s.name);
    for (var b of s.beforeAll) { try { await call(b, 'beforeAll'); } catch (e) { post('e', pad + '  ✗ beforeAll hook failed: ' + e.message); stats.fail++; return; } }
    for (var t of s.tests) {
      if (t.todo) { stats.todo++; post('w', pad + '  ✎ todo ' + t.name); continue; }
      if (t.skip) { stats.skip++; post('w', pad + '  ○ skipped ' + t.name); continue; }
      var t0 = performance.now(), err = null;
      try {
        var befores = chain(s, 'before'); for (var bf of befores) await call(bf, 'beforeEach');
        await call(t.fn, t.name, t.timeout);
      } catch (e) { err = e; }
      try { var afters = chain(s, 'after'); for (var af of afters) await call(af, 'afterEach'); } catch (e2) { err = err || e2; }
      var ms = Math.round(performance.now() - t0);
      if (err) { stats.fail++; failures.push({ name: t.name, err: err }); post('e', pad + '  ✗ ' + t.name + ' (' + ms + ' ms)\n' + pad + '      ' + String(err && err.message || err).split('\n').join('\n' + pad + '      ')); }
      else { stats.pass++; post('l', pad + '  ✓ ' + t.name + ' (' + ms + ' ms)'); }
    }
    for (var c of s.suites) await runSuite(c, s.name ? depth + 1 : depth);
    for (var a of s.afterAll) { try { await call(a, 'afterAll'); } catch (e3) { post('e', pad + '  ✗ afterAll hook failed: ' + e3.message); } }
  }
  sim.hasTests = function () { return registered > 0; };
  sim.runTests = async function () {
    if (!registered) return false;
    post('l', '');
    await runSuite(root, 0);
    var total = stats.pass + stats.fail + stats.skip + stats.todo;
    post(stats.fail ? 'e' : 'l', '\nTests:  ' + (stats.fail ? stats.fail + ' failed, ' : '') + stats.pass + ' passed' + (stats.skip ? ', ' + stats.skip + ' skipped' : '') + (stats.todo ? ', ' + stats.todo + ' todo' : '') + ', ' + total + ' total');
    return true;
  };
  sim.testStats = stats;

  var defs = { describe: describe, it: it, test: test, expect: expect, jest: jest, beforeEach: T.beforeEach, afterEach: T.afterEach, beforeAll: T.beforeAll = function (f) { cur.beforeAll.push(f); }, afterAll: T.afterAll = function (f) { cur.afterAll.push(f); }, vi: jest };
  test.skip = it.skip; test.todo = it.todo; test.only = it; test.each = it.each;
  Object.keys(defs).forEach(function (k) { if (!(k in G)) G[k] = defs[k]; });
  T.suite = describe;
  sim.register('test', T); sim.register('node:test', T);
  sim.register('@jest/globals', { describe: describe, it: it, test: test, expect: expect, jest: jest, beforeEach: T.beforeEach, afterEach: T.afterEach, beforeAll: defs.beforeAll, afterAll: defs.afterAll });
  sim.register('vitest', { describe: describe, it: it, test: test, expect: expect, vi: jest, beforeEach: T.beforeEach, afterEach: T.afterEach, beforeAll: defs.beforeAll, afterAll: defs.afterAll });
})(window);
