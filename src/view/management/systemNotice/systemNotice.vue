<template>
  <div style="width: 100%;margin:0 auto;">
    <!--      &lt;!&ndash;面包屑&ndash;&gt;-->
    <!--      <div class="nav-top">-->
    <!--        <el-breadcrumb separator="/">-->
    <!--          <el-breadcrumb-item :to="{ path: '/managementContent' }">基础管理</el-breadcrumb-item>-->
    <!--          <el-breadcrumb-item>系统公告</el-breadcrumb-item>-->
    <!--        </el-breadcrumb>-->
    <!--      </div>-->

    <div class="nav-form-top function-part">
      <!--第一行查询加按钮-->
      <div class="input-content">
        <span>公告内容：</span>
        <el-input placeholder="请输入" class="input_box" v-model="searchForm.content"></el-input>
      </div>
      <div class="time-content">
        <span>时间：</span>
        <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.publishDate"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="button-flex">
        <el-button type="danger" style="margin-left: 5%" @click="getAllNotice">查询</el-button>
        <el-button type="danger" @click="establishNotice">创建</el-button>
      </div>
    </div>

    <!--表格-->
    <el-table :data="information"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}" class="form-table-top">
      <el-table-column prop="publishTime" label="发布时间" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="content" label="发布内容" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="organizationName" label="通知范围" align="center"/>
      <el-table-column prop="partyName" label="发布人员" align="center"/>
      <el-table-column label="操作" align="center" width="150">
        <!--操作行-->
        <template slot-scope="scope">
          <el-button type="text" class="text_button" @click="viewNotice(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--创建弹出框-->
    <div style="text-align: left">
      <el-dialog title="添加系统公告" :visible.sync="foundVisible">
        <el-form ref="ruleForm" :rules="rules" :model="addForm">
          <div style="margin-left: 5%">
            <el-form-item label="公告内容：" class="read" prop="content">
              <el-input placeholder="请输入内容" type="textarea" :rows="3" style="width: 400px"
                        v-model="addForm.content"></el-input>
            </el-form-item>

            <el-form-item label="通知范围：" class="read" prop="notificationScope">
              <el-radio-group v-model="addForm.notificationScope">
                <el-radio :label="'2477224e1f9d47acb2813047371b81a1'">所有人</el-radio>
                <el-radio :label="this.userInfo.organizationId" v-show="this.organizationRank!=='1'">本学院</el-radio>
              </el-radio-group>
            </el-form-item>

            <!--按钮部分-->
            <el-form-item style="margin-left: 50%;">
              <el-button @click="closeEstablish">取消</el-button>
              <el-button type="danger" @click="addNotice">确定</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </div>

    <!--查看弹出框-->
    <div style="text-align: left">
      <el-dialog title="查看系统公告" :visible.sync="viewVisible">
        <el-form :model="viewForm">
          <div style="margin-left: 5%">
            <el-form-item label="公告内容：" class="read" prop="content">
              <el-input placeholder="请输入内容" type="textarea" :rows="3" style="width: 400px" v-model="viewForm.content"
                        readonly></el-input>
            </el-form-item>

            <!--按钮部分-->
            <el-form-item style="margin-left: 40%;">
              <el-button @click="closeView">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
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
        :total="totalEssay">
      </el-pagination>
    </div>

  </div>
</template>

<script>
    import {Msg} from "../../../tools/message";
    import {Auth} from '../../../store/modules/auth'
    import {systemNotice} from './systemNoticeJS'

    export default {
        name: "systemNotice",

        data() {
            return {

                userInfo: Auth.getUser(),
                organizationRank: 0,

                value: '',
                foundVisible: false,//创建弹窗是否显示
                viewVisible: false,

                // 页码
                currentPage: 1,//当前页
                totalEssay: 0,//总共的文章数量
                pageSize: 5,

                information: [],

                searchForm: {
                    content: '',
                    publishDate: '',
                },
                addForm: {
                    content: '',
                    notificationScope: '',
                },
                viewForm: {},

                /*表单验证*/
                ruleForm: {
                    content: "",
                    notificationScope: ""
                },

                rules: {
                    content: [
                        {required: true, message: "请输入内容", trigger: ['blur', 'change']},
                    ],
                    notificationScope: [
                        {required: true, message: "请选择", trigger: ['change']},
                    ],
                },

                // searchInformation:{   //查找
                //   content: '',
                //   currentPage: 1,
                //   organizationId: '',
                //   pageSize: 5,
                //   publishTime: '',
                //   rank: 1,   /*this.userInfo.organizationRank[0]*/
                // },
            }
        },

        methods: {
            establishNotice() {
                this.foundVisible = true;
            },
            viewNotice(row) {
                this.viewVisible = true;
                this.viewForm = row;
            },

            closeEstablish() {
                this.foundVisible = false;
                this.addForm = {
                    partyId: ''
                };

                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
            },
            closeView() {
                this.viewVisible = false;
                this.viewForm = {};
            },

            //条数处理
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAllNotice();
            },
            // 页码处理
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllNotice();
            },

            addNotice() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        console.log("验证通过");
                        this.addForm.partyId = this.userInfo.partyId;
                        systemNotice.addAnnouncement(this.addForm)
                            .then(
                                res => {
                                    Msg.success(res.data.message);
                                    this.closeEstablish();
                                    this.getAllNotice();
                                }
                            )
                            .catch(err => {
                                Msg.error("添加失败");
                                console.log(err);
                            });
                    } else {
                        Msg.error('请填写正确的资料信息后再提交！');
                    }
                })
            },

            getAllNotice() {
                systemNotice.selectByTimeAndContent({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    organizationId: this.userInfo.organizationId,
                    content: this.searchForm.content,
                    publishTime: this.searchForm.publishDate,
                    rank: this.userInfo.organizationRank
                })
                    .then(
                        res => {
                            if (res.data.code === 200) {
                                this.information = res.data.data.list;
                                this.totalEssay = res.data.data.total;
                            } else if (res.data.code === 403) {
                                Msg.error('权限不足');
                            } else {
                                Msg.error('网络繁忙');
                            }


                        })
                    .catch(err => {
                        Msg.error('网络繁忙');
                        console.log(err);
                    });
            }
        },

        created() {
            this.getAllNotice();
            this.organizationRank = this.userInfo.organizationRank;
        }
    }
</script>

<style scoped>

  /*各种头部的距离*/
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

  /*表格字体样式*/
  .text_button {
    font-size: 13px;
    color: red;
    background: none;
    margin-left: 2px;
  }

  >>> .el-button--danger {
    background-color: red;

  }

  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

</style>
