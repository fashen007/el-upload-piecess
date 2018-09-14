<template>
  <div id="app">
    <upload :uploadText='uploadText' @uploaded='uploaded'></upload>
  </div>
</template>

<script>
import upload from './components/upload.vue'

export default {
  name: 'App',
  components: {
    upload
  },
  data () {
    return {
      uploadText: '测试上传'
    }
  },
  methods: {
    uploaded (data) {
      console.log('上传完毕', data)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
