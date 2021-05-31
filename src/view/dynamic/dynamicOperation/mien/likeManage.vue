<template>
  <div class="body">

<!--    &lt;!&ndash;-面包屑&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">风采管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>点赞管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <!---功能分区  输入内容   选择发布时间   点击查询-->
    <div class="function-part" >
      <div class="content-box">
        <div class="content-words">内容:</div>
        <el-input v-model="inputContent" placeholder="请输入内容" clearable></el-input>
      </div>
      <div  class="pubTime-box">
        <div class="pubTime-words">发布时间:</div>
        <div >
          <el-date-picker
            v-model="searchPublishTime"
            :picker-options="pickerOptions"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <div class="buttons-box" >
        <el-button type="danger" @click="searchByInput()">查询</el-button>
      </div>
    </div>

    <!--展示内容分区-->
    <div class="main-content">
      <template>
        <el-table :data="praiseRecordData" style="width: 100%;min-height:310px">
          <el-table-column prop="academy" :show-overflow-tooltip="true" label="学校/院"  ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="title" label="文章标题"></el-table-column>
          <el-table-column :formatter="formatContent" prop="content" label="文章内容" ></el-table-column>
          <el-table-column :formatter="changeDisplay" prop="source" label="类别" ></el-table-column>
          <el-table-column prop="contributor" label="投稿人" ></el-table-column>
          <el-table-column prop="contributeTime" label="投稿时间"></el-table-column>
          <el-table-column prop="publishTime" label="发布时间" :formatter="display"></el-table-column>
          <el-table-column prop="praiseAmount" label="点赞量">
            <template slot-scope="scope">
              <span @click="jumpToLikeListManage(scope.row.id)">{{scope.row.praiseAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="browsingAmount" label="浏览量" ></el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetails(scope.row)" class="operate-words">查看</el-button>
            </template>
          </el-table-column>

        </el-table>
      </template>
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
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>

import {Auth} from "../../../../store/modules/auth";
import {likeManageJs as likeManage} from "./likeMagnageJs";
import {Msg} from "../../../../tools/message";

export default {
      name: "likeManage",
      data(){
          return{
            userInfo:Auth.getUser(),  //登录的用户信息
            currentPage:1,
            pageSize:5,
            total:0,
            inputContent:"",//功能分区-input框-输入内容
            searchPublishTime:"",//功能分区-select框-选择发布时间
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6
              }
            },//只能选择今天以前的时间

            checkObj:[],//选择框
            checked:false,
            //搜索框的发布时间
            searchData:{},
            //表格数据展示
            praiseRecordData:[],
            isQuery:false
          }
      },
      methods:{
        //改变表格的显示值
        display(row, column, value){
          var publishTime = value;
          if(value==null || value===""){
            publishTime ="——"
          }
          return publishTime;
        },

        changeDisplay(row, column, value){
          var source;
          if(value === '1'){
            source = "党员先锋";
          }
          if(value === '2'){
            source = '基层风采';
          }
          if(value === '3'){
            source = '党主题日';
          }
          if(value === '4'){
            source = '志愿活动';
          }
         if(value === '5'){
            source = '党校培训'
          }
          return source;
        },
        /**校正点赞记录文章内容**/
        formatContent(row, column, cellvalue){
          var formatContent = cellvalue.substr(0,4);
          return formatContent+"...";
        },

        //每条多少页
        handleSizeChange(val) {
          this.pageSize = val;
          if(this.isQuery){
            this.searchByInput();  //查询得到数据时的翻页
          }else{
            this.getClickLikeLists();     //页面一开始得到的数据翻页
          }
          //console.log(`每页 ${val} 条`);
        },
        //这是第几页
        handleCurrentChange(val) {
          this.currentPage = val;
          if(this.isQuery){
            this.searchByInput();  //查询得到数据时的翻页
          }else{
            this.getClickLikeLists();     //页面一开始得到的数据翻页
          }
          //console.log(`当前页: ${val}`);
        },

        viewDetails(row){
          console.log("传之前："+ row.id);
          console.log(row.type)
          this.$router.push({
            path:'/essayDetails',
            //把稿件id传给后端
            query:{
              type:'like',
              id : row.id,
              originTable: row.type
            }//表示传字符串类型
          })

        },

        //跳到点赞列表管理页面
        jumpToLikeListManage(id){
          this.$router.push({
            path:'/likeListManage',
            //把稿件id传给后端
            query:{
              id : id
            }//表示传字符串类型
          })
        },

        //页面开始加载时获得的数据
        getClickLikeLists(){
          console.log(this.inputContent);
          var rank = parseInt(this.userInfo.organizationRank);
          var params = {currentPage:this.currentPage,pageSize:this.pageSize,
            partyId:Auth.getUserInfo().partyId,
            organizationRank:rank,
            organizationId:Auth.getUserInfo().organizationMsgList[0].organizationId};
          likeManage.getClickLikeList(params).then(res=>{
              if(res.data.code === 200){
                  this.praiseRecordData = res.data.data.list;
                  this.total = res.data.data.total;
                  this.isQuery = false;
              } else if(res.data.code === 403){
                  Msg.error('权限不足');
              } else {
                  Msg.error('网络繁忙');
              }

          })
        },

        //通过搜索获得相关的点赞记录
        searchByInput(){
          var rank = parseInt(this.userInfo.organizationRank);
          var params = {
            currentPage:this.currentPage,pageSize:this.pageSize,
            organizationRank:rank,
            organizationId:Auth.getUserInfo().organizationMsgList[0].organizationId,
            inputContent:this.inputContent,
            startTime:this.searchPublishTime[0],
            endTime:this.searchPublishTime[1]
          };
          likeManage.getClickLikeListBySearch(params).then(res=>{
            this.praiseRecordData = res.data.data.list;
            this.total = res.data.data.total;
            this.isQuery = true;
          })
        },
      },
      mounted(){
        this.getClickLikeLists();
      }
    }
</script>

<style scoped>
  .function-part,.content-box,.pubTime-box{
    display: flex;
    align-items: center;
  }
  .function-part{
    margin: 2% 0 2% 0;
  }
  .content-words,.pubTime-words{
    width: 80px;
    font-size:14px;
  }
  .pubTime-box,.buttons-box{
    margin-left:2%;
  }

  .operate-words{
    color: #F56C6C;
  }
  .pages{
    display: flex;
    justify-content: center;
    margin-top:2%;
  }

  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }

</style>
