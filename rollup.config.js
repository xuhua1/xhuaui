import babel from 'rollup-plugin-babel'
import clear from 'rollup-plugin-clear'
import postcss from 'rollup-plugin-postcss'
// import { uglify } from "rollup-plugin-uglify"
import fs from 'fs'
import path from 'path'

const componentsDir = 'src/components'
const cModuleNames = fs.readdirSync(path.resolve(componentsDir))

const excloudArray = [];
const cModuleMap = cModuleNames
  .filter(item => {
    return item.indexOf('.') < 0 && excloudArray.indexOf(item) < 0;
  })
  .reduce((prev, name) => {
    prev[name] = `${componentsDir}/${name}/index.js`
    return prev
  }, {})
console.log(cModuleMap)
export default {
  input: {
    index: './src/index.js',
    ...cModuleMap
  },
  output: {
    dir: 'es',
    format: 'cjs',
    entryFileNames: '[name]/index.js'
  },
  plugins: [
    clear({ targets: ['lib'] }),
    postcss({
      extensions: [".less", ".css"],
      extract: false, // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
    }),
    babel(),
    // uglify()
  ],
  external: [
    'react',
    'react-router-dom',
    'rmc-feedback',
    'prop-types',
    'classnames',
  ]
}