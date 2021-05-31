<template>
  <el-container style="height: 100%">
    <el-aside width="230px" class="el-menu-vertical-demo">
      <el-menu class="el-menu-vertical-demo"
               router
               :default-active="$route.path"
               :unique-opened="true">
        <template v-for="item in permissionList[index].children">
          <el-submenu v-if="item.children.length!=0" :index="item.permissionPath">
            <template slot="title">
              <img src="./service/u1695.png" class="img-emblem">
              <span slot="title">{{item.permissionName}}</span>
            </template>

            <template v-for="it in item.children">
              <el-menu-item :index="it.permissionPath">{{it.permissionName}}</el-menu-item>
            </template>

          </el-submenu>

          <el-menu-item v-else :index="item.permissionPath">
            <template slot="title">
              <img src="./service/u1695.png" class="img-emblem">
              <span>{{item.permissionName}}</span>
            </template>
          </el-menu-item>

        </template>


      </el-menu>
    </el-aside>
    <el-main>
      <breadcrumb></breadcrumb>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
    import breadcrumb from "../components/breadcrumb";
    import {mapGetters} from 'vuex'

    export default {
        name: "Container",
        computed: {
            ...mapGetters([
                'permissionList',
            ]),
        },
        data() {
            return {
                index: 0,

            }
        },
        mounted(){
            var to = {
                path: this.$route.path
            }
            this.listen(to,to);
        },
        components: {
            breadcrumb
        },
        watch: {
            $route: 'listen'
        },
        methods: {

            listen(to, from) {
                for (var i = 0; i < this.permissionList.length; i++) {
                    if (this.permissionList[i].permissionPath === this.activedMenu(to.path)) {
                        this.index = i;
                    }
                }
            },
            activedMenu: function (val) {
                for (var i = 0; i < this.permissionList.length; i++) { // 如果是主菜单
                    if (val === this.permissionList[i].permissionPath) {
                        return val;
                    }
                }
                return this.findPermissionParent(val, this.permissionList);


            },
            findPermissionParent(val, list) {
                for (var i = 0; i < list.length; i++) {
                    var isTrue = true;
                    for (var j = 0; j < list[i].children.length; j++) {
                        if (list[i].children[j].permissionPath === val) {
                            isTrue = false;
                            return list[i].permissionPath;
                        }
                    }
                    if (isTrue) {

                        for (var j = 0; j < list[i].children.length; j++) {
                            for (var k = 0; k < list[i].children[j].children.length; k++) {
                                if (val === list[i].children[j].children[k].permissionPath) {
                                    return list[i].permissionPath;
                                }
                            }
                        }
                    }

                }

            }
        }
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
