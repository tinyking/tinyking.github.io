<template>
  <div class="posts-container">
    <a-row type="flex">
      <div style="width: 30%; max-width: 30%;" v-for="post in $posts" >
        <a-col style="padding-left: 8px; padding-right: 8px; margin-bottom: 16px;">
           <router-link :to="post.path">
          <a-card hoverable>
            <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png"
            />
            <a-card-meta :title="post.title">
              <template slot="description">
                {{post.frontmatter.desc}}
              </template>
            </a-card-meta>
            <div class="posts-card-addtional">
              <a-row type="flex" justify="space-between">
                <a-col>
                  <a-icon type="calendar" />
                  <span>{{post.frontmatter.date}}</span>
                </a-col>
                <a-col>
                </a-col>
              </a-row>
            </div>
          </a-card>
           </router-link>
        </a-col>
      </div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Posts'
};
</script>

<style>
.posts-card-addtional {
  margin-top: 20px;
}
</style>
