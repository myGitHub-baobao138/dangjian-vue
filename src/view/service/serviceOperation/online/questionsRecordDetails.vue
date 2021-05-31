<template>
  <div>
    <!--面包屑-->
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item :to="{ path: '/questions' }">在线答题</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item :to="{ path: '/questionsRecord' }">答题记录管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>答题记录详情</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->

    <div class="nav-form-top function-part">
      <p><span class="return-record-list" @click="goRecordList">返回列表页面</span></p>
      <p class="small-title">基本信息</p>
      <el-row>
        <el-col :span="6">
          <div>标题: {{recordDetail.title}}</div>
        </el-col>
        <el-col :span="6">
          <div>分类: {{recordDetail.questionCategoryName}}</div>
        </el-col>
        <el-col :span="12">
          <div>答题时间: {{recordDetail.answerTime}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div>答题者: {{recordDetail.answerer}}</div>
        </el-col>
        <el-col :span="6">
          <div>正确率: {{recordDetail.correctRate}}%</div>
        </el-col>
        <el-col :span="12">
          <div></div>
        </el-col>
      </el-row>
    </div>

    <p class="small-title">答题详情</p>
    <el-table :data="recordDetail.questions"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top"
              :row-class-name="tableRowClassName">
      <el-table-column label="题目内容" prop="title" :show-overflow-tooltip="true" align="left">
        <template slot-scope="scope">
          {{scope.row.title}} , {{scope.row.question}}
        </template>
      </el-table-column>
      <el-table-column label="选项描述" prop="answerDescription" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.questionType === '2' ">无</span>
          <span v-else
                v-for="(data,index) in scope.row.answerDescription.split(';')">{{options[index]}}.{{data}} </span>

        </template>
      </el-table-column>
      <el-table-column label="正确答案" prop="correctAnswer" align="center"
                       :formatter="formatterCorrectAnswer"></el-table-column>
      <el-table-column label="答题者输入" prop="answerContent" align="center" :formatter="formatterAnswerContent">
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
  </div>
</template>

<script>
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    import {QuestionsRecordDetailsApi} from "./questionsRecordDetailsApi";

    export default {
        name: "questionRecordDetails",
        data() {
            return {
                totalList: 0,
                currentPage: 1,
                totalPage: 0, // 总页数
                pageSize: 5, // 每页条数
                options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                recordDetail: {
                    answerRecordId: '',
                    title: '',
                    questionCategoryName: '',
                    answerer: '',
                    partyId: '',
                    examineId: '',
                    correctQuestionNumber: 0,
                    answerTime: '',
                    correctRate: 0,
                    questions: [],
                    questionTotal: 0
                },
                id: ''
            }
        },
        created() {

            var params = this.$route.query;

            if (params.id === undefined) {

            } else { // 有值
                this.id = params.id;
                var data = {
                    answerRecordId: params.id,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                QuestionsRecordDetailsApi.getQuestionRecord(data).then(res => {
                    if (res.data.code === 200) {
                        this.recordDetail = res.data.data;
                        this.totalList = res.data.data.questionTotal;
                        this.getTotalPage();
                    } else if (res.data.code === 403) {
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙')
                    }

                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            }
        }
        ,
        mounted() {

        }
        ,
        methods: {
            handleSizeChange(val) { // 改变每页数量
                this.pageSize = val;
                this.getRecordList();
            },
            handleCurrentChange(val) { // 改变当前页数
                this.currentPage = val;
                this.getRecordList();
            },
            getRecordList() {
                var data = {
                    answerRecordId: this.id,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                QuestionsRecordDetailsApi.getQuestionRecord(data).then(res => {
                    if (res.data.code === 200) {
                        this.recordDetail = res.data.data;
                        this.totalList = res.data.data.questionTotal;
                        this.getTotalPage();
                    } else {
                        Msg.error('网络繁忙')
                    }

                }).catch(err => {
                    Msg.error('网络繁忙');
                })
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
            }
            ,
            tableRowClassName({row, rowIndex}) { // 改变表格某行的样式
                if (row.correctAnswer === row.answerContent) {
                    return 'correct-row';
                } else {
                    return 'error-row';
                }
            }
            ,
            goRecordList() { // 回到记录列表
                this.$router.push({path: 'questionsRecord'});
            }
            ,
            formatterCorrectAnswer(row, column) {
                if (row.questionType === '1') {
                    let answers = row.answerDescription.split(';');
                    for (var i = 0; i < answers.length; i++) {
                        if (row.correctAnswer === answers[i]) {
                            return this.options[i] + '. ' + row.correctAnswer;
                        }
                    }
                    return row.correctAnswer;
                } else {
                    return row.correctAnswer;
                }
            }
            ,
            formatterAnswerContent(row, column) {
                if (row.questionType === '1') {
                    let answers = row.answerDescription.split(';');
                    for (var i = 0; i < answers.length; i++) {
                        if (row.answerContent === answers[i]) {
                            return this.options[i] + '. ' + row.answerContent;
                        }
                    }
                    return row.answerContent;
                } else {
                    return row.answerContent;
                }
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


  .function-part {
    font-size: 16px;
    text-align: left;
    padding-left: 4px;
  }

  .small-title {
    font-weight: bold;
    font-size: 14px;
    text-align: left;
    margin: 25px 0;
    padding-left: 10px;
  }

  .el-row {
    margin-bottom: 15px;
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

  .return-record-list {
    color: #FF0000;
    cursor: pointer;
  }

  .return-record-list:hover {
    color: #f75d5d;
  }

  .return-record-list:active {
    color: #F00;
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

  >>> .el-button--default:hover {
    color: #ff0000;
    background-color: #fff4f4;
    border-color: #fff4f4;
  }

  >>> .el-button--primary:active {
    color: #FFF;
    background-color: #ff0000;
    border-color: #ff0000;
  }


  >>> .el-table .error-row {
    color: #ff0000;
  }

  >>> .el-table .correct-row {
    color: #5A5A5A;
  }
</style>
