<template>
  <div id="header" class="header page-wrapper">
    <a-row class="page">
      <a-col :sm="24" :md="6">
        <a class="logo" href="/">
          <Logo width="30" height="30" />
          <span class="logo-text">SIGMA</span>
        </a>
      </a-col>
      <a-col :sm="0" :md="18">
        <div class="menu">
          <a-menu mode="horizontal">
            <a-menu-item key="home">
              <router-link to="/">首页</router-link>
            </a-menu-item>
            <a-menu-item key="posts">
              <router-link to="/posts">博客</router-link>
            </a-menu-item>
            <a-menu-item key="about">
              <router-link to="/about">关于我</router-link>
            </a-menu-item>
            <!--            <a-menu-item key="mail23">-->
            <!--              <router-link to="/tools">工具</router-link>-->
            <!--            </a-menu-item>-->
          </a-menu>
          <a href="https://github.com/tinyking" target="_blank" class="gitbtn">Github</a>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Logo from '@theme/components/Logo.vue';

export default {
  name: 'Header',
  components: { Logo }
};
</script>

<style scoped></style>
