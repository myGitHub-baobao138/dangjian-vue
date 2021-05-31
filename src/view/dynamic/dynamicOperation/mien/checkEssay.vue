<template>
  <div class="body">

    <!--审核弹窗-->
    <div class="checkForm">
      <el-dialog title="审核"
                 :visible.sync="checkFormVisible"
                 :before-close="handleCloseCheckForm">
        <el-form :model="checkForm" :rules="checkFormRules" ref="checkForm" >
          <el-form-item label="审核状态" prop="checkStatus">
            <template>
             <el-radio v-model="checkForm.checkStatus" label= 1>通过</el-radio>
              <el-radio v-model="checkForm.checkStatus" label= -1>不通过</el-radio>
           </template>
          </el-form-item>
          <el-form-item label="审核内容"  prop="details">
            <el-input v-model="checkForm.details" placeholder="请输入至少五个字符"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetCheckForm('checkForm')">取 消</el-button>
          <el-button type="primary" @click="sendCheckResult('checkForm')">确 定</el-button>
        </div>
      </el-dialog>


    </div>

    <!--功能分区 ==页面上的查询/审核-->
    <div class="function-part" >
      <!--输入搜索内容-->
      <div class="content-box">
        <div class="content-words">内容:</div>
        <el-input v-model="searchInput" placeholder="请输入内容" > </el-input>
      </div>
      <!--选择审核状态-->
      <div class="checkType-box">
        <div class="checkType-words" >审核状态:</div>
        <div>
          <template >
            <el-select v-model="searchStatus" placeholder="请选择" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
      </div>
      <!--查询/审核按钮-->
      <div class="buttons-box">
        <el-button type="danger" @click="getQueryCheckEssayList()">查询</el-button>
        <el-button type="danger" @click="checkedBySelection()">审核</el-button>
      </div>
    </div>

    <!--显示相关的审核数据-->
    <div class="main-content">
      <template>
        <el-table :data="essayData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column fixed align="center" type="selection" :selectable="selectTable" v-model="checked"/>
          <el-table-column prop="academyName" label="学院" :show-overflow-tooltip="true"/>
          <el-table-column :show-overflow-tooltip="true" prop="title" label="稿件标题"/>
          <el-table-column prop="content" label="稿件内容" :formatter="formatContent"/>
          <el-table-column prop="source" label="来源" :formatter="formatSource"/>
          <el-table-column :show-overflow-tooltip="true" prop="contributor" label="投稿人"/>
          <el-table-column prop="contributeTime" label="投稿时间"/>
          <el-table-column prop="checkStatus" label="审核状态" :formatter="formatCheckStatus"/>
          <el-table-column :show-overflow-tooltip="true" prop="reviewer" label="审核人" :formatter="formatNullCell"/>
          <el-table-column prop="checkTime" label="审核时间" :formatter="formatNullCell"/>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.checkStatus == 0">
                <div style="display: flex;">
                  <div @click="checkSingleEssay(scope.row)" class="operate-words">&nbsp;审核&nbsp;</div>
                  <div @click="viewDetails(scope.row)" class="operate-words">&nbsp;查看&nbsp;</div>
                </div>
              </span>
              <span v-else><div @click="viewDetails(scope.row)" class="operate-words">&nbsp;查看&nbsp;</div></span>
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
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalEssay">
      </el-pagination>
    </div>

  </div>
</template>


