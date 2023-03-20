import t from 'tap';
import postcss from 'postcss';
import postcssColorVariableShorthand from '../index.js';
import {_normalizeColor} from '../index.js';

const splitRules = (str) => str.replace(/(\S);(\S)/, '$1;\n$2').split(/\r?\n/);
const transform = (input, opts = {}) => postcss([postcssColorVariableShorthand(opts)]).process(input);
const trim = (str) => str.replace(/\s+/g, '');

t.test('return original', async t => {
  const input = 'a { color: blue; }';
  const res = await transform(input);
  t.same(res.css, input);
});

t.test('transform hsl', async (t) => {
  const res = await transform('--grey-50--hsl: hsl(205, 20%, 94%);\n--spacing: 1rem;');
  t.same(splitRules(res.css).map(trim), [
    '--grey-50--hsl:205.000,20.000%,94.000%;',
    '--grey-50:hsl(var(--grey-50--hsl));',
    '--spacing:1rem;',
  ]);
});

t.test('transform hex to hsl', async (t) => {
  const res = await transform('--color-a--hsl: #ff0044;\n--color-b--hsl: #f67;\n--spacing: 2rem;');
  t.same(splitRules(res.css).map(trim), [
    '--color-a--hsl:344.000,100.000%,50.000%;',
    '--color-a:hsl(var(--color-a--hsl));',
    '--color-b--hsl:353.333,100.000%,70.000%;',
    '--color-b:hsl(var(--color-b--hsl));',
    '--spacing:2rem;',
  ]);
});

t.test('transform hsl with one variable', async (t) => {
  const res = await transform('--grey-50--hsl: hsl(var(--grey-hue), 20%, 94%);\n--spacing: 3rem;');
  t.same(splitRules(res.css).map(trim), [
    '--grey-50--hsl:var(--grey-hue),20.000%,94.000%;',
    '--grey-50:hsl(var(--grey-50--hsl));',
    '--spacing:3rem;',
  ]);
});

t.test('transform hsl with two variables', async (t) => {
  const aax = await transform('--abc--hsl: hsl(var(--a), var(--b), 90%);\n--spacing: 4rem;');
  t.same(splitRules(aax.css).map(trim), [
    '--abc--hsl:var(--a),var(--b),90.000%;',
    '--abc:hsl(var(--abc--hsl));',
    '--spacing:4rem;',
  ]);

  const xaa = await transform('--abc--hsl: hsl(40, var(--a), var(--b));\n--spacing: 4rem;');
  t.same(splitRules(xaa.css).map(trim), [
    '--abc--hsl:40.000,var(--a),var(--b);',
    '--abc:hsl(var(--abc--hsl));',
    '--spacing:4rem;',
  ]);
});

t.test('transform hsl with only variable', async (t) => {
  const res = await transform('--primary--hsl: hsl(var(--grey-50--hsl));\n--spacing: 4rem;');
  t.same(splitRules(res.css).map(trim), [
    '--primary--hsl:var(--grey-50--hsl);',
    '--primary:hsl(var(--primary--hsl));',
    '--spacing:4rem;',
  ]);
});
