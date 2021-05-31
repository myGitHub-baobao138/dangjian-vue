<template>
  <div>
<!--    &lt;!&ndash;面包屑&ndash;&gt;-->
<!--    <div class="nav-top">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/questions' }">在线答题</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>问题分类管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>分类名称：</span>
        <el-input placeholder="请输入"  clearable v-model="categoryName" class="input_box" size="medium"  @change="getList()"></el-input>
      </div>

      <div class="button-flex">
        <el-button type="primary" style="margin-left: 13px" @click="getQuestionsClassifyList">查询</el-button>
        <el-button type="primary" style="margin-left: 13px" @click="openCreateDialog">创建</el-button>
      </div>

    </div>
    <el-table :data="questionClassifies"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="分类名称" prop="categoryName"  align="center">
      </el-table-column>
      <el-table-column label="创建人" prop="founderName" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="creationTime" align="center"></el-table-column>
      <el-table-column label="相关考核题" prop="count" align="center" >
        <template slot-scope="scope">
          <span style="color: #49A9F0">{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span  class="text_button" @click="openEditDialog(scope.row)"> 编辑 &nbsp;</span>
          <span class="text_button" @click="deleteQuestionById(scope.row.id)"> 删除</span>
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
        layout="total, prev, pager, next, sizes,jumper"
        :total="totalList">
        <span>第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>

    <!-- 创建 -->
    <el-dialog title="创建分类名称" :visible.sync="addDialogFormVisible" @closed="closed('addForm')">
      <el-form :model="addForm" ref="addForm" :rules="addRules">
        <el-form-item label="分类名称:" :label-width="formLabelWidth" prop="categoryName">
          <el-input placeholder="请输入分类名称" v-model="addForm.categoryName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth" prop="remark">
          <el-input
            placeholder="请输入备注"
            v-model="addForm.remark" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑分类名称" :visible.sync="editDialogFormVisible" @closed="closed('editForm')">
      <el-form :model="editForm" ref="editForm" :rules="addRules">
        <el-form-item label="分类名称:" :label-width="formLabelWidth" prop="categoryName">
          <el-input placeholder="请输入分类名称" v-model="editForm.categoryName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth" prop="remark">
          <el-input
            placeholder="请输入备注"
            v-model="editForm.remark" clearable >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {QuestionsClassifyApi} from "./questionsClassifyApi";
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    export default {
        name: "questionsClassify",
        data() {
            return {
                totalList: 0,
                currentPage: 1,
                totalPage: 1, // 总页数
                pageSize: 5, // 每页条数
                questionClassifies: [], // 问题分类列表
                categoryName: '', // 分类名称
                formLabelWidth: '120px',
                addDialogFormVisible: false,
                editDialogFormVisible: false,
                addForm:{
                    categoryName: '',
                    remark: '',
                    founder: '',
                    creationTime: '',
                },
                addRules: {
                    categoryName:[{required: true, message: '请输入分类名称', trigger: 'blur'}],
                    remark: [{required: true, message: '请输入备注', trigger: 'blur'}]
                },
                editForm:{
                    id: '',
                    categoryName: '',
                    remark: '',
                },


            }
        },
        mounted() {
          this.getQuestionsClassifyList();
        },
        methods: {
            getList(){ // 清空条件后，查询所有数据
                if(this.categoryName === ''){
                    this.getQuestionsClassifyList();
                }
            },
            closed(formName){
                this.resetForm(formName);
            },
            getQuestionsClassifyList(){ // 获取分类数据
                if(this.categoryName === ''){ // 获取全部数据
                    let params = {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize
                    }
                    QuestionsClassifyApi.getQuestionClassifyList(params).then(res =>{
                        if(res.data.code === 200){
                            this.questionClassifies = res.data.data.list;
                            this.totalList = res.data.data.total;
                            this.getTotalPage();
                        } else if(res.data.code === 403){
                            Msg.error('权限不足');
                        } else {
                            Msg.error('获取题目失败,请稍后再试');
                        }

                    }).catch(err =>{
                        Msg.error('网络繁忙');
                    });
                } else {
                    let params = {
                        categoryName: this.categoryName,
                        currentPage: this.currentPage,
                        pageSize: this.pageSize
                    }
                    QuestionsClassifyApi.getQuestionClassifyListByQuery(params).then(res => {
                        if(res.data.code === 200){
                            this.questionClassifies = res.data.data.list;
                            this.totalList = res.data.data.total;
                            this.getTotalPage();
                        } else if(res.data.code === 403){
                            Msg.error('权限不足');
                        } else {
                            Msg.error('获取题目失败,请稍后再试');
                        }


                    }).catch(err =>{
                        Msg.error('网络繁忙');
                    })
                }

            },
            handleSizeChange(val) { // 改变每页数量
                this.pageSize = val;
                this.getQuestionsClassifyList();
            },
            handleCurrentChange(val) { // 改变当前页数
                this.currentPage = val;
                this.getQuestionsClassifyList();
            },
            getTotalPage(){ // 获取总页数
                this.totalPage = Math.ceil(this.totalList / this.pageSize);

                if (this.currentPage > this.totalList) {
                    this.currentPage = this.totalList;
                }

                if (this.currentPage === 0 && this.totalPage === 0) {
                    this.currentPage = 1;
                    this.totalPage = 1;
                }
            },
            openCreateDialog() { // 打开创建弹窗
                this.addDialogFormVisible = true;
            },
            resetForm(formName){ // 重置表单
                this.$refs[formName].resetFields();
            },
            add(formName){ // 新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addForm.creationTime = this.getCurrentTime();
                        this.addForm.founder = Auth.getUser().partyId;
                        QuestionsClassifyApi.addQuestionClassify(this.addForm).then(res =>{
                            if(res.data.code === 200) {
                                Msg.success(res.data.message);
                                this.getQuestionsClassifyList();
                                this.addDialogFormVisible = false;
                                this.resetForm('addForm');
                            } else {
                                Msg.error(res.data.message);
                            }

                        }).catch(res =>{
                            this.resetForm('addForm');
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }


                });
            },
            cancelAdd(){ // 取消新增
                this.addDialogFormVisible = false;
                this.resetForm('addForm');
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
            getCurrentTime() {
                var myDate = new Date(); //获取系统当前时间
                return this.dateFtt("yyyy-MM-dd hh:mm:ss", myDate);
            },
            openEditDialog(data){ // 打开编辑弹窗
                this.editForm.id = data.id;
                this.editForm.categoryName = data.categoryName;
                this.editForm.remark = data.remark;
                this.editDialogFormVisible = true;
            },
            cancelEdit(){ // 取消编辑
                this.editDialogFormVisible = false;
                this.resetForm('editForm');
            },
            deleteQuestionById(id){ // 删除分类
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    QuestionsClassifyApi.deleteQuestionCategory({id: id}).then(res =>{
                        if(res.data.data){
                            Msg.success('删除成功');
                        } else {
                            Msg.error('删除失败');
                        }
                        this.getQuestionsClassifyList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            edit(formName){ // 编辑
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            id: this.editForm.id,
                            categoryName: this.editForm.categoryName,
                            remark: this.editForm.remark
                        }
                        QuestionsClassifyApi.editQuestionCategory(params).then(res =>{
                            if(res.data.code === 200) {
                                Msg.success(res.data.message);
                                this.getQuestionsClassifyList();
                                this.editDialogFormVisible = false;
                                this.resetForm('editForm');
                            } else {
                                Msg.error(res.data.message);
                            }

                        }).catch(res =>{
                            this.resetForm('editForm');
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }


                });
            },


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
    width: 190px;
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

  >>> .el-button--primary:active {
    color: #FFF;
    background-color: #ff0000;
    border-color: #ff0000;
  }


  >>> .el-button--default:hover {
    color: #ff0000;
    background-color: #fff4f4;
    border-color: #fff4f4;
  }
</style>