<script>
  import {Auth} from "../../../../store/modules/auth";
  import {checkEssayJs} from "./checkEssayJs";
  import {Msg} from "../../../../tools/message";

  export default {
        name: "checkEssay",
      data(){
        var regChinese = /^[\u4E00-\u9FA5]+$/;//验证输入的是否全部是中文
        var rule_datails = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('审核说明不能为空!!'))
          }
          if (!regChinese.test(value)) {
            return callback(new Error('请输入汉字!!'))
          }
          if(value.length <5 ){
            return callback(new Error('请输入至少五个字符!!'))
          }
          return callback();
        };
          return{
            userInfo:Auth.getUser(),//登录的用户信息
            essayData:[],//全部审核稿件信息列表
            isQuery:"",//判断是用于普通翻页还是查询时的翻页

            checkFormVisible:false,//审核弹窗是否显示
            checkForm:{
              checkerId:"",
              checkerName:"",
              checkedEssayId:"",//单个被审核稿件id
              checkedEssayName:"",//审核稿件的文章名
              checkedIdList:[],//多选框->多个被审核稿件id
              checkedNameList:[],//多选框->多个被审核稿件标题
              checkStatus:"",//审核状态
              details:"",//审核说明
            },//审核对应内容
            checkFormRules: {
              checkStatus: [{required: true, message: '请选择审核状态', trigger: 'blur'}],
              details: [{required: true, validator: rule_datails, trigger: 'blur'}]
            },

            searchInput:"",//查询输入的内容
            searchStatus:"",//查询-选择框-审核状态
            options: [ {
              value: 2,
              label: '全部'
            },{
              value: 0,
              label: '未审核'
            }, {
              value: -1,
              label: '未通过'
            }],

            checked:false,
            checkObj:[],

            pageSize:5,
            currentPage:1,//当前页
            totalEssay:0,//总共的文章数量
          }
      },
      methods:{
        //获取全部审核稿件信息 -------以对接成功
        getAllCheckEssay(){
          var rank = parseInt(this.userInfo.organizationRank);
          checkEssayJs.getAllCheckEssay({currentPage: this.currentPage, pageSize: this.pageSize,
            organizationId:this.userInfo.organizationId, organizationRank: rank })
             .then(res => {
                 if(res.data.code === 200){
                     this.essayData = res.data.data.list;
                     this.totalEssay = res.data.data.total;
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

        //查询接口---对接成功
        getQueryCheckEssayList(){

          if(this.searchStatus ==2 && this.searchInput !== "" ){
            console.log(1);
            //表示查询全部 --相当于审核状态为空--通过输入内容去查询
            this.getQueryListByInputContent();
            return;
          }
          if(this.searchStatus ==2 && this.searchInput == "" ){
            console.log(2);
            //表示查询全部 --相当于审核状态为空--通过输入内容去查询
            this.getAllCheckEssay();
            return;
          }

          if(this.searchInput == "" && this.searchStatus !== ""){
            //查询输入内容为空--通过审核状态去查询
            console.log(3);
            this.getQueryListByCheckStatus();
            return;
          }
          if(( this.searchStatus == 0 || this.searchStatus == -1  ) && this.searchInput !== "" && this.searchStatus !== ""){
            console.log(4);
            //通过输入内容和审核状态同时查询
            this.getQueryListByInputContentAndStatus();
            return;
          } else{
            //查询审核状态为空--通过输入内容去查询
            console.log(5);
            this.getQueryListByInputContent();
          }




        },

        //查询输入内容为空--通过审核状态去查询--对接成功
        getQueryListByCheckStatus(){
          var rank = parseInt(this.userInfo.organizationRank);
          checkEssayJs.getQueryCheckEssayListByCheckStatus({currentPage: this.currentPage, pageSize: this.pageSize,
            organizationId:this.userInfo.organizationId, organizationRank: rank ,checkStatus: this.searchStatus})
            .then(res=> {
                if(res.data.code === 200){
                    this.essayData = res.data.data.list;
                    this.totalEssay = res.data.data.total;
                    this.isQuery = true;
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

        //查询审核状态为空--通过输入内容去查询 --对接成功
        getQueryListByInputContent(){
          var rank = parseInt(this.userInfo.organizationRank);
          checkEssayJs.getQueryCheckEssayListByInputContent({currentPage: this.currentPage, pageSize: this.pageSize,
            organizationId:this.userInfo.organizationId, organizationRank: rank ,
            inputContent: this.searchInput})
            .then(res=> {
                if(res.data.code === 200){
                    this.essayData = res.data.data.list;
                    this.totalEssay = res.data.data.total;
                    this.isQuery = true;
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

        //通过输入内容和审核状态同时查询 --- 对接成功
        getQueryListByInputContentAndStatus(){
          console.log("getQueryListByInputContentAndStatus" + this.searchStatus);
          var rank = parseInt(this.userInfo.organizationRank);
          checkEssayJs.getQueryCheckEssayListByCheckAndInput({currentPage: this.currentPage, pageSize: this.pageSize,
            organizationId:this.userInfo.organizationId, organizationRank: rank ,
            inputContent: this.searchInput,checkStatus: this.searchStatus})
            .then(res=> {
                if(res.data.code === 200){
                    this.essayData = res.data.data.list;
                    this.totalEssay = res.data.data.total;
                    this.isQuery = true;
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

        //审核单篇文章--对接成功
        checkSingleEssay(row){
          this.checkFormVisible = true;

          //审核稿件id稿件id
          this.checkForm.checkedEssayId = row.id;
          //审核稿件 稿件名称
          this.checkForm.checkedEssayName = row.title;
          //审核人党员id
          this.checkForm.checkerId = this.userInfo.partyId;
          //审核人党员姓名
          this.checkForm.checkerName = this.userInfo.userName;
        },

        //发送审核结果 + 重新获取稿件list ---对接成功
        sendCheckResult(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.checkFormVisible = false;
              //此次审核为批量审核
              if(this.checkForm.checkedEssayId === undefined || this.checkForm.checkedEssayId === ""){
                for(var i in this.checkForm.checkedIdList){
                  checkEssayJs.updateStatusEssayByEssayIdList(this.checkForm)
                    .then(res=>{
                      this.$message({ message: res.data.message, type:'success'});
                      //重新获取表格内容
                      this.getAllCheckEssay();
                      //清空input框内内容
                      this.checkForm.details = "";
                    });
                }
              }else{//审核单篇稿件
                checkEssayJs.updateStatusEssayBySingleEssayId(this.checkForm)
                  .then(res=>{
                    this.$message({ message: res.data.message, type:'success'});
                    //重新获取表格内容
                    this.getAllCheckEssay();
                    //清空input框内内容
                    this.checkForm.details = "";
                  });
              }

            }
          });
        },

        //查看稿件详情页-------已对接完成
        viewDetails(row){
          this.$router.push({
            path:'/checkEssayDetails',
            //把稿件id传给后端
            query:{
              id : row.id
            }//表示传字符串类型
          })
        },

        /**elementUI 实现table第一列加checkbox，部分选中，部分状态不可选*/
        selectTable(row){
          if(row.checkStatus == 0 ){
            return true;
          }else{
            return false;
          }
        },

        /**根据多选框来审核**/
        checkedBySelection(){
          if (this.checkObj.length == 0) {
            this.$message({
              message: '请选择审核对象',
              type: 'warning'
            });
            return;
          }

          this.checkFormVisible = true;
          //获得批量审核稿件的id
          for(var i in this.checkObj){
           this.checkForm.checkedIdList[i]=this.checkObj[i].id;
           this.checkForm.checkedNameList[i] = this.checkObj[i].title;
            console.log(this.checkForm.checkedIdList[i] + this.checkForm.checkedNameList[i] );
          }
          //审核人党员id
          this.checkForm.checkerId = this.userInfo.partyId;
          //审核人党员姓名
          this.checkForm.checkerName = this.userInfo.userName;
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

        /**校正审核状态
         * 1:已通过
         * 0:未审核
         * -1:未通过
         **/
        formatCheckStatus(row, column, cellvalue){
          var checkStatus;
          if(cellvalue==-1){
            checkStatus="未通过";
          }else{
            checkStatus="未审核";
          }
          return checkStatus;
        },

        /**校正审核稿件内容**/
        formatContent(row, column, cellvalue){
          var formatContent = cellvalue.substr(0,4);
          return formatContent+"...";
        },

        handleSizeChange(val) {
          this.pageSize = val;
          if(this.isQuery){
            this.getQueryCheckEssayList();
          }else{
            this.getAllCheckEssay();
          }
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          if(this.isQuery){
            this.getQueryCheckEssayList();
          }else{
            this.getAllCheckEssay();
          }
        },
        handleSelectionChange(val) {
          this.checkObj = val;
        },

        resetCheckForm(formName){
          this.$refs[formName].resetFields();
          this.checkFormVisible= false;
        },

        handleCloseCheckForm(){
          this.$refs['checkForm'].resetFields();
          this.checkFormVisible= false;
        },

        formatNullCell(row, column, cellvalue){
          var source;
          if(cellvalue==undefined){
            source = "-";
          }else {
            source = cellvalue;
          }
          return source;
        },

      },
      created() {
          this.getAllCheckEssay();
      }
    }
</script>

<style scoped>
  .function-part,.checkType-box,.content-box,.buttons-box{
    display: flex;
    align-items: center;
  }
  .function-part{
    margin: 2% 0 2% 0;
  }
  .checkType-words,.content-words{
    font-size: 14px;
    width: 80px;
  }
  .checkType-box,.buttons-box{
    margin-left: 2%;
  }

  .operate-words{
    color: #F56C6C;
  }

  .pages{
    display: flex;
    justify-content: center;
    margin-top:10px;
  }

  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }


</style>
