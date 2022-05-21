import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

export default [
  {
    input: './src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
      }),
      external(),
      resolve(),
      filesize(),
      process.env.NODE_ENV === 'production' && terser(),
    ],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/veen-data-kit.es.js',
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },{
        file: 'dist/veen-data-kit.umd.js',
        format: 'umd',
        name: 'VeenDataKit',
        globals: {
          react: 'React',
          axios: 'Axios',
          'react-redux': 'ReactRedux',
          'redux-saga': 'ReduxSaga',
          'redux-saga/effects': 'ReduxSaga/Effects',
          'redux-logger': 'ReactLogger',
          'redux': 'Redux',
          'lodash/get': 'Lodash/Get',
          'lodash/set': 'Lodash/Set',
          'lodash/identity': 'Lodash/Identity',
          'lodash/identity': 'Lodash/Identity',
          'immer': 'Immer',
        },
      }
    ]
  }
];