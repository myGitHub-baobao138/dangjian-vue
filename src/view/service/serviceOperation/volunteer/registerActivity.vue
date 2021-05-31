<template>
  <div style="width:100%;margin:0 auto;">

    <!--    &lt;!&ndash;面包屑&ndash;&gt;-->
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item :to="{ path: '/service/' }"> 志愿活动</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>活动报名管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->

    <!--查询条件-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>标题：</span>
        <el-input placeholder="请输入" clearable class="input_box" size="medium" v-model="inputTitle" clearable></el-input>
      </div>
      <!--<div class="input-content">-->
      <!--<span>开始时间：</span>-->
      <!--<el-date-picker-->
      <!--clearable-->
      <!--v-model="beginTime"-->
      <!--type="date"-->
      <!--placeholder="选择日期"-->
      <!--value-format="yyyy-MM-dd"-->
      <!--format="yyyy/MM/dd"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
      <!--</div>-->
      <div class="input-content">
        <span>状态：</span>
        <el-select v-model="statusValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="getActivityList()">查询</el-button>
        <el-button type="primary" style="margin-left: 20%" @click="insertActivity()">创建</el-button>
      </div>
    </div>

    <!--表格内容-->
    <el-table :data="activityRegistrations"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="活动标题" prop="activityTitle" :show-overflow-tooltip="true"
                       align="center"></el-table-column>
      <el-table-column label="活动内容" prop="activityContent" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="发起人" prop="activitySponsor" align="center"></el-table-column>
      <el-table-column label="报名截止时间" prop="registrationDeadline" align="center"></el-table-column>
      <el-table-column label="状态" prop="activityState" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.activityState==1">未发布</span>
          <span v-if="scope.row.activityState==2">报名中</span>
          <span v-if="scope.row.activityState==3">报名截止</span>
          <span v-if="scope.row.activityState==4">活动结束</span>
        </template>
      </el-table-column>
      <el-table-column label="报名人数" prop="registrationNumber" align="center" width="100">
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" style="color: red" @click="checkRegistration(scope.row.id)"
                     v-if="scope.row.activityState!=1">查看报名&nbsp|
          </el-button>

          <el-dialog title="报名人数" :visible.sync="dialogTableVisible">
            <el-table :data="detailInfo">
              <el-table-column property="registrationTime" label="报名时间" width="150"></el-table-column>
              <el-table-column property="name" label="姓名" width="200"></el-table-column>
              <el-table-column property="registerIdentity" label="身份"></el-table-column>
              <el-table-column property="contactNumber" label="电话"></el-table-column>
            </el-table>
          </el-dialog>
          <el-button size="small" type="text" style="color: red" @click="deleteActivity(scope.row)"
                     v-if="scope.row.activityState==1">删除&nbsp|
          </el-button>
          <!--<el-button size="small" type="text" style="color: red;margin: 0" @click="editActivity(scope.row)" v-if="scope.row.activityState==1">编辑&nbsp|</el-button>-->
          <el-button size="small" type="text" style="color: red;margin: 0" @click="updateActivityState(scope.row.id)"
                     v-if="scope.row.activityState==1">发布&nbsp|
          </el-button>
          <el-button size="small" type="text" style="color: red;margin: 0" @click="toCheck(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--创建活动-->
    <div class="create-activity">
      <el-dialog title="创建活动" :visible.sync="dialogFormVisible">
        <div style="width: 100%;height: 1px;background-color: #EBEBEB;margin-bottom: 20px;"></div>
        <el-form :model="activity" :rules="activityRules" ref="activityRulesForm" label-width="120px">
          <el-form-item label="活动标题:" prop="activityTitle">
            <div class="activity-title">
              <el-input v-model="activity.activityTitle" autocomplete="off"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="活动内容:" prop="activityContent">
            <div class="activity-content">
              <el-input v-model="activity.activityContent" autocomplete="off"></el-input>
            </div>
          </el-form-item>

          <div style="display: flex">
            <div class="activity-left">
              <el-form-item label="活动联系人:" prop="activityContact">
                <div class="activity-contact">
                  <el-input v-model="activity.activityContact" autocomplete="off"></el-input>
                </div>
              </el-form-item>

              <el-form-item label="活动地址:" prop="activityLocation">
                <div class="activity-contact">
                  <el-input v-model="activity.activityLocation" autocomplete="off"></el-input>
                </div>
              </el-form-item>

              <el-form-item label="活动时间:" prop="activityTime">
                <div class="activity-contact">
                  <el-date-picker
                    v-model="activity.activityTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
              </el-form-item>
            </div>

            <div class="activity-right">
              <el-form-item label="联系电话:" prop="contactNumber">
                <div class="activity-contact-number">
                  <el-input v-model="activity.contactNumber" autocomplete="off"></el-input>
                </div>
              </el-form-item>

              <el-form-item label="集合地址:" prop="meetingPlace">
                <div class="activity-contact-number">
                  <el-input v-model="activity.meetingPlace" autocomplete="off"></el-input>
                </div>
              </el-form-item>

              <el-form-item label="活动截止时间:" prop="activityDeadline">
                <div class="activity-contact-number">
                  <el-date-picker
                    v-model="activity.activityDeadline"
                    type="datetime"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
              </el-form-item>
            </div>
          </div>


