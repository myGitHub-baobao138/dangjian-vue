<template>
  <div>
    <!--    <div>-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/managementContent' }">基础管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>组织架构</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="input-box">
      <!--输入职务-->
      <div class="search-job">
        <div style="width:50px"><span style="font-size: 14px">组织:</span></div>
        <el-input v-model="organizationName" placeholder="请输入" clearable></el-input>
      </div>
      <!--选择级别-->
      <div class="search-level">
        <div style="width:50px"><span style="font-size: 14px">级别：</span></div>
        <el-select v-model="value" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button">
        <el-button type="danger" @click="getOrganizationStructureDataBySearch">查询</el-button>
        <el-button type="danger" style="margin-left:22%" @click="createDialog('createStructureForm')">创建</el-button>
      </div>
    </div>

    <!--表格数据渲染-->
    <div class="treeTable">
      <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource"></tree-grid>
    </div>

    <!--创建弹窗-->
    <el-dialog title="创建组织" :visible.sync="dialogFormVisible">
      <el-form :model="createStructureForm" :rules="createStructureRuleForm" ref="createStructureForm">
        <el-form-item label="组织名称" :label-width="formLabelWidth" prop="organizationName">
          <el-input v-model="createStructureForm.organizationName" placeholder="请输入组织名称"
                    style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="级别" :label-width="formLabelWidth" prop="rank">
          <el-select v-model="createStructureForm.rank" @change="getHigherOaganizationName(createStructureForm.rank)"
                     placeholder="请选择级别">
            <el-option label="一级" value=1></el-option>
            <el-option label="二级" value=2></el-option>
            <el-option label="三级" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织" :label-width="formLabelWidth" prop="organizationId"
                      v-if="createStructureForm.rank!=='1'">
          <el-select v-model="createStructureForm.organizationId" placeholder="请选择上级职务">
            <el-option
              v-for="item in createStructureForm.higherOptions"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth" prop="remark">
         <textarea v-model="createStructureForm.remark"
                   style="width:220px;height:50px; box-shadow: 0 3px 5px rgba(0,0,0,.2);">
         </textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitOrganizationInfo('createStructureForm')">确 定</el-button>
      </div>
    </el-dialog>

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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import {Auth} from "../../../store/modules/auth";
    import {organizationStructure} from "./organizationStructure";
    import TreeGrid from './TreeTable/TreeGrid'
    import {Msg} from "../../../tools/message";

    export default {
        name: "organizationFramework",
        components: {
            TreeGrid,
        },
        data() {
            return {
                organizationName: '',
                userInfo: Auth.getUserInfo(),
                currentPage: 1,
                pageSize: 5,
                total: 0,
                dialogFormVisible: false,
                columns: [
                    {
                        text: '组织名称',
                        dataIndex: 'organizationName'
                    },
                    {
                        text: '级别',
                        dataIndex: 'rank'
                    },
                    {
                        text: '人数',
                        dataIndex: 'amount'
                    },
                    {
                        text: '说明',
                        dataIndex: 'remark'
                    },
                ],
                dataSource: [],
                options: [{
                    value: 1,
                    label: '一级'
                }, {
                    value: 2,
                    label: '二级'
                }, {
                    value: 3,
                    label: '三级'
                }
                ],
                value: '',
                //创建组织架构的表单数据
                createStructureForm: {
                    higherOptions: [{
                        organizationName: '',
                        organizationId: ''
                    }]
                },
                formLabelWidth: '120px',
                //创建职务时的表单验证
                createStructureRuleForm: {
                    organizationName: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                    ],
                    rank: [{required: true, message: '请选择创建组织等级', trigger: 'change'}],
                    organizationId: [
                        {required: true, message: '请选择上级组织', trigger: 'change'}
                    ],
                    remark: [
                        {required: true, message: '请填写相关描述', trigger: 'blur'}
                    ]
                },
                index: true
            }
        },
        methods: {
            //得到组织架构列表的数据
            getOrganizationStructureList() {
                console.log(this.userInfo);
                this.index = true;
                var rank = this.userInfo.organizationMsgList[0].organizationRank;
                organizationStructure.getOrganizationFrameworkList({rank: parseInt(rank)}).then(res => {
                    this.dataSource = res.data.data;
                    if (res.data.code === 403) {
                        Msg.error('权限不足');
                    }

                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            },
            //根据组织名称/级别来查询组织架构
            getOrganizationStructureDataBySearch() {
                if (this.organizationName === '' && this.value === '') {
                    this.getOrganizationStructureList();
                    this.$message({
                        type: 'success',
                        message: '查询全部组织信息成功！'
                    });
                } else {
                    this.index = false;
                    let params = {
                        currentPage: this.currentPage, organizationName: this.organizationName,
                        rank: this.value, pageSize: this.pageSize
                    };
                    organizationStructure.getOrganizationDataBySearch(params).then(res => {
                        this.dataSource = res.data.data.list;
                        this.total = res.data.data.total;
                    })
                }
            },
            //创建组织架构弹窗
            createDialog(formName) {
                this.dialogFormVisible = true;
                if (this.$refs[formName] !== undefined)
                    this.$refs[formName].resetFields();
                this.createStructureForm = {
                    higherOptions: [{
                        organizationName: '',
                        organizationId: ''
                    }]
                };
            },
            submitOrganizationInfo(formName) {
                // console.log(this.createStructureForm.organizationId);
                var params = {
                    createMemberId: this.userInfo.partyId,
                    higherOrganizationId: this.createStructureForm.organizationId,
                    organizationName: this.createStructureForm.organizationName,
                    rank: this.createStructureForm.rank,
                    remark: this.createStructureForm.remark
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('此操作将创建一个新的组织, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            organizationStructure.createOrganizationStructure(params).then(res => {
                                let rank = this.userInfo.organizationMsgList[0].organizationRank;
                                console.log(params.rank);
                                if ((params.rank > rank) || (params.rank === rank)) {

                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '创建成功!'
                                        });
                                        return;
                                    } else if (res.data.code === 500) {
                                        this.$message.error('不能创建重复的组织名称');
                                    }
                                } else {
                                    this.$message.error("您只能创建" + rank + '级或者' + rank + '级以下的组织');
                                }

                                this.getOrganizationStructureList();
                            });

                            this.dialogFormVisible = false;
                            this.createStructureForm = {
                                higherOptions: [{
                                    organizationName: '',
                                    organizationId: ''
                                }]
                            };
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消创建'
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getHigherOaganizationName(rank) {
                console.log(rank);
                var params = {
                    organizationId: this.userInfo.organizationMsgList[0].organizationId,
                    partyOrganizationRank: this.userInfo.organizationMsgList[0].organizationRank,
                    rank: rank
                };
                organizationStructure.getHigherOrganizationName(params).then(res => {
                    this.createStructureForm.higherOptions = res.data.data;
                })
            },

            //改变页码
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getOrganizationStructureDataBySearch()
            },
            //改变当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getOrganizationStructureDataBySearch()
                console.log(`当前页: ${val}`);
            }
        },
        created() {
            this.getOrganizationStructureList();

        }
    }
</script>

<style scoped>
  .input-box {
    margin-top: 2%;
    margin-bottom: 2%;
  }

  .input-box, .search-job, .search-level, .button {
    display: flex;
    align-items: center;
  }

  .search-level {
    margin-left: 2%;
  }

  .button {
    margin-left: 15%;
    margin-top: 0.5%;
  }

  .treeTable {
    margin-top: 10px;
  }

  .block {
    margin-top: 4%;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: red;
    color: #FFF;
  }

  .el-table__footer-wrapper, .el-table__header-wrapper {
    overflow: hidden;
    background-color: darkgray;
  }

  .el-table th {
    background-color: darkgray;
  }

  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  /*改变按钮颜色样式设置*/
  >>> .el-button--danger {
    height: 32px;
    line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }
</style>
