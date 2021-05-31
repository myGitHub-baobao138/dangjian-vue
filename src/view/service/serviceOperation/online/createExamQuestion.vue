<template>
  <div style="text-align: left">
    <el-form :inline="true" ref="examQuestions" :rules="examRules" :model="examQuestions" label-position="top"
             class="demo-form-inline">
      <div class="basic-info">
        <p class="small-title">基本信息
          <el-button style="margin-left: 20px" @click="cancel" v-if="method === 'view' || method === ''">返回列表
          </el-button>
        </p>
        <el-form-item label="标题" prop="title">
          <el-input v-model="examQuestions.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="questionCategoryId">
          <el-select v-model="examQuestions.questionCategoryId" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.categoryName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择开始-结束时间" prop="dateTimes">
          <el-date-picker
            v-model="examQuestions.dateTimes"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="getDate()">
          </el-date-picker>
        </el-form-item>
      </div>

      <!-- 题目 -->
      <div class="questions">
        <span class="small-title">创建题目</span>
        <el-button class="button-add" @click="openCreateQuestionDialog" v-if="method != 'view' && method != ''">+添加
        </el-button>
        <el-button class="button-add" @click="openQuestionsOptionsDialog" v-if="method != 'view' && method != ''">
          +题库选择
        </el-button>
        <el-table :data="examQuestions.questions"
                  :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
                  class="form-table-top"
                  ref="multipleTable">
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
              <span v-if="scope.row.questionType === '1'" style="color: #49A9F0">单选</span>
              <span v-else style="color: #49A9F0">填空</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="method != 'view' && method != ''">
            <template slot-scope="scope">
              <span class="text_button" @click="openViewDialog(scope.row)">查看 &nbsp;</span>
              <span class="text_button" @click="openEditDialog(scope.row)"> 编辑 &nbsp;</span>
              <span class="text_button" @click="deleteQuestionById(scope.row.id)"> 删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!--        &lt;!&ndash;页码&ndash;&gt;-->
        <!--        <div class="pages">-->
        <!--          <el-pagination-->
        <!--            background-->
        <!--            @size-change="handleSizeChange"-->
        <!--            @current-change="handleCurrentChange"-->
        <!--            :current-page="currentPage"-->
        <!--            :page-sizes="[5, 10, 20, 30]"-->
        <!--            :pageSize="pageSize"-->
        <!--            layout="total,slot,  prev, pager, next, sizes,jumper"-->
        <!--            :total="totalList">-->
        <!--            <span>第{{currentPage}}/{{totalPage}}页</span>-->
        <!--          </el-pagination>-->
        <!--        </div>-->

        <div class="bottom-button" v-if="method != 'view' && method != ''">
          <el-button type="primary" style="margin-left: 20px" @click="saveExamQuestion('examQuestions')">保存</el-button>
          <el-button type="primary" style="margin-left: 20px" @click="postExamQuestion('examQuestions')">发布</el-button>
          <el-button style="margin-left: 20px" @click="cancel">取消</el-button>
        </div>


      </div>


    </el-form>

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
                        :key="data.key">
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

    <!-- 题库选择 -->
    <el-dialog title="题库选择" :visible.sync="selectDialogFormVisible" width="60%">
      <div class="input-content">
        <span>类型：</span>
        <el-select v-model="questionType" placeholder="请选择" clearable @change="getQuestionsList()">
          <el-option
            v-for="item in typeOptions1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <el-table :data="questions"
                :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
                class="form-table-top"
                @selection-change="handleSelectionChange"

      >
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column label="题目内容" prop="title" align="center">
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
      </el-table>
      <!--页码-->
      <div class="pages">
        <el-pagination
          background
          @size-change="handleAddSizeChange"
          @current-change="handleAddCurrentChange"
          :current-page="addCurrentPage"
          :page-sizes="[5, 10, 20, 50]"
          :pageSize="addPageSize"
          layout="total, prev, pager, next, sizes,jumper"
          :total="addTotalList">
          <span>第{{addCurrentPage}}/{{addTotalPage}}页</span>
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSelectDialog">取消</el-button>
        <el-button @click="selectQuestions()" type="primary">添加</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    import {CreateExamQuestionApi} from "./createExamQuestionApi";
    import {ExamQuestionsManageApi} from "./examQuestionsManageApi";
    import {QuestionBankApi} from "./questionBankApi";


    export default {
        name: "createExamQuestion",
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

            var checkTime = (rule, value, callback) => {


                var isTrue = false;

                var date1 = new Date(value[0]);
                var date2 = new Date(this.getYearMonthDay());
                if (date2 > date1) {
                    isTrue = true;
                }

                if (isTrue) {
                    callback(new Error('考题时间已过期'));
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
                examQuestions: {
                    id: '',
                    title: '',
                    questionCategoryId: '', // 分类
                    beginTime: '', // 开始时间
                    endTime: '',
                    dateTimes: [],
                    questions: [], // 题目列表
                }, // 考题

                typeOptions: [], // 分类数组
                pickerOptions: {
                    // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
                    disabledDate: (time) => {
                        return this.dealDisabledDate(time)
                    }
                }, // 日期设置对象
                // totalList: 0,
                // currentPage: 1,
                // totalPage: 1, // 总页数
                // pageSize: 5, // 每页条数
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
                    ], answerEditNum: [{validator: checkEditAnswerNum, trigger: 'blur'}],
                    answerAddNum: [{validator: checkAddAnswerNum, trigger: 'blur'}],
                },
                formLabelWidth: '120px',
                rules: {
                    validator: isAnswerSame, trigger: 'blur'
                },
                editRules: {
                    validator: isAnswerSameEdit, trigger: 'blur'
                },
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
                selectDialogFormVisible: false, // 选择题库弹窗
                selections: [], // 选择题库对象数组
                questions: [], // 所有题目
                questionType: '', // 问题类型
                typeOptions1: [{
                    value: '1',
                    label: '单选'
                }, {
                    value: '2',
                    label: '填空'
                }],
                addTotalList: 0,
                addCurrentPage: 1,
                addTotalPage: 1, // 总页数
                addPageSize: 5, // 每页条数
                examRules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    questionCategoryId: [
                        {required: true, message: '请选择分类', trigger: 'change'}
                    ],
                    dateTimes: [
                        {type: 'array', required: true, message: '请选择时间', trigger: 'change'},
                        {validator: checkTime, trigger: 'change'}
                    ]
                },
                method: '',


            }
        },
        created() {
            var params = this.$route.query;
            this.method = params.method === undefined ? '' : params.method;
            if (params.id === undefined) {

            } else { // 有值
                CreateExamQuestionApi.getExamineQuestion({id: params.id}).then(res => {
                    if(res.data.code === 200){
                        this.examQuestions.id = res.data.data.id;
                        this.examQuestions.title = res.data.data.title;
                        this.examQuestions.questionCategoryId = res.data.data.questionCategoryId;
                        this.examQuestions.dateTimes.push(res.data.data.beginTime);
                        this.examQuestions.dateTimes.push(res.data.data.endTime);
                        this.examQuestions.questions = res.data.data.questions;
                    } else if(res.data.code === 403){
                        Msg.error('权限不足');
                    } else {
                        Msg.error('网络繁忙');
                    }

                }).catch(err =>{
                    Msg.error('网络繁忙');
                })
            }


        },
        mounted() {
            this.getQuestionCategoryNameIdList();
        },
        methods: {
            getQuestionCategoryNameIdList() { // 获取分类id和name对象数组
                ExamQuestionsManageApi.getQuestionCategoryNameIdList().then(res => {
                    if (res.data.code === 200) {
                        this.typeOptions = res.data.data;
                    }
                })
            },
            closed(formName){
                this.resetForm(formName);
            },
            getDate() {
                if (this.examQuestions.dateTimes === null) {
                    this.examQuestions.beginTime = '';
                    this.examQuestions.endTime = '';
                } else {
                    this.examQuestions.beginTime = this.examQuestions.dateTimes[0];
                    this.examQuestions.endTime = this.examQuestions.dateTimes[1];
                }


            },
            // 单独处理时间的函数
            dealDisabledDate(time) {
                // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
                // Date.now()是把今天的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数,这样比较好比较
                // return的值,true是不可以操作选择,false可以操作选择,比如下面这个判断就只能选择今天之后的时间
                return time.getTime() < Date.now() - 8.64e7;

                // 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
                // return time.getTime() <= Date.now()
                // return time.getTime() < Date.now() - 8.64e7
            },
            openQuestionsOptionsDialog() { // 打开选择题库弹窗
                this.getQuestionsList();
                this.selectDialogFormVisible = true;
            },
            // handleSizeChange(val) { // 改变每页数量
            //     this.pageSize = val;
            //     // this.getExamQuestionList();
            // },
            // handleCurrentChange(val) { // 改变当前页数
            //     this.currentPage = val;
            //     // this.getExamQuestionList();
            // },
            // getTotalPage() { // 获取总页数
            //     this.totalPage = Math.ceil(this.totalList / this.pageSize);
            //
            //     if (this.currentPage > this.totalList) {
            //         this.currentPage = this.totalList;
            //     }
            //
            //     if (this.currentPage === 0 && this.totalPage === 0) {
            //         this.currentPage = 1;
            //         this.totalPage = 1;
            //     }
            // },
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
                                params.id = res.data.data;
                                this.addQuestion(params);
                                this.cancelAdd();
                            } else {
                                Msg.error(res.data.message);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            addQuestion(params) {
                this.examQuestions.questions.push(params);
            },
            editQuestionBank(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = this.getQuestionAddAndEditParams(this.editQuestionForm);
                        QuestionBankApi.editQuestion(params).then(res => {
                            if (res.data.code === 200) {
                                Msg.success(res.data.message);
                                this.cancelEdit();
                                for (var i = 0; i < this.examQuestions.questions.length; i++) {
                                    if (this.examQuestions.questions[i].id === params.id) {
                                        this.examQuestions.questions[i] = params;
                                    }
                                }
                            } else {
                                Msg.error(res.data.message);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }, openViewDialog(data) { // 打开查看弹窗
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
                this.$confirm('删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (var i = 0; i < this.examQuestions.questions.length; i++) {
                        if (id === this.examQuestions.questions[i].id) {
                            this.examQuestions.questions.splice(i, 1);
                            Msg.success('删除成功')
                        }
                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }, removeOptions(item) {
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
            saveExamQuestion(formName) { // 保存考题
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.examQuestions.questions.length === 0) {
                            Msg.warn('请选题');
                        } else {
                            if (this.method === 'insert' || this.method === '') { // 新增
                                var questions = [];
                                for (var i = 0; i < this.examQuestions.questions.length; i++) {
                                    questions.push(this.examQuestions.questions[i].id);
                                }
                                this.getDate();
                                var params = {
                                    title: this.examQuestions.title,
                                    beginTime: this.examQuestions.beginTime,
                                    endTime: this.examQuestions.endTime,
                                    questionCategory: this.examQuestions.questionCategoryId,
                                    founderId: Auth.getUser().partyId,
                                    founderOrganizationId: Auth.getUser().organizationId,
                                    questionId: questions
                                }
                                CreateExamQuestionApi.addExamQuestion(params).then(res => {
                                    if (res.data.code === 200) {
                                        Msg.success(res.data.message);
                                        this.$router.push({path: 'questions'});
                                    } else {
                                        Msg.error(res.data.message);
                                    }
                                })
                            } else {
                                var questions = [];
                                for (var i = 0; i < this.examQuestions.questions.length; i++) {
                                    questions.push(this.examQuestions.questions[i].id);
                                }
                                this.getDate();
                                var params = {
                                    id: this.examQuestions.id,
                                    title: this.examQuestions.title,
                                    beginTime: this.examQuestions.beginTime,
                                    endTime: this.examQuestions.endTime,
                                    questionCategory: this.examQuestions.questionCategoryId,
                                    founderId: Auth.getUser().partyId,
                                    founderOrganizationId: Auth.getUser().organizationId,
                                    questionId: questions
                                }
                                CreateExamQuestionApi.updateExamQuestion(params).then(res => {
                                    if (res.data.code === 200) {
                                        Msg.success(res.data.message);
                                        this.$router.push({path: 'questions'});
                                    } else {
                                        Msg.error(res.data.message);
                                    }
                                })
                            }


                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            postExamQuestion(formName) { // 发布考题
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.examQuestions.questions.length === 0) {
                            Msg.warn('请选题');
                        } else {
                            if (this.method === 'insert' || this.method === '') { // 新增
                                var questions = [];
                                for (var i = 0; i < this.examQuestions.questions.length; i++) {
                                    questions.push(this.examQuestions.questions[i].id);
                                }
                                this.getDate();
                                var params = {
                                    title: this.examQuestions.title,
                                    beginTime: this.examQuestions.beginTime,
                                    endTime: this.examQuestions.endTime,
                                    releaseTime: this.time(),
                                    questionCategory: this.examQuestions.questionCategoryId,
                                    founderId: Auth.getUser().partyId,
                                    founderOrganizationId: Auth.getUser().organizationId,
                                    questionId: questions
                                }
                                CreateExamQuestionApi.addExamQuestion(params).then(res => {
                                    if (res.data.code === 200) {
                                        Msg.success(res.data.message);
                                        this.$router.push({path: 'questions'});
                                    } else {
                                        Msg.error(res.data.message);
                                    }
                                })
                            } else { // 修改
                                var questions = [];
                                for (var i = 0; i < this.examQuestions.questions.length; i++) {
                                    questions.push(this.examQuestions.questions[i].id);
                                }
                                this.getDate();
                                var params = {
                                    id: this.examQuestions.id,
                                    title: this.examQuestions.title,
                                    beginTime: this.examQuestions.beginTime,
                                    endTime: this.examQuestions.endTime,
                                    releaseTime: this.time(),
                                    questionCategory: this.examQuestions.questionCategoryId,
                                    founderId: Auth.getUser().partyId,
                                    founderOrganizationId: Auth.getUser().organizationId,
                                    questionId: questions
                                }
                                CreateExamQuestionApi.updateExamQuestion(params).then(res => {
                                    if (res.data.code === 200) {
                                        Msg.success(res.data.message);
                                        this.$router.push({path: 'questions'});
                                    } else {
                                        Msg.error(res.data.message);
                                    }
                                })
                            }

                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            cancel() { // 取消考题
                this.$router.push({path: '/questions'});
            },
            selectQuestions() { // 选择题库
                if (this.selections.length === 0) {
                    Msg.warn('请选择题目');
                } else {
                    for (var i = 0; i < this.selections.length; i++) {
                        var flag = false;
                        for (var j = 0; j < this.examQuestions.questions.length; j++) {
                            if (this.selections[i].id === this.examQuestions.questions[j].id) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            this.examQuestions.questions.push(this.selections[i]);
                        }
                    }
                    this.$confirm('添加成功,是否继续添加题目?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                    }).catch(() => {
                        this.closeSelectDialog();
                    });

                }
            },
            closeSelectDialog() {
                this.questionType = '';
                this.selections = [];
                this.selectDialogFormVisible = false;
            },
            handleSelectionChange(val) {
                this.selections = val;
            },
            getQuestionsList() { // 清空选择类型
                if (this.questionType === '') { // 获取全部列表
                    let params = {
                        currentPage: this.addCurrentPage,
                        pageSize: this.addPageSize
                    }
                    QuestionBankApi.getQuestionList(params).then(res => {
                        if (res.data.code === 200) {
                            this.addTotalList = res.data.data.total;
                            this.questions = res.data.data.list;
                            this.getAddTotalPage();
                        } else {
                            Msg.error('获取题目失败,请稍后再试');
                        }
                    })
                } else {
                    let params = {
                        questionType: this.questionType,
                        currentPage: this.addCurrentPage,
                        pageSize: this.addPageSize
                    };
                    QuestionBankApi.getQuestionListByType(params).then(res => {
                        if (res.data.code === 200) {
                            this.addTotalList = res.data.data.total;
                            this.questions = res.data.data.list;
                            this.getAddTotalPage();
                        } else {
                            Msg.error('查询失败，请稍后再试');
                        }
                    });
                }

            },
            handleAddSizeChange(val) { // 改变题库选择每页数量
                this.addPageSize = val;
                this.getQuestionsList();
            },
            handleAddCurrentChange(val) { // 改变题库选择当前页数
                this.addCurrentPage = val;
                this.getQuestionsList();
            },
            getAddTotalPage() { // 获取题库选择总页数
                this.addTotalPage = Math.ceil(this.addTotalList / this.addPageSize);

                if (this.addCurrentPage > this.addTotalList) {
                    this.addCurrentPage = this.addTotalList;
                }

                if (this.addCurrentPage === 0 && this.addTotalPage === 0) {
                    this.addCurrentPage = 1;
                    this.addTotalPage = 1;
                }
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
            getYearMonthDay() {
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


  /*//输入框*/
  .input_box {
    width: 200px;
    height: 40px;

  }

  /** 基本信息模块 */
  .basic-info {

  }

  /** 题目 */
  .questions {

  }

  .small-title {
    font-weight: bold;
    font-size: 16px;
  }

  .button-add {
    margin-left: 10px;
  }

  .bottom-button {
    text-align: center;
    margin-top: 32px;
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

  /*.cancel{*/
  /*  color: #fff;*/
  /*  background-color: #DCDFE6;*/
  /*}*/
</style>
