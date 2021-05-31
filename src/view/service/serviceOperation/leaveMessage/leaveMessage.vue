<template>
  <div style="width:100%;margin:0 auto;">
    <!--面包屑-->
<!--    <div class="nav-top">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>留言管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>留言内容：</span>
        <el-input placeholder="请输入" v-model="leaveWordsContent" clearable class="input_box" size="medium" @change="clearLeaveWordsContent"></el-input>
      </div>
      <div class="input-content">
        <span>留言时间：</span>
        <el-date-picker
          clearable
          v-model="leaveWordsTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy/MM/dd"
          clearable
          @change="clearLeaveWordsTime"
        >
        </el-date-picker>
      </div>
      <div class="input-content">
        <span>组织：</span>
        <el-select v-model="selectOrganizationId" placeholder="请选择" clearable @change="clearOrganization">
          <el-option
            v-for="item in selects"
            :key="item.organizationId"
            :label="item.organizationName"
            :value="item.organizationId">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="getLeaveWordsList">查询</el-button>
      </div>

    </div>
    <el-table :data="leaveWordsList"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="留言时间" prop="leaveWordsTime" :show-overflow-tooltip="true"
                       align="center"></el-table-column>
      <el-table-column label="姓名" prop="leaveWordsName" align="center"></el-table-column>
      <el-table-column label="身份" prop="leaveWordsPosition" align="center"></el-table-column>
      <el-table-column label="留言内容" prop="leaveWordsContent" align="center"></el-table-column>
      <el-table-column label="回复内容" prop="replyContent" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.replyContent">___</span>
          <span v-else>{{scope.row.replyContent}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复人" prop="replyName" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.replyName">___</span>
          <span v-else>{{scope.row.replyName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复时间" prop="replyTime" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.replyTime">___</span>
          <span v-else>{{scope.row.replyTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织" prop="leaveOrganizationName" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="text_button" @click="openReplyDialog(scope.row)"
                v-if="!scope.row.replyContent || !scope.row.replyName || !scope.row.replyTime ">回复</span>
          <span v-else class="text_button" @click="openViewDialog(scope.row)">查看</span>
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
        :pageSize="pageSize"
        layout="total,  prev, pager, next, sizes,jumper"
        :total="totalList">
        <span>第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>

    <el-dialog title="查看详情" :visible.sync="viewDialogFormVisible" >
      <el-form :model="viewForm">
        <el-form-item label="问题描述:" :label-width="formLabelWidth">
          <span>{{viewForm.leaveWordsContent}}</span>
          <div class="leave-info">
            <span>{{viewForm.leaveWordsTime}}</span>
            <span>{{viewForm.leaveWordsName}}</span>
          </div>
          <!--        <el-input v-model="viewForm.leaveWordsContent" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="回复内容:" :label-width="formLabelWidth">
          {{viewForm.replyContent}}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="回复留言" :visible.sync="replyDialogFormVisible" @closed="closed('replyForm')">
      <el-form :model="replyForm" ref="replyForm" :rules="rules">
        <el-form-item label="问题描述:" :label-width="formLabelWidth">
          <span>{{replyForm.leaveWordsContent}}</span>
          <div class="leave-info">
            <span>{{replyForm.leaveWordsTime}}</span>
            <span>{{replyForm.leaveWordsName}}</span>
          </div>
          <!--        <el-input v-model="viewForm.leaveWordsContent" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="回复内容:" :label-width="formLabelWidth" prop="replyContent">
          <el-input

            placeholder="请输入回复内容"
            v-model="replyForm.replyContent">
          </el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reply('replyForm')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {leaveApi} from "./leaveApi";
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";

    export default {
        name: "leaveMessage",
        data() {
            return {
                leaveWordsTime: '',
                leaveWordsContent: '',
                leaveWordsList: [],
                totalList: 0,
                currentPage: 1,
                totalPage: 1, // 总页数
                pageSize: 5, // 每页条数
                userInfo: Auth.getUserInfo() || {},
                viewDialogFormVisible: false, // 查看弹窗
                replyDialogFormVisible: false, // 回复弹窗
                viewForm: {
                    leaveWordsContent: '',
                    leaveWordsTime: '',
                    leaveWordsName: '',
                    replyContent: ''
                },
                replyForm: {
                    leaveWordsContent: '',
                    leaveWordsTime: '',
                    leaveWordsName: '',
                    replyContent: '',
                    leaveWordsId: ''
                },
                formLabelWidth: '120px',
                rules: {
                    replyContent: [
                        {required: true, message: '请输入回复内容', trigger: 'blur'},
                        {min: 1, max: 1000, message: '长度在 1 个字符以上', trigger: 'blur'}
                    ],
                },
                selects: [],
                selectOrganizationId: '',
                user: Auth.getUser() || {}
            }
        },
        mounted() {
            this.getLeaveWordsList();
            this.getOrganization();
        },
        methods: {
            closed(formName){
                this.resetForm(formName);
            },
            clearLeaveWordsContent(){
              if(this.leaveWordsContent === ''){
                  this.getLeaveWordsList();
              }
            },
            clearLeaveWordsTime(){
                if(this.leaveWordsTime === ''){
                    this.getLeaveWordsList();
                }
            },
            clearOrganization(){
                if(this.selectOrganizationId === ''){
                    this.getLeaveWordsList();
                }
            },
            getOrganization() {

                leaveApi.getOrganizationNameIdList({organizationId: this.user.organizationId}).then(res => {
                    if (res.data.code === 200) {
                        this.selects = res.data.data;
                    } else if(res.data.code === 403){
                        // Msg.error('权限不足')
                    }
                }).catch(err =>{
                    Msg.error('网络繁忙');
                })
            },
            getLeaveWordsList() {
                var data = {
                    adminOrganizationId: Auth.getUser().organizationId,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    leaveWordsContent: this.leaveWordsContent,
                    selectOrganizationId: this.selectOrganizationId,
                    leaveWordsTime: this.leaveWordsTime,
                };

                leaveApi.getLeaveWordsQueryList(data).then(res => {
                    if(res.data.code === 200){
                        this.leaveWordsList = res.data.data.list;
                        this.totalList = res.data.data.total;
                        this.totalPage = Math.ceil(this.totalList / this.pageSize);

                        Msg.success(res.data.message);

                        if (this.currentPage > this.totalList) {
                            this.currentPage = this.totalList;
                        }
                        if (this.currentPage === 0 && this.totalPage === 0) {
                            this.currentPage = 1;
                            this.totalPage = 1;
                        }
                    } else if(res.data.code === 403){
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙');
                    }



                }).catch(err =>{
                    Msg.error('网络繁忙');
                })
            }
            ,
            handleSizeChange(val) {
                this.pageSize = val;
                this.getLeaveWordsList();
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getLeaveWordsList();
                // console.log(`当前页: ${val}`);
            },
            // 打开回复弹窗
            openReplyDialog(data) {
                this.replyDialogFormVisible = true;
                this.replyForm.leaveWordsContent = data.leaveWordsContent;
                this.replyForm.leaveWordsName = data.leaveWordsName;
                this.replyForm.leaveWordsTime = data.leaveWordsTime.slice(0, 10);
                this.replyForm.leaveWordsId = data.id; // 留言id
                // this.viewForm.replyContent = data.replyContent;
            },
            // 打开查看弹窗
            openViewDialog(data) {
                this.viewDialogFormVisible = true;
                this.viewForm.leaveWordsContent = data.leaveWordsContent;
                this.viewForm.leaveWordsName = data.leaveWordsName;
                this.viewForm.leaveWordsTime = data.leaveWordsTime.slice(0, 10);
                this.viewForm.replyContent = data.replyContent;
            },
            reply(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = {
                            replyPartyId: this.user.partyId, // 管理员的党员id
                            leaveWordsId: this.replyForm.leaveWordsId, // 留言id
                            replyTime: this.time(), // 回复时间
                            replyContent: this.replyForm.replyContent, // 回复内容
                            replyOrganizationId: this.user.organizationId,
                            replyPostId: this.user.postId
                        }
                        leaveApi.replyLeaveWords(data).then(res => {
                            if (res.data.data) {
                                Msg.success(res.data.message);
                            } else {
                                Msg.error(res.data.message);
                            }
                            this.getLeaveWordsList(); // 获取数据
                        }).catch(err =>{
                            Msg.error('网络繁忙');
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                    this.replyDialogFormVisible = false;
                    this.resetForm('replyForm');
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 格式化时间
            dateFtt(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            // 获取当前格式化时间
            time() {
                var myDate = new Date(); //获取系统当前时间
                return this.dateFtt("yyyy-MM-dd hh:mm:ss", myDate);
            }
        }
    }
</script>

<style scoped>
  /*各种头部的距离*/
  /*.nav-top,*/

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
    width: 200px;
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

  /*!* 分页组件调整样式*!*/

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
