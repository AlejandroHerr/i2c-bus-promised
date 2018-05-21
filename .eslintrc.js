module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-bitwise': 0,
    'flowtype/delimiter-dangle': [
      2,
      'always-multiline',
    ],
    'flowtype/generic-spacing': [
      2,
      'never',
    ],
    'flowtype/no-primitive-constructor-types': 2,
    'flowtype/no-types-missing-file-annotation': 2,
    'flowtype/no-weak-types': 2,
    'flowtype/object-type-delimiter': [
      2,
      'comma',
    ],
    'flowtype/require-parameter-type': 2,
    'flowtype/require-return-type': [
      0,
    ],
    'flowtype/require-valid-file-annotation': 2,
    'flowtype/semi': [
      2,
      'always',
    ],
    'flowtype/space-after-type-colon': [
      2,
      'always',
    ],
    'flowtype/space-before-generic-bracket': [
      2,
      'never',
    ],
    'flowtype/space-before-type-colon': [
      2,
      'never',
    ],
    'flowtype/type-id-match': [
      2,
      '^([A-Z][a-z0-9]+)+Type$',
    ],
    'flowtype/union-intersection-spacing': [
      2,
      'always',
    ],
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1,
    'flowtype-errors/show-errors': 2,
    'no-warning-comments': [1, { "terms": ["$FlowFixMe", "TODO"], "location": "anywhere" }],
  },
  plugins: [
    'flowtype',
    'flowtype-errors',
  ],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
};
