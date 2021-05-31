<template>
  <div style="width: 100%;margin:0 auto;">
<!--    &lt;!&ndash;面包屑&ndash;&gt;-->
<!--    <div style="margin-top: 10px">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{path:'/cultivate' }">党建培训管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>发布文章</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div style="display: flex;justify-content:center;margin-top: 25px;">

      <el-form :model="establishForm" ref="ruleForm" :rules="rules">
        <h2>发布文章</h2>
        <el-form-item label="标题：" class="read" prop="title" style="margin-left: 25px">
          <el-input size="small" v-model="establishForm.title" style="width:580px;"/>
        </el-form-item>

        <el-form-item label="网址：" class="read"  style="margin-left: 35px">
          <el-input size="small" placeholder="请输入以Http://开头以.com结尾的内容" v-model="establishForm.outsiteUrl"  style="width: 580px;">
            <template slot="prepend">Http://</template>
            <template slot="append">.com</template>
          </el-input>
        </el-form-item>

        <el-form-item label="文章内容:" prop="content">
          <el-input placeholder="请输入内容" v-model="establishForm.content" type="textarea" :rows="7" style="width: 570px;"></el-input>
        </el-form-item>

        <el-form-item label="上传图片：" style="margin-left: 8px">
          <div class="read">
            <el-upload action="http://localhost:9090/Dynamic/DyCultivateController/uploadPic" style=" text-align: start"
                       ref="uploadPic"
                       list-type="picture-card"
                       :auto-upload="false"
                       :limit= "1"
                       :on-success="handlePicSuccess"
                       :on-error="handlePicError"
                       :on-exceed="exceedFile"
                       accept=".jpg,.pdf"
                       v-model="picUrl">
              <i class="el-icon-plus" ></i>
              <div slot="tip" class="el-upload__tip">支持拓展名：.pdf,.jpg...</div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="上传附件："style="margin-left: 8px">
          <div class="read">
            <el-upload ref="uploadPlugin" style=" text-align: start"
                        action="http://localhost:9090/Dynamic/DyCultivateController/uploadPlugin"
                       :limit= "1"
                       :auto-upload="false"
                       :on-success="handlePluginSuccess"
                       :on-error="handlePluginError"
                       :on-exceed="exceedFile"
                       accept=".docx,.doc,application/pdf,image/jpg,image/jpeg"
                       v-model="pluginUrl">
              <el-button slot="trigger"  icon="el-icon-upload2" size="medium">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">支持拓展名：.doc,.docx,.pdf,.jpg...</div>
            </el-upload>

          </div>
        </el-form-item>

        <!--底部按钮-->
        <el-form-item>
          <el-button type="danger" @click="publish(0)">保存</el-button>
          <el-button type="danger" style="margin-left: 5%" @click="publish(1)">发布</el-button>
          <el-button style="margin-left: 5%" @click="jumpToCultivate">取消</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import {Auth} from '../../../../store/modules/auth'
  import {cultivateManage} from "./cultivateManageJS";
  import {Msg} from "../../../../tools/message";
    export default {
      name: "cultivateEstablish",

      data() {
        return {
          userInfor:Auth.getUser(),

          establishForm: {
            organizationId:'',
            editorId:'',
            publishStatus:0,
            outsiteUrl:'',
            pluginUrl:'',
            picUrl:''
          },
          // outsiteUrl:'',
          picUrl:'',   //图片路径
          pluginUrl:'', //附件路径

          ruleForm: {
            title: "",
            content:"",
          },
          rules: {
            title: [
              {required: true, message: "请输入标题", trigger: ['blur', 'change']},
            ],
            content: [
              {required: true, message: "请输入内容", trigger: ['blur', 'change']},
            ],
          },

          // 上传文件
          uploadFile(){

          },
          // 上传图片
          uploadPic(){},
        }
      },
      methods:{

        //____________________________________________________文件上传
        // 文件超出个数限制时的钩子
        exceedFile() {
          // this.$notify.warning({
          //   title: '警告',
          //   message: `只能上传一个文件`
          // })
          Msg.error("只能上传一个文件哦");
        },
        //———————————————————————— 图片上传
        handlePicSuccess(res,file){
          // this.imageUrl = URL.createObjectURL(file.raw);
          // this.url=res;
          this.picUrl=res;
        },
        handlePicError(){
          Msg.error("上传失败，请重新上传");
        },
        handlePluginSuccess(res,file){
          // this.fileUrl= URL.createObjectURL(file.raw);
          this.pluginUrl=res;
        },
        handlePluginError(){
          Msg.error("上传失败，请重新上传");
        },


        // 返回
        jumpToCultivate(){
          this.$router.push({path:'/cultivate'});
        },
        saveEssay(){

        },
        publish(publishStatus){
          this.$refs.ruleForm.validate(valid => {   //验证成功
            if (valid) {
              this.$refs.uploadPic.submit();
              this.$refs.uploadPlugin.submit();

              setTimeout(()=>{   //异步处理数据
                this.establishForm.picUrl = this.picUrl;
                this.establishForm.pluginUrl=this.pluginUrl;
                this.establishForm.organizationId=this.userInfor.organizationId;
                // this.establishForm.content=this.establishForm.content.replaceAll(" ","&nbsp;");
                // this.establishForm.content=this.establishForm.content.split(' ').join('&nbsp;&nbsp;');
                this.establishForm.editorId = this.userInfor.partyId;
                this.establishForm.publishStatus = publishStatus;
              /*写入数据库*/
                cultivateManage.createUserAccount(this.establishForm).then(
                  res=>{
                    Msg.success(res.data.message);
                    this.jumpToCultivate();

                  })
                  .catch(err =>{
                    Msg.error(res.data.message);
                    console.log(err);
                    this.jumpToCultivate();
                  });
                },1000);
            }
            else {
              Msg.error('请填写正确的资料信息后再提交！');
            }
          });

        },
      },
      mounted(){

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
  >>> .el-button--danger {
    background-color: red;

  }
  /*.tips_font{*/
    /*color: gray;*/
    /*font-size: 14px;*/
    /*margin-left: 5%;*/
  /*}*/
</style>
