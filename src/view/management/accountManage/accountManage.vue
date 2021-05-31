<template>
  <div style="width: 100%;margin:0 auto;">

    <div style="width: 100%" class="nav-form-top function-part">
      <div class="input-content">
        <span>党员名称：</span>
        <el-input placeholder="请输入" v-model="searchContent" class="input-box" clearable
                  @change="searchInformation"></el-input>
      </div>
      <div class="button-flex">
        <el-button type="danger" @click="searchInformation">查询</el-button>
        <el-button type="danger" @click="establishAccount" style="margin-left: 20%">创建</el-button>
      </div>

    </div>

    <!--表格-->
    <el-table :data="information"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}" class="form-table-top">
      <el-table-column prop="account" label="账号名称" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="password" label="密码" :show-overflow-tooltip="true" align="center"/>
      <el-table-column prop="name" label="姓名" align="center"/>
      <el-table-column prop="organizationName" label="组织" align="center" :show-overflow-tooltip="true"  :formatter="formateAccount"/>
      <el-table-column prop="postName" label="职务" align="center" :show-overflow-tooltip="true"
                       :formatter="formateAccount"/>
      <el-table-column prop="classification" label="类别" width="140" align="center" :formatter="formateClassification"/>
      <el-table-column prop="enable" label="是否启用" align="center" width="110" :formatter="formatIsEnable"/>

      <el-table-column label="操作" align="center" width="150">
        <!--操作行-->
        <template slot-scope="scope">
          <el-button type="text" class="text_button" @click="updateAccount(scope.row)">编辑</el-button>
          <el-button type="text" class="text_button" v-show="scope.row.enable"
                     @click="modifyState(scope.row.userId,scope.row.enable)">禁用
          </el-button>
          <el-button type="text" class="text_button" v-show="!scope.row.enable"
                     @click="modifyState(scope.row.userId,scope.row.enable)">启用
          </el-button>
          <el-button type="text" class="text_button" @click="deleteUserById(scope.row.userId)">删除</el-button>
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


    <!--创建弹出框-->
    <div style="text-align: left">
      <el-dialog title="添加账号信息" :visible.sync="foundVisible" :before-close="clearAddForm">
        <el-form ref="ruleForm" :rules="rules" :model="addForm">
          <div class="popBox">
            <el-form-item label="账号:" class="read" prop="account">
              <el-input placeholder="请输入" size="medium" v-model="addForm.account"></el-input>
            </el-form-item>

            <el-form-item label="密码:" class="read" style="margin-left: 2%" prop="password">
              <el-input placeholder="请输入" size="medium" v-model="addForm.password" show-password></el-input>
            </el-form-item>
          </div>
          <div class="popBox">
            <el-form-item label="党员:" class="read" prop="name">
              <el-select v-model="partyMember.name" placeholder="请选择" size="medium" filterable style="width: 198px">
                <el-option
                  v-for="item in partyMember"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学号/工号:" class="read" style="margin-left: 1%" prop="sysPartyMemberInformationId">
              <el-select v-model="addForm.sysPartyMemberInformationId" placeholder="请选择" size="medium"
                         style="width: 200px">
                <el-option
                  v-for="item in snoList"
                  :key="item.id"
                  :label="item.snoOrJobNumber"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <!--按钮部分-->
        <div slot="footer" style="margin-right: 8%">
          <el-button @click="clearAddForm">取消</el-button>
          <el-button type="danger" @click="createUserAccount">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑弹出框-->
    <div style="text-align: left">
      <el-dialog title="修改" :visible.sync="updateVisible" :before-close="clearUpdateForm">
        <el-form ref="ruleForm2" :rules="rules2" :model="updateForm">
          <div class="popBox">
            <el-form-item label="账号:" class="read" prop="account">
              <el-input placeholder="请输入" size="medium" v-model="updateForm.account"></el-input>
            </el-form-item>

            <el-form-item label="密码:" class="read" style="margin-left: 2%" prop="password">
              <el-input placeholder="请输入" size="medium" v-model="updateForm.password" show-password></el-input>
            </el-form-item>
          </div>

          <!--按钮部分-->
          <el-form-item style="margin-left: 65%;">
            <el-button @click="clearUpdateForm">取消</el-button>
            <el-button type="danger" @click="updateUserInfor">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>


