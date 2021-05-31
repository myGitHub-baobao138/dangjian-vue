<template>
  <div class="body">

<!--    &lt;!&ndash;面包屑面包屑&ndash;&gt;-->
<!--    <div class="bread" style="margin-bottom: 20px;" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">风采管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>文章发布管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <!--下架弹窗-->
    <div class="removeForm">
      <el-dialog title="下架" :visible.sync="removeFormVisible" @close="clearRemoveForm">
        <el-form :model="removeForm">
          <el-form-item label="下架说明"  >
            <el-input v-model="removeForm.details" placeholder="请输入至少五个字符"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="removeFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendRemoveResult()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--功能分区-页面上的查询/发布/下架-->
    <div  class="function-part">
      <!--input输入查询内容-->
      <div class="content-box">
        <div class="content-words" >内容:</div>
        <el-input v-model="searchInput" placeholder="请查询输入内容"></el-input>
      </div>
      <!--datePicker 选择查询时间范围-->
      <div class="selectTime-box">
        <div class="date-words">发布时间:</div>
        <div >
          <el-date-picker
            v-model="searchPublishTime"
            :picker-options="pickerOptions"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <!--buttons 查询/发布/下架 按钮-->
      <div class="buttons-box">
        <el-button type="danger"  @click="searchByInput()">查询</el-button>
        <el-button type="danger"  @click="publishNewEssays()">发布</el-button>
        <el-button type="danger"  @click="deleteMoreShow()">下架</el-button>
      </div>
    </div>

    <!--显示相关的发布数据-->
    <div class="main-content">
      <template>
        <el-table :data="essayData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column fixed align="center" type="selection" :selectable="selectTable" v-model="checked"/>
          <el-table-column :show-overflow-tooltip="true" prop="academy" label="学校/院"/>
          <el-table-column :show-overflow-tooltip="true" prop="title" label="文章标题"/>
          <el-table-column :show-overflow-tooltip="true" prop="content" label="文章内容" :formatter="formatContent"/>
          <el-table-column prop="source" label="类别" :formatter="formatSource"/>
          <el-table-column :show-overflow-tooltip="true" prop="contributor" label="投稿人"/>
          <el-table-column prop="contributeTime" label="投稿时间"/>
          <el-table-column prop="publishTime" label="发布时间" :formatter="formatTime"/>
          <el-table-column prop="outTime" label="下架时间" :formatter="formatTime"/>
          <el-table-column  label="操作" width="170%">
            <template slot-scope="scope">
              <span v-if="scope.row.essayStatus === -3">
                <div @click="viewDetails(scope.row)" class="operate-words">&nbsp;查看&nbsp;</div>
              </span>
              <span v-else-if="scope.row.essayStatus == 1">
                <div style="display: flex;">
                  <div @click="deleteShow(scope.row)" class="operate-words">&nbsp;下架&nbsp;</div>
                  <div @click="viewDetails(scope.row)" class="operate-words">&nbsp;查看&nbsp;</div>
                  <div>
                    <span v-if="!scope.row.isTop" @click="setOutTop(scope.row)" ><div class="operate-words">&nbsp;取消置顶&nbsp;</div></span>
                    <span v-else @click="setTop(scope.row)"><div class="operate-words">&nbsp;置顶&nbsp;</div></span>
                  </div>
                </div>
              </span>
              <span v-else="scope.row.essayStatus == -2">
                <div style="display: flex;">
                  <div @click="deleteEssay(scope.row)" class="operate-words">&nbsp;删除&nbsp;</div>
                  <div @click="editEssay(scope.row)" class="operate-words">&nbsp;编辑&nbsp;</div>
                  <div @click="confirmPublish(scope.row)" class="operate-words">&nbsp;确认发布&nbsp;</div>
                </div>
              </span>
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
        :total="totalEssay">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {Auth} from "../../../../store/modules/auth";
  import {publishEssayJs} from "./publishEssayJs";
  import {Msg} from "../../../../tools/message";

  export default {
        name: "publishEssay",
      data(){
          return{
            userInfo:Auth.getUser(),//登录的用户信息
            searchInput:"",//输入查询的内容
            searchPublishTime:"",//选择的时间范围
            pickerOptions: {//只能选择今天以前的时间
              disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6
              }
            },

            essayData:[],//相关文章list
            isQuery:false,//判断是否为查询的翻页

            checked:false,//多选框
            checkObj:[],//存储选中对象

            currentPage:1,//当前页
            pageSize:5,
            totalEssay:0,//总共的文章数量

            removeFormVisible:false,//下架弹窗的显示
            removeForm:{
              checkerId:"",
              checkerName:"",
              checkedEssayId:"",//单个被审核稿件id
              checkedEssayName:"",//审核稿件的文章名
              checkedIdList:[],//多选框->多个被审核稿件id
              checkedNameList:[],//多选框->多个被审核稿件标题
              checkStatus:"",//审核状态
              details:"",//审核说明
            },//审核对应内容
          }
      },
      methods:{

        //获取全部已发布文章-- 对接完成
        getAllPublishEssay(){
          var rank = parseInt(this.userInfo.organizationRank);
          publishEssayJs.getAllPublishEssayList({currentPage: this.currentPage,pageSize: this.pageSize,
              organizationId:this.userInfo.organizationId, organizationRank: rank}
            )
            .then(res=>{
                if(res.data.code === 200){
                    this.essayData = res.data.data.list;
                    this.totalEssay = res.data.data.total;
                    console.log(this.essayData[0]);
                    this.isQuery = false;
                } else if(res.data.code === 403){
                    Msg.error('权限不足');
                } else {
                    Msg.error('网络繁忙');
                }

            })
            .catch(err => {
                Msg.error('网络繁忙');
          });

        },

        //上面功能区，根据输入内容查询 ---对接完成
        searchByInput(){
          if(this.searchInput == "" && this.searchPublishTime == ""){
            console.log("nothing");
            this.getAllPublishEssay();
            return;
          }

          var startTime =this.searchPublishTime[0];
          var endTime =this.searchPublishTime[1];

          if(startTime == undefined ){
            startTime = "";
            endTime = "";
          }

          var rank = parseInt(this.userInfo.organizationRank);
          publishEssayJs.queryPublishEssayList({currentPage: this.currentPage,pageSize: this.pageSize,
            organizationId:this.userInfo.organizationId, organizationRank: rank,
            inputContent: this.searchInput, startTime: startTime, endTime: endTime})
            .then(res=>{
              this.essayData = res.data.data.list;
              this.totalEssay = res.data.data.total;
              this.isQuery = true;
            })
            .catch(err => {
              console.log(err);
            });
        },

        //上面功能区，根据多选框发布新文章
        publishNewEssays(){
          this.$router.push(
            {
              path:'/establishEssay',
              query:{
                id : "",
                type:"insert",
              }
            });
        },

        //上面功能区，根据多选框下架文章---完成
        deleteMoreShow(){
          //获得批量下架稿件的id + 判断需要被下架的文章是否正确
          //因为草稿状态 也是可以被选的   只有已下架的文章不可被选

          if (this.checkObj.length == 0) {
            this.$message({
              message: '请选择下架对象',
              type: 'warning'
            });
            return;
          }

          for(var i in this.checkObj){
            this.removeForm.checkedIdList[i]=this.checkObj[i].id;
            this.removeForm.checkedNameList[i] = this.checkObj[i].title;
          }

          this.removeFormVisible = true;
          //操作人党员id
          this.removeForm.checkerId = this.userInfo.partyId;
          //操作人党员姓名
          this.removeForm.checkerName = this.userInfo.userName;

        },

        //下架单篇文章  --完成
        deleteShow(row){
          this.removeFormVisible = true;

          //获得下架单篇文章的id
          this.removeForm.checkedEssayId = row.id;
          //审核稿件 稿件名称
          this.removeForm.checkedEssayName = row.title;
          //审核人党员id
          this.removeForm.checkerId = this.userInfo.partyId;
          //审核人党员姓名
          this.removeForm.checkerName = this.userInfo.userName;

        },

        //将下架文章id/idList，下架说明传到后端 --对接完成
        sendRemoveResult(){

          if(this.removeForm.details.length<5){
            this.$message({
              message: '下架说明不能为空或小于五个字符',
              type: 'warning'
            });
            return;
          }

          this.removeFormVisible = false;

          //此次下架为批量下架
          if(this.removeForm.checkedEssayId === undefined || this.removeForm.checkedEssayId === ""){
            for(var i in this.removeForm.checkedIdList){
              publishEssayJs.setManyEssayLeave(this.removeForm)
                .then(res=>{
                  this.$message({
                    message: res.data.message,
                    type:'success'
                  });
                  //重新获取表格内容
                  this.getAllPublishEssay();
                  //清空input框内内容
                  this.removeForm.details = "";
                });
            }
          }else{//下架单篇稿件
            publishEssayJs.setSingleEssayLeave(this.removeForm)
              .then(res=>{
                this.$message({ message: res.data.message, type:'success'});
                //重新获取表格内容
                this.getAllPublishEssay();
                //清空input框内内容
                this.removeForm.details = "";
              });
          }
        },

        //对后台编辑未发布的文章再次进行编辑
        editEssay(row){
          this.$router.push({
            path:'/establishEssay',
            query:{
              id : row.id,
              type:"edit",
            }//表示传字符串类型
          })

        },

        //查看发布文章/点赞详情页
        viewDetails(row){
          console.log("传之前："+ row.id);
          this.$router.push({
            path:'/essayDetails',
            //把稿件id传给后端
            query:{
              type:"publish",
              id : row.id,
              originTable: 1
            }//表示传字符串类型
          })
        },

        //取消置顶 ---对接成功
        setOutTop(row){
          this.$confirm('此操作将此篇文章在小程序端取消置顶显示, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            publishEssayJs.setEssayOutTop({checkedEssayId: row.id, checkedEssayName:row.title,
              checkerId:this.userInfo.partyId,checkerName:this.userInfo.userName})
              .then(res=>{
                this.$message({
                  type: 'success',
                  message: res.data.message,
                });
                this.getAllPublishEssay();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        },

        //设置为置顶----对接完成
        setTop(row){
          var topSize =0;
          publishEssayJs.getTotalTopSize()
            .then(res=>{
              topSize = res.data.data;
          });
          console.log(topSize);
          if(topSize >5){
            this.$message({
              message: '置顶文章数量不能超过5篇',
              type: 'warning'
            });
            return;
          }

          this.$confirm('此操作将此篇文章在小程序端置顶显示, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            publishEssayJs.setEssayTop({checkedEssayId: row.id, checkedEssayName:row.title,
              checkerId:this.userInfo.partyId,checkerName:this.userInfo.userName})
              .then(res=>{
                this.$message({
                  type: 'success',
                  message: res.data.message,
                });
                this.getAllPublishEssay();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消置顶'
            });
          });
        },

        //删掉后台编辑-未发布的文章
        deleteEssay(row){
          this.$confirm('此操作将删除此片草稿, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            publishEssayJs.deleteByEssayIdFromList({essayId: row.id} )
              .then(res=>{
                this.$message({
                  type: 'success',
                  message: res.data.message,
                });
                this.getAllPublishEssay();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });

        },

        //单篇文章的确认发布---完成
        confirmPublish(row){
          this.$confirm('此操作将此篇文章展示在小程序端, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            publishEssayJs.publishSingleEssayFromList({checkedEssayId: row.id, checkedEssayName:row.title,
              checkerId:this.userInfo.partyId,checkerName:this.userInfo.userName})
              .then(res=>{
                this.$message({
                  type: 'success',
                  message: res.data.message,
                });
                this.getAllPublishEssay();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            });
          });
        },

        //elementUI 实现table第一列加checkbox，部分选中，部分状态不可选
        //如果是已下架的文章  就设为不可选中状态
        selectTable(row){
          return row.essayStatus == 1;
        },
        //每条多少页
        handleSizeChange(val) {
          this.pageSize = val;
          if(this.isQuery){
            this.searchByInput();

          }else{
            this.getAllPublishEssay();
          }
        },
        //这是第几页
        handleCurrentChange(val) {
          this.currentPage = val;
          if(this.isQuery){
            this.searchByInput();
          }else{
            this.getAllPublishEssay();
          }
        },
        //获取多选框选中的内容
        handleSelectionChange(val){
          this.checkObj = val;
        },

        //清空下架弹窗内容
        clearRemoveForm(){
          this.removeForm.details ="";
        },

        /**校正审核稿件内容**/
        formatContent(row, column, cellvalue){
          var formatContent = cellvalue.substr(0,4);
          return formatContent+"...";
        },
        /**校正来源
         * (来源于小程序-发布文章-
         * 党员先锋1
         * 基层风采2
         * 党主题日3)
         * 也称类别
         **/
        formatSource(row, column, cellvalue){
          var source;
          if(cellvalue==1){
            source = "党员先锋";
          }else if(cellvalue ==2){
            source = "基层风采";
          }else {
            source = "党主题日";
          }
          return source;
        },
        formatTime(row, column, cellvalue){
          var source;
          if(cellvalue==undefined){
            source = "-";
          }else {
            source = cellvalue;
          }
          return source;
        },
      },
      created(){
        this.getAllPublishEssay();

      }
    }
</script>

<style scoped>
  .function-part,.selectTime-box,.content-box,.buttons-box{
    display: flex;
    align-items: center;
  }
  .function-part{
    margin: 2% 0 2% 0;
  }
  .content-words,.date-words{
    font-size: 14px;
    width:80px ;
  }
  .selectTime-box,.buttons-box{
    margin-left: 2%;
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

