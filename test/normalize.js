import t from 'tap';
import {_normalizeColor} from '../index.js';

t.test('normalizeColor', async t => {
  t.same(_normalizeColor('hsl(var(--single))'),
    {normalized: 'hsl(var(--single))', variables: ['var(--single)']});

  t.same(_normalizeColor('hsl(40, 100%, 99%)'),
    {normalized: 'hsl(40, 100%, 99%)', variables: ['', '', '']});

  t.same(_normalizeColor('hsl(var(--a), 30%, 20%)'),
    {normalized: 'hsl(0, 30%, 20%)', variables: ['var(--a)', '', '']});

  t.same(_normalizeColor('hsl(var(--a), 0%, 42%)'),
    {normalized: 'hsl(0, 0%, 42%)', variables: ['var(--a)', '', '']});

  t.same(_normalizeColor('hsl(40, var(--b), 20%)'),
    {normalized: 'hsl(40, 0%, 20%)', variables: ['', 'var(--b)', '']});

  t.same(_normalizeColor('hsl(40, var(--b), var(--c))'),
    {normalized: 'hsl(40, 0%, 0%)', variables: ['', 'var(--b)', 'var(--c)']});

  t.same(_normalizeColor('rgb(40, var(--b), var(--c))'),
    {normalized: 'rgb(40, 0, 0)', variables: ['', 'var(--b)', 'var(--c)']});

  t.same(_normalizeColor('#00ff00'),
    {normalized: '#00ff00', variables: ['', '', '']});
});
