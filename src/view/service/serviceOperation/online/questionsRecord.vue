<template>
  <div>

    <!--    &lt;!&ndash;面包屑&ndash;&gt;-->
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item :to="{ path: '/questions' }">在线答题</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>答题记录管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->

    <div class="nav-form-top function-part">

      <div class="input-content">
        <span>分类：</span>
        <el-select v-model="questionCategory" class="input_box" placeholder="请选择" clearable
                   @change="clearQuestionCategory">
          <el-option
            v-for="(item,index) in typeOptions"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>

      </div>
      <div class="input-content">
        <span>内容：</span>
        <el-input placeholder="请输入标题或者答题者" v-model="content" clearable class="input_box" size="medium"
                  @change="clearContent"></el-input>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="getRecordList">查询</el-button>
      </div>

    </div>
    <el-table :data="records"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="标题" prop="title" align="center"></el-table-column>
      <el-table-column label="分类名称" prop="questionCategoryName" align="center"></el-table-column>
      <el-table-column label="答题者" prop="answerer" align="center"></el-table-column>
      <el-table-column label="身份" prop="position" align="center"></el-table-column>
      <el-table-column label="答对题目" prop="correctQuestionNumber" align="center">
        <template slot-scope="scope">
          <span style="color: #4FACF1">{{scope.row.correctQuestionNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="答题时间" prop="answerTime" align="center"></el-table-column>
      <el-table-column label="百分比" prop="correctRate" align="center">
        <template slot-scope="scope">
          {{scope.row.correctRate}}%
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="text_button" @click="view(scope.row.answerRecordId)">查看</span>
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
    import {QuestionsRecordApi} from './questionsRecordApi'

    export default {
        name: "questionsRecord",
        data() {
            return {
                questionCategory: '', // 问题分类
                typeOptions: [], // 类型选择
                content: '', // 内容标题或者答题者
                totalList: 0,
                currentPage: 1,
                totalPage: 1, // 总页数
                pageSize: 5, // 每页条数
                records: [],


            }
        },
        mounted() {
            this.getQuestionCategoryNameIdList();
            this.getRecordList();
        },
        methods: {
            getQuestionCategoryNameIdList() { // 获取分类id和name对象数组
                QuestionsRecordApi.getQuestionCategoryNameIdList().then(res => {
                    if (res.data.code === 200) {
                        this.typeOptions = res.data.data;
                    } else if (res.data.code === 403) {
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙');
                    }
                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            },
            clearQuestionCategory() { // 清空选择的问题分类后，调用接口
                if (this.questionCategory === '') {
                    this.getRecordList();
                }
            },
            clearContent() { // 清空内容后，调用接口
                if (this.content === '') {
                    this.getRecordList();
                }
            },
            getRecordList() { // 获取列表数据
                var data = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    content: this.content,
                    questionCategoryId: this.questionCategory
                }
                QuestionsRecordApi.getQuestionRecordList(data).then(res => {
                    if (res.data.code === 200) {
                        this.records = res.data.data.list;
                        this.totalList = res.data.data.total;
                        this.getTotalPage();
                    } else if (res.data.code === 403) {
                        Msg.error('权限不足');
                    } else {
                        Msg.error('获取失败,请稍后再试');
                    }


                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            },
            handleSizeChange(val) { // 改变每页数量
                this.pageSize = val;
                this.getRecordList();
            },
            handleCurrentChange(val) { // 改变当前页数
                this.currentPage = val;
                this.getRecordList();
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
            view(id) { // 查看
                this.$router.push({
                    path: '/recordDetails',
                    query: {
                        id: id
                    }
                });
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
