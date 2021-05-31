<template>
  <div>
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/three' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/three' }">三会一课</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>党建纪要管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="headerEdit" >
      <div>
        <span>会议类型：</span>
        <el-select v-model="selectMinuteType" placeholder="请选择" clearable>
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>记录时间：</span>
        <el-date-picker v-model="selectRecorderTime" type="date"  placeholder="选择日期"></el-date-picker>
      </div>
      <el-button type="danger" @click="getSummaryList()">查询</el-button>
    </div>

    <div class="table">
      <el-table :data="summaryList" :cell-style="rowClass" :header-cell-style="headClass" style="width: 100%;" >
        <el-table-column :show-overflow-tooltip="true" prop="organizationName" label="组织"  width="180px;"></el-table-column>
        <el-table-column  prop="minuteType" label="类别" width="140px;">
          <template slot-scope="scope">
            <span v-if="scope.row.minuteType==1">党委会</span>
            <span v-if="scope.row.minuteType==2">委员会</span>
            <span v-if="scope.row.minuteType==3">小组会</span>
            <span v-if="scope.row.minuteType==4">党课</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="minuteContent" label="纪要内容" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="hostParticipateName" label="出席人" width="140px;"></el-table-column>
        <el-table-column prop="meetingRecorderName" label="记录人" width="100px"></el-table-column>
        <el-table-column prop="recorderTime" label="记录时间" ></el-table-column>
      </el-table>
    </div>

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
  import {threeLessonsMethods} from './threeLessonsJS';
  import {Auth} from "../../../../store/modules/auth";
  import {Msg} from "../../../../tools/message";

  export default {
        name: "summaryManage",
      data(){
          return{
            selectMinuteType:'',
            selectRecorderTime:'',

            currentPage:1,//当前页
            pageSize:5,
            total:0,//总共的文章数量

            summaryList:[],
            //三会一课的类别
            type:[
              {value:1,label:"1.党委会"},
              {value:2,label:"2.委员会"},
              {value:3,label:"3.小组会"},
              {value:4,label:"4.党课"},
            ],
            userInformation:{},
          }
      },
      created(){
        this.getSummaryList();
      },
      methods:{
        //表头居中
        headClass () {
          return 'text-align: center;background:#eef1f6;'
        },
        // 表格样式设置
        rowClass () {
          return 'text-align: center;'
        },
        //翻页设置
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        p(s) {
          return s < 10 ? '0' + s : s
        },
        getSummaryList(){

          if(this.selectRecorderTime!=''){
            const d = new Date(this.selectRecorderTime)
            const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
            this.selectRecorderTime = resDate;
          }
          this.userInformation = Auth.getUser();
          var summaryQuery={
            minuteType:this.selectMinuteType,
            recorderTime:this.selectRecorderTime,
            organizationId:this.userInformation.organizationId,
            rank:this.userInformation.organizationRank,
            currentPage:this.currentPage,
            pageSize:this.pageSize
          };
          threeLessonsMethods.getSummaryList(summaryQuery).then(res=>{
              if(res.data.code === 200){
                  this.summaryList = res.data.data.list;
                  this.total = res.data.data.total;
              } else if(res.data.code === 403){
                  Msg.error('权限不足');
              } else {
                  Msg.error('网络繁忙');
              }

          })
          this.selectMinuteType='';
          this.selectRecorderTime='';
        },
      }
    }
</script>

<style scoped>

  .headerEdit{
    margin-top: 20px;margin-bottom: 20px;
  }
  .headerEdit div,.headerEdit{
    display: flex;align-items: center;
  }
  .headerEdit div span{
    width: 100px;
  }
  .headerEdit >>>.el-input{
    /*margin-right: 10px;*/
  }
  .headerEdit >>>.el-input__inner{
    height: 32px;
  }
  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-left: 20px;
  }
  .edit{
    color: #ff0000;
  }

  .pages{
    display: flex;
    justify-content: center;
    margin-top:10px;
  }
</style>
