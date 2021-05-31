<template>
  <div style="width:100%;margin:0 auto;">
    <!--面包屑-->
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>转组织关系</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>姓名：</span>
        <el-input placeholder="请输入" clearable class="input_box" size="medium" v-model="searchList.name"
                  @change="validateName"></el-input>
      </div>
      <div class="input-content">
        <span>申请时间：</span>
        <el-date-picker
          clearable
          v-model="searchList.applicationDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy/MM/dd"
          @change="validateTime"
        >
        </el-date-picker>
      </div>
      <div class="input-content">
        <span>进度：</span>
        <el-select v-model="searchList.progress" placeholder="请选择" @change="validateProgress" clearable>
          <el-option
            v-for="item in progressOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="searchByTimeAndNameAndProgress">查询</el-button>
        <el-button type="primary" style="margin-left: 20%" @click="addOrganizationDialog">创建</el-button>
        <el-button type="primary" style="margin-left: 20%" @click="back()" v-if="backView">返回</el-button>
      </div>
    </div>
    <el-table :data="organizationList"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="申请时间" prop="applicationDate" :show-overflow-tooltip="true"
                       align="center" style="overflow: hidden"></el-table-column>
      <el-table-column label="姓名" prop="userName" align="center"></el-table-column>
      <el-table-column label="出生年月" prop="birthday" align="center"></el-table-column>
      <el-table-column label="学号/工号" prop="userNumber" align="center"></el-table-column>
      <el-table-column label="名族" prop="userNation" align="center">
      </el-table-column>
      <el-table-column label="性别" prop="userSex" align="center">
      </el-table-column>
      <el-table-column label="原党支部" prop="originOrganizationName" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="移交党支部" prop="targetOrganizationName" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.state==0">原党支部未审核</span>
          <span v-if="scope.row.state==1">现党支部未审核</span>
          <span v-if="scope.row.state==2">审核失败</span>
          <span v-if="scope.row.state==3">审核成功</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" prop="progress" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.progress==0">申请中</span>
          <span v-if="scope.row.progress==1" style="color: #FF5A5A">审批中</span>
          <span v-if="scope.row.progress==2" style="color: #129646;">完成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="text_button" @click="examine(scope.row)"
                v-if="scope.row.progress==0 ||scope.row.progress==1 ">审批</span>
          <span class="text_button" @click="openViewDialog(scope.row)" v-if="scope.row.progress==2">查看流程</span>
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
        layout="total,prev, pager, next, sizes,jumper"
        :total="totalList">
        <span>第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>

    <el-dialog title="查看流程" :visible.sync="viewOrganizationDialogFormVisible">
      <el-steps :active="successState+1" align-center>
        <!--<el-step title="步骤1" description="开始审核"></el-step>-->
        <!--<el-step title="步骤2" description="原党支部审批中" ></el-step>-->
        <!--<el-step title="步骤3" description="原党支部审批通过，移交党支部审批中" v-if="successState==4"></el-step>-->
        <!--<el-step title="步骤3" description="原党支部审批不通过"v-else></el-step>-->
        <!--<el-step title="步骤4" description="移交支部审批通过" v-if="successState==4"></el-step>-->
        <!--<el-step title="步骤4" description="移交支部审批未通过" v-else></el-step>-->
        <!--<el-step title="步骤5" description="审批完成" v-if="successState==4"></el-step>-->
        <!--<el-step title="步骤5" description="审批未通过"v-else></el-step>-->
        <template >
          <el-step  v-for="(item,index) in progressList"
                    :title="item.title"
                    :description="item.content"
                    :key="index"
                    v-if="index<successState"
                    icon="el-icon-edit"
          >
          </el-step>





        <el-step :title="errorPressList[successState].title"
                 :description="errorPressList[successState].content"
                 v-if="successState!=4"
                 icon="el-icon-edit"
        >

        </el-step>

          <el-step :title="progressList[successState].title" description="审批通过" v-if="successState==4" icon="el-icon-edit"></el-step>
          <el-step :title="errorPressList[successState+1].title" description="审批未通过" v-if="successState<4" icon="el-icon-edit"></el-step>

        </template>


      </el-steps>
    </el-dialog>

    <el-dialog title="审批" :visible.sync="examineView" @close="cancelExamine('addExamineForm')">
      <el-form :model="addExamineForm" :rules="addExamineRules" ref="addExamineForm" label-width="100px">
        <el-form-item label="审批" prop="isPass" style="display: block">
          <el-select v-model="addExamineForm.isPass" placeholder="请选择">
            <el-option
              v-for="item in passList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark" style="width: 500px">
          <el-input type="textarea" v-model="addExamineForm.remark"
                    :rows="5"
                    placeholder="请输入审核说明"
                    maxlength="200"
                    show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <p>审核历史记录</p>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="approvalDate"
            label="审批时间"
          >
          </el-table-column>
          <el-table-column
            prop="approverName"
            label="审批人员"
          >
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state==0">审核失败</span>
              <span v-if="scope.row.state==1">审核通过</span>
              <span v-if="scope.row.state==2">申请</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
          >
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 1%">
        <el-button @click="addExamine('addExamineForm')" style="float: right;margin-right: 5%">确定</el-button>
        <el-button @click="cancelExamine('addExamineForm')" style="margin-left: 70%">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="创建组织关系" :visible.sync="addOrganizationDialogFormVisible"
               @close="cancelAdd('addOrganizationForm')">
      <div>
        <el-form :model="addOrganizationForm" :rules="addOrganizationRules" ref="addOrganizationForm"
                 label-width="100px">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="addOrganizationForm.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="申请时间" prop="applicationDate" style="width: 49.5%;margin-left: 5%;">
            <el-date-picker
              v-model="addOrganizationForm.applicationDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions" style="width: 86%" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="学号/工号" prop="userNumber">
            <el-input v-model="addOrganizationForm.userNumber" clearable @change="clearOrganization">
            </el-input>
          </el-form-item>
          <el-form-item label="名族" prop="userNation" style="width: 49.5%;margin-left: 5%;">
            <el-select v-model="addOrganizationForm.userNation" style="width: 86%" clearable>
              <el-option
                v-for="item in nationList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="addOrganizationForm.userSex" clearable>
              <el-option
                v-for="item in selectSex"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月" prop="birthday" style="width: 49.5%;margin-left: 5%;">
            <el-date-picker
              v-model="addOrganizationForm.birthday"
              type="date"
              placeholder="选择日期" style="width: 86%"
              :picker-options="birthDayPickerOptions" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="原党支部" prop="originOrganizationName">
            <el-input v-model="addOrganizationForm.originOrganizationName" clearable v-bind:disabled="disabledInput">
            </el-input>
          </el-form-item>
          <el-form-item label="移交党支部" prop="targetOrganizationName" style="width: 49.5%;margin-left: 5%;">
            <!--<el-input v-model="addOrganizationForm.targetOrganizationName" style="width: 86%">-->
            <!--</el-input>-->
            <el-select v-model="addOrganizationForm.targetOrganizationName">
              <el-option
                v-for="item in targetOrganList"
                :key="item.organizationId"
                :label="item.organizationName"
                :value="item.organizationName" clearable>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交原因" prop="reason" style="width: 94.5%;">
            <el-input v-model="addOrganizationForm.reason" type="textarea"
                      :rows="5"
                      placeholder="请输入原因"
                      maxlength="200"
                      show-word-
                      clearable
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="submitForm('addOrganizationForm')" style="float: right;margin-right: 5%" type="primary">确定
        </el-button>
        <el-button @click="cancelAdd('addOrganizationForm')" style="margin-left: 70%">取消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {Auth} from "../../../../store/modules/auth";
    import {Msg} from "../../../../tools/message";
    import {TurnOrganization} from "./turnOrganizationApi";

    export default {
        name: "turnOrganization",
        data() {
            var validatorRemark = (rule, value, callback) => {
                const CN = /^[\u4e00-\u9fa5]{5,200}$/;
                if (!value) {
                    return callback(new Error("审批说明不能为空"))
                } else {
                    if (value.length < 5) {
                        return callback(new Error("审批说明不能少于5个字"))
                    }
                    setTimeout(() => {
                        if (CN.test(value)) {
                            callback();
                        } else {
                            callback(new Error("审批说明需要汉字"))
                        }
                    }, 100)
                }
            };
            var validatorName = (rule, value, callback) => {
                const CN = /^[\u4e00-\u9fa5]{2,5}$/;
                if (!value) {
                    return callback(new Error("姓名不能为空"))
                } else {
                    if (value.length < 2) {
                        return callback(new Error("审批说明不能少于2个汉字"))
                    }
                    setTimeout(() => {
                        if (CN.test(value)) {
                            callback();
                        } else {
                            callback(new Error("请输入正确的中文名称"))
                        }
                    }, 100)
                }
            };
            var validatorNumber = (rule, value, callback) => {
                const idReg = /^[0-9]{6,11}$/
                if (!value) {
                    return callback(new Error('学号或工号不能为空'))
                }
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字'))
                } else {
                    if (idReg.test(value)) {
                        this.getOrganizationNameAll();
                        callback();
                    } else {
                        callback(new Error('请输入6-11位纯数字学号或工号'))
                    }
                }
            };
            var validatorReason = (rule, value, callback) => {
                const CN = /^[\u4e00-\u9fa5]{5,200}$/;
                if (!value) {
                    return callback(new Error("转组织原因不能为空！"))
                } else {
                    if (value.length < 5) {
                        return callback(new Error("转组织原因不能少于5个汉字"))
                    }
                    setTimeout(() => {
                        if (CN.test(value)) {
                            callback();
                        } else {
                            callback(new Error("请输入正确的汉字原因说明"))
                        }
                    }, 100)
                }
            };
            return {
                disabledInput: true,
                tableData: [{
                    approvalDate: '',
                    approverName: '',
                    remark: '',
                    state: ''
                }],
                addExamineForm: {
                    isPass: '',
                    remark: ''
                },
                birthDayPickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
                    },
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                selectSex: ['男', '女'],
                organizationList: [],
                progressOption: [
                    {label: '申请中', value: 0},
                    {label: '审批中', value: 1},
                    {label: '完成', value: 2}
                ],
                successState:0,
                progressList:[{content:"开始审核",title:"步骤一"},
                  {content:"原党支部审核中",title:"步骤二"},
                  {content:"原党支部审核通过，移交目的党支部审核中",title:"步骤三"},
                  {content:"目的党支部审核通过",title:"步骤四"},
                  {content:"审核完成",title:"步骤五"}
                  ],
                errorPressList:[{content:"开始审核",title:"步骤一"},
                  {content:"原党支部审核中",title:"步骤二"},
                  {content:"原党支部审核不通过",title:"步骤三"},
                  {content:"移交党支部审核中",title:"步骤四"},
                  {content:"移交党支部审核未通过",title:"步骤五"},
                  {content:"审核不通过",title:"步骤六"}
                  ],
                addOrganizationForm: {
                    userName: '',
                    userNumber: '',
                    userNation: '',
                    originOrganizationId: '',
                    originOrganizationName: '',
                    targetOrganizationId: '',
                    targetOrganizationName: '',
                    reason: '',
                    birthday: '',
                    applicationDate: '',
                    userSex: '',
                },
                passList: [
                    {label: '通过', value: '1'},
                    {label: '未通过', value: '0'}
                ],
                nationList: [{name: '汉族'}, {name: '壮族'}, {name: '满族'}, {name: '回族'}, {name: '苗族'}, {name: '维吾尔族'}, {name: '土家族'},
                    {name: '彝族'}, {name: '蒙古族'}, {name: '藏族'}, {name: '布依族 '}, {name: '侗族'}, {name: '瑶族'}, {name: '朝鲜族'},
                    {name: '白族'}, {name: '哈尼族'}, {name: '哈萨克族'}, {name: '黎族'}, {name: '傣族'}, {name: '畲族'}, {name: '僳僳族'},
                    {name: '仡佬族'}, {name: '东乡族'}, {name: '拉祜族'}, {name: '水族'}, {name: '佤族'}, {name: '纳西族'}, {name: '羌族'},
                    {name: '土族'}, {name: '仫佬族'}, {name: '锡伯族'}, {name: '柯尔克孜族'}, {name: '达翰尔族'}, {name: ' 景颇族'}, {name: '毛南族'},
                    {name: '撒拉族'}, {name: '布朗族'}, {name: '塔吉克族'}, {name: '阿昌族'}, {name: '普米族'}, {name: '鄂温克族'}, {name: '怒族'},
                    {name: '京族'}, {name: '基诺族'}, {name: '德昂族'}, {name: '保安族'}, {name: '俄罗斯族'}, {name: '裕固族'}, {name: '乌孜别克族'},
                    {name: '门巴族'}, {name: '鄂伦春族'}, {name: '独龙族'}, {name: '塔塔尔族'}, {name: '赫哲族'}, {name: '高山族'}, {name: '珞巴族'},],
                addOrganizationRules: {
                    userName: {required: true, validator: validatorName, trigger: ['blur']},
                    userNumber: {required: true, validator: validatorNumber, trigger: ['blur']},
                    userNation: {required: true, message: '名族不能为空', trigger: 'blur'},
                    originOrganizationName: {required: true, message: '原党支部不能为空', trigger: ['blur']},
                    targetOrganizationName: {required: true, message: '移交党支部不能为空', trigger: ['blur', 'change']},
                    reason: {required: true, validator: validatorReason, trigger: 'blur'},
                    birthday: {required: true, message: '请选择一个日期', trigger: 'blur'},
                    applicationDate: {required: true, message: '申请时间不能为空', trigger: 'blur'},
                    userSex: {required: true, message: '请选择性别', trigger: 'blur'},
                },
                addExamineRules: {
                    isPass: {required: true, message: '请选择审批状态', trigger: 'blur'},
                    remark: {required: true, validator: validatorRemark, minLength: 5, trigger: 'blur',}
                },
                addOrganizationDialogFormVisible: false,//添加投票调查弹窗
                viewOrganizationDialogFormVisible: false,//查看投票
                statusValue: null,
                totalList: 0,
                currentPage: 1,
                totalPage: 0, // 总页数
                pageSize: 5, // 每页条数
                userInfo: {},
                formLabelWidth: '120px',
                searchList: {applicationDate: '', name: '', progress: null},
                backView: false,
                examineView: false,
                currentRow: {},
                targetOrganList: [],
            }
        },
        mounted() {
            this.getOrganizationList();
        },
        created() {

        },
        methods: {
            clearOrganization() {
                console.log(this.addOrganizationForm.userNumber)
                if (this.addOrganizationForm.userNumber == '' || this.addOrganizationForm.userNumber == undefined || this.addOrganizationForm.userNumber == null) {
                    this.addOrganizationForm.originOrganizationName = null;
                    this.addOrganizationForm.originOrganizationId = null;
                    this.targetOrganList = [];
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addOrganization(formName);
                    } else {
                        // console.log('error submit!!');
                        Msg.error("请根据提示填写正确的数据！")
                        return false;
                    }
                });
            },
            getApplicationState(applicationId){
              TurnOrganization.findApplicationState({applicationId:applicationId}).then(res=>{
                this.successState = parseInt(3);
              }).catch(err=>{
                Msg.error("流程获取失败")
              })

            },
            addOrganization(formName) {
                TurnOrganization.addTurnOrganization(this.addOrganizationForm).then(res => {
                    Msg.success("信息添加成功")
                    this.addOrganizationDialogFormVisible = false;
                    this.resetForm(formName);
                    this.getOrganizationList();
                }).catch(err => {
                    // console.log(err)
                    Msg.error("信息添加失败")
                })
            },
            cancelExamine(formName) {
                this.examineView = false;
                this.resetForm(formName);
            },
            examine(row) {
                this.currentRow = row
                this.examineView = true;
                TurnOrganization.findApprovalHistory({applicationId: row.id}).then(res => {
                    // console.log(res);
                    this.tableData = res.data.data;
                }).catch(err => {
                })

            },
            addExamine(formName) {
                var addData = {
                    approverId: this.userInfo.partyId,
                    state: this.addExamineForm.isPass,
                    remark: this.addExamineForm.remark,
                    applicationId: this.currentRow.id,
                    currentApproverOrganizationId: this.userInfo.organizationId,
                    originOrganizationId: this.currentRow.orginOrganizationId,
                    targetOrganizationId: this.currentRow.targetOrganizationId
                }
                TurnOrganization.addApprovalRecord(addData).then(res => {
                    Msg.success("审批成功");
                    this.resetForm(formName);
                    this.examineView = false;
                    this.getOrganizationList();
                }).catch(err => {
                    Msg.error("审批失败")
                })
            }
            ,
            back() {
                this.backView = false;
                this.getOrganizationList();
            },
            openViewDialog(row) {
                this.viewOrganizationDialogFormVisible = true;
                console.log(row)
                this.getApplicationState(row.id);
            },
            validateName() {
                if ((this.searchList.applicationDate == '' || this.searchList.applicationDate == null) && (this.searchList.name == '' || this.searchList.name == null) && (this.searchList.progress == '' || this.searchList.progress == null)) {
                    this.currentPage = 1;
                    this.getOrganizationList();
                }
            },
            validateTime() {
                if ((this.searchList.applicationDate === '' || this.searchList.applicationDate === null)
                    && (this.searchList.name === '' || this.searchList.name === null) &&
                    (this.searchList.progress === '' || this.searchList.progress === null)) {
                    this.currentPage = 1;
                    this.getOrganizationList();
                }
            },
            validateProgress() {
                if ((this.searchList.applicationDate === '' || this.searchList.applicationDate === null) && (this.searchList.name == '' || this.searchList.name == null) && (this.searchList.progress == '' || this.searchList.progress == null)) {
                    this.currentPage = 1;
                    this.getOrganizationList();
                }
            },
            FormTime() {
                alert(this.addVoteRuleForm.voteTime);
                for (var i = 0; i < this.addVoteRuleForm.voteOption.length; i++) {
                    this.addVoteRuleForm.voteOption[i].option = this.options[i];
                }
                // console.log(this.addVoteRuleForm.voteOption)
            },
            cancelAdd(formName) {
                this.addOrganizationDialogFormVisible = false;
                this.resetForm(formName);
            },
            resetForm(formName) { // 重置表单
                this.$refs[formName].resetFields();
            },
            addOrganizationDialog() {
                //


                this.addOrganizationDialogFormVisible = true;
            },
            getOrganizationNameAll() {
                var data = {
                    number: this.addOrganizationForm.userNumber
                }
                if (this.addOrganizationForm.userNumber === '' || this.addOrganizationForm.userNumber === undefined) {
                    this.methods = {type: 'waring', message: '请先输入姓名'}
                } else {
                    TurnOrganization.getOrganization(data).then(res => {
                        this.addOrganizationForm.originOrganizationName = res.data.data.originOrganizationName;
                        this.addOrganizationForm.originOrganizationId = res.data.data.originOrganizationId;
                        this.targetOrganList = res.data.data.targetOrganizations;
                    })
                }
            },
            getOrganizationList() {
                this.userInfo = Auth.getUser();
                // console.log(this.userInfo);
                var data = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    currentOrganizationRank: this.userInfo.organizationRank,
                    currentOrganizationId: this.userInfo.organizationId
                };
                TurnOrganization.getTurnOrganizationList(data).then(res => {

                    this.organizationList = res.data.data.list;
                    this.totalList = res.data.data.total;
                    if (res.data.code === 403) {
                        Msg.error('权限不足');
                    }
                    // console.log(res.data);

                    // console.log(this.totalList);
                }).catch(err => {
                    Msg.error('网络繁忙');
                })
            }
            ,
            searchByTimeAndNameAndProgress() {
                if ((this.searchList.applicationDate === '' || this.searchList.applicationDate === null)
                    && (this.searchList.name === '' || this.searchList.name === null)
                    && (this.searchList.progress === '' || this.searchList.progress === null)) {
                    Msg.warn("请输入数据进行查询")
                } else {
                    var data = {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        currentOrganizationRank: this.userInfo.organizationRank,
                        currentOrganizationId: this.userInfo.organizationId,
                        progress: this.searchList.progress,
                        name: this.searchList.name,
                        applicationDate: this.searchList.applicationDate
                    };
                    TurnOrganization.getTurnOrganizationList(data).then(res => {
                        // console.log(res.data.code);
                        // // console.log(res.data);
                        if (res.data.code === 200 && res.data.data == undefined) {
                            Msg.warn(res.data.message)
                        } else {
                            this.organizationList = res.data.data.list;
                            this.totalList = res.data.data.total;
                        }
                        // console.log(this.totalList);
                    }).catch(err => {
                        console.log(err)
                    })
                }


            },
            handleSizeChange(val) {
                this.pageSize = val;
                // this.searchByTimeAndNameAndProgress();
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                // this.searchByTimeAndNameAndProgress();
                // console.log(`当前页: ${val}`);
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
            }
        },
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

  >>> .cell.el-tooltip {
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*//输入框*/
  .input_box {
    width: 76%;
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
    width: 50%;
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

  >>> .el-form-item__content el-input {
    width: 200px;
  }

  /*>>>.el-input input{*/
  /*width: auto;*/
  /*}*/
  >>> .el-form-item {
    display: inline-block;
    width: 44.5%;
  }

  body .el-table th.gutter {
    display: table-cell !important;
  }


</style>
