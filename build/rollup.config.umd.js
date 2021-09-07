import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'distLinkage',
    file: 'dist/distLinkage.umd.js',
    format: 'umd'
  },
})

export default config