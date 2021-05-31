<template>
  <div style="width:100%;margin:0 auto;">
    <!--    <div class="nav-top">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item>党建服务</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>志愿活动</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>活动审核管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>内容：</span>
        <el-input placeholder="请输入" clearable class="input_box" size="medium" v-model="searchList.content"></el-input>
      </div>

      <div class="input-content">
        <span>状态：</span>
        <el-select v-model="searchList.approvalState" placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="button-flex">
        <el-button type="primary" style="margin-left: 2%" @click="keywordSearchVolunteer">查询</el-button>
        <el-button type="primary" style="margin-left: 20%" @click="examination">审核</el-button>
      </div>
    </div>
    <el-table :data="activityVolunteers"
              :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="活动标题" prop="activityTitle" :show-overflow-tooltip="true"
                       align="center" width="130px"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="活动内容" prop="activityContent" align="center"
                       width="130px;"></el-table-column>
      <el-table-column label="发起人" prop="activitySponsor" align="center"></el-table-column>
      <el-table-column label="身份" prop="activitySponsorIdentity" align="center"></el-table-column>
      <el-table-column label="投稿时间" prop="submissionTime" align="center">
      </el-table-column>
      <el-table-column label="审核状态" prop="approvalState" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.approvalState==0" style="color: red">未审核</span>
          <span v-else-if="scope.row.approvalState==-1">未通过</span>
          <span v-else-if="scope.row.approvalState==1">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="reviewer" align="center">
      </el-table-column>
      <el-table-column label="审核时间" prop="reviewTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" style="color: red" @click="examination1(scope.row)"
                     v-if="scope.row.approvalState==0">审核
          </el-button>
          <el-button type="text" style="color: red" v-if="scope.row.approvalState ==0">|</el-button>
          <el-button size="small" type="text" style="color: red" @click="toCheck(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes,jumper"
        :total="totalPage">
        <span>第{{currentPage}}/{{Math.ceil(totalPage/pageSize)}}页</span>
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import {CheckActivityjs} from "./checkActivityjs";
    import {Msg} from "../../../../tools/message";

    export default {
        name: "registerActivity",
        data() {
            return {
                activityVolunteers: [],
                currentPage: 1,
                totalPage: 0,
                pageSize: 5,
                statusOption: [{label: '全部状态', value: ''}, {label: '未审核', value: '0'}, {label: '未通过', value: '-1'}],
                searchList: {approvalState: '', content: ''},
                examines: [],
                selectedActivityId: [],
                approvalState: [],//多选审核之前用来装多选的审核状态
                isCanApproval: true,//状态 是否可以审核
                registerList: {}
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
                CheckActivityjs.getActivityByPage({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    this.activityVolunteers = res.data.data
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                CheckActivityjs.getActivityByPage({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    this.activityVolunteers = res.data.data
                })
            },
            toCheck(val) {
                // console.log(val)
                sessionStorage.setItem("volunteer", JSON.stringify(val));
                this.$router.push({path: '/checkActivityDetail'})
            },
            keywordSearchVolunteer() {//关键字查询
                this.searchList.currentPage = this.currentPage;
                this.searchList.pageSize = this.pageSize;
                console.log(this.searchList);
                CheckActivityjs.keywordSearchVolunteer(this.searchList).then(res => {
                    this.totalPage = res.data.data.length;
                    this.activityVolunteers = res.data.data
                })
            },

            handleSelectionChange(val) {//改变选中状态
                this.approvalState = [];//清空选中的状态
                this.isCanApproval = true;//复原是否可以审核
                this.selectedActivityId = [];
                this.examines = val;
                for (let i = 0; i < this.examines.length; i++) {
                    this.selectedActivityId.push(this.examines[i].id)
                    this.approvalState.push(this.examines[i].approvalState)
                }
            },
            examination() {//审核
                // console.log(this.approvalState)
                if (this.approvalState == '') {
                    alert("请选择内容进行审核！")
                } else {
                    let that = this;
                    for (let i = 0; i < this.approvalState.length; i++) {
                        if (this.approvalState[i] != 0)
                            this.isCanApproval = false;//不能进行审核
                    }
                    if (!this.isCanApproval) {//审核状态为false
                        alert("请选择没有进行审核的数据进行审核！")
                    } else {//审核状态为true
                        this.$confirm("请您进行审核", "审核", {
                            confirmButtonText: "通过",
                            cancelButtonText: "不通过",
                            type: 'warning',
                            center: true
                        }).then(() => {
                            CheckActivityjs.examine({
                                id: that.selectedActivityId,
                                approvalState: 1
                            }).then(res => {

                            });
                            this.$message({
                                type: 'success',
                                message: '审核通过'
                            });
                            location.reload();
                        }).catch(() => {
                            CheckActivityjs.examine({
                                id: that.selectedActivityId,
                                approvalState: -1
                            }).then(res => {

                            });
                            this.$message({
                                type: 'info',
                                message: '审核未通过'
                            });
                            location.reload();
                        })
                    }
                }
            },
            examination1(Info) {
                this.selectedActivityId = []
                this.selectedActivityId.push(Info.id)
                let that = this;
                this.$confirm("请您进行审核", "审核", {
                    confirmButtonText: "通过",
                    cancelButtonText: "不通过",
                    type: 'warning',
                    center: true
                }).then(() => {
                    CheckActivityjs.examine({
                        id: that.selectedActivityId,
                        approvalState: 1
                    }).then(res => {

                    });
                    this.$message({
                        type: 'success',
                        message: '审核通过'
                    });
                    location.reload();
                }).catch(() => {
                    CheckActivityjs.examine({
                        id: that.selectedActivityId,
                        approvalState: -1
                    }).then(res => {

                    });
                    this.$message({
                        type: 'info',
                        message: '审核未通过'
                    });
                    location.reload();
                })
            }
        },
        created() {
            CheckActivityjs.getActivityByPage({
                currentPage: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                this.activityVolunteers = res.data.data
                if (res.data.code === 403) {
                    Msg.error('权限不足');
                }

            }).catch(err => {
                Msg.error('网络繁忙');
            });

            CheckActivityjs.getTotalPage().then(res => {

                this.totalPage = res.data.data
                if (res.data.code === 403) {
                    Msg.error('权限不足');
                }

            }).catch(err => {
                Msg.error('网络繁忙');
            })
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
    width: 210px;
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
</style>
