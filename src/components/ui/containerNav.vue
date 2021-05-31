<template>

    <el-container id="container">
      <el-header>  <header-nav></header-nav></el-header>
      <el-main><router-view style="height: 100%" /></el-main>
    </el-container>
</template>

<script>
  import headerNav from '@/components/headerNav'
    export default {
        name: "containerNav",
        components:{
          headerNav,
        }
    }
</script>

<style scoped>
  #container{
    height: 100%;
  }
  .el-header {
    height: 129px !important;
    padding: 0;
    text-align: center;
    /*line-height: 60px;*/
  }



  .el-main {
    padding: 0;
    height: 100%;
  }

  body > .el-container {
    height: 100%;
  }
</style>
