module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/sigma-man/' : '/',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#2f54eb',
            'link-color': '#597ef7',
            'border-radius-base': '2px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
};
