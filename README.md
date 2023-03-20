# PostCSS color variable shorthand

## Introduction

[PostCSS](https://github.com/postcss/postcss) plugin that expands color
variables to make it quicker to define reusable CSS color variables.

By adding a `--hsl` or `--rgb` suffix (See example usage below) to the
variable name, this plugin will automatically expand one line of CSS into
two. This is useful in case you want to use the same color for `hsla()`.

## Usecase

You have defined a bunch of colors in your existig stylesheet, but then
later on you want to use the same colors with alpha, or you have just gotten
tired of HEX and RGB and want to use HSL instead.

```css
/* Starting point */
--bakground-color: rgb(240, 240, 240);
--text-color: #446677;

/* To get this working _without_ this plugin, you would have to delete most
 * of what you already have, write six new lines of CSS and also figure out
 * what #446677 is in RGB.
 */
--background-color-vars: 240, 240, 240;
--bakground-color: rgb(--background-color-vars);
--bakground-color-alpha: rgba(--background-color-vars, 0.9);
--text-color-vars: 68, 102, 183;
--text-color: rgb(--text-color-vars);
--text-color-alpha: rgba(--text-color-vars, 0.7);

/* To get this working _with_ this plugin, you only need to add "--hsl" at the
 * end of the existing variable names and define the two new "-alpha" colors.
 */
--bakground-color--hsl: rgb(240, 240, 240);
--text-color--hsl: #446677;
--bakground-color-alpha: hsla(--background-color--hsl, 0.9);
--text-color-alpha: hsla(--text-color--hsl, 0.7);
```

## Example

**Example input**

```css
:root {
  --grey-hue: 205;
  --text-color--hsl: hsl(var(--grey-hue), 20%, 94%);
  --black--hsl: #040404;
}
```

**Example output**

```css
:root {
  --grey-hue: 205;
  --text-color--hsl: var(--grey-hue), 20%, 94%;
  --text-color: hsl(var(--text-color--hsl));
  --black--hsl: 0, 0%, 1.569%;
  --black: hsl(var(--black--hsl));
}
```

## Usage

The example usage below will produce the "hsl" output above, but `colorSpace`
can also be "rgb" if you prefer that over "hsl".

```js
import postcssColorVariableShorthand from 'postcss-color-variable-shorthand';

const config = {
  plugins: [
    postcssColorVariableShorthand({colorSpace: 'hsl'}),
  ],
};

export default config;
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your
environment.

***

MIT © [Jan Henning Thorsen](https://thorsen.pm)
