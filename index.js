import Color from 'color';

const processed = Symbol();

const postcssColorVariableShorthand = (opts = {}) => {
  const colorSpace = opts.colorSpace || 'hsl';
  const modelSuffixRe = new RegExp('--' + colorSpace + '$');
  const suffixes = colorSpace === 'hsl' ? ['', '%', '%'] : ['', '', ''];

  return {
    postcssPlugin: 'postcss-color-variable-shorthand',
    Declaration(decl, _params) {
      if (!decl.prop.endsWith('--' + colorSpace)) return;
      if (decl[processed]) return;
      decl[processed] = true;

      const {normalized, variables} = _normalizeColor(decl.value);
      if (variables.length === 1) {
        decl.value = variables[0];
        decl.after(decl.prop.replace(modelSuffixRe, '') + `: ${colorSpace}(var(${decl.prop}))`);
      }
      else if (variables.length === 3) {
        try {
          const numeric = Color(normalized)[colorSpace]().array();
          for (let i = 0; i < variables.length; i++) {
            if (!variables[i]) variables[i] = numeric[i].toFixed(3) + suffixes[i];
          }

          decl.value = `${variables[0]}, ${variables[1]}, ${variables[2]}`;
          decl.after(decl.prop.replace(modelSuffixRe, '') + `: ${colorSpace}(var(${decl.prop}))`);
        }
        catch (err) {
          console.warn(`[color-variable-shorthand] Unable to parse declaration "${decl.prop}: ${decl.value}": Expect one or three variables/numbers.`);
        }
      }
      else {
        console.warn(`[color-variable-shorthand] Unable to parse declaration "${decl.prop}: ${decl.value}": Expect one or three variables/numbers.`);
      }
    },
  };
};

postcssColorVariableShorthand.postcss = true;

export default postcssColorVariableShorthand;

export function _normalizeColor(color) {
  if (color.match(/^\s*\#(\w{3,})/)) {
    return {normalized: color, variables: ['', '', '']};
  }

  let i = -1;
  const suffixes = color.match(/\bhsl\b/) ? ['', '%', '%'] : ['', '', ''];
  const variables = [];
  const normalized = color.replace(/var\([^)]+\)|\d[^, ]*/g, match => {
    i++;
    variables.push(match.startsWith('var') ? match : '');
    return match.startsWith('var') ? '0' + suffixes[i] : match;
  });

  return variables.length <= 1 ? {normalized: color, variables} : {normalized, variables};
}
