<template>
  <div style="width: 100%;margin:0 auto;">
      <!--面包屑-->
<!--    <div >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/dynamicContent' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>党建培训管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div style="width: 100%" class="nav-form-top function-part" >
        <div class="input-content">
          <span>内容：</span>
          <el-input placeholder="请输入" :show-overflow-tooltip="true"
                    class="input_box" v-model="searchForm.content"></el-input>
        </div>
        <div class="time-content">
          <span>发布时间：</span>
          <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.date"
                          value-format="yyyy-MM-dd" class="input_box"></el-date-picker>
        </div>
        <div class="button-flex">
          <el-button type="danger" @click="searchInfor">查询</el-button>
          <el-button type="danger" style="margin-left: 20%" @click="publishChecks">发布</el-button>
          <el-button type="danger" style="margin-left: 10px" @click="jumpToEstablish">创建</el-button>
        </div>

    </div>

      <!--表格-->
    <el-table   @selection-change="handleSelectionChange"
                :data="essayInfor"
                :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}" class="form-table-top">
      <el-table-column fixed type="selection" :selectable="selectTable"  width="50"  ></el-table-column>
      <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"/>
      <el-table-column prop="content" label="内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="publishTime" label="发布时间" :formatter="formatePublishTime" :show-overflow-tooltip="true"/>
      <el-table-column prop="editorName" label="编辑人"/>
      <el-table-column prop="publishStatus" label="状态"  width="140" :formatter="formateStatus"/>
      <el-table-column prop="browsingAmount" label="浏览量" align="center" width="110" :formatter="formateBrowsing"/>
      <el-table-column prop="praiseAmount" label="点赞数" align="center" width="110">
        <template slot-scope="scope">
          <span v-show="!scope.row.publishStatus">——</span>
          <router-link :to="{name:'likeListManage',params:{id:scope.row.id,type:'like'}}" plain style="color: #49a9f0" v-show="scope.row.publishStatus">{{scope.row.praiseAmount}}</router-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150">
      <!--操作行-->
        <template slot-scope="scope" >
          <el-button type="text" class="text_button" v-show="scope.row.publishStatus===0" @click="deleteClick(scope.row)">删除</el-button>
          <el-button type="text" class="text_button" v-show="scope.row.publishStatus===0 " @click="updateClick(scope.row)">编辑</el-button>
          <el-button type="text" class="text_button" @click="viewClick(scope.row)">查看</el-button>
        </template>

      </el-table-column>
    </el-table>

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
        :total="totalEssay">
      </el-pagination>
    </div>

    <!--查看弹出框-->
    <div class="viewForm">
      <el-dialog title="查看" :visible.sync="viewVisible">
        <el-form :model="viewForm" class="popBox">
          <el-form-item label="标题："  class="read">
            <el-input size="small" v-model="viewForm.title" style="width: 400px" readonly/>
          </el-form-item>

          <el-form-item label="网址：" class="read"  v-show="viewForm.outsiteUrl!==''">
            <a :href="getWebUrl(viewForm.outsiteUrl)"  target="_blank">{{viewForm.outsiteUrl}}</a>
          </el-form-item>

          <el-form-item label="文章内容" >
            <el-input  v-model="viewForm.content" type="textarea" :rows="6" readonly></el-input>
          </el-form-item>

          <el-form-item label="图片：" v-model="viewForm.picUrl"  v-show="viewForm.picUrl!==''">
            <div class="read">
              <img :src="viewForm.picUrl" style="width: 60%;height: 60%">
            </div>
          </el-form-item>

          <el-form-item label="附件：" v-model="viewForm.pluginUrl" v-show="viewForm.pluginUrl!==''">
            <div class="read">
              <el-button type="text" icon="el-icon-paperclip" @click="getDownLoad(viewForm.pluginUrl)">
                点击下载附件
              </el-button>

            </div>
          </el-form-item>

          <!--底部按钮-->
          <el-form-item>
            <el-button style="margin-left: 5%" @click="cleanRead">取消</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </div>

    <!--修改弹出框-->
    <div class="updateForm">
      <el-dialog title="修改" :visible.sync="updateVisible">
        <el-form :model="updateForm" class="popBox" ref="ruleForm" :rules="rules">
          <el-form-item label="标题:"  class="read" prop="title" style="margin-left:4.5%">
            <el-input size="small" v-model="updateForm.title" style="width: 210%"/>
          </el-form-item>

          <el-form-item label="网址:" class="read"  style="margin-left:6%" >
            <el-input size="small" v-model="updateForm.outsiteUrl" placeholder="请输入以Http://开头以.com结尾的内容"  style="width: 120%;">
              <template slot="prepend">Http://</template>
              <template slot="append">.com</template>
            </el-input>
          </el-form-item>

          <el-form-item label="文章内容:" class="read" prop="content">
            <el-input type="textarea" :rows="7" style="width: 250%" v-model="updateForm.content"></el-input>
          </el-form-item>

          <div class="read">
            <div style="margin-left:1%;width: 45%" v-show="picUrl!==''">
              <el-form-item label="当前图片:"  style="margin-left:1%" prop="picUrl" >
                  <img :src="picUrl" class="avatar" >
              </el-form-item>
            </div>
            <div style="width: 70%;margin-left: 0">
              <el-form-item label="更改图片:">
                  <el-upload style=" text-align: start;"
                             ref="uploadPic"
                             :auto-upload="false"
                             :limit= "1"
                             :on-success="handlePicSuccess"
                             :on-exceed="exceedFile"
                             action="http://localhost:9090/Dynamic/DyCultivateController/uploadPic"
                             list-type="picture-card"
                             accept=".jpg,.pdf"
                             v-model="updateForm.picUrl">
                    <i class="el-icon-plus" ></i>
                    <div slot="tip" class="el-upload__tip" v-show="this.picUrl===''" style="margin-left: 15%">支持拓展名：.pdf,.jpg...</div>
                  </el-upload>
              </el-form-item>
            </div>

          </div>

          <div class="read">
            <div style="margin-left:1%;width: 38%" v-show="updateForm.pluginUrl!==''">
              <el-form-item label="当前附件：" style="margin-left:1%" prop="pluginUrl">
                <div class="read">
                  <el-button type="text" icon="el-icon-paperclip" @click="getDownLoad(pluginUrl)"
                             style="height:5px;">
                    点击下载原附件
                  </el-button>
                </div>
              </el-form-item>
            </div>
            <div style="width: 50%;margin-left: 1%">
              <el-form-item label="更改附件：" >
                <div class="read">
                  <el-upload  ref="uploadPlugin" style=" text-align: start"
                              action="http://localhost:9090/Dynamic/DyCultivateController/uploadPlugin"
                              :limit= "1"
                              :auto-upload="false"
                              :on-success="handlePluginSuccess"
                              :on-exceed="exceedFile"
                              accept=".docx,.doc,application/pdf,image/jpg,image/jpeg,image/gif,image/png"
                              v-model="updateForm.pluginUrl">
                    <el-button icon="el-icon-upload2" size="medium">上传文件</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </div>
          </div>
          <!--底部按钮-->
          <el-form-item>
            <el-button type="danger" @click="updateEssay(0)">保存</el-button>
            <el-button type="danger" style="margin-left: 5%" @click="updateEssay(1)">发布</el-button>
            <el-button style="margin-left: 5%" @click="cleanForm">取消</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {Auth} from '../../../../store/modules/auth'
  import {cultivateManage} from "./cultivateManageJS";
  import {Msg} from "../../../../tools/message";

  export default {
        name: "cultivateManage",
      data(){
          return{
            userInfor:Auth.getUser(),

            value:'',
            essayInfor:[],

            viewVisible:false,//查看弹窗是否显示
            updateVisible:false,//修改弹窗是否显示

            viewForm:{
              outsiteUrl:'',
              pluginUrl:'',
              picUrl:''
            },
            updateForm:{
              essayId:'', title:'', editorId:'',organizationId:'',
              publishStatus:0,
              outsiteUrl:'',
              content:'',
            },

            outsiteUrl:'',
            picUrl:'',
            pluginUrl:'',

            searchForm:{
              content:'',
              date:''
            },
            checkObj:[],    //选择的选项
            checkList:[],    //传过去的id

            // 查询
            // searchContent:"",

            currentPage:1,//当前页
            totalEssay:0,//总共的文章数量
            pageSize:5,

/*               验证*/
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
          }
      },

      methods:{
          /*处理发布时间显示*/
        formatePublishTime(row, column, cellvalue){
          var publishTime;
          if(!row.publishStatus)
            publishTime = "——";
          else
            publishTime=cellvalue;
          return publishTime;
        },
          /*处理状态*/
        formateStatus(row, column, cellvalue){
          var publishStatus;
          if(cellvalue){
            publishStatus = "已发布";
          }else{
            publishStatus = "预览";
          }
          return publishStatus;
        },
        /*阅览量*/
        formateBrowsing(row, column, cellvalue){
          var browsingAmount;
          if(!row.publishStatus)
            browsingAmount = "——";
          else
            browsingAmount=cellvalue;
          return browsingAmount;
        },

        searchInfor(){
          // alert(this.searchForm.date);
          this.getCurrentEssayInfor();
        },

        // 监视表格中勾选部分
        handleSelectionChange(val) {
          this.checkObj = val;
        },
        // 发布确认
        publishChecks(){
          for(var i in this.checkObj)
            this.checkList[i]=this.checkObj[i].id;

          this.$confirm('是否确认发布该文章', '确认发布',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonClass:'button_y',
            type: 'warn'
          }).then(()=>{
            if(this.checkList.length!==0) {
              this.doPublish();
            }
            else{
              Msg.error("请勾选内容")
            }

          }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消发布'
                });
          });
        },
        doPublish(){
            cultivateManage.publishEssayById(this.checkList).then(
              res => {
                Msg.success(res.data.message);
                this.checkList = [];
                this.checkObj = [];
                this.getCurrentEssayInfor();
              })
              .catch(err => {
                Msg.error(res.data.message);
                console.log(err);
              });
        },

        deleteClick(row){

          this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            cultivateManage.deleteCultivateEssayById({cultivateEssayId:row.id}).then(
                res=> {
                  Msg.success(res.data.message);
                  this.getCurrentEssayInfor();
                })
                .catch(err =>{
                  Msg.error('删除失败');
                  console.log(err);
                });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        viewClick(row){
          this.viewVisible=true;
          this.viewForm =row;
        },
        updateClick(row){
          this.updateVisible=true;
          this.updateForm.title = row.title;
          this.updateForm.content = row.content;
          this.updateForm.essayId = row.id;
          this.updateForm.outsiteUrl = row.outsiteUrl;
          this.updateForm.pluginUrl = row.pluginUrl;
          this.updateForm.picUrl = row.picUrl;
          this.pluginUrl = row.pluginUrl;
          this.picUrl = row.picUrl;
        },
        handlePicSuccess(res,file){
          this.picUrl = URL.createObjectURL(file.raw);
          // this.url=res;
          this.picUrl=res;
        },
        handlePluginSuccess(res,file){  //附件
          this.pluginUrl=res;
        },

        exceedFile() {

          Msg.error("只能上传一个文件哦");
        },

        cleanForm(){
          this.updateVisible = false;
          this.$refs.ruleForm.clearValidate();
          this.$refs.ruleForm.resetFields();
           this.updateForm={
             essayId:'', editorId:'',organizationId:'',
             publishStatus:0,
             title:'',content:'',
             outsiteUrl:'',
           };
          this.$refs.uploadPic.clearFiles();
          this.$refs.uploadPlugin.clearFiles();
          this.pluginUrl='';
          this.picUrl='';

        },
        cleanRead(){   //取消查看
          this.viewVisible = false;
          this.viewForm={
            outsiteUrl:'',
            pluginUrl:'',
            picUrl:''
          };
        },
        getDownLoad(url){  //获取附件内容
          if(url===undefined){
            Msg.warn("没有附件可以下载");
          }
          else{
            // alert(url);
            window.location.href=url;
          }
        },

          jumpToEstablish(){
            this.$router.push({path:'/cultivateEstablish'})
        },

        selectTable(row){
          if(row.publishStatus === 0) {
            return true;
          }
          else {
            return false;
          }
        },
        //发布弹窗内容
        updateEssay(publishStatus){

          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              this.$refs.uploadPic.submit();
              this.$refs.uploadPlugin.submit();

              setTimeout(()=>{
                this.updateForm.editorId = this.userInfor.partyId;
                this.updateForm.organizationId = this.userInfor.organizationId;
                this.updateForm.picUrl = this.picUrl;
                this.updateForm.pluginUrl =this.pluginUrl;
                this.updateForm.publishStatus = publishStatus;

                console.log("update",this.updateForm);
                cultivateManage.modifyEssayById(this.updateForm).then(
                  res=>{
                    this.cleanForm();
                    this.getCurrentEssayInfor();
                    Msg.success(res.data.message);
                  })
                  .catch(err =>{
                    Msg.error(res.data.message);
                    console.log(err);
                  });
              },100);
            }
            else {
              Msg.error('请填写正确的资料信息后再提交！');
            }
          })
        },
