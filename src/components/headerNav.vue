<template>
  <div style="width: 100%">
    <div id="background">
      <img src="../components/ui/image/u1689.png" style="width: 100%;height: 83px">
      <div class="icon-text">
        <img class="icon-head" src="../components/ui/image/u1695.png"/>
        <span class="title-text">士继理工党建管理系统</span>
      </div>

    </div>
    <el-row>
      <el-col :span="14">
        <el-menu
          :default-active="activedMenu($route.path)"
          class="el-menu-demo"
          mode="horizontal"
          background-color="rgb(255,0,0)"
          text-color="#fff"
          active-text-color="white">
          <router-link to="dynamicContent" class="title">
            <el-menu-item style="height:45px;" index="1">党建动态</el-menu-item>
          </router-link>
          <router-link to="service" class="title">
            <el-menu-item style="height:45px;" index="2">党建服务</el-menu-item>
          </router-link>
          <router-link to="managementContent" class="title">
            <el-menu-item style="height:45px;" index="3">基础管理</el-menu-item>
          </router-link>

        </el-menu>
      </el-col>
      <el-col :span="10" class="el-col-user">


        <el-select v-model="organization" @change="getPosts" placeholder="请选择组织" class="select-organization">
          <el-option
            v-for="item in organizations"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="post" placeholder="请选择职务" @change="changeUser" class="select-position">
          <el-option
            v-for="item in posts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span @click="exitLogin" class="span-name">{{userInfo.userName}} <i
          class="el-icon-switch-button icon-logout"></i></span>
        <!--        <span>({{user.postName}})</span>-->
      </el-col>


    </el-row>


  </div>
</template>

