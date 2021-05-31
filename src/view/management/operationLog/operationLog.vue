<template>
  <div>
    <!--顶部导航栏-->
<!--    <div>-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '' }">基础管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item >操作日志管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="border">
      <div class="log-content">
        <div><span>内容：</span></div>
        <div><el-input v-model="content" placeholder="请输入"  clearable></el-input></div>

      </div>
      <div class="users">
        <span>人员：</span>
        <el-select
          filterable
          remote
          reserve-keyword
          v-model="operatiorName"
          :filter-method="changeByInput"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(person,index) in options"
            :key="index"
            :label="person"
            :value="person">
          </el-option>
        </el-select>
      </div>
      <div class="button">
        <el-button type="danger" @click="getOperationLogList">查询</el-button>
      </div>
    </div>

    <!--表格-->
    <div class="table">
      <el-table
        :data="operationLogTableData"
        style="width: 100%"
        :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
      >
        <el-table-column
          prop="operationDate"
          label="操作时间"
          align="center"
          width="220">
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="人员"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="postName"
          align="center"
          label="职务">
        </el-table-column>
        <el-table-column
          prop="operationPage"
          align="center"
          label="操作页面">
        </el-table-column>
        <el-table-column
          prop="operationContent"
          align="center"
          label="操作内容">
        </el-table-column>
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
  import {operationLogJs} from "./operationLogJs";
  import {Msg} from "../../../tools/message";

  export default {
        name: "operationLog",
      data(){
          return{
            content:'',
            options: [],
            operatiorName: '',
            currentPage:1,
            pageSize:5,
            total:0,
            operationLogTableData:[

            ],
          }
      },
    methods:{
      //改变页码
      handleSizeChange(val){
        this.pageSize = val;
        this.getOperationLogList();
      },
      //改变当前页
      handleCurrentChange(val){
        this.currentPage = val ;
        this.getOperationLogList();
      },
      //查询系统操作日志(全部数据/输入内容/人员/输入内容与人员一起)
      getOperationLogList(){
        var params = {content:this.content,currentPage:this.currentPage,
          name:this.operatiorName,pageSize:this.pageSize};
        operationLogJs.getOperationLogData(params).then(res=>{
          if (res.data.code === 200) {
            this.operationLogTableData = res.data.data.list;
            this.total = res.data.data.total;
            this.$message({
              type:'success',
              message:res.data.message
            })
          } else if(res.data.code === 403) {
              Msg.error('权限不足');
          }    else
          {
            this.operationLogTableData = [];
            this.total = 0;
            this.$message.error(res.data.message)
          }

        }).catch(err =>{
            Msg.error('网络繁忙');
        })
      },
      //页面开始加载时得到选择器所有加载人员的名字
      getOperatorNameList(){
        operationLogJs.findOperatorName({operatorName:this.operatorName}).then(res=>{
          this.options = res.data.data;
        })
      },
      //通过输入在选择器里面的人员姓名改变选择器里面的值
      changeByInput(value){
        setTimeout(() => {
        operationLogJs.findOperatorName({operatorName:value}).then(res=>{
          //if(res.data.message === '查询成功'){
            this.options = res.data.data;
          // }else{
          //   this.options =[];
          // }
        })
      },1)}
    },

    created(){
      this.getOperationLogList();
      this.getOperatorNameList();
    }
  }
</script>

<style scoped>
  .border{
    margin-top:2%;
  }
  .border,.log-content,.users{
    display:flex;
    align-items: center;

  }
  .users{
    margin-left:2%;
  }
  .button{
    margin-left:10%;
  }
  .table{
    margin-top:2%;
    min-height: 335px;
  }
  .pages{
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }
  /*改变按钮颜色样式设置*/
  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }
</style>
