import less from '@wcj/rollup-plugin-less';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/FancyProductDesigner.js',
    format: 'es'
  },
  plugins: [
    less.default({}),
  ]
}