<script>
    import {ChangeUserRoleApi} from "./ChangeUserRoleApi";
    import {Auth} from "../store/modules/auth";
    import {Msg} from "../tools/message";
    import {asyncRouterMap} from "../router";

    export default {
        name: "headerNav",
        data() {
            return {
                activeIndex: '/dynamicContent',
                userInfo: Auth.getUserInfo() || {},
                user: {},
                post: '',
                posts: [],
                organization: '',
                organizations: [],
                organizationRank: 0,
                flag: false,
                permissionList: asyncRouterMap
            };
        },
        created() {
            this.getOrganizationPost();
        },
        mounted() {
            this.getUserInfo();
        },
        methods: {
            activedMenu: function (val) {
                this.findPermissionParent(val, this.permissionList);
                return this.isNumber(this.activeIndex);
            },
            findPermissionParent(val, list) {
                for (var i = 0; i < list.length; i++) {
                    if (val === list[i].path) {
                        return val;
                    }
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].children && list[i].children.length > 0) {

                        if (this.findPermissionParent(val, list[i].children) != false) {
                            if (list[i].path === '/service' || list[i].path === '/dynamicContent' || list[i].path === '/managementContent') {
                                this.activeIndex = list[i].path;
                                return list[i].path;
                            } else {
                                return list[i].path;
                            }
                        }
                    }
                }
                return false;


            },
            isNumber(path) {
                if (path === '/service') {
                    return '2';
                } else if (path === '/dynamicContent') {
                    return '1';
                } else if (path === '/managementContent') {
                    return '3';
                } else return '1';
            },
            /** 退出登录 */
            exitLogin: function () {
                this.$confirm('确认退出登录？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    var data = {
                        account: Auth.getAccountPwd().account
                    }
                    this.$store.dispatch('accountLogoutSubmit', data).then((res) => {
                        this.$router.push({path: '/login'})
                    })
                    this.$router.push({path: '/login'});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                })
            },
            getOrganizationPost() {
                var user = Auth.getUser() || {};
                var userInfo = Auth.getUserInfo() || {};

                if (JSON.stringify(user) != "{}") {

                    if (userInfo.userId != user.userId) { // 不是当前用户
                        this.organization = user.organizationMsgList[0].organizationId;
                        this.post = user.organizationMsgList[0].postId;
                        this.flag = true;
                    } else {
                        this.organization = user.organizationId;
                        this.post = user.postId;
                        this.flag = true;
                    }

                }
            },
            // 获取用户信息
            getUserInfo() {
                var info = Auth.getUserInfo();
                this.organizations = [];
                for (var i = 0; i < info.organizationMsgList.length; i++) {
                    var organization = {
                        value: info.organizationMsgList[i].organizationId,
                        label: info.organizationMsgList[i].organizationName
                    }

                    this.organizations.push(organization);
                }
                if (!this.flag) {
                    this.organization = this.organizations[0].value;
                }


                this.getPosts(this.organization);
            },
            // 获取职务
            getPosts(value) {
                var info = Auth.getUserInfo();
                this.posts = [];
                this.organizationRank = 0; // 职务
                var index = -1;
                for (var i = 0; i < info.organizationMsgList.length; i++) {
                    if (info.organizationMsgList[i].organizationId === value) {
                        index = i;
                    }
                }

                var organizationInfo = info.organizationMsgList[index];
                this.organizationRank = organizationInfo.organizationRank;
                var postIds = organizationInfo.postId.split(',');
                var postNames = organizationInfo.postName.split(',');
                for (var i = 0; i < postIds.length; i++) {
                    var post = {
                        value: postIds[i],
                        label: postNames[i]
                    }

                    this.posts.push(post);
                }

                if (!this.flag) {
                    this.post = this.posts[0].value;
                }

                this.flag = false;

                this.changeUser();
            },
            // 改变职务
            changeUser() {

                const userInfo = {
                    userId: Auth.getUserInfo().userId,
                    userName: Auth.getUserInfo().userName,
                    partyId: Auth.getUserInfo().partyId,
                    organizationId: this.organization,
                    postId: this.post,
                    organizationRank: this.organizationRank
                };
                this.$store.dispatch('changeOrganizationPost', userInfo).then((res => {
                    // console.log(res);
                }))
                var params = {
                    account: Auth.getAccountPwd().account,
                    organizationId: this.organization,
                    postId: this.post
                }

                ChangeUserRoleApi.changeUserRole(params).then(res => {
                    if (res.data.code === 200) {
                        // Msg.success(res.data.message);
                    }
                })


            }
        }
    }
</script>

<style scoped>
  >>> .el-menu-item.is-active {
    background: #fff !important;
    color: red !important;
  }

  body {
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  .title {
    display: inline-block;
    font-family: "华文行楷 Bold", "华文行楷";
    font-weight: 700;
    font-style: normal;
    color: #ffffff;

  }

  >>> .el-menu-item {
    font-size: 17px;
  }


  .title-text {
    font-feature-settings: "kern" 1;
    font-family: 方正舒体;
    font-style: italic;
    font-size: 34px;
    font-weight: bolder;
    position: absolute;
    left: 5%;
    top: 22%;
    width: 500px;
  }


  .icon-head {

    width: 73px;
    height: 73px;

  }

  .icon-text {
    top: 1%;
    left: 1%;
    position: absolute;
    vertical-align: middle;
  }

  .el-col-user {
    height: 100%;
    border-bottom: 1px solid #fff;
    line-height: 46px;
  }

  .el-row {
    background-color: rgb(255, 0, 0);
    margin-top: -4px;
    height: 46px;
  }

  .span-name {
    cursor: pointer;
    color: #fff;
  }

  .icon-logout {
    font-size: 16px;
  }

  .select-position >>> input {
    width: 120px;
    background: rgb(255, 0, 0);
    border: none;
    color: #fff;
  }

  .select-organization >>> input {
    width: 280px;
    background: rgb(255, 0, 0);
    border: none;
    color: #fff;
  }

  .select-organization >>> .el-input__suffix {
    right: 20px;
  }

  .select-position >>> .el-input__suffix {
    right: 12px;
  }


</style>
