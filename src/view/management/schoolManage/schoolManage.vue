<template>
  <div>
    <!--顶部导航栏-->
    <!--    <div>-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item >基础管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item >学院管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->

    <!--查询框-->
    <div class="border">
      <div class="input-box">
        <div class="border-words">学院名称:</div>
        <div class="input">
          <el-input v-model="academyName" placeholder="请输入:"></el-input>
        </div>
      </div>

      <div class="school">
        <div class="border-words">校区:</div>
        <el-select v-model="campus" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.campus"
            :label="item.label"
            :value="item.campus">
          </el-option>
        </el-select>
      </div>
      <div class="buttons-box">
        <div class="button">
          <el-button type="danger" @click="searchInfo">查询</el-button>
        </div>
        <div class="button">
          <el-button type="danger">导入</el-button>
        </div>
        <div class="button">
          <el-button type="danger">创建</el-button>
        </div>
      </div>
    </div>

    <!--表格数据-->
    <div class="table">
      <el-table
        :data="academyTableData"
        style="width: 100%"
        :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
      >
        <el-table-column
          prop="schoolName"
          label="学校"
          align="center"
          width="220">
        </el-table-column>
        <el-table-column
          prop="academyName"
          label="学院名称"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="campus"
          align="center"
          label="校区">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!--操作行-->
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color: red">编辑</el-button>
            &nbsp;<span style="color: red">|</span>&nbsp
            <el-button type="text" @click="handleDeleteAcademyInfo(scope.row)" size="small" style="color: red;">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        :total="total">
      </el-pagination>
    </div>
    <!--编辑弹窗-->
    <el-dialog title="修改学院信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editAcademyForm">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="editAcademyForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
    import {getAcademy} from "./AcademyManagement";
    import {Msg} from "../../../tools/message";

    export default {
        name: "schoolManage",
        data() {
            return {
                academyTableData: [
                    {
                        school: '理工大学', academy: '计算机学院', schoolAddress: '花溪'
                    }
                ],
                options: [{
                    campus: '花溪',
                    label: '花溪'
                }, {
                    campus: '两江',
                    label: '两江校区'

                }],
                academyName: '',
                schoolName: '',
                campus: '',
                currentPage: 1,
                pageSize: 5,
                total: 0,
                isQuery: '',
                editDialogFormVisible: false,//修改学院信息弹窗
                editAcademyForm: []
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                if (this.isQuery) {
                    this.searchInfo();
                } else {
                    this.getAcademyTableData();
                }
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                if (this.isQuery) {
                    this.searchInfo();
                } else {
                    this.getAcademyTableData();
                }
            },
            //得到学院列表数据
            getAcademyTableData() {
                getAcademy.getAcademyList({currentPage: this.currentPage, pageSize: this.pageSize}).then(res => {

                    if (res.data.code === 200) {
                        this.academyTableData = res.data.data.list;
                        this.total = res.data.data.total;
                        this.isQuery = false;
                    } else if (res.data.code === 403) {
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙');
                    }

                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            },
            searchInfo() {
                getAcademy.getAcademyQueryList({
                    academyName: this.academyName, campus: this.campus,
                    currentPage: this.currentPage, pageSize: this.pageSize
                }).then(res => {
                    this.academyTableData = res.data.data.list;
                    this.total = res.data.data.total;
                    this.isQuery = true;
                })
            },
            handleDeleteAcademyInfo(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getAcademy.deleteAcademyInfo()({id: row.id}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.data.message
                        })
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        created() {
            this.getAcademyTableData();
        }
    }
</script>

<style scoped>
  .border, .buttons-box, .input-box, .school {
    display: flex;
    align-items: center;
  }

  .border {
    margin: 2% 0 2% 0;
  }

  .border-words {
    font-size: 14px;
    width: 80px;
  }

  .school, .buttons-box, .button {
    margin-left: 2%;
  }

  .pages {
    margin-top: 3%;
  }
</style>
