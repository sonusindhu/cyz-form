// rollup.config.js
// ES output
var common = require('./rollup.cjs');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cyz-form.esm.js',
      format: 'es',
      // When export and export default are not used at the same time, set legacy to true.
      // legacy: true,
      name: common.name,
      banner: common.banner,
      sourcemap: true,
    },
    {
      file: 'dist/cyz-form.mjs',
      format: 'es',
      // legacy: true,
      name: common.name,
      banner: common.banner,
      sourcemap: true,
    },
  ],
  plugins: [...common.getCompiler()],
};
