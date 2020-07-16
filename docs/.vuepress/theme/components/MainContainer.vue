<template>
  <div class="main-container">
    <Posts v-if="isPost" />
    <Content v-else class="main-content" />
  </div>
</template>

<script>
import Posts from  '@theme/components/Posts';
export default {

  data() {
    return {
      isPost: true
    }
  },
  components: {
    Posts
  },
  created() {
    this.handleRoute();
  },
  watch: {
    $route: 'handleRoute',
  },
  methods: {
    handleRoute(to, from) {
      this.isPost = this.$route.path === '/posts/'
      const path = this.$route.path.split('/');
      console.log(this.$route);
      console.log(path);
    }
  }
}
</script>

<style>

</style>
