<template>
  <div>
<!--    &lt;!&ndash;面包屑面包屑&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/managementContent' }">基础管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/userManage' }">用户管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <!--功能分区-输入微信号/是否认证->进行查询 -->
    <div class="function-part" >
      <div class="weChat-box">
        <div class="function-words">微信昵称:</div>
        <el-input v-model="inputWxNickname" placeholder="请输入" clearable @change="clearNickName"></el-input>
      </div>
      <div class="proveSelect-box">
        <div class="function-words">是否认证:</div>
        <div>
          <el-select v-model="selectAudited" placeholder="请选择" clearable @change="clearAudited">
            <el-option
              v-for="item in isAudited"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="buttons-box">
        <el-button type="danger" @click="getWxUserQueryList()">查询</el-button>
      </div>
    </div>

    <!--显示用户信息列表-->
    <div class="main-content">
      <el-table :data="wxUserList">
        <el-table-column prop="nickname" label="昵称" ></el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex"></el-table-column>
        <el-table-column prop="createTime" label="首次登录时间" ></el-table-column>
        <el-table-column prop="isAudited" label="是否认证" :formatter="formatIsAudited"></el-table-column>
        <el-table-column prop="verifyTime" label="认证时间" ></el-table-column>
      </el-table>
    </div>

    <!--页码-->
    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalWxUser">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {WxUser} from './userManageJs';
  import {Auth} from "../../../store/modules/auth";

  export default {
        name: "userManage",
      data(){
          return{
            userInfo:Auth.getUserInfo(),//登录的用户信息

            inputWxNickname:"",//功能分区-输入微信昵称
            selectAudited:"",//功能分区-选择是否认证

            isAudited:[
              {
                value: 0,
                label: '否'
              },
              {
                value: 1,
                label: '是'
              }],//是否认证

            wxUser:{
              id:"",
              nickname:"",
              sex:"",
              createTime:"",
              isAudited:"",
              verifyTime:"",
            },
            wxUserList:[],//获得全部微信用户信息

            isQuery:"",//用来表示翻页是普通翻页还是查询时翻页

            currentPage:1,//当前页
            pageSize:5,//页码数量
            totalWxUser:0,//总微信用户数量
          }
      },
      methods:{
        getWxUserQueryList(){

            WxUser.getWxUserQueryList({ currentPage:this.currentPage,pageSize:this.pageSize,
              nickname:this.inputWxNickname, isAudited: this.selectAudited}).then(
              res=>{
                this.wxUserList = res.data.data.list;
                this.totalWxUser = res.data.data.total;
                this.isQuery = true;
                  if (res.data.code === 403) {
                      Msg.error('权限不足');
                  }
              }
            )
        },

          clearAudited(){ // 清除认证
            if(this.selectAudited === ''){
                this.getWxUserQueryList();
            }
          },
          clearNickName(){ // 清除昵称
            if(this.inputWxNickname === ''){
                this.getWxUserQueryList();
            }
          },

        //校正性别显示
        formatSex(row, column, cellvalue){
          var sex="";
          if(cellvalue){
            sex = "女";

          }else{
            sex= "男";
          }
          return sex;
        },

        //校正是否认证显示
        formatIsAudited(row, column, cellvalue){
          var isAudited="";
          if(cellvalue == 1){
            isAudited = "认证成功";

          }else if(cellvalue == 0){
            isAudited = "未认证";
          }else{
            isAudited = "认证失败";
          }
          return isAudited;
        },

        //每条多少页
        handleSizeChange(val) {
          this.pageSize = val;
            this.getWxUserQueryList();

        },
        //这是第几页
        handleCurrentChange(val) {
          this.currentPage = val;
            this.getWxUserQueryList();

        },

      },
      mounted(){
          this.getWxUserQueryList();
      }
    }
</script>

<style scoped>
  .function-part,.proveSelect-box,.weChat-box{
    display: flex;
    align-items: center;
  }
  .function-part{
    margin: 2% 0 2% 0;
  }
  .function-words{
    width: 80px;
    font-size: 14px;
  }
  .proveSelect-box,.buttons-box{
    margin-left:2%;
  }

  .pages{
    display: flex;
    justify-content: center;
    margin-top:2%;
  }


</style>
