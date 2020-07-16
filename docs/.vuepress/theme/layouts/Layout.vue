<template>
  <div :class="{ 'theme-container': true, home: $page.frontmatter.home }">
    <div class="header">
      <div class="header-placeholder"></div>
      <Header />
    </div>

    <Home v-if="$page.frontmatter.home" />
    <Aboutme v-else-if="$page.frontmatter.about" />
    <MainContainer v-else/>

    <Footer />
  </div>
</template>

<script>
import Header from '@theme/components/Header.vue';
import Footer from '@theme/components/Footer';
import Home from '@theme/components/Home';
import Aboutme from '@theme/components/Aboutme'
import MainContainer from '@theme/components/MainContainer'

export default {
  components: { Home, Header, Footer, Aboutme, MainContainer }
};
</script>
