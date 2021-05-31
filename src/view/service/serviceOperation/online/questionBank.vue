<template>
  <div>
<!--    &lt;!&ndash;面包屑&ndash;&gt;-->
<!--    <div class="nav-top">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/questions' }">在线答题</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>题库管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>类型：</span>
        <el-select v-model="questionType" class="input_box" placeholder="请选择" clearable @change="getList()">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 13px" @click="getQuestionBankList">查询</el-button>
        <el-button type="primary" style="margin-left: 13px" @click="openCreateQuestionDialog">创建</el-button>
      </div>

    </div>
    <el-table :data="questions"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="题目内容" prop="title" :show-overflow-tooltip="true" align="center">
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
      <el-table-column label="类型" prop="questionType" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.questionType === '1'">单选</span>
          <span v-else>填空</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="text_button" @click="openViewDialog(scope.row)">查看 &nbsp;</span>
          <span class="text_button" @click="openEditDialog(scope.row)"> 编辑 &nbsp;</span>
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

    <!-- 添加题目 -->
    <el-dialog title="添加题目" :visible.sync="addDialogFormVisible" width="60%" @closed="closed('addQuestionForm')">
      <el-form :model="addQuestionForm" ref="addQuestionForm" :rules="addRules" :label-width="formLabelWidth">
        <el-form-item label="题目描述:" prop="title">
          <el-input type="textarea" v-model="addQuestionForm.title" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述:" prop="question">
          <el-input type="textarea" v-model="addQuestionForm.question" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题类型:" prop="questionType">
          <el-radio v-model="addQuestionForm.questionType" label="1">单选</el-radio>
          <el-radio v-model="addQuestionForm.questionType" label="2">填空</el-radio>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="答案描述" v-if="addQuestionForm.questionType === '1'" v-model="addQuestionForm.answerOptions"
                      prop="answerAddNum">
          <el-form-item style="margin-bottom: 25px"

                        v-for="(data, index) in addQuestionForm.answerOptions"
                        :key="data.key"
                        :prop="'answerOptions.' + index + '.value'"
                        :rules="rules"
          >
            <el-input v-model="data.value" style="width: 425px">
              <div slot="prepend" style="width: 10px;">{{options[index]}}</div>
            </el-input>
            <i class="el-icon-remove-outline option-remove" @click.prevent="removeOptions(data)"
               style="margin-left: 10px"></i>
          </el-form-item>
          <el-button class="button-add" @click="addOptions">+添加</el-button>
        </el-form-item>

        <!-- 单选答案 -->
        <el-form-item label="正确答案" v-if="addQuestionForm.questionType === '1' " prop="correctAnswer">
          <el-radio-group v-model="addQuestionForm.correctAnswer">
            <el-radio v-for="(data, index) in addQuestionForm.answerOptions"
                      :key="index"
                      :label="options[index]"
            ></el-radio>

          </el-radio-group>
        </el-form-item>

        <!--  填空 -->
        <el-form-item label="正确的答案" v-else prop="correctAnswer2">
          <el-input v-model="addQuestionForm.correctAnswer2"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="addQuestionBank('addQuestionForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑题目 -->
    <el-dialog title="编辑题目" :visible.sync="editDialogFormVisible" width="60%" @closed="closed('editQuestionForm')">
      <el-form :model="editQuestionForm" ref="editQuestionForm" :rules="addRules" :label-width="formLabelWidth">
        <el-form-item label="题目描述:" prop="title">
          <el-input type="textarea" v-model="editQuestionForm.title" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述:" prop="question">
          <el-input type="textarea" v-model="editQuestionForm.question" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题类型:" prop="questionType">
          <el-radio v-model="editQuestionForm.questionType" label="1">单选</el-radio>
          <el-radio v-model="editQuestionForm.questionType" label="2">填空</el-radio>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="答案描述" v-if="editQuestionForm.questionType === '1'" v-model="editQuestionForm.answerOptions"
                      prop="answerEditNum">
          <el-form-item style="margin-bottom: 25px"

                        v-for="(data, index) in editQuestionForm.answerOptions"
                        :key="data.key"
                        :prop="'answerOptions.' + index + '.value'"
                        :rules="editRules"
          >
            <el-input v-model="data.value" style="width: 425px">
              <div slot="prepend" style="width: 10px;">{{options[index]}}</div>
            </el-input>
            <i class="el-icon-remove-outline option-remove" @click.prevent="removeEditOptions(data)"
               style="margin-left: 10px"></i>
          </el-form-item>
          <el-button class="button-add" @click="addEditOptions">+添加</el-button>
        </el-form-item>

        <!-- 单选答案 -->
        <el-form-item label="正确答案" v-if="editQuestionForm.questionType === '1' " prop="correctAnswer">
          <el-radio-group v-model="editQuestionForm.correctAnswer">
            <el-radio v-for="(data, index) in editQuestionForm.answerOptions"
                      :key="index"
                      :label="options[index]"
            ></el-radio>

          </el-radio-group>
        </el-form-item>

        <!--  填空 -->
        <el-form-item label="正确的答案" v-else prop="correctAnswer2">
          <el-input v-model="editQuestionForm.correctAnswer2"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="editQuestionBank('editQuestionForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看题目 -->
    <el-dialog title="查看题目" :visible.sync="viewDialogFormVisible" width="60%">
      <el-form :model="viewQuestionForm" :label-width="formLabelWidth">
        <el-form-item label="题目描述:">
          <el-input type="textarea" v-model="viewQuestionForm.title" clearable autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="问题描述:">
          <el-input type="textarea" v-model="viewQuestionForm.question" clearable autocomplete="off"
                    readonly></el-input>
        </el-form-item>
        <el-form-item label="问题类型:">
          <el-radio v-model="viewQuestionForm.questionType" label="1" disabled>单选</el-radio>
          <el-radio v-model="viewQuestionForm.questionType" label="2" disabled>填空</el-radio>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="答案描述" required v-if="viewQuestionForm.questionType === '1'">
          <el-form-item style="margin-bottom: 25px"

                        v-for="(data, index) in viewQuestionForm.answerOptions"
                        :key="data.key"


          >
            <el-input v-model="data.value" style="width: 425px" readonly>
              <div slot="prepend" style="width: 10px;">{{options[index]}}</div>
            </el-input>
          </el-form-item>
        </el-form-item>

        <!-- 单选答案 -->
        <el-form-item label="正确答案" v-if="viewQuestionForm.questionType === '1' ">
          <el-radio-group v-model="viewQuestionForm.correctAnswer">
            <el-radio v-for="(data, index) in viewQuestionForm.answerOptions"
                      :key="index"
                      :label="options[index]"
                      disabled
            ></el-radio>

          </el-radio-group>
        </el-form-item>

        <!--  填空 -->
        <el-form-item label="正确的答案" v-else>
          <el-input v-model="viewQuestionForm.correctAnswer2" readonly></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelView()">关闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    import {QuestionBankApi} from './questionBankApi'

    export default {
        name: "questionBank",
        data() {
            var isAnswerSame = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('选项不能为空'));
                }
                var count = 0;
                for (var i = 0; i < this.addQuestionForm.answerOptions.length; i++) {
                    if (value != '' && value === this.addQuestionForm.answerOptions[i].value) {
                        count++;
                    }
                }
                if (count >= 2) {
                    callback(new Error('选项不可以重复'));
                } else {
                    callback();
                }
            };
            var isAnswerSameEdit = (rule, value, callback) => {

                if (value === '') {
                    callback(new Error('选项不能为空'));
                }
                var count = 0;
                for (var i = 0; i < this.editQuestionForm.answerOptions.length; i++) {
                    if (value != '' && value === this.editQuestionForm.answerOptions[i].value) {
                        count++;
                    }
                }
                if (count >= 2) {
                    callback(new Error('选项不可以重复'));
                } else {
                    callback();
                }
            };
            var checkAddAnswerNum = (rule, value, callback) => {
                console.log(value)
                if (this.addQuestionForm.answerOptions.length > 1) {
                    callback();
                } else {
                    callback(new Error('选项至少有两个'));
                }
            };
            var checkEditAnswerNum = (rule, value, callback) => {
                if (this.editQuestionForm.answerOptions.length > 1) {
                    callback();
                } else {
                    callback(new Error('选项至少有两个'));
                }
            };
            return {
                questionType: '', // 问题类型
                typeOptions: [{
                    value: '1',
                    label: '单选'
                }, {
                    value: '2',
                    label: '填空'
                }],
                addDialogFormVisible: false,
                viewDialogFormVisible: false,
                editDialogFormVisible: false,
                addQuestionForm: {
                    id: '',
                    title: '',
                    question: '',
                    questionType: '1',
                    answerDescription: '',
                    correctAnswer: '',
                    correctAnswer2: '',
                    picture: '',
                    answerOptions: [{value: ''}, {value: ''}, {value: ''}]
                },
                viewQuestionForm: {
                    id: '',
                    title: '',
                    question: '',
                    questionType: '1',
                    answerDescription: '',
                    correctAnswer: '',
                    correctAnswer2: '',
                    picture: '',
                    answerOptions: [{value: ''}, {value: ''}, {value: ''}]
                },
                editQuestionForm: {
                    id: '',
                    title: '',
                    question: '',
                    questionType: '1',
                    answerDescription: '',
                    correctAnswer: '',
                    correctAnswer2: '',
                    picture: '',
                    answerOptions: [{value: ''}, {value: ''}, {value: ''}]
                },
                questions: [],
                totalList: 0,
                currentPage: 1,
                totalPage: 1, // 总页数
                pageSize: 5, // 每页条数
                options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                addRules: {
                    title: [
                        {required: true, message: '请输入题目描述', trigger: 'blur'}
                    ],
                    question: [
                        {required: true, message: '请输入问题描述', trigger: 'blur'}
                    ],
                    questionType: [
                        {required: true, message: '请选择问题类型', trigger: 'blur'}
                    ],
                    correctAnswer: [
                        {required: true, message: '请选择正确答案', trigger: 'blur'}
                    ],
                    correctAnswer2: [
                        {required: true, message: '请输入正确答案', trigger: 'blur'}
                    ],
                    answerEditNum: [{validator: checkEditAnswerNum, trigger: 'blur'}],
                    answerAddNum: [{validator: checkAddAnswerNum, trigger: 'blur'}],
                },
                formLabelWidth: '120px',
                rules: {
                    validator: isAnswerSame, trigger: 'blur'
                },
                editRules: {
                    validator: isAnswerSameEdit, trigger: 'blur'
                }


            }
        },
        mounted() {
            this.getQuestionBankList();
        },
        methods: {
            getList() { // 清空条件后，查询所有数据
                if (this.questionType === '') {
                    this.getQuestionBankList();
                }
            },
            closed(formName){
                this.resetForm(formName);
            },
            getQuestionBankList() { // 获取题库列表
                if (this.questionType === '') { // 获取全部列表
                    let params = {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize
                    }
                    QuestionBankApi.getQuestionList(params).then(res => {
                        if(res.data.code === 200){
                            this.totalList = res.data.data.total;
                            this.questions = res.data.data.list;
                            this.getTotalPage();
                        } else if(res.data.code === 403){
                            Msg.error('权限不足');
                        } else {
                            Msg.error('获取题目失败,请稍后再试');
                        }
                    }).catch(err => {
                        Msg.error('网络繁忙');
                    });
                } else {
                    let params = {
                        questionType: this.questionType,
                        currentPage: this.currentPage,
                        pageSize: this.pageSize
                    };
                    QuestionBankApi.getQuestionListByType(params).then(res => {
                        if(res.data.code === 200){
                            this.totalList = res.data.data.total;
                            this.questions = res.data.data.list;
                            this.getTotalPage();
                        } else if(res.data.code === 403){
                            Msg.error('权限不足');
                        } else {
                            Msg.error('获取题目失败,请稍后再试');
                        }
                    }).catch(err => {
                        Msg.error('网络繁忙');
                    });
                }

            },
            openCreateQuestionDialog() { // 打开创建题目弹窗
                this.addDialogFormVisible = true;
            },
            cancelAdd() {
                this.addDialogFormVisible = false;
                this.resetForm('addQuestionForm');
            },
            cancelView() {
                this.viewDialogFormVisible = false;
            },
            cancelEdit() {
                this.editDialogFormVisible = false;
                this.resetForm('editQuestionForm');
            },
            resetForm(formName) { // 重置表单
                this.$refs[formName].resetFields();
            },
            addQuestionBank(formName) { // 新增题目
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = this.getQuestionAddAndEditParams(this.addQuestionForm);
                        QuestionBankApi.addQuestion(params).then(res => {
                            if (res.data.code === 200) {
                                Msg.success(res.data.message);
                                this.getQuestionBankList();
                                this.cancelAdd();
                            } else {
                                Msg.error(res.data.message);
                            }
                        }).catch(err => {
                            Msg.error('网络繁忙');
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            editQuestionBank(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = this.getQuestionAddAndEditParams(this.editQuestionForm);
                        QuestionBankApi.editQuestion(params).then(res => {
                            if (res.data.code === 200) {
                                Msg.success(res.data.message);
                                this.getQuestionBankList();
                                this.cancelEdit();
                            } else {
                                Msg.error(res.data.message);
                            }
                        }).catch(err => {
                            Msg.error('网络繁忙');
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
            ,
            handleSizeChange(val) { // 改变每页数量
                this.pageSize = val;
                this.getQuestionBankList();
            },
            handleCurrentChange(val) { // 改变当前页数
                this.currentPage = val;
                this.getQuestionBankList();
            },
            openViewDialog(data) { // 打开查看弹窗
                this.getQuestionDialogData(this.viewQuestionForm, data);
                this.viewDialogFormVisible = true;

            },
            openEditDialog(data) { // 打开编辑弹窗
                this.getQuestionDialogData(this.editQuestionForm, data);
                this.editDialogFormVisible = true;
            },
            getQuestionDialogData(form, data) {
                form.title = data.title;
                form.id = data.id;
                form.question = data.question;
                form.questionType = data.questionType;
                form.answerOptions = [{value: ''}, {value: ''}, {value: ''}]; // 首先把选项置空
                if (data.questionType === '1') { // 单选
                    form.answerDescription = data.answerDescription;
                    var strs = data.answerDescription.split(";");
                    form.answerOptions = [];
                    for (var i = 0; i < strs.length; i++) {
                        form.answerOptions.push({
                            value: strs[i],
                            key: Date.now() + i
                        });
                        if (data.correctAnswer === strs[i]) {
                            form.correctAnswer = this.options[i];
                        }
                    }

                } else { // 填空
                    form.correctAnswer2 = data.correctAnswer;
                }
            },
            deleteQuestionById(id) { // 删除问题
                this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    QuestionBankApi.deleteQuestionById({id: id}).then(res => {
                        if (res.data.code === 200) {
                            Msg.success(res.data.message);
                            this.getQuestionBankList();
                        } else {
                            Msg.error(res.data.message);
                        }

                    }).catch(err => {
                        Msg.error('网络繁忙');
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

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
            },
            removeOptions(item) {
                var index = this.addQuestionForm.answerOptions.indexOf(item);
                if (index !== -1) {
                    this.addQuestionForm.answerOptions.splice(index, 1);
                }
                this.addQuestionForm.correctAnswer = ''; // 正确答案选项清空
            },
            addOptions() {
                this.addQuestionForm.answerOptions.push({
                    value: '',
                    key: Date.now()
                });
            },
            removeEditOptions(item) {
                var index = this.editQuestionForm.answerOptions.indexOf(item);
                if (index !== -1) {
                    this.editQuestionForm.answerOptions.splice(index, 1);
                }
                this.editQuestionForm.correctAnswer = ''; // 正确答案选项清空
            },
            addEditOptions() {
                this.editQuestionForm.answerOptions.push({
                    value: '',
                    key: Date.now()
                });
            },
            getQuestionAddAndEditParams(data) { // 获取新增获取编辑参数
                if (data.questionType === '1') { // 单选
                    var description = '';
                    var correctAnswer = '';
                    for (var i = 0; i < data.answerOptions.length; i++) {
                        description += data.answerOptions[i].value + ";";
                        if (this.options[i] === data.correctAnswer) {
                            correctAnswer = data.answerOptions[i].value;
                        }
                    }
                    description = description.substring(0, description.length - 1);
                    var params = {
                        id: data.id,
                        title: data.title,
                        question: data.question,
                        questionType: data.questionType,
                        answerDescription: description,
                        correctAnswer: correctAnswer,
                    }
                    return params;
                } else {
                    var params = {
                        id: data.id,
                        title: data.title,
                        question: data.question,
                        questionType: data.questionType,
                        correctAnswer: data.correctAnswer2,
                    }
                    return params;
                }

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


  .read {
    display: flex;
  }

  .text_button {
    font-size: 13px;
    color: red;
    background: none;
    cursor: pointer;
  }

  .option-remove {
    font-size: 17px;
    cursor: pointer;
    color: #DCDFE6;
  }

  .option-remove:hover {
    color: #C0C4CC;
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

  /*//输入框*/
  .input_box {
    width: 190px;
    height: 40px;
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

  /*>>> .el-button:focus {*/
  /*  background: #fff;*/
  /*  border: 1px solid #DCDFE6;*/
  /*  color: #606266;*/
  /*}*/

  >>> .el-button--default:hover {
    color: #ff0000;
    background-color: #fff4f4;
    border-color: #fff4f4;
  }

  >>> .el-radio__input.is-checked + .el-radio__label {
    color: #ff0000;
  }

  >>> .el-radio__input.is-checked .el-radio__inner {
    background-color: #ff0000;
    border-color: #ff0000;
  }


</style>
