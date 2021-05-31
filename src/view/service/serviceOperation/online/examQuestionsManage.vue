<template>
  <div>

<!--    &lt;!&ndash;面包屑&ndash;&gt;-->
<!--    <div class="nav-top">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/questions' }">在线答题</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>问题管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>分类：</span>
        <el-select v-model="questionCategory" class="input_box"  placeholder="请选择" clearable @change="clearQuestionCategory">
          <el-option
            v-for="(item,index) in typeOptions"
            :key="index"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="input-content">
        <span>标题：</span>
        <el-input placeholder="请输入" v-model="title" clearable class="input_box" size="medium"
                  @change="clearTitle"></el-input>
      </div>
      <div class="input-content">
        <span>状态：</span>
        <el-select v-model="state" class="input_box"  placeholder="请选择" clearable @change="clearQuestionStatus">
          <el-option
            v-for="(item,index) in stateOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="getExamineList">查询</el-button>
        <el-button type="primary" style="margin-left: 2%" @click="postExamQuestion">发布</el-button>
        <el-button type="primary" style="margin-left: 2%" @click="createExamQuestion">创建</el-button>
      </div>

    </div>
    <el-table :data="examQuestionsList"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName" align="center"></el-table-column>
      <el-table-column label="题目数" prop="questionsNumber" align="center"></el-table-column>
      <el-table-column label="答题人数" prop="respondentNumber" align="center">
        <template slot-scope="scope">
          <span class="numbers" v-if="scope.row.respondentNumber === 0">___</span>
          <span v-else class="numbers">{{scope.row.respondentNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始-结束时间" prop="beginTime" align="center" min-width="140">
        <template slot-scope="scope">
          {{scope.row.beginTime}} - {{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="founder" align="center"></el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1" class="state-unpublished">未发布</span>
          <span v-if="scope.row.state === 2" class="state-not-started">未开始</span>
          <span v-if="scope.row.state === 3" class="state-in-progress">进行中</span>
          <span v-if="scope.row.state === 4" class="state-end">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">

          <span class="text_button" @click="view(scope.row.id)">查看</span>
          <span class="text_button" v-if="scope.row.state === 3" @click="end(scope.row.id)"> &nbsp; 提前结束 </span>
          <span class="text_button" v-if="scope.row.state === 1 || scope.row.state === 2" @click="edit(scope.row)"> &nbsp; 编辑 &nbsp; </span>
          <span class="text_button" v-if="scope.row.state === 1 || scope.row.state === 2" @click="remove(scope.row.id)">删除</span>
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

  </div>
</template>

<script>
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    import {ExamQuestionsManageApi} from "./examQuestionsManageApi";

    export default {
        name: "questionsManage",
        data() {
            return {
                questionCategory: '', // 问题分类
                title: '', // 标题
                typeOptions: [], // 分类数组
                state: '', // 状态
                stateOptions: [
                    {value: 1, label: '未发布'},
                    {value: 2, label: '未开始'},
                    {value: 3, label: '进行中'},
                    {value: 4, label: '已结束'}
                ], // 状态数组
                examQuestionsList: [],
                totalList: 0,
                currentPage: 1,
                totalPage: 1, // 总页数
                pageSize: 5, // 每页条数
                formLabelWidth: '120px',
                selections: [],


            }
        },
        mounted() {
            this.getQuestionCategoryNameIdList();
            this.getExamineList();
        },
        methods: {
            getQuestionCategoryNameIdList() { // 获取分类id和name对象数组
                ExamQuestionsManageApi.getQuestionCategoryNameIdList().then(res => {
                    if (res.data.code === 200) {
                        this.typeOptions = res.data.data;
                    }
                })
            },
            getExamineList() { // 获取数据

                var params = {
                    title: this.title,
                    questionCategory: this.questionCategory,
                    state: this.state,
                    pageSize: this.pageSize,
                    currentPage: this.currentPage
                }
                ExamQuestionsManageApi.getExamineQuestionQueryList(params).then(res => {
                    if(res.data.code === 200){
                        this.examQuestionsList = res.data.data.list;
                        this.totalList = res.data.data.total;
                        this.getTotalPage();
                    } else if(res.data.code === 403){
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙');
                    }


                }).catch(err =>{
                    Msg.error('网络繁忙');
                })
            },
            clearQuestionCategory() { // 清除分类查询条件
                if (this.questionCategory === '') {
                    this.getExamineList();
                }

            },
            clearTitle() { // 清除标题
                if (this.title === '') {
                    this.getExamineList();
                }
            },
            clearQuestionStatus() { // 清除状态
                if (this.state === '') {
                    this.getExamineList();
                }
            },
            postExamQuestion() { // 发布考题
                var selects = this.selections;
                var id = [];
                var isTrue = false;
                var str = '';
                for (var i = 0; i < selects.length; i++) {
                    if (selects[i].state === 1) { // 未发布的考题
                        id.push(selects[i].id);
                    }
                    var date1 = new Date(selects[i].endTime);
                    var date2 = new Date(this.getYearMonthDay());
                    console.log(selects[i].endTime)
                    console.log(this.getYearMonthDay())
                    console.log(date1);
                    console.log(date2)
                    if(date2 > date1 ){
                        isTrue = true;
                        str += selects[i].title + ','
                    }
                }
                if (id.length === 0) {
                    Msg.warn('请选择未发布的考题');
                } else if(isTrue){ // 判断时间
                    Msg.warn(str+'考题时间已过期，需要重新修改')
                }
                else {
                    var params = {id: id, releaseTime: this.time()};
                    ExamQuestionsManageApi.releaseExamineQuestion(params).then(res => {
                        if (res.data.code === 200) {
                            Msg.success(res.data.message);
                            this.getExamineList();
                        } else {
                            Msg.error(res.data.message);
                        }
                    }).catch(err =>{
                        Msg.error('网络繁忙');
                    })
                }

            },
            createExamQuestion() { // 创建考题
                this.$router.push({
                    path: '/createExamQuestion',
                    query: {
                        method: 'insert'
                    }
                });
            },
            handleSizeChange(val) { // 改变每页数量
                this.pageSize = val;
                this.getExamineList();
            },
            handleCurrentChange(val) { // 改变当前页数
                this.currentPage = val;
                this.getExamineList();
            },
            getTotalPage() { // 获取总页数
                this.totalPage = Math.ceil(this.totalList / this.pageSize);

                if (this.currentPage > this.totalList) {
                    this.currentPage = this.totalList;
                }

                if (this.currentPage === 0 && this.totalPage === 0) {
                    this.currentPage = 1;
                    this.totalPage = 1;
                }
            },
            handleSelectionChange(val) { // 改变多选选项
                this.selections = val;
            },
            end(id) { // 结束
                ExamQuestionsManageApi.earlyTerminationExamine({id: id}).then(res => {
                    if (res.data.code === 200) {
                        Msg.success(res.data.message);
                        this.getExamineList();
                    } else {
                        Msg.error(res.data.message);
                    }


                }).catch(err =>{
                    Msg.error('网络繁忙');
                })


            },
            edit(data) { // 编辑
                this.$router.push({
                    path: '/createExamQuestion',
                    query: {
                        method: 'edit',
                        id: data.id,
                        index: data.state
                    }
                });
            },
            view(id) { // 查看
                this.$router.push({
                    path: '/createExamQuestion',
                    query: {
                        method: 'view',
                        id: id
                    }
                });
            },
            remove(id) { // 删除
                this.$confirm('删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ExamQuestionsManageApi.deleteExamineQuestion({id: id}).then(res => {
                        if (res.data.data) {
                            Msg.success(res.data.message);
                        } else {
                            Msg.error(res.data.message);
                        }
                        this.getExamineList();
                    }).catch(err =>{
                        Msg.error('网络繁忙');
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

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
            },
            getYearMonthDay(){
                var myDate = new Date(); //获取系统当前时间
                return this.dateFtt("yyyy/MM/dd", myDate);
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

  .numbers {
    color: #49A9F0;
  }

  .state-unpublished {
    color: #FFBD9C;
  }

  .state-not-started {
    color: #5A5A5A;
  }

  .state-in-progress {
    color: #5AAD5A;
  }

  .state-end {
    color: #FF5A5A;
  }


  /*//输入框*/
  .input_box {
    width: 180px;
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
