var typescript = require('rollup-plugin-typescript2');
var babel = require('@rollup/plugin-babel');
var { extendDeep } = require('@jsmini/extend');

var pkg = require('../package.json');

var version = pkg.version;

var banner = `/*!
 * ${pkg.name} ${version} (https://github.com/sonusindhu/cyz-form)
 * API https://github.com/sonusindhu/cyz-form/blob/master/doc/api.md
 * Copyright 2017-${new Date().getFullYear()} Sonu Sindhu. All Rights Reserved
 * Licensed under MIT (https://github.com/sonusindhu/cyz-form/blob/master/LICENSE)
 */
`;

function getCompiler(opt) {
  opt = extendDeep(
    {
      tsconfigOverride: {
        compilerOptions: { target: 'es5', module: 'esnext' },
      },
    },
    opt,
  );
  return [
    typescript(opt),
    babel({
      babelrc: false,
      extensions: ['.js', '.mjs', '.ts'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: 'last 2 versions, > 1%, Android >= 8, iOS >= 10.3',
              node: '14',
            },
            modules: false,
            loose: false,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            versions: '^7.23.2',
            helpers: true,
            regenerator: false,
          },
        ],
      ],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
  ];
}

exports.name = 'CyzForm';
exports.banner = banner;
exports.getCompiler = getCompiler;
