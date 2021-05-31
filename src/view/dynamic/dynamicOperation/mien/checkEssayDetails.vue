<template>
  <div>
<!--    &lt;!&ndash;面包屑面包屑&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">风采管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">稿件审核管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>查看详情页面</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <!--审核按钮-->
    <template>
      <div v-if="this.essay.checkStatus ===0" class="check-button">
        <el-button type="danger" plain @click="checkFormVisible=true">审核</el-button>
      </div>
    </template>

    <!--审核弹窗-->
    <div class="checkForm">
      <el-dialog title="审核"
                 :visible.sync="checkFormVisible"
                 :before-close="handleCloseCheckForm">
        <el-form :model="checkForm" :rules="checkFormRules" ref="checkForm">
          <el-form-item label="审核状态" prop="checkStatus">
            <template>
              <el-radio v-model="checkForm.checkStatus" label= 1>通过</el-radio>
              <el-radio v-model="checkForm.checkStatus" label= -1>不通过</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="审核内容" prop="details" >
            <el-input v-model="checkForm.details" placeholder="请输入至少五个字符"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetCheckForm('checkForm')">取 消</el-button>
          <el-button type="primary" @click="sendCheckResult('checkForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--稿件内容-->
    <div class="main-inf" >
      <!-- 来源|标题        作者|地位|时间 -->
      <div class="inf-title">
        <div class="big-title">
          <div class="essay-origin" >{{essay.source}}</div>
          <div >|</div>
          <div class="essay-title">{{essay.title}}</div>
        </div>
        <div class="writer">
          <div >{{essay.contributor}}</div>
          <div>|</div>
          <div>{{essay.position}}</div>
          <div>|</div>
          <div>{{essay.contributeTime}}</div>
        </div>
      </div>
      <!--主要内容-->
      <div class="inf-content">
        <div v-html="essay.content" class="essay-content">{{essay.content}}</div>
        <div class="content-img">
          <div class="img" style="margin: 10px 0 5px 0;">
            <el-image  :src="essay.picUrl" ></el-image>
          </div>
          <div class="more">
            <div>附件</div>
            <template >
              <div v-if="essay.pluginUrl=== '' || essay.pluginUrl=== undefined ">
                <div style="margin-left: 15px;">未上传附件</div>
              </div>
              <div v-else>
                <a style="margin-left: 15px;" :href="essay.pluginUrl">更多图片.word</a>
              </div>
            </template>

          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  import {Auth} from "../../../../store/modules/auth";
  import {checkEssayJs} from "./checkEssayJs";

  export default {
        name: "checkEssayDetails",
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
            essay:{},
            userInfo:Auth.getUser(),//登录的用户信息

            checkFormVisible:false,//审核弹窗是否显示
            checkForm:{
              checkerId:"",
              checkerName:"",
              checkedEssayId:"",//单个被审核稿件id
              checkedEssayName:"",//审核稿件的文章名
              checkStatus:"",//审核状态
              details:"",//审核说明
            },//审核对应内容
            checkFormRules: {
              checkStatus: [{required: true, message: '请选择审核状态', trigger: 'blur'}],
              details: [{required: true, validator: rule_datails, trigger: 'blur'}]
            },

          }
      },
      methods:{
        //获取通过ID稿件详情信息
        getEssayById(id){
          checkEssayJs.getCheckEssayDetails({essayId:id})
            .then(res=>{
              this.essay = res.data.data;
              this.formatSource();//校正稿件来源

            })

        },

        sendCheckResult(formName){

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.checkFormVisible=false;

              //审核稿件id稿件id
              this.checkForm.checkedEssayId = this.essay.id;
              //审核稿件 稿件名称
              this.checkForm.checkedEssayName = this.essay.title;
              //审核人党员id
              this.checkForm.checkerId = this.userInfo.partyId;
              //审核人党员姓名
              this.checkForm.checkerName = this.userInfo.userName;

              checkEssayJs.updateStatusEssayBySingleEssayId(this.checkForm)
                .then(res=>{
                  this.$message({ message: res.data.message, type:'success'});
                  //清空input框内内容
                  this.checkForm.details = "";
                  this.getEssayById(this.essay.id);
                });


            }
          });


        },

        resetCheckForm(formName){
          this.$refs[formName].resetFields();
          this.checkFormVisible= false;
        },
        handleCloseCheckForm(){
          this.$refs['checkForm'].resetFields();
          this.checkFormVisible= false;
        },

        /**
         * 校正稿件来源
         * 来源(来源于小程序-发布文章-
         * 党员先锋1
         * 基层风采2
         * 党主题日3)
         * 也称类别
         */
        formatSource(){
          if(this.essay.source ==1){
            this.essay.source = "党员先锋";
          }else if(this.essay.source ==2){
            this.essay.source = "基层风采";
          }else{
            this.essay.source = "党主题日";
          }
        },

      },
      mounted(){
        this.getEssayById(this.$route.query.id);
      }
    }
</script>

<style scoped>
  /*稿件总内容Div*/
  .main-inf{
    width: 750px;
    margin: 30px 0 0 100px;
  }
  /*稿件标题div*/
  .inf-title{
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid darkgrey;
  }
  .big-title,.more{
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .writer{
    display: flex;
    align-items: flex-end;
    margin-right:40px;
    margin-bottom: 2px;
  }
  .inf-content{
    width: 95%;
    margin:20px 0 0 17px;
    line-height: 25px;
  }
  .essay-content{
    text-align: left;
  }
  .check-button{
    position: absolute;
    left: 1110px;
    top: 150px;
  }
  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }
</style>
