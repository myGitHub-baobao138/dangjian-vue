<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="230px" class="el-menu-vertical-demo">
        <el-menu class="el-menu-vertical-demo" router
                 :default-active="$route.path"
                 :unique-opened="true">


          <el-submenu index="/activityManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span slot="title">志愿活动管理</span>
            </template>
            <el-menu-item index="/checkActivity">志愿活动审核管理</el-menu-item>
            <el-menu-item index="/register">活动报名管理</el-menu-item>
          </el-submenu>

          <el-submenu index="/threeLessons">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span slot="title">三会一课</span>
            </template>
            <el-menu-item index="/three">三会一课管理</el-menu-item>
            <el-menu-item index="/summary">纪要管理</el-menu-item>
          </el-submenu>

          <el-menu-item index="/leave">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>留言管理</span>
            </template>
          </el-menu-item>

          <el-menu-item index="/vote">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>投票管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/turn">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>转组织关系</span>
            </template>
          </el-menu-item>


          <el-submenu index="/onlineAnswer">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span slot="title">在线答题</span>
            </template>

            <el-menu-item index="/questions">考题管理</el-menu-item>
            <el-menu-item index="/questionsRecord">答题记录管理</el-menu-item>
            <el-menu-item index="/questionsClassify">问题分类管理</el-menu-item>
            <el-menu-item index="/questionBank">题库管理</el-menu-item>
          </el-submenu>

          <el-menu-item index="/themeDay">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>党主题日管理</span>
            </template>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-main>
        <breadcrumb></breadcrumb>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
    import breadcrumb from "../../components/breadcrumb";

    export default {
        name: "serviceContent",
        components: {
            breadcrumb
        },
    }
</script>

<style scoped>
  .el-aside {
    /*line-height: 200px;*/
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow: -moz-scrollbars-none; /* 旧版本Firefox*/
    -webkit-transition: all .3s ease-in-out;
    transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out, 0.3s padding-right ease-in-out;
  }

  .el-aside::-webkit-scrollbar { /* Chrome */
    display: none;
  }

  body {
    background-color: rgb(255, 243, 217);
  }

  a {
    text-decoration: none;
  }

  .el-menu-vertical-demo {
    min-height: 100%;
    background-color: rgb(255, 243, 217);
    text-align: left
  }

  .img-emblem {
    width: 30px;
    border-radius: 50%
  }
</style>
