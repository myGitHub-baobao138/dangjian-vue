<template>
  <!--风采管理的文章发布下的发布文章-->
  <div style="width: 100%;margin:0 auto;">
<!--    &lt;!&ndash;面包屑&ndash;&gt;-->
<!--    <div style="margin-top: 10px">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{path:'/' }">风采管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{path:'/publish' }">文章发布管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>发布文章</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div style="display: flex;justify-content:center;margin-top: 25px;">

      <el-form :model="establishForm" ref="ruleForm" :rules="rules">
        <h2>发布文章</h2>
        <el-form-item label="文章标题："  class="read" prop="title">
          <el-input v-model="establishForm.title" size="small" style="width:580px;margin-left: 6px"/>
        </el-form-item>

        <el-form-item label="文章内容："  prop="content">
          <el-input placeholder="请输入内容" v-model="establishForm.content"  type="textarea" :rows="7" style="width: 570px;">{</el-input>
        </el-form-item>

        <el-form-item label="展示类别："  placeholder="请选择" class="read">
          <el-select v-model="establishForm.source">
            <el-option
              v-for="item in source"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片：" >
          <div class="read imgBox">
            <div style="display: flex;">
              <el-upload action="http://localhost:9090/dynamic/CultivateController/uploadPic" style=" text-align: start"
                         ref="uploadPic"
                         list-type="picture-card"
                         :auto-upload="false"
                         :limit= "1"
                         :on-success="handlePicSuccess"
                         :on-error="handlePicError"
                         :on-exceed="exceedFile"
                         accept=".jpg,.pdf"
                         v-model="establishForm.picUrl">
                <i class="el-icon-plus" ></i>
              </el-upload>
              <template>
                <div v-if="this.$route.query.type ==='edit' ">
                  <div class="oldImgBox">
                    <div style="width:100px;">原上传图片:</div>
                    <img :src="this.establishForm.picUrl"  style=" width:100px; height:100px; border-radius:5px; " />
                  </div>
                </div>
              </template>
            </div>
            <div class="tips_font">支持拓展名：.pdf,.jpg...</div>
          </div>
        </el-form-item>

        <el-form-item label="上传附件：" >
          <div class="read testBox">
            <div style="display: flex">
              <el-upload ref="uploadPlugin" style=" text-align: start"
                         action="http://localhost:9090/dynamic/CultivateController/uploadPlugin"
                         :limit= "1"
                         :auto-upload="false"
                         :on-success="handlePluginSuccess"
                         :on-error="handlePluginError"
                         :on-exceed="exceedFile"
                         accept=".docx,.doc,application/pdf,image/jpg,image/jpeg"
                         v-model="establishForm.pluginUrl">
                <el-button slot="trigger"  icon="el-icon-upload2" size="medium">上传文件</el-button>
              </el-upload>
              <template >
                <div v-if="this.$route.query.type === 'edit' ">
                  <div class="oldImgBox">
                    <div style="width:100px;">原上传附件:</div>
                    <a :href="this.establishForm.pluginUrl" style="width:100px;">下载原附件</a>
                  </div>
                </div>
              </template>

            </div>
            <div slot="tip" class="el-upload__tip">支持拓展名：.doc,.docx,.pdf,.jpg...</div>

          </div>
        </el-form-item>

        <!--底部按钮-->
        <el-form-item>
          <el-button type="danger" @click="saveEssay">保存</el-button>
          <el-button type="danger" style="margin-left: 5%" @click="publish">发布</el-button>
          <el-button style="margin-left: 5%" @click="jumpToPublish">取消</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import {Auth} from "../../../../store/modules/auth";
  import {EstablishEssayJs} from "./EstablishEssayJs";
  import {Msg} from "../../../../tools/message";

  export default {
        name: "EstablishEssay",
      data() {

        var rule_title = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('标题不能为空!!'))
          }
          if(value.length>15){
            return callback(new Error('标题长度不能超过15个字符!!'))
          }

          return callback();
        };

        return {

          userInfo:Auth.getUser(),//登录的用户信息

          operateType:0,//1--发布   -2保存

          typeFromPublishEssay:"",//从文章发布管理传过来的操作类型



          establishForm: {
            id:"",
            title:"",
            content:"",
            organizationId:"",
            source:0,
            contributorId:"",
            checkStatus:-2,//默认是保存草稿状态
            picUrl:"",
            pluginUrl:"",
            operatorId:"",
            operatorName:""
          },

          //文章发布表单验证
          ruleForm: {
            title: "",
            content:"",
            showType:"",
          },
          rules: {
            title: [
              {required: true, validator:rule_title, trigger: ['blur', 'change']},
            ],
            content: [
              {required: true, message: "请输入内容", trigger: ['blur', 'change']},
            ],
            type: [
              {required: true, message: "请选择", trigger: ['blur', 'change']},
            ],
          },

          source:[
            {label:"请选择", value:0},
            {label:"党员先锋" ,value:1},
            {label:"基层风采" ,value:2}
          ],
        }
      },
      methods:{
        // 返回文章管理
        jumpToPublish(){
          this.$router.push({path:'/publish'})
        },
        exceedFile() {
          Msg.error("只能上传一个文件哦");
        },
        //———————————————————————— 图片上传
        handlePicSuccess(res){
          this.establishForm.pluginUrl=res;
        },
        handlePicError(){
          Msg.error("上传失败，请重新上传");
        },
        handlePluginSuccess(res){
          this.establishForm.pluginUrl=res;
        },
        handlePluginError(){
          Msg.error("上传失败，请重新上传");
        },

        //保存
        saveEssay(){
          if(this.establishForm.title.length>15){
            this.$message({
              message: '文章标题不能超过15个字',
              type: 'warning'
            });
            return;
          }
          var isTrue = this.checkInput();
          if(isTrue===0){
            return;
          }
          this.establishForm.checkStatus = -2;
          this.establishForm.organizationId = this.userInfo.organizationId;
          this.establishForm.contributorId = this.userInfo.partyId;
          this.operateType =-2;
          if(this.establishForm.id == ""){
            console.log("insert");
            this.insertEssay();
          }else{
            console.log("update");
            this.updateEssay();
          }
        },

        //发布
        publish(){
          if(this.establishForm.title.length>15){
            this.$message({
              message: '文章标题不能超过15个字',
              type: 'warning'
            });
            return;
          }

          if(this.checkInput() ==0){
            return;
          }
          this.operateType =1;
          this.establishForm.checkStatus = 1;
          this.establishForm.organizationId = this.userInfo.organizationId;
          this.establishForm.contributorId = this.userInfo.partyId;
          this.establishForm.operatorId = this.userInfo.partyId;
          this.establishForm.operatorName = this.userInfo.userName;
          if(this.establishForm.id == ""){
            //id为空 表示是新增
            console.log("insert");
            this.insertEssay();
          }else{
            console.log("update");
            this.updateEssay();
          }
        },

        //调用新增发布接口
        insertEssay(){
          EstablishEssayJs.insertNewRssay(this.establishForm)
            .then(res=>{
              this.$message({
                type: 'info',
                message: res.data.message,
              });
              if(this.operateType == 1){
                //如果选择发布文章,跳回文章发布管理页面
                this.$router.push({path:'/publish'});
              }
            });
        },

        //调用修改保存接口
        updateEssay(){
          EstablishEssayJs.updateById(this.establishForm)
            .then(res=>{
              this.$message({
                type: 'info',
                message: res.data.message,
              });
              if(this.operateType == 1){
                //如果选择发布文章,跳回文章发布管理页面
                this.$router.push({path:'/publish'});
              }
            });
        },

        //确保标题/内容/来源的输入和选择不为空
        checkInput(){
          console.log(this.establishForm.title);
          console.log("checkINput");
          if(this.establishForm.title == "" ||this.establishForm.title == undefined){
            console.log("title");
            this.$message({
              type: 'warning',
              message: "请输入标题",
            });
            return 0;
          }

          if(this.establishForm.content == ""||this.establishForm.content == undefined){
            console.log("content");
            this.$message({
              type: 'warning',
              message: "请输入内容",
            });
            return 0;
          }

          if(this.establishForm.source ==0||this.establishForm.source == undefined){
            console.log("source");
            this.$message({
              type: 'warning',
              message: "请选择文章来源",
            });
            return 0;
          }
        }
      },

      created(){
          this.typeFromPublishEssay = this.$route.query.type;
          if(this.$route.query.type == "edit"){
            //获取编辑草稿内容
            this.establishForm.id = this.$route.query.id;
            EstablishEssayJs.getUpdateEssayInf({essayId: this.$route.query.id})
              .then(res=>{
                  if(res.data.code === 200){
                      this.establishForm = res.data.data;
                      console.log(this.establishForm.picUrl);
                      console.log(this.establishForm.picUrl.length);
                  } else if(res.data.code === 403){
                      Msg.error('权限不足');
                  } else {
                      Msg.error('网络繁忙');
                  }

              });
          }
      }
    }
</script>

<style scoped>

  .read{
    display: flex;
  }
  >>> .el-upload--picture-card{
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  .tips_font{
    color: gray;
    font-size: 14px;
  }
  .oldImgBox{
    display: flex;
    align-items: flex-start;
    margin-left: 10%;
  }
  .imgBox,.testBox{
    flex-direction: column;
    align-items: flex-start;

  }
</style>
