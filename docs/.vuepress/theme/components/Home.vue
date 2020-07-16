<template>
  <div class="home-wrapper">
    <Banner />
    <Page1 />
  </div>
</template>

<script>
import Banner from '@theme/components/Banner';
import Page1 from './Page1';
export default {
  name: 'Home',
  components: { Banner, Page1 }
};
</script>

<style></style>
