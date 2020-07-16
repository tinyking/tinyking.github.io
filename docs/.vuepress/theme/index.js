const path = require('path');

module.exports = (options, ctx) => {
  const { sep } = path;
  const { themeConfig, siteConfig, sourceDir } = ctx;


  return {
    chainWebpack: config => {

      console.error('sssssss')
      config.module
        .rule('less')
        .oneOf('normal')
        .use('less-loader')
        .options({ javascriptEnabled: true })
        .end()
        .end()
        .oneOf('modules')
        .use('less-loader')
        .options({ javascriptEnabled: true });
    },
    ready() {
      ctx.addPage({
        path: '/'
      })
    }
  };
};
