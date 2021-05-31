<template>
  <div style="width:100%;margin:0 auto;">
    <!--面包屑-->
    <!--    <div>-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/managementContent' }">基础管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>职务管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>职务名称：</span>
        <el-input placeholder="请输入" class="input_box" size="medium" v-model="searchPostName" clearable @change="getAllPostInfor"></el-input>
      </div>
      <div class="button-flex">
        <el-button type="danger" style="margin-left: 2%" @click="getAllPostInfor">查询</el-button>
        <el-button type="danger" @click="officeEstablish">创建</el-button>
      </div>

    </div>
    <el-table :data="information" :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="职务名称" prop="name" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column label="相关联人数" prop="associatedNumber" align="center"></el-table-column>
      <el-table-column label="职务等级" prop="postRank" align="center"></el-table-column>
      <el-table-column label="创建人员" prop="createPartyName" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" class="text_button" @click="officeUpdate(scope.row)">编辑</el-button>
          <el-button type="text" class="text_button" @click="deletePost(scope.row)">删除</el-button>

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

    <!--添加职务弹窗-->
    <div style="text-align: left;">
      <el-dialog title="添加职务" :visible.sync="addVisible">
        <el-form :model="addForm" ref="ruleForm" :rules="rules" :inline="true" label-width="100px">
          <div style="display: flex">
            <el-form-item label="职务名称：" style="margin-right: 2%" class="read" prop="name">
              <el-input placeholder="请输入" v-model="addForm.name" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="职务等级：" class="read" prop="rank">
              <el-select v-model="addForm.rank" placeholder="请选择" size="medium" style="width: 180px">
                <el-option v-for="item in rankLevel"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style="margin-right: 8%">
          <el-button @click="cleanAddForm">取消</el-button>
          <el-button type="danger" @click="addOffice">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--修改职务弹窗-->
    <div style="text-align: left;">
      <el-dialog title="修改职务" :visible.sync="updateVisible">
        <el-form :model="updateForm" ref="ruleForm2" :rules="rules2" label-width="100px" :inline="true">
          <div style="display: flex">
            <el-form-item label="职务名称：" class="read" prop="name" style="margin-right: 2%;">
              <el-input placeholder="请输入" v-model="updateForm.name" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="职务等级：" class="read" prop="postRank">
              <el-select v-model="updateForm.postRank" placeholder="请选择" size="medium" style="width: 180px">
                <el-option v-for="item in rankLevel"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style="margin-right: 8%">
          <el-button @click="cleanUpdateForm">取消</el-button>
          <el-button type="danger" @click="updatePost">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import {Auth} from '../../../store/modules/auth'
    import {officeManage} from './officeManageJS'
    import {Msg} from "../../../tools/message";

    export default {
        name: "officeManage",

        data() {
            return {
                userInfo: Auth.getUser(),

                currentUserInfor: {},

                information: [],

                addVisible: false,
                updateVisible: false,

                addForm: {partyId: ''},  //添加表单
                updateForm: {partyId: '', name: '', postRank: 0},   //修改表单
                searchPostName: '',

                rankLevel: [   //等级选项
                    {value: 1, label: '一级'}, {value: 2, label: '二级'}, {value: 3, label: '三级'}
                ],

                ruleForm: {
                    name: "",
                    rank: "",
                },
                ruleForm2: {
                    name: "", postRank: "",
                },

                rules: {       //验证
                    name: [
                        {required: true, message: "请输入职务名称", trigger: ['blur', 'change']},
                    ],
                    rank: [
                        {required: true, message: "请选择", trigger: ['change']},
                    ],
                    postRank: [
                        {required: true, message: "请选择", trigger: ['change']},
                    ],
                },
                rules2: {       //验证
                    name: [
                        {required: true, message: "请输入职务名称", trigger: ['blur', 'change']},
                    ],
                    postRank: [
                        {required: true, message: "请选择", trigger: ['change']},
                    ],
                },

                // 页码
                currentPage: 1,//当前页
                totalEssay: 0,//总共的文章数量
                pageSize: 5,
            }
        },
        watch: {
            searchPostName: function () {
                if (this.addForm.name != undefined) {
                    var startlen = this.searchPostName.length;
                    this.searchPostName = this.searchPostName.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                    var endlen = this.searchPostName.length;
                    if (startlen != endlen) {
                        Msg.warn("职务名称只能输入中文!");
                    }
                }
            },
            'addForm.name': function () {
                if (this.addForm.name != undefined) {
                    var startlen = this.addForm.name.length;
                    this.addForm.name = this.addForm.name.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                    var endlen = this.addForm.name.length;
                    if (startlen != endlen) {
                        Msg.warn("职务名称只能输入中文!");
                    }
                }
            },
            'updateForm.name': function () {
                if (this.addForm.name != undefined) {
                    var startlen = this.updateForm.name.length;
                    this.updateForm.name = this.updateForm.name.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                    var endlen = this.updateForm.name.length;
                    if (startlen != endlen) {
                        Msg.warn("职务名称只能输入中文!");
                    }
                }
            },
        },
        methods: {
            //获取表格中的职务信息
            getAllPostInfor() {
                officeManage.findPostInfoByName({
                    postName: this.searchPostName,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                })
                    .then(
                        res => {
                            if (res.data.code === 442) {
                                this.information = [];
                                this.totalEssay = 0;
                            } else {
                                this.information = res.data.data.list;
                                this.totalEssay = res.data.data.total;
                            }
                            if (res.data.code === 403) {
                                Msg.error('权限不足');
                            }
                        }
                    )
                    .catch(err => {
                        Msg.error("网络繁忙");
                    });
            },

            /*清空弹窗*/
            cleanAddForm() {
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                this.addForm = {
                    partyId: '', name: ''
                };
                this.addVisible = false;

            },
            cleanUpdateForm() {
                this.$refs.ruleForm2.clearValidate();
                this.$refs.ruleForm2.resetFields();

                this.updateForm = {
                    id: '', name: '', postRank: 0
                };
                this.updateVisible = false;

                // this.rankLevel.value='';
            },

            officeEstablish() {
                this.addVisible = true;
            },
            officeUpdate(row) {
                this.updateVisible = true;
                this.updateForm.name = row.name;
                this.updateForm.postRank = row.postRank;
                this.updateForm.id = row.id;
                // this.rankLevel.value = row.postRank;
            },

            addOffice() {     //添加职务
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        console.log("验证通过");
                        this.addForm.partyId = this.userInfo.partyId;
                        officeManage.addPostInfo(this.addForm)
                            .then(
                                res => {
                                    if (res.data.code === 442)
                                        Msg.success(res.data.message);
                                    else if (res.data.code === 441)
                                        Msg.error(res.data.message);
                                    this.addVisible = false;
                                    this.getAllPostInfor();
                                    this.cleanAddForm();
                                }
                            )
                            .catch(err => {
                                Msg.error("创建失败");
                                console.log(err);
                            });
                    } else {
                        Msg.error('请填写正确的资料信息后再提交！');
                    }
                });
            },

            /*修改职务*/
            updatePost() {
                this.$refs.ruleForm2.validate(valid => {
                    if (valid) {
                        console.log("验证通过");
                        // alert(this.updateForm.postRank+"   "+this.updateForm.id+"   "+this.updateForm.name+"   "+this.userInfo.partyId);
                        officeManage.modifyPostInfo({
                            id: this.updateForm.id,
                            name: this.updateForm.name,
                            partyId: this.userInfo.partyId,
                            rank: this.updateForm.postRank
                        })
                            .then(
                                res => {
                                    this.updateVisible = false;
                                    this.getAllPostInfor();
                                    this.cleanUpdateForm();
                                    if (res.data.code == 440)
                                        Msg.error(res.data.message);
                                    else
                                        Msg.success(res.data.message);
                                }
                            )
                            .catch(err => {
                                Msg.error("创建失败");
                                console.log(err);
                            });
                    } else {
                        Msg.error('请填写正确的资料信息后再提交！');

                    }
                });
            },
            /*删除职务*/
            deletePost(row) {
                this.$confirm('是否确认删除该职务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    officeManage.deletePostInfoById({postId: row.id})
                        .then(
                            res => {
                                Msg.success(res.data.message);
                                this.getAllPostInfor();
                            }
                        )
                        .catch(err => {
                            Msg.error("删除失败");
                            console.log(err);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            //条数处理
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAllPostInfor();
            },
            // 页码处理
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllPostInfor();
            },

        },
        created() {
            this.getAllPostInfor();
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
    margin-left: 5px;
  }

  >>> .el-button--danger {
    background-color: red;

  }

  /*.popBox{*/
  /*display: flex;*/
  /*justify-content:center;*/
  /*}*/
  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }
</style>
