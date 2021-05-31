<template>
  <div style="width:100%;margin:0 auto;">
    <!--面包屑-->
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>投票调查管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>标题：</span>
        <el-input placeholder="请输入" clearable class="input_box" size="medium" v-model="searchList.title"
                  @change="validTitle"></el-input>
      </div>
      <div class="input-content">
        <span>开始时间：</span>
        <el-date-picker
          clearable
          v-model="searchList.beginTime"
          type="date"
          range-separator="至"
          placeholder="选择日期"
          value-format="yyyy/MM/dd"
          format="yyyy-MM-dd"
          @change="validTitle"
        >
        </el-date-picker>
      </div>
      <div class="input-content">
        <span>状态：</span>
        <el-select v-model="searchList.status" placeholder="请选择" clearable @change="validTitle">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="selectByCondition(1)">查询</el-button>
        <el-button type="primary" style="margin-left: 20%" @click="addOrganizationDialog">创建</el-button>
      </div>
    </div>
    <el-table :data="voteList"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="标题" prop="title" :show-overflow-tooltip="true"
                       align="center"></el-table-column>
      <el-table-column label="内容描述" prop="content" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="发起人" prop="partyName" align="center"></el-table-column>
      <el-table-column label="组织" prop="organizationName" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="选项列举" prop="option" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="开始-结束时间" prop="beginTimeAndEndTime" align="center" width="200px">

      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1" style="color: #129646;">进行中</span>
          <span v-if="scope.row.status==0">未开始</span>
          <span v-if="scope.row.status==-1" style="color: #FF5A5A">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="最多票数" prop="maxOption" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="text_button" @click="editView(scope.row)"
                v-if="scope.row.status==0">编辑</span>
          <span class="text_button" @click="openViewDialog(scope.row)">查看结果</span>
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
        layout="total,  prev, pager, next, sizes,jumper"
        :total="totalList">
        <span>第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>

    <el-dialog title="查看详情" :visible.sync="viewVoteDialogFormVisible">
      <div>
        <template>
          <strong style="font-size: 18px">{{viewList.title}}</strong>
          <span style="font-size: 18px">({{viewList.beginTimeAndEndTime}})</span>
          <el-button v-if="viewList.status==-1" type="danger" style="margin-left: 2%" plain disabled> 已结束</el-button>
          <el-button v-if="viewList.status==1" type="success" style="margin-left: 2%" plain disabled>正在进行中</el-button>
          <el-button v-if="viewList.status==0" type="info" style="margin-left: 2%" plain disabled>未开始</el-button>
        </template>
        <div class="vote-content">
          {{viewList.content}}
        </div>
      </div>
      <div class="nav-form-top">
        <div v-for="item in viewList.list" :key="item.option">
          <template>
            {{item.option}}&nbsp;&nbsp;{{item.voteContent}}&nbsp;&nbsp;
          </template>
          <el-progress :text-inside="true" :stroke-width="20"
                       :percentage="item.optionNumber!=0?Math.round((item.optionNumber/viewList.sum)*100):0"
                       class="progress-content"></el-progress>
        </div>
        <div style="display: flex;align-items: center;justify-content: center">
          <span>总票数：</span>
          <template align="center">{{viewList.sum}}</template>
        </div>

      </div>
    </el-dialog>
    <el-dialog title="添加调查" :visible.sync="addVoteDialogFormVisible" @close="cancelAdd('addVoteRuleForm')">
      <div>
        <el-form :model="addVoteRuleForm" :rules="addVoteRules" ref="addVoteRuleForm" label-width="120px">
          <el-form-item label="标题" prop="voteTitle" style="width: 35%;display: inline-block">
            <el-input v-model="addVoteRuleForm.voteTitle"></el-input>
          </el-form-item>
          <el-form-item label="开始结束时间" prop="voteTime" style="display: inline-block;width: 60%;margin-left: 2%">
            <!--<el-date-picker-->
            <!--v-model="addVoteRuleForm.voteTime"-->
            <!--type="daterange"-->
            <!--align="right"-->
            <!--unlink-panels-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--:picker-options="pickerOptions"-->
            <!--format="yyyy/MM/dd"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
            <!--/>-->
            <el-date-picker
              v-model="addVoteRuleForm.voteTime"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['12:00:00', '12:00:00']">
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="内容" prop="voteContent" style="display: inline-block;width: 95.5%;height: 120px">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入至少5个字符"
              v-model="addVoteRuleForm.voteContent"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="选项">
            <div style="margin-bottom: 2%"
                 v-for="(domain, index) in addVoteRuleForm.voteOption"
                 :label="'域名' + index"
                 :key="domain.key"
                 :prop="'addVoteRuleForm.voteOption.' + index + '.optionContent'"
                 :rules="editRules">
              <el-input style="width: 50%" v-model="addVoteRuleForm.voteOption[index].optionContent">
                <div slot="prepend" style="width: 10px;">{{options[index]}}</div>
              </el-input>
              <i class="el-icon-remove-outline option-remove" @click="removeDomain(domain)"
                 style="margin-left: 10px"></i>
            </div>
            <el-button @click="addDomain">添加选项</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="submitForm('addVoteRuleForm')" style="float: right;margin-right: 5%" type="primary">确定
        </el-button>
        <el-button @click="cancelAdd('addVoteRuleForm')" style="margin-left: 600px">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {VoteApi} from "./VoteApi"
  import {Auth} from "../../../../store/modules/auth";
  import {Msg} from "../../../../tools/message";

  export default {
    name: "voteManage",
    data() {

      var validatorTitle = (rule, value, callback) => {
        const CN = /^[\u4e00-\u9fa5]{2,15}$/;
        if (!value) {
          return callback(new Error("标题不能为空"))
        } else {
          if (value.length < 2 || value.length > 15) {
            return callback(new Error("标题数字在2-15个字之间"))
          }
          setTimeout(() => {
            if (CN.test(value)) {
              callback();
            } else {
              callback(new Error("请输入正确的中文标题"))
            }
          }, 100)
        }
      };
      var validatorContent = (rule, value, callback) => {
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (!value) {
          return callback(new Error("内容不能为空"))
        } else {
          if (value.length < 5 || value.length > 200) {
            return callback(new Error("内容在5-200个字之间"))
          }
          setTimeout(() => {
            if (reg.test(value)) {
              callback();
            } else {
              callback(new Error("内容必须包含中文"))
            }
          }, 100)
        }
      };
      var isOptionSameEdit = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('选项不能为空'));
        }
        var count = 0;
        for (var i = 0; i < this.addVoteRuleForm.voteOption.length; i++) {
          if (value != '' && value === this.addVoteRuleForm.voteOption[i].optionContent) {
            count++;
          }
        }
        if (count >= 2) {
          callback(new Error('选项不可以重复'));
        } else {
          callback();
        }
      }
      return {

        searchList: {
          title: '',
          beginTime: '',
          status: null
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        statusOption: [
          {label: '未开始', value: 0}, {label: '进行中', value: 1}, {label: '已结束', value: -1}
        ],
        addVoteDialogFormVisible: false,//添加投票调查弹窗
        viewVoteDialogFormVisible: false,//查看投票
        statusValue: null,
        totalList: 0,
        currentPage: 1,
        totalPage: 0, // 总页数
        pageSize: 10, // 每页条数
        userInfo: {},
        formLabelWidth: '120px',
        voteList: [],
        viewList: [],
        editViewDialog: false,
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        addVoteRuleForm: {
          voteTitle: '',
          voteOption: [{
            optionContent: '',
            option: ''
          }],
          voteTime: [],
          voteContent: '',
        },
        voteOptionList: [{
          optionContent: '',
          option: ''
        }],
        currentRow: {},
        addVoteRules: {
          voteTitle: {
            required: true, validator: validatorTitle, trigger: 'blur'
          },
          voteTime: {
            required: true, message: '请选择开始结束时间', trigger: 'blur'
          },
          voteOption: {
            required: true, message: '请输入选项', trigger: 'blur'
          },
          voteContent: {
            required: true, validator: validatorContent, trigger: 'blur'
          },
        },
        editRules: {
          validator: isOptionSameEdit, trigger: 'blur'
        },

      }
    },
    mounted() {
      this.userInfo = Auth.getUser();
      this.getVoteList();
      // console.log(this.userInfo)
    },
    methods: {
      cancelAdd(formName) {
        this.addVoteDialogFormVisible = false;
        this.resetForm(formName);
      },
      editView(row) {
        console.log(row)
        this.addVoteRuleForm.voteTime = '';
        this.addVoteRuleForm.voteContent = '';
        this.addVoteRuleForm.voteTitle = '';
        this.addVoteRuleForm.voteOption = this.voteOptionList;
        this.currentRow = row;
        this.addVoteDialogFormVisible = true;
        this.editViewDialog = true;
        this.addVoteRuleForm.voteTitle = row.title;
        this.addVoteRuleForm.voteOption = row.list;
        this.addVoteRuleForm.voteContent = row.content;
        this.addVoteRuleForm.voteTime = row.noSubTime.split("*");

        // console.log(this.addVoteRuleForm.voteTime);
        //
        // console.log(row.noSubTime);
        // console.log(this.addVoteRuleForm.voteTime)
      },
      //表单验证
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addVote(formName);
          } else {
            // console.log('error submit!!');
            Msg.error("请根据提示填写正确的数据！")
            return false;
          }
        });
      },
      //添加记录
      addVote(formName) {
        var count = [];
        if (this.addVoteRuleForm.voteOption.length >= 2) {
          for (var i = 0; i < this.addVoteRuleForm.voteOption.length; i++) {
            if (this.addVoteRuleForm.voteOption[i].optionContent === "" || this.addVoteRuleForm.voteOption[i].optionContent === undefined || this.addVoteRuleForm.voteOption[i].optionContent === null) {
              Msg.warn("选项内容不能为空");
              return;
            } else {
              this.addVoteRuleForm.voteOption[i].option = this.options[i];
            }
          }
        } else {
          Msg.warn("选项不能低于两个");
          return;
        }
        //判断是否重复选项
        for (let j = 0; j < this.addVoteRuleForm.voteOption.length; j++) {
          for (let i = j+1; i < this.addVoteRuleForm.voteOption.length; i++) {
            if (this.addVoteRuleForm.voteOption[i].optionContent == this.addVoteRuleForm.voteOption[j].optionContent) {
              Msg.warn("选项不能重复");
              return;
            }
          }
        }
        this.addVoteRuleForm.voteStatus = 0;
        var myDate = new Date();
        myDate = this.dateFtt("yyyy-MM-dd HH:mm:ss", myDate);
        //默认投票的状态为未开始
        var status = 0;
        //如果投票开始时间和现在时间一样，则投票为进行中
        if (myDate.substring(0, myDate.length - 3) == this.addVoteRuleForm.voteTime[0].substring(0, this.addVoteRuleForm.voteTime[0].length - 3)) {
          status = 1;
        }
        console.log(this.addVoteRuleForm.voteTime);
        var data = {
          voteId: this.currentRow.id,
          voteBeginTime: this.addVoteRuleForm.voteTime[0],
          //格式化开始结束时间
          voteEndTime: this.addVoteRuleForm.voteTime[1],
          voteStatus: status,
          organizationId: this.userInfo.organizationId,
          sysUserPartyId: this.userInfo.partyId,
          voteContent: this.addVoteRuleForm.voteContent,
          voteOption: this.addVoteRuleForm.voteOption,
          voteTitle: this.addVoteRuleForm.voteTitle
        }
        if (this.editViewDialog == true) {
          VoteApi.updateVote(data).then(res => {
            this.addVoteRuleForm.voteTime = '';
            this.addVoteRuleForm.voteContent = '';
            this.addVoteRuleForm.voteTitle = '';
            this.addVoteRuleForm.voteOption = this.voteOptionList;
            // console.log(res);
            this.addVoteDialogFormVisible = false;
            this.editViewDialog = false;
            this.resetForm(formName);
            this.getVoteList();

          }).catch(err => {
            // console.log(err)
          })
        } else {
          VoteApi.addVote(data).then(res => {
            this.addVoteRuleForm.voteTime = '';
            this.addVoteRuleForm.voteContent = '';
            this.addVoteRuleForm.voteTitle = '';
            this.addVoteRuleForm.voteOption = this.voteOptionList;
            Msg.success("添加投票调查成功")
            this.addVoteDialogFormVisible = false;
            this.editViewDialog = false;
            this.resetForm(formName);
            this.getVoteList()
          }).catch(err => {
            Msg.error("添加投票调查失败")
          })
        }

        // console.log(this.addVoteRuleForm)
      },
      openViewDialog(row) {
        this.viewVoteDialogFormVisible = true;
        this.viewList = row;
        this.viewList.sum = 0;
        for (var i = 0; i < this.viewList.list.length; i++) {
          this.viewList.sum += parseInt(this.viewList.list[i].optionNumber);
        }
      },
      removeDomain(item) {
        var index = this.addVoteRuleForm.voteOption.indexOf(item)
        if (this.addVoteRuleForm.voteOption[index].id != null || this.addVoteRuleForm.voteOption[index].id != undefined) {
          VoteApi.deleteOption({voteId: this.addVoteRuleForm.voteOption[index].id}).then(res => {
          }).catch(err => {
          })
        }
        if (index > 1) {
          this.addVoteRuleForm.voteOption.splice(index, 1)
        } else {
          Msg.warn("投票不能低于两个选项")
        }
      },
      resetForm(formName) { // 重置表单
        this.$refs[formName].resetFields();
      },
      addDomain() {
        var optionLength = this.addVoteRuleForm.voteOption.length;
        this.addVoteRuleForm.voteOption.push({
          value: '',
          option: ''
        },);
      },
      addOrganizationDialog() {
        this.addVoteRuleForm.voteTime = '';
        this.addVoteRuleForm.voteContent = '';
        this.addVoteRuleForm.voteTitle = '';
        this.addVoteRuleForm.voteOption = this.voteOptionList;
        this.addVoteDialogFormVisible = true
      },
      validTitle() {
        if ((this.searchList.title === '' || this.searchList.title === null) && (this.searchList.beginTime === '' || this.searchList.beginTime === null) && (this.searchList.status === null || this.searchList.status === '')) {
          this.getVoteList();
        }
        // console.log(this.searchList)
      },

      selectByCondition(currentPage) {
        if ((this.searchList.title === '' || this.searchList.title === null)
          && (this.searchList.beginTime === '' || this.searchList.beginTime === null)
          && (this.searchList.status === null || this.searchList.status === '')) {
          Msg.warn("请输入数据进行查询");
          // console.log(this.searchList)
        } else {
          // console.log(this.searchList)
          var data = {
            currentPage: 1,
            organizationId: this.userInfo.organizationId,
            organizationRank: this.userInfo.organizationRank,
            pageSize: this.pageSize,
            status: this.searchList.status,
            time: this.searchList.beginTime,
            title: this.searchList.title
          }
          VoteApi.getVoteList(data).then(res => {
            Msg.success("查询成功");
            // console.log(res)
            this.totalList = res.data.data.total;
            this.voteList = res.data.data.list;
          }).catch(err => {
            Msg.error("查询失败")
          })
        }

      },
      getVoteList() {
        var data = {
          currentPage: 1,
          organizationId: this.userInfo.organizationId,
          organizationRank: this.userInfo.organizationRank,
          pageSize: this.pageSize,
        }
        VoteApi.getVoteList(data).then(res => {
          if (res.data.code == 200) {
            // console.log(res)
            this.totalList = res.data.data.total
            this.voteList = res.data.data.list;
          } else {
            Msg.error(res.data.message);
          }
        }).catch(err => {
          Msg.error(err.msg)
        })
      }
      ,
      turnPage() {
        var data = {
          currentPage: this.currentPage,
          organizationId: this.userInfo.organizationId,
          organizationRank: this.userInfo.organizationRank,
          pageSize: this.pageSize,
          status: this.searchList.status,
          time: this.searchList.beginTime,
          title: this.searchList.title
        }
        VoteApi.getVoteList(data).then(res => {
          if (res.data.code == 200) {
            // console.log(res)
            this.totalList = res.data.data.total
            this.voteList = res.data.data.list;
          } else {
            Msg.error(res.data.message);
          }
        }).catch(err => {
          Msg.error(err.msg)
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.turnPage();
        // this.selectByCondition();
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.turnPage();
        // this.selectByCondition();
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

  .vote-content {
    margin-top: 2%;
    text-indent: 2em;
  }

  .progress-content {
    width: 60%;
    display: inline-block;
    margin-top: 2%;
    margin-bottom: 2%;
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
    width: 56%;
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

  >>> .input__inner {
    width: 95%;
  }
</style>