<!--          <el-form-item label="上传图片:">-->
<!--            <div class="showFile">-->
<!--              <div class="picture" style="margin-right: 9%;width: 206px ;">-->
<!--                <el-upload-->
<!--                  class="avatar-uploader"-->
<!--                  action="http://localhost:9090/Service/ActivityRegistration/upload"-->
<!--                  :show-file-list="false"-->
<!--                  :on-success="handleAvatarSuccess">-->
<!--                  <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
<!--                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                </el-upload>-->
<!--              </div>-->
<!--              <span v-if="this.editOrInsert == 1">原上传图片:</span>-->
<!--              <div v-if="this.editOrInsert == 1" style="width:100px;margin-left: 2%">-->
<!--                <img :src="this.activity.picture" style=" width:100px; height:100px; border-radius:5px; "/>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-form-item>-->
          <el-form-item label="上传图片:">
            <div class="showFile">
              <div class="picture" style="margin-right: 9%;width: 206px ;">
                <el-upload
                  ref="uploadPic"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit= "1"
                  :on-success="handleAvatarSuccess"
                  :on-error="handlePicError"
                  :on-exceed="exceedFile"
                  accept=".jpg,.pdf"
                  v-model="imageUrl"
                  class="avatar-uploader"
                  action="http://localhost:9090/Service/ActivityRegistration/upload">
                </el-upload>
              </div>
              <span v-if="this.editOrInsert == 1">原上传图片:</span>
              <div v-if="this.editOrInsert == 1" style="width:100px;margin-left: 2%">
                <img :src="this.activity.picture" style=" width:100px; height:100px; border-radius:5px; "/>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="上传附件:">
            <div class="showFile">
              <div style="margin-right: 9%;width: 206px ;">
                <el-upload
                  class="upload-demo"
                  action="http://localhost:9090/Service/ActivityRegistration/uploadFile"
                  ref="uploadFileURL"
                  :on-change="handleChange"
                  :auto-upload="false"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </div>
              <span v-if="this.editOrInsert == 1">原上传附件:</span>
              <div v-if="this.editOrInsert == 1" style="width:100px;margin-left: 2%">
                <a :href="this.activity.annex" style="width:100px;">下载原附件</a>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" v-if="this.editOrInsert == 1" @click="submitUpdateActivity('activityRulesForm')">
            确定
          </el-button>
          <el-button type="primary" v-if="this.editOrInsert == 0" @click="publish('activityRulesForm')">发布</el-button>
          <el-button type="primary" v-if="this.editOrInsert == 0" @click="resolve('activityRulesForm')">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!--翻页-->
    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total,prev, pager, next, sizes,jumper"
        :total="total">
        <span>第{{currentPage}}/{{Math.ceil(total/pageSize)}}页</span>
      </el-pagination>
    </div>

  </div>
