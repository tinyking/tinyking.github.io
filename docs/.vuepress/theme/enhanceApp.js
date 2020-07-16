import './styles/index.less';

import Antd from 'ant-design-vue';

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Antd);

  console.log(siteData);
  Vue.prototype.$posts = getPosts(siteData);
};


export function getPosts(siteData) {
  const {pages} = siteData;

  let posts = [];

  if (pages && pages.length) {
    posts = pages.filter(page => {
      const {date} = page.frontmatter;
      return !(date === undefined) && page.regularPath.startsWith('/posts/')
    });

    posts.sort((a, b) => {
      return b.frontmatter.date.localeCompare(a.frontmatter.date);
    });
  }

  return posts;
}
