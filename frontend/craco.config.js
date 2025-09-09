const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
    },
  }
}