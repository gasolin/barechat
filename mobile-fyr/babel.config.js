export default {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          'barechat': '../cli',
          'barechat-rpc': '../rpc'
        },
      },
    ],
  ],
};