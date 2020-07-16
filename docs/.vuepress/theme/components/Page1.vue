<template>
  <div class="home-page-wrapper page1">
    <div class="home-page">
      <h1>三大特征</h1>
      <div class="page-content">
        <a-row>
          <a-col
            class="page1-item"
            v-for="item in items"
            :key="item.title"
            :xs="24"
            :md="8"
            style="opacity: 1; transform: translate(0px, 0px);"
          >
            <router-link to="/" class="page1-item-link">
              <div class="point-wrapper"></div>
              <div class="page1-item-img">
                <img :src="item.img" alt="img" />
              </div>
              <div class="page1-item-title">{{ item.title }}</div>
            </router-link>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page1',
  data() {
    return {
      items: [
        { img: 'https://gw.alipayobjects.com/zos/rmsportal/QCcDSfdbCIbVSsUZJaQK.svg', title: '设计指引' },
        { img: 'https://gw.alipayobjects.com/zos/rmsportal/hMSnSxMzmiGSSIXxFtNf.svg', title: 'Sketch资源包' },
        { img: 'https://gw.alipayobjects.com/zos/rmsportal/OMEOieDFPYDcWXMpqqzd.svg', title: '响应式布局' }
      ]
    };
  }
};
</script>

<style scoped></style>
