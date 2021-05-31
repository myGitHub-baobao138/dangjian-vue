<template>
  <div class="body">
<!--    &lt;!&ndash;-面包屑&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">风采管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/like' }">点赞管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item >点赞列表管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="function-part" >
      <div class="likeTime-box">
        <div class="likeTime-words">点赞时间:</div>
        <div class="dateSelect">
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
      <el-button type="danger"  @click="searchByLikeTime()" class="buttons-box">查询</el-button>
    </div>

    <div class="like-list" >
      <el-table :data="likeListData">
        <el-table-column prop="clickTime" label="点赞时间"></el-table-column>
        <el-table-column prop="clickPersonName" label="姓名"></el-table-column>
        <el-table-column prop="clickPersonPosition" label="身份"></el-table-column>
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
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import {likeListManage} from "./likeListManage";

  export default {
        name: "likeListManage",
      data(){
          return{
            currentPage:1,
            pageSize:5,
            total:0,
            searchPublishTime:"",//功能分区-select框-选择点赞时间
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6
              }
            },//只能选择今天以前的时间
            likeListData:[],  //点赞记录的数据
            articleId:'',
            isQuery:false
          }
      },
      methods:{
        //每条多少页
        handleSizeChange(val) {
          this.pageSize = val ;
          if(this.isQuery){
            this.searchByLikeTime();
          }else{
            this.getLikeList(id);
          }
          //console.log(`每页 ${val} 条`);
        },
        //这是第几页
        handleCurrentChange(val) {
          this.currentPage = val ;
          if(this.isQuery){
            this.searchByLikeTime();
          }else{
            this.getLikeList(id);
          }
          //console.log(`当前页: ${val}`);
        },

        //根据传来的文章id  去获取相关的点赞列表
        getLikeList(id){
          likeListManage.getLikeListManage(
            {currentPage:this.currentPage,pageSize:this.pageSize,articleId:id}).then(res=>{
            this.likeListData = res.data.data.list;
            this.total = res.data.data.total;
            this.isQuery = false;
          })
        },

        //根据选择的点赞时间范围来查询
        searchByLikeTime(){
          var params={currentPage:this.currentPage,pageSize:this.pageSize,
            startTime:this.searchPublishTime[0],
            endTime:this.searchPublishTime[1],
            articleId:this.articleId};
          likeListManage.getLikeListManageByClickTime(params).then(res=>{
            this.likeListData = res.data.data.list;
            this.total = res.data.data.total;
            this.isQuery = true;
          })
        },
      },
      mounted(){
         this.articleId = this.$route.query.id;   //接收传过来的文章id
          this.getLikeList(this.$route.query.id);
      }
    }
</script>

<style scoped>
  .function-part,.likeTime-box{
    display: flex;
    align-items: center;
  }
  .function-part{
    margin: 2% 0 2% 1%;
  }
  .likeTime-words{
    font-size: 14px;
    width:80px;
  }
  .buttons-box,.dateSelect{
    margin-left:2%;

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