<script>
    import {Msg} from "../../../tools/message";
    import {Auth} from '../../../store/modules/auth'
    import {accountManage} from './accountManageJS'

    export default {
        name: "accountManage",

        data() {
            return {

                userInfo: Auth.getUser(),

                stateInfor: {},


                foundVisible: false,//创建弹窗是否显示
                updateVisible: false,//修改弹窗是否显示


                updateForm: {
                    userId: '',
                    account: '',
                    password: ''
                },
                reAccount: '',
                rePassword: '',

                addForm: {
                    sysPartyMemberInformationId: ''
                },
                searchForm: {},
                checkObj: [],

                // 查询
                searchContent: "",

                // 页码
                currentPage: 1,//当前页
                totalEssay: 0,//总共的文章数量
                pageSize: 5,

                // 数据部分
                information: [],

                partyMember: [],  //党员
                snoList: [],   //党员学号数组
                rePartyMemberName: "",  //反显党员名字

                // 表单验证部分
                ruleForm: {
                    account: "",
                    password: "",
                    sysPartyMemberInformationId: "",
                },
                ruleForm2: {
                    account: "",
                    password: "",
                },
                rules: {
                    account: [
                        {required: true, message: "请输入账号", trigger: ['blur', 'change']},
                        {min: 6, max: 20, message: '长度在 6 -20个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: ['blur', 'change']},
                        {min: 6, max: 20, message: '长度在 6 -20个字符', trigger: 'blur'}
                    ],
                    sysPartyMemberInformationId: [
                        {required: true, message: "请选择", trigger: ['change']},
                    ],
                },
                rules2: {
                    account: [
                        {required: true, message: "请输入标题", trigger: ['blur', 'change']},
                        {min: 6, max: 20, message: '长度在 6 -20个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: ['blur', 'change']},
                        {min: 6, max: 20, message: '长度在 6 -20个字符', trigger: 'blur'}
                    ],
                },
            }
        },

        watch: {
            'addForm.account': function () {
                if (this.addForm.account != undefined) {
                    var startlen = this.addForm.account.length;
                    this.addForm.account = this.addForm.account.replace(/[^A-Za-z0-9]/g, '');
                    var endlen = this.addForm.account.length;
                    if (startlen != endlen) {
                        Msg.warn("账号只能输入字母和数字!");
                    }
                }
            },
            'updateForm.account': function () {
                if (this.addForm.account != undefined) {
                    var startlen = this.updateForm.account.length;
                    this.updateForm.account = this.updateForm.account.replace(/[^A-Za-z0-9]/g, '');
                    var endlen = this.updateForm.account.length;
                    if (startlen != endlen) {
                        Msg.warn("账号只能输入字母和数字!");
                    }
                }
            },
            'partyMember.name': function () {

                this.addForm.sysPartyMemberInformationId = ''; //清空表格党员信息
                this.ruleForm.sysPartyMemberInformationId = '';  //清空党员信息验证

                for (var i = 0; i < this.partyMember.length; i++) {
                    if (this.partyMember[i].name === this.partyMember.name) {
                        this.snoList = this.partyMember[i].list;
                        return;
                    }
                }
            },
        },

        methods: {
            establishAccount() {
                this.foundVisible = true;
                this.getPartyMemberInfor();
            },
            updateAccount(row) {
                this.updateVisible = true;
                this.updateForm.account = row.account;
                this.updateForm.password = row.password;
                this.updateForm.userId = row.userId;
            },
            clearAddForm() {
                this.foundVisible = false;
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                // this.$refs.ruleForm.clearValidate();
                this.partyMember = [];
                this.snoList = [];
                this.addForm = {
                    sysPartyMemberInformationId: ''
                };

            },
            clearUpdateForm() {
                this.updateVisible = false;
                this.updateForm = {
                    account: '', password: '', userId: ''
                };
                this.$refs.ruleForm2.clearValidate();
                this.$refs.ruleForm2.resetFields();
            },
            getPartyMemberInfor() {      //查找组织
                accountManage.selectPartyNameLike().then(
                    res => {
                        this.partyMember = res.data.data;
                    }
                )
                    .catch(err => {
                        Msg.error("查询失败");
                        console.log(err);
                    });
            },

            //是否启用
            formatIsEnable(row, column, cellvalue) {
                var isenable;
                if (cellvalue) {
                    isenable = "是";
                } else {
                    isenable = "否";
                }
                return isenable;
            },
            //类别
            formateClassification(row, column, cellvalue) {
                var classification;
                if (cellvalue) {
                    classification = "教师";
                } else {
                    classification = "学生";
                }
                return classification;
            },

            //条数处理
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAllInfor();
            },
            // 页码处理
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllInfor();
            },

            /*查询*/
            searchInformation() {
                this.getAllInfor();
            },
            //获取表格中的信息
            getAllInfor() {
                accountManage
                    .findPartyMemberInformation({
                        name: this.searchContent,
                        currentPage: this.currentPage,
                        organizationId: this.userInfo.organizationId,
                        organizationRank: this.userInfo.organizationRank,
                        pageSize: this.pageSize
                    })
                    .then(
                        res => {
                            if (res.data.code === 482) {
                                this.information = [];
                                this.totalEssay = 0;
                            } else {
                                this.information = res.data.data.list;
                                this.totalEssay = res.data.data.total;
                            }

                            if (res.data.code === 403) {
                                Msg.error('权限不足')
                            }
                        }
                    )
                    .catch(err => {
                        Msg.error("网络繁忙");
                        console.log(err);
                    });
            },

            //修改当前用户的状态
            modifyState(userId, isEnable) {
                this.stateInfor.userId = userId;

                this.stateInfor.state = !isEnable;
                accountManage.modifyUserAccountState(this.stateInfor)
                    .then(
                        res => {
                            Msg.success('更改成功');
                            this.getAllInfor();
                        })
                    .catch(err => {
                        Msg.error('修改状态失败');
                        console.log(err);
                    });
            },

            //创建用户信息
            createUserAccount() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        console.log("验证通过");
                        // alert(this.addForm.account+"   "+this.addForm.password+"   "+this.addForm.academyId+"   "+this.addForm.sysPartyMemberInformationId);
                        accountManage.createUserAccount(this.addForm).then(
                            res => {
                                this.foundVisible = false;
                                if (res.data.code === 481)
                                    Msg.success(res.data.message);
                                else if (res.data.code === 480)
                                    Msg.error(res.data.message);
                                this.clearAddForm();
                                this.getAllInfor();
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

            //删除用户
            deleteUserById(userId) {
                this.$confirm('是否确认删除该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    accountManage.deleteUserInfoByUserId({userId: userId}).then(
                        res => {
                            Msg.success(res.data.message);
                            this.getAllInfor();
                        }
                    )
                        .catch(err => {
                            Msg.error("删除失败");
                            console.log(err);
                        });
                })
            },

            updateUserInfor() {

                this.$refs.ruleForm2.validate(valid => {
                    if (valid) {
                        console.log("验证通过");
                        accountManage.modifyUserInformationByUserId(this.updateForm).then(
                            res => {
                                this.updateVisible = false;
                                if (res.data.code == 440)
                                    Msg.error(res.data.message);
                                else
                                    Msg.success(res.data.message);
                                this.clearUpdateForm();
                                this.getAllInfor();
                            }
                        )
                            .catch(err => {
                                Msg.error("修改失败");
                                this.updateVisible = false;
                                console.log(err);
                            });
                    } else {
                        Msg.error('请填写正确的资料信息后再提交！');
                    }
                });
            },
            /*处理账号显示*/
            formateAccount(row, column, cellvalue) {
                var accountColumns;
                if (!cellvalue) {
                    accountColumns = "————";
                } else {
                    accountColumns = cellvalue;
                }
                return accountColumns;
            }
        },
        created() {
            this.getAllInfor();
        }

    }
</script>

<style scoped>
  /*各种头部的距离*/
  .nav-form-top, .form-table-top {
    margin-top: 2%;
  }

  .input-content, .function-part, .button-flex {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 2%;
  }

  .input-box {
    width: 220px;
    height: 40px;
  }

  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  /*取消下划线*/
  a {
    text-decoration: none;
  }

  .text_button {
    font-size: 13px;
    color: red;
    background: none;
    margin-left: 2px;
  }

  >>> .el-button--danger {
    background-color: red;

  }

  /*表单格式*/
  .read {
    display: flex;
  }

  /*弹出框格式*/
  .popBox {
    display: flex;
    justify-content: center;
  }
</style>