//  关闭弹窗

        getWebUrl(outsiteUrl){
          return outsiteUrl;
        },

        //条数处理
        handleSizeChange(val) {
          this.pageSize = val;
          this.getCurrentEssayInfor();
        },
        // 页码处理
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getCurrentEssayInfor();
        },
        /*获取文章*/
        getCurrentEssayInfor(){

          cultivateManage.findEssayInformation({currentPage: this.currentPage,pageSize: this.pageSize,content:this.searchForm.content,publishTime:this.searchForm.date})
            .then(
              res=>{
                  if(res.data.code === 200){
                      this.essayInfor = res.data.data.list;
                      this.totalEssay=res.data.data.total;
                  } else if(res.data.code === 403){
                      Msg.error('权限不足');
                  } else {
                      Msg.error('网络繁忙');
                  }

              }
            )
            .catch(err =>{
              Msg.error("网络繁忙");
            });

        }
      },
    created(){
      this.getCurrentEssayInfor();
    }

    }
</script>

<style scoped>
  /*各种头部的距离*/
   .nav-form-top, .form-table-top{
    margin-top:2%;
  }

  .input-content, .time-content, .function-part, .button-flex{
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 2%;
  }

  /*页码*/
  .pages{
    display: flex;
    justify-content: center;
    margin-top:2%;
  }

  /*//输入框*/
  .input_box{
    width: 210px;
    height: 40px;

  }

  /*取消下划线*/
  a {
    text-decoration: none;
  }
   .button_y{
    background: red;

  }
  .text_button{
    font-size: 13px;
    color: red;
    background: none;
    margin-left: 2px;
  }
  >>> .el-button--danger {
    background-color: red;

  }
  .read{
    display: flex;
  }

  .sysBox .el-pagination.is-background.el-pager li:not(.disabled).active{
  /*// 进行修改背景和字体*/
    background: red;
    color: #fff;
  }

  .popBox{
    margin: 0 20px;
  }

/*备注样式*/
  .tips_font{
    color: gray;
    font-size: 14px;
    margin-left: 5%;
  }
  >>> .el-upload--picture-card{
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .avatar {
    width: 50%;
    height: 50%;
    display: block;
  }
</style>
