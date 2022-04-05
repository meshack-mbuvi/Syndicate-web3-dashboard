var path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-next-router'
  ],
  staticDirs: ['../public'],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '..', 'src'),
      functions: path.resolve(__dirname, '..', 'functions'),
      src: path.resolve(__dirname, '..', 'src')
    };
    return config;
  }
};
