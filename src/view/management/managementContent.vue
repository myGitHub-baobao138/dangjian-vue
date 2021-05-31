<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="230px" class="el-menu-vertical-demo">
        <el-menu class="el-menu-vertical-demo" router
                 :default-active="$route.path"
                 :unique-opened="true">

          <el-menu-item index="/organization">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>组织架构</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/partyMemberManagement">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>党员管理</span>
            </template>
          </el-menu-item>

          <el-menu-item index="/userManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>用户管理</span>
            </template>
          </el-menu-item>

          <el-menu-item index="/authenticationManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>认证管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/officeManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>职务管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/authorityManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>权限管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/systemNotice">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>系统公告</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/operationLog">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>操作日志</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/accountManage">
            <template slot="title">
              <img src="../service/u1695.png" class="img-emblem">
              <span>后台账号管理</span>
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

<script>    import breadcrumb from "../../components/breadcrumb";

export default {
    name: "managementContent",
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