</template>
<script>

    import {Auth} from "../../../../store/modules/auth";
    import {RegisterActivityjs} from "./registerActivityjs";
    import {Msg} from "../../../../tools/message.js"


    export default {
        name: "registerActivity",
        data() {
            var checkcontactNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            return {
                inputTitle: '',
                beginTime: '',
                statusValue: '',

                activity: {},
                detailInfo: [],
                imageUrl: '',
                fileName: '',

                editOrInsert: 0,//0-新增  1-修改

                dialogTableVisible: false,
                dialogFormVisible: false,

                currentPage: 1,
                total: 0,
                pageSize: 5,

                fileList: [],

                activityRegistrations: [],
                statusOption: [{label: '未发布', value: 1}, {label: '报名中', value: 2}],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                activityRulesForm: {
                    activityTitle: '',
                    activityContent: '',
                    activityContact: '',
                    activityLocation: '',
                    activityTime: '',
                    contactNumber: '',
                    meetingPlace: '',
                    registrationDeadline: '',
                    activityDeadLine: '',
                },
                activityRules: {
                    activityTitle: {
                        required: true, message: '请输入标题', trigger: 'blur'
                    },
                    activityContent: {
                        required: true, message: '请输入活动内容', trigger: 'blur'
                    },
                    activityContact: {
                        required: true, message: '请输入活动联系人', trigger: 'blur'
                    },
                    activityLocation: {
                        required: true, message: '请输入活动地址', trigger: 'blur'
                    },
                    activityTime: {
                        required: true, message: '请选择活动时间', trigger: 'blur'
                    },
                    registrationDeadline: {
                        required: true, message: '请选择活动截止时间', trigger: 'blur'
                    },
                    contactNumber: [
                        {required: true, message: '请输入联系人电话'},
                        {validator: checkcontactNumber, trigger: 'blur'}],
                    meetingPlace: {
                        required: true, message: '请输入集合地址', trigger: 'blur'
                    },
                    activityDeadline: {
                        required: true, message: '请输入活动截止时间', trigger: 'blur'
                    },

                },
            }
        },

        methods: {

            //翻页设置
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getActivityList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.getActivityList();
            },

            checkRegistration(id) {
                this.dialogTableVisible = true;
                RegisterActivityjs.selectInfoByActivityId({
                    activityId: id
                }).then(res => {
                    this.detailInfo = res.data.data;
                })
            },

            toCheck(val) {
                sessionStorage.setItem("registerActivity", JSON.stringify(val));
                this.$router.push({path: '/registerActivityDetail'})
            },
            handleAvatarSuccess(res, file) {
                // this.fileName = file.name;
                // this.imageUrl = URL.createObjectURL(file.raw);
              //
              this.imageUrl = res;
            },
            handlePicError(){
              Msg.error("上传失败，请重新上传");
            },
            exceedFile() {
              // this.$notify.warning({
              //   title: '警告',
              //   message: `只能上传一个文件`
              // })
              Msg.error("只能上传一个文件哦");
            },
            //提交修改的数据
            submitUpdateActivity(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.$refs.uploadPic.submit();
                        var record = {
                            id: this.activity.id,
                            activityTitle: this.activity.activityTitle,
                            activityContent: this.activity.activityContent,
                            // registrationNumber:this.activity.registrationNumber,
                            // activitySponsorIdentity:this.activity.activitySponsorIdentity,
                            activityLocation: this.activity.activityLocation,
                            meetingPlace: this.activity.meetingPlace,
                            activityContact: this.activity.activityContact,
                            contactNumber: this.activity.contactNumber,
                            registrationDeadline: this.activity.registrationDeadline,
                            activityTime: this.activity.activityTime,
                            submissionTime: this.activity.submissionTime
                        };
                        console.log(record);
                        RegisterActivityjs.updateByPrimaryKeySelective(record).then(res => {
                            this.getActivityList();
                            this.dialogFormVisible = false;
                        })
                    } else {
                        // console.log('error submit!!');
                        Msg.error("请根据提示填写正确的数据！")
                        return false;
                    }
                });
            },
            //发布
            publish(formName) {

              this.$confirm('确定要发布么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$refs[formName].validate((valid) => {

                  if (valid) {
                    this.$refs.uploadPic.submit();
                    this.$refs.uploadFileURL.submit();
                    setTimeout(()=>{
                      this.activity.picture = this.imageUrl;
                      this.activity.activitySource = "2";//活动来源
                      this.activity.activitySponsorId = Auth.getUser().partyId;
                      this.activity.organizationId = Auth.getUser().organizationId;
                      this.activity.activitySponsorIdentity = Auth.getUser().postId;
                      this.activity.approvalState = 0;
                      this.dialogFormVisible = false;
                      this.activity.activityState = 2;
                      RegisterActivityjs.toInsert(this.activity).then(res => {
                        this.getActivityList();
                        this.resetForm(this.activity);
                      })
                    },1000)
                  } else {
                    // console.log('error submit!!');
                    Msg.error("请根据提示填写正确的数据！")
                    return false;
                  }
                });
                this.$message({
                  type: 'success',
                  message: '发布成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消发布'
                });
              });
            },
            //保存
            resolve(formName) {
              this.$confirm('确定要保存么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.$refs.uploadFileURL.submit();
                    this.$refs.uploadPic.submit();
                    setTimeout(()=>{
                      this.activity.picture = this.imageUrl;
                      this.activity.activitySource = "2";//活动来源
                      this.activity.activitySponsorId = Auth.getUser().partyId;
                      this.activity.organizationId = Auth.getUser().organizationId;
                      this.activity.activitySponsorIdentity = Auth.getUser().postId;
                      this.activity.approvalState = 0;
                      this.dialogFormVisible = false;
                      this.activity.activityState = 1;
                      RegisterActivityjs.toInsert(this.activity).then(res => {
                        this.getActivityList();
                        this.resetForm(this.activity);
                      })
                    },1000)
                  } else {
                    // console.log('error submit!!');
                    Msg.error("请根据提示填写正确的数据！");
                    return false;
                  }
                });
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消保存'
                });
              });
            },
            cancel() {
                this.dialogFormVisible = false;
                // RegisterActivityjs.cancel({
                //     fileName: this.fileName
                // }).then(res => {
                //     console.log("没有保存")
                // })
            },
            //删除志愿活动
            deleteActivity(val) {
              this.$confirm('确定要删除么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                RegisterActivityjs.deleteActivityById({
                  activityId: val.id,
                  imageUrl:val.picture
                }).then(res => {
                  this.getActivityList();
                });
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            },
            //新增志愿活动
            insertActivity() {
                this.editOrInsert = 0;
                this.dialogFormVisible = true;
            },
            //编辑志愿活动
            editActivity(data) {
                this.editOrInsert = 1;
                this.activity = data;
                console.log("修改的id：")
                console.log(this.activity);
                this.dialogFormVisible = true;
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            updateActivityState(val) {
              this.$confirm('确定要发布么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                RegisterActivityjs.updateActivityState({
                  activityId: val
                }).then(res => {
                  this.getActivityList();
                });
                this.$message({
                  type: 'success',
                  message: '发布成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消发布'
                });
              });
            },

            //上传附件
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-3);
            },

            getActivityList() {
                var dto = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    title: this.inputTitle,
                    beginTime: this.beginTime,
                    activityState: this.statusValue
                };
                RegisterActivityjs.selectActivityRegistration(dto).then(res => {
                        this.activityRegistrations = res.data.data;
                    if (res.data.code === 403) {
                        Msg.error('权限不足');
                    }

                    //再调一次接口得到总的条数，没有必要 -- 很有必要
                    RegisterActivityjs.getTotalPage(dto).then(res => {
                        this.total = res.data.data
                    })
                }).catch(err => {
                    Msg.error('网络繁忙');
                });
            },
        },
        mounted() {
            //   RegisterActivityjs.selectActivityRegistration({
            //     currentPage:this.currentPage,
            //     pageSize:this.pageSize
            //   }).then(res=>{
            //     console.log(res.data.data);
            //     this.activityRegistrations = res.data.data;
            //   });
            // RegisterActivityjs.getTotalPage().then(res=>{
            //   this.totalPage = res.data.data
            // })
            this.getActivityList();
        }
    }
</script>

<style scoped>
  /*各种头部的距离*/
  .picture >>> .el-upload {
    height: 100px;
    width: 100px;
    border: 1px solid gray;
  }

  .picture >>> .el-upload i {
    line-height: 100px;
  }

  .nav-form-top, .form-table-top {
    margin-top: 2%;
  }

  .input-content, .time-content, .function-part, .button-flex {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 2%;
  }

  /*//输入框*/
  .input_box {
    width: 210px;
    height: 40px;
  }

  .read {
    display: flex;
  }

  .text_button {
    font-size: 13px;
    color: red;
    background: none;
    cursor: pointer;
  }

  .popBox {
    display: flex;
    justify-content: center;
  }

  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  /*编辑时的文件摆放*/
  .showFile {
    display: flex;
    /*align-items: end;*/
  }

  /* 分页组件调整样式*/

  /*>>> .el-pagination.is-background .el-pager li:not(.disabled).active {*/
  /*  background-color: #f00;*/
  /*  color: #FFF;*/
  /*}*/

  /*>>> .el-pagination.is-background .el-pager li:not(.disabled).active:hover {*/
  /*  background-color: #409EFF;*/
  /*  color: #FFF;*/
  /*}*/

  /*>>> .el-pagination.is-background .el-pager li:not(.disabled):hover {*/
  /*  color: #409EFF;*/
  /*}*/

  /**弹窗内容 */
  >>> .el-dialog {
    text-align: left;
    width: 56%;
  }

  .leave-info {
    text-align: right;
    padding-right: 5%;
  }

  >>> .el-button--primary {
    color: #FFF;
    background-color: #ff0000;
    border-color: #ff0000;
  }

  >>> .el-button--primary:hover {
    color: #FFF;
    background-color: #f55a5a;
    border-color: #f55a5a;
  }

  >>> .el-button--default:hover {
    color: #ff0000;
    background-color: #fff4f4;
    border-color: #fff4f4;
  }
</style>
