<template>
  <div>
    <!--    &lt;!&ndash;面包屑面包屑&ndash;&gt;-->
    <!--    <div class="bread">-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item :to="{ path: '/managementContent' }">基础管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item >党员管理</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->

    <!--导入弹窗-->
    <el-dialog
      class="importPopUp"
      :visible.sync="importPopUpVisible"
      width="35%">
      <div class="import-title">
        <div style="font-weight: bolder; ">导入党员信息</div>
        <a style="color: red" class="downLoadFile-words"
           onclick="window.location.href= 'http://localhost:9090/System/PartyMemberInformationController/downloadFile'">下载模板</a>
      </div>
      <div class="import-file">
        <el-upload ref="upload" style=" margin-left: 30%;"
                   action="http://localhost:9090/System/PartyMemberInformationController/uploadExcel"
                   :limit="1"
                   :auto-upload="false"
                   :on-success="handlePluginSuccess"
                   :on-error="handlePluginError"
                   :on-exceed="exceedFile"
                   v-model="importFile">
          <el-button slot="trigger" type="primary">导入文件</el-button>
        </el-upload>
      </div>
      <div slot="footer" class="importPopUp-footer">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确 定</el-button>
      </div>
    </el-dialog>

    <!--创建弹窗-->
    <el-dialog
      class="createPopUp"
      :visible.sync="createPopUpVisible"
      :before-close="closeCreateForm"
      title="添加党员信息">
      <el-form :model="createMemberForm" :rules="createMemberRules" ref="createMemberForms">
        <div style="display:flex;">
          <div>
            <el-form-item label="姓名" style="display: flex;" prop="name">
              <el-input v-model="createMemberForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电话" style="display: flex;" prop="phoneNumber">
              <el-input v-model="createMemberForm.phoneNumber" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类别" style="display: flex;" prop="category">
              <el-radio-group v-model="createMemberForm.category">
                <el-radio label="1" value=1>教师</el-radio>
                <el-radio label="0" value=0>学生</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="PopRight">
            <el-form-item label="组织" style="display: flex;" prop="organizationName">
              <el-select v-model="createMemberForm.organizationName">
                <el-option v-for="item in organizationList"
                           :key="item.organizationId"
                           :label="item.organizationName"
                           :value="item.organizationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职务" style="display: flex;" prop="postName">
              <el-select v-model="createMemberForm.postName">
                <el-option
                  v-for="item in positions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" style="display: flex;" prop="sex">
              <el-select v-model="createMemberForm.sex">
                <el-option label="男" value=1></el-option>
                <el-option label="女" value=0></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="学号/工号" style="display:flex; width: 50%;" prop="snoOrJobNumber">
          <el-input v-model="createMemberForm.snoOrJobNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="入党时间" style="display:flex; " prop="enterTime">
          <el-date-picker
            v-model="createMemberForm.enterTime"
            type="date"
            placeholder="选择日期"
            :picker-options="createTimePickerOptions"
            style="margin-left: 3px;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="createPopUp-footer">
        <el-button @click="closeCreateForm()">取 消</el-button>
        <el-button type="primary" @click="submitCreateForm('createMemberForms')">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置提醒弹窗-->
    <el-dialog
      class="setRemindPopUp"
      :visible.sync="setRemindPopUpVisible"
      title="设置提醒"
      :before-close="handleCloseRemindPopUp"
      width="55%">
      <el-form :model="setRemindForm" :rules="setRemindRules" ref="setRemindForm">
        <div class="selectPartySort">
          <div class="partySortWords">分类</div>
          <el-form-item prop="partyMeetingSort">
            <el-select v-model="setRemindForm.partyMeetingSort" placeholder="请选择会议类型" style="width:120%;"
                       prop="partyMeetingName">
              <el-option label="党支部委员大会" value="党支部委员大会"></el-option>
              <el-option label="支委会" value="支委会"></el-option>
              <el-option label="党小组会" value="党小组会"></el-option>
              <el-option label="党课" value="党课"/>
              <el-option label="中心组学习" value="中心组学习"></el-option>
              <el-option label="教师政治学习" value="教师政治学习"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20%">
            <el-button type="primary" @click="submitSetRemindForm('setRemindForm')">提交</el-button>
            <el-button type="primary" @click="addMeetingRecord('setRemindForm')">添加记录</el-button>
            <el-button @click="resetSetRemindForm('setRemindForm')">重置</el-button>
          </el-form-item>
        </div>
        <template>
          <div
            v-if="this.setRemindForm.partyMeetingSort === '党支部委员大会' || this.setRemindForm.partyMeetingSort == '党课' || this.setRemindForm.partyMeetingSort == undefined "
            class="selectSeasonPart">
            <div class="left-time-part">
              <div class="first-season">
                <div class="seasonWords">第一季度</div>
                <el-form-item prop="firstSeasonMonth">
                  <el-select v-model="setRemindForm.firstSeasonMonth" placeholder="请选择月" class="month">
                    <el-option label="1月" value=1></el-option>
                    <el-option label="2月" value=2></el-option>
                    <el-option label="3月" value=3></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="firstSeasonDay">
                  <el-input v-model="setRemindForm.firstSeasonDay" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="third-season">
                <div class="seasonWords">第三季度</div>
                <el-form-item prop="thirdSeasonMonth">
                  <el-select v-model="setRemindForm.thirdSeasonMonth" placeholder="请选择月" class="month">
                    <el-option label="7月" value=7></el-option>
                    <el-option label="8月" value=8></el-option>
                    <el-option label="9月" value=9></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="thirdSeasonDay">
                  <el-input v-model="setRemindForm.thirdSeasonDay" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="right-time-part" style="margin-left:5%;">
              <div class="second-season">
                <div class="seasonWords">第二季度</div>
                <el-form-item prop="secondSeasonMonth">
                  <el-select v-model="setRemindForm.secondSeasonMonth" placeholder="请选择月" class="month">

                    <el-option label="4月" value=4></el-option>
                    <el-option label="5月" value=5></el-option>
                    <el-option label="6月" value=6></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="secondSeasonDay">
                  <el-input v-model="setRemindForm.secondSeasonDay" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="forth-season">
                <div class="seasonWords">第四季度</div>
                <el-form-item prop="forthSeasonMonth">
                  <el-select v-model="setRemindForm.forthSeasonMonth" placeholder="请选择月" class="month">
                    <el-option label="10月" value=10></el-option>
                    <el-option label="11月" value=11></el-option>
                    <el-option label="12月" value=12></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="forthSeasonDay">
                  <el-input v-model="setRemindForm.forthSeasonDay" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-else class="selectMonthTime">
            <div class="first-column">
              <div class="month1">
                <div class="monthWords">1月:</div>
                <el-form-item prop="day1">
                  <el-input v-model="setRemindForm.day1" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month5">
                <div class="monthWords">5月:</div>
                <el-form-item prop="day5">
                  <el-input v-model="setRemindForm.day5" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month9">
                <div class="monthWords">9月:</div>
                <el-form-item prop="day9">
                  <el-input v-model="setRemindForm.day9" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="second-column">
              <div class="month2">
                <div class="monthWords">2月:</div>
                <el-form-item prop="day2">
                  <el-input v-model="setRemindForm.day2" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month6">
                <div class="monthWords">6月:</div>
                <el-form-item prop="day6">
                  <el-input v-model="setRemindForm.day6" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month10">
                <div class="monthWords">10月:</div>
                <el-form-item prop="day10">
                  <el-input v-model="setRemindForm.day10" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="third-column">
              <div class="month3">
                <div class="monthWords">3月:</div>
                <el-form-item prop="day3">
                  <el-input v-model="setRemindForm.day3" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month7">
                <div class="monthWords">7月:</div>
                <el-form-item prop="day7">
                  <el-input v-model="setRemindForm.day7" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month11">
                <div class="monthWords">11月:</div>
                <el-form-item prop="day11">
                  <el-input v-model="setRemindForm.day11" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="forth-column">
              <div class="month4">
                <div class="monthWords">4月:</div>
                <el-form-item prop="day4">
                  <el-input v-model="setRemindForm.day4" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month8">
                <div class="monthWords">8月:</div>
                <el-form-item prop="day8">
                  <el-input v-model="setRemindForm.day8" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
              <div class="month12">
                <div class="monthWords">12月:</div>
                <el-form-item prop="day12">
                  <el-input v-model="setRemindForm.day12" placeholder="请输入日" class="day"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-if="this.partyMeetingList.length >0">
            <template>
              <el-table
                :data="this.partyMeetingList"
                style="width: 100%">
                <el-table-column prop="meetingName" label="提醒内容" width="140">
                </el-table-column>
                <el-table-column prop="meetingTime" label="设置时间"></el-table-column>
                <el-table-column label="操作" width="95">
                  <template slot-scope="scope">
                    <div @click="deleteFromPartyMeetingList(scope.row)">&nbsp;删除&nbsp;</div>
                  </template>
                </el-table-column>
              </el-table>
            </template>

          </div>
        </template>

      </el-form>
    </el-dialog>

    <!--编辑弹窗-->
    <el-dialog
      class="UpdatePopUp"
      :visible.sync="UpdatePopUpVisible"
      title="编辑党员信息">
      <el-form :model="updateMemberForm" :rules="updateMemberRules" ref="updateMemberForm">
        <div style="display:flex;">
          <div>
            <el-form-item label="姓名" style="display: flex;" prop="name">
              <el-input v-model="updateMemberForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电话" style="display: flex;" prop="phoneNumber">
              <el-input v-model="updateMemberForm.phoneNumber" placeholder="请输入" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="类别" style="display: flex;" prop="category">
              <el-radio-group v-model="updateMemberForm.category">
                <el-radio :label="1" value=1>教师</el-radio>
                <el-radio :label="0" value=0>学生</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="PopRight">
            <el-form-item label="组织" style="display: flex;" prop="organizationName">
              <el-select v-model="updateMemberForm.organizationId">
                <el-option v-for="item in organizationList"
                           :key="item.organizationId"
                           :label="item.organizationName"
                           :value="item.organizationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职务" style="display: flex;" prop="postName">
              <el-select v-model="updateMemberForm.postId">
                <el-option
                  v-for="item in positions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" style="display: flex;" prop="sex">
              <el-radio-group v-model="updateMemberForm.sex">
                <el-radio :label=1 value=1>男</el-radio>
                <el-radio :label=0 value=0>女</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="学号/工号" style="display:flex; width: 50%;" prop="snoOrJobNumber">
          <el-input v-model="updateMemberForm.snoOrJobNumber" placeholder="请输入" max></el-input>
        </el-form-item>
        <el-form-item label="入党时间" style="display:flex; " prop="enterTime">
          <el-date-picker
            v-model="updateMemberForm.enterTime"
            type="date"
            placeholder="选择日期"
            :picker-options="createTimePickerOptions"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd HH:mm:ss"
            style="margin-left: 3px;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="updatePopUp-footer">
        <el-button @click="closeCreateForm('updateMemberForm')">取 消</el-button>
        <el-button type="primary" @click="updateParty('updateMemberForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog
      class="ViewPopUp"
      :visible.sync="ViewPopUpVisible"
      title="查看党员信息">
      <el-form :model="viewMemberForm" ref="viewMemberForm">
        <div style="display:flex;">
          <div>
            <el-form-item label="姓名" style="display: flex;" prop="name">
              <el-input v-model="viewMemberForm.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="电话" style="display: flex;">
              <el-input v-model="viewMemberForm.contact" readonly></el-input>
            </el-form-item>
            <el-form-item label="类别" style="display: flex;">
              <el-input v-model="viewMemberForm.classification" readonly></el-input>
            </el-form-item>
          </div>
          <div class="PopRight">
            <el-form-item label="组织" style="display: flex;" porp="academy">
              <el-input v-model="viewMemberForm.organizationName" readonly></el-input>
            </el-form-item>
            <el-form-item label="职务" style="display: flex;" porp="position">
              <el-input v-model="viewMemberForm.postName" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别" style="display: flex;" porp="sex">
              <el-input v-model="viewMemberForm.sex" readonly></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="学号/工号" style="display:flex; width: 50%;" porp="jobId">
          <el-input v-model="viewMemberForm.number" readonly></el-input>
        </el-form-item>
        <el-form-item label="入党时间" style="display:flex; ">
          <el-input v-model="viewMemberForm.partyJoinTime" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="ViewPopUpVisible = false">返 回</el-button>
      </span>
    </el-dialog>

    <!--功能分区-输入姓名/选择职务->进行查询  引进/创建/设置提醒-->
    <div class="function-part">
      <div class="inputName-box">
        <div class="function-words">姓名:</div>
        <el-input v-model="inputName" placeholder="请输入内容"></el-input>
      </div>
      <div class="selectPosition-box">
        <div class="function-words">职务:</div>
        <div>
          <el-select v-model="selectPosition" placeholder="请选择职务">
            <el-option
              v-for="item in positions"
              :key="item.postId"
              :label="item.postName"
              :value="item.postName">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="buttons-box">
        <el-button type="primary" @click="searchMemberInf()">查询</el-button>
        <el-button type="primary" @click="importMemberInf()">导入</el-button>
        <el-button type="primary" @click="createNewMemberInf()">创建</el-button>
        <el-button type="primary" @click="setMoreReminders">设置提醒</el-button>
      </div>
    </div>

    <!--党员列表显示-->
    <div class="main-content">
      <el-table :data="partyMemberList" @selection-change="handleSelectionChange">
        <el-table-column fixed align="center" type="selection" v-model="checked"></el-table-column>
        <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="postName" label="职务" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatterTableSex"></el-table-column>
        <el-table-column prop="number" label="工号/学号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="partyJoinTime" label="入党时间"></el-table-column>
        <el-table-column prop="organizationName" label="组织" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="contact" label="联系方式" width="120%"></el-table-column>
        <el-table-column prop="classification" label="类别" :formatter="formatterTableClassification"></el-table-column>
        <el-table-column label="操作" width="200%">
          <template slot-scope="scope">
            <div style="display: flex;">
              <div @click="updateDetails(scope.row)" class="operate-words">&nbsp;编辑&nbsp;</div>
              <!--<div @click="deleteDetails(scope.row.partyId)" class="operate-words">&nbsp;删除&nbsp;</div>-->
              <div @click="viewDetails(scope.row.partyId)" class="operate-words">&nbsp;查看&nbsp;</div>
              <div @click="setSingleRemind(scope.row.partyId)" class="operate-words">&nbsp;设置提醒&nbsp;</div>
            </div>
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
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPartyMember">
      </el-pagination>
    </div>

  </div>
</template>

<script>
    import {Auth} from "../../../store/modules/auth";
    import {partyMemberJs} from "./partyMemberJs";
    import {Msg} from "../../../tools/message";

    export default {
        name: "partyMember",
        data() {
            var regChinese = /^[\u4E00-\u9FA5]+$/;//验证输入的是否全部是中文
            var regPhoneNumber = /^1(3|4|5|6|7|8|9)[0-9]{9}$/; //验证输入的电话好嘛必须是13 以上的开头
            var regNumber = /^[0-9]*$/;  // 定义正则表达式
            //姓名的表单验证
            var rule_name = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('姓名不能为空!!'))
                }
                if (!regChinese.test(value)) {
                    return callback(new Error('请输入汉字!!'))
                }
                return callback();
            };

            //电话的表单验证
            var rule_phoneNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('电话号码不能为空!!'))
                }
                if (!regPhoneNumber.test(value)) {
                    return callback(new Error('请重新输入电话号码!!'));
                }
                return callback();
            };

            //学号/工号的表单验证
            var rule_snoOrJobNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('学号/工号不能为空!!'));
                }
                if (!regNumber.test(value)) {
                    return callback(new Error('学号/工号只能为数字!!'));
                }

                return callback();
            };

            //只能输入不超过两位的数字
            var rule_dayIsNum = (rule, value, callback) => {
                const num = /^[0-9]*$/;
                if (!value) {
                    callback(new Error('请输入日期'));
                } else if (!num.test(value) || value.length > 2 || value < 1) {
                    callback(new Error('输入错误'));
                } else {
                    callback();
                }
                return callback;
            };
            //验证第一季度 的日期输入
            var rule_firstMonthDay = (rule, value, callback) => {
                if (this.setRemindForm.firstSeasonMonth == 2 && value > 27) {
                    callback(new Error('此月只有27天'));
                } else if ((this.setRemindForm.firstSeasonMonth == 1 || this.setRemindForm.firstSeasonMonth == 3) && value > 31) {
                    callback(new Error('此月只有31天'));
                } else {
                    callback();
                }
                return callback;
            };

            //验证第四季度 的日期输入
            var rule_secondMonthDay = (rule, value, callback) => {
                if (this.setRemindForm.secondSeasonMonth == 5 && value > 31) {
                    callback(new Error('此月只有31天'));
                } else if ((this.setRemindForm.secondSeasonMonth == 4 || this.setRemindForm.secondSeasonMonth == 4) && value > 30) {
                    callback(new Error('此月只有30天'));
                } else {
                    callback();
                }
                return callback;
            };

            //验证第三季度 的日期输入
            var rule_thirdMonthDay = (rule, value, callback) => {
                if (this.setRemindForm.thirdSeasonMonth == 9 && value > 30) {
                    callback(new Error('此月只有30天'));
                } else if ((this.setRemindForm.thirdSeasonMonth == 7 || this.setRemindForm.thirdSeasonMonth == 8) && value > 31) {
                    callback(new Error('此月只有31天'));
                } else {
                    callback();
                }
                return callback;
            };

            var rule_forthMonthDay = (rule, value, callback) => {
                if (this.setRemindForm.forthSeasonMonth == 11 && value > 30) {
                    callback(new Error('此月只有30天'));
                } else if ((this.setRemindForm.forthSeasonMonth == 10 || this.setRemindForm.forthSeasonMonth == 12) && value > 31) {
                    callback(new Error('此月只有31天'));
                } else {
                    callback();
                }
                return callback;
            };

            //1 3 5 7 8 10  12有31天
            var rule_day31 = (rule, value, callback) => {
                if (value > 31) {
                    callback(new Error('此月只有31天'));
                } else {
                    callback();
                }
                return callback;
            };

            // 验证 4 6 9 11 月有30天
            var rule_day30 = (rule, value, callback) => {
                if (value > 30) {
                    callback(new Error('此月只有30天'));
                } else {
                    callback();
                }
                return callback;
            };

            //验证2月有 27 天
            var rule_day27 = (rule, value, callback) => {
                if (value > 27) {
                    callback(new Error('此月只有27天'));
                } else {
                    callback();
                }
                return callback;
            };


            return {
                userInfo: Auth.getUser(),//登录的用户信息
                inputName: "",//功能分区-input框-输入名字
                selectPosition: "",//功能分区-选择框-选择职务
                positions: [],
                organizationList: [],
                isQuery: '',//表示是否返回的查询数据
                partyMemberList: [],//党员信息列表

                checked: false,//多选-选择框
                checkObj: [],

                createPopUpVisible: false,//创建弹窗的visible属性
                createMemberForm: {
                    category: "",
                    enterTime: "",
                    name: "",
                    organizationName: "",
                    partyId: "",
                    phoneNumber: "",
                    postName: '',
                    sex: null,
                    snoOrJobNumber: ''
                },//添加党员信息的对象
                createMemberRules: {
                    name: [
                        {required: true, validator: rule_name, trigger: 'change'}
                    ],
                    phoneNumber: [
                        {required: true, validator: rule_phoneNumber, trigger: 'blur'}
                    ],
                    snoOrJobNumber: [
                        {required: true, validator: rule_snoOrJobNumber, trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择类别', trigger: 'change'}
                    ],
                    postName: [
                        {required: true, message: '请选择职务', trigger: 'change'}
                    ],
                    enterTime: [
                        {required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    organizationName: [
                        {required: true, message: '请选择组织', trigger: 'change'}
                    ]
                },
                createTimePickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },//只能选择今天以前的日期


                importPopUpVisible: false,//导入弹窗的visible属性
                importFileName: "",//导入文件的名字
                importFile: "",//导入的文件

                UpdatePopUpVisible: false,//编辑弹窗的visible属性
                updateMemberForm: {
                    category: '',
                    enterTime: '',
                    name: '',
                    organizationName: '',
                    partyId: '',
                    phoneNumber: '',
                    postName: '',
                    postId: '',
                    sex: null,
                    snoOrJobNumber: '',
                    partyOrgPOstId: '',
                    organizationId: ''
                },//获取需要编辑的党员信息
                updateMemberRules: {
                    name: [
                        {required: true, validator: rule_name, trigger: 'change'}
                    ],
                    phoneNumber: [
                        {required: true, validator: rule_phoneNumber, trigger: 'blur'}
                    ],
                    snoOrJobNumber: [
                        {required: true, validator: rule_snoOrJobNumber, trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择类别', trigger: 'change'}
                    ],
                    postName: [
                        {required: true, message: '请选择职务', trigger: 'change'}
                    ],
                    enterTime: [
                        {required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    organizationName: [
                        {required: true, message: '请选择组织', trigger: 'change'}
                    ]
                },

                ViewPopUpVisible: false,///查看弹窗的visible属性
                viewMemberForm: {},//获取需要查看的党员信息

                currentPage: 1,
                pageSize: 5,
                totalPartyMember: 0,//总共的党员用户数量

                //设置提醒弹窗
                setRemindPopUpVisible: false,
                setRemindForm: {
                    partyMeetingSort: "",
                    firstSeasonMonth: "",
                    secondSeasonMonth: "",
                    thirdSeasonMonth: "",
                    forthSeasonMonth: "",
                },
                setRemindRules: {
                    partyMeetingSort: [
                        {required: true, message: '请选择会议分类', trigger: 'blur'},
                    ],
                    firstSeasonMonth: [
                        {required: true, message: '请选择月份', trigger: 'change'},
                    ],
                    secondSeasonMonth: [
                        {required: true, message: '请选择月份', trigger: 'change'}
                    ],
                    thirdSeasonMonth: [
                        {required: true, message: '请选择月份', trigger: 'change'}
                    ],
                    forthSeasonMonth: [
                        {required: true, message: '请选择月份', trigger: 'change'}
                    ],
                    firstSeasonDay: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_firstMonthDay, trigger: 'blur'}
                    ],
                    secondSeasonDay: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_secondMonthDay, trigger: 'blur'}
                    ],
                    thirdSeasonDay: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_thirdMonthDay, trigger: 'blur'}
                    ],
                    forthSeasonDay: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_forthMonthDay, trigger: 'blur'}
                    ],
                    day1: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day2: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day27, trigger: 'blur'}
                    ],
                    day3: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day4: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day30, trigger: 'blur'}
                    ],
                    day5: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day6: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day30, trigger: 'blur'}
                    ],
                    day7: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day8: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day9: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day30, trigger: 'blur'}
                    ],
                    day10: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                    day11: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day30, trigger: 'blur'}
                    ],
                    day12: [
                        {required: true, validator: rule_dayIsNum, trigger: 'blur'},
                        {required: true, validator: rule_day31, trigger: 'blur'}
                    ],
                },
                partyMeetingList: [],
                getRemindMemberList: [],//被选中要设置的会议提醒的党员id列表
                remindsListToDataBase: [],
                reminderSingleTime: {
                    time: '',
                },
                reminderSingle: {
                    list: [],
                    meetingName: "",
                    partyId: "",
                }
            }

        },

        methods: {
            handleCreateClose() {
                this.$refs['createMemberRules'].clearValidate();
            },
            cancelUpload() {
                this.$refs.upload.clearFiles();
                this.importPopUpVisible = false;
            },

            exceedFile() {
                Msg.error("只能上传一个文件哦");
            },
            handlePluginSuccess(res) {
                this.importFileName = res;
                if (res.code == 200) {
                    this.$message = ({
                        type: 'success',
                        message: res.message
                    })
                } else {
                    this.$message = ({
                        type: 'warning',
                        message: res.message
                    })
                }
                this.importFile = "";


            },
            handlePluginError() {
                Msg.error("上传失败，请重新上传");
            },

            updateParty(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        partyMemberJs.updatePartyInfo(this.updateMemberForm).then(res => {
                            this.getPartyMemberList();
                            this.UpdatePopUpVisible = false;
                        }).catch(err => {
                        })
                    }
                });
                //表单验证
            },
            getPost() {
                partyMemberJs.getPost({}).then(res => {
                    this.positions = res.data.data;
                }).catch(err => {

                })
            },
            getOrganization() {
                partyMemberJs.getOrganization({}).then(res => {
                    this.organizationList = res.data.data;
                }).catch(err => {

                })
            },
            //预览文件
            uploadExcel() {
                this.importPopUpVisible = false;
                this.$refs.upload.submit();
                this.getPartyMemberList();
                this.$refs.upload.clearFiles();
                //
            },
            //对单个党员进行编辑操作
            updateDetails(row) {
                // console.log(row)
                this.updateMemberForm.partyId = row.partyId;
                this.updateMemberForm.category = row.classification;
                this.updateMemberForm.enterTime = row.partyJoinTime;
                this.updateMemberForm.organizationName = row.organizationName;
                this.updateMemberForm.name = row.name;
                this.updateMemberForm.phoneNumber = row.contact;
                this.updateMemberForm.postName = row.postName;
                this.updateMemberForm.sex = row.sex;
                this.updateMemberForm.snoOrJobNumber = row.number;
                this.updateMemberForm.partyOrgPOstId = row.spopId;
                this.updateMemberForm.organizationId = row.organizationId;
                this.updateMemberForm.postId = row.postId;
                this.UpdatePopUpVisible = true;
                this.getOrganization();
            },


            //对单个党员进行查看详情操作 ----已完成
            viewDetails(id) {
                for (var i = 0; i < this.partyMemberList.length; i++) {
                    if (id === this.partyMemberList[i].partyId) {
                        this.viewMemberForm = this.partyMemberList[i];
                    }
                }

                if (this.viewMemberForm.classification == 1) {
                    this.viewMemberForm.classification = "老师";
                } else {
                    this.viewMemberForm.classification = "学生";
                }

                if (this.viewMemberForm.sex == 1) {
                    this.viewMemberForm.sex = "男";
                } else {
                    this.viewMemberForm.sex = "女";
                }

                this.ViewPopUpVisible = true;
            },

            //重置提醒弹窗---已对完
            resetSetRemindForm(formName) {
                this.$refs[formName].resetFields();
                this.partyMeetingList = [];
            },

            //删除会议列表信息中的一条记录---已对完
            deleteFromPartyMeetingList(row) {
                for (var i = 0; i < this.partyMeetingList.length; i++) {
                    if (row.meetingName === (this.partyMeetingList[i].meetingName)) {
                        this.partyMeetingList.splice(i, 1);
                        console.log("删除成功")
                    }
                }

            },

            //根据选的的会议类型，和时间 生成记录  动态显示 ---已对完
            addMeetingRecord(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //判断是否有重复的会议提醒
                        if (this.partyMeetingList.length > 0) {
                            for (var i = 0; i < this.partyMeetingList.length; i++) {
                                if (this.setRemindForm.partyMeetingSort === (this.partyMeetingList[i].meetingName)) {
                                    this.partyMeetingList.splice(i, 1);
                                }
                            }
                        }

                        var meetingTimeInf;
                        console.log(this.setRemindForm.partyMeetingSort);
                        if (this.setRemindForm.partyMeetingSort === "党支部委员大会" || this.setRemindForm.partyMeetingSort === "党课") {
                            var firstSeasonTime = this.setRemindForm.firstSeasonMonth + "-" + this.setRemindForm.firstSeasonDay + ",";
                            var secondSeasonTime = this.setRemindForm.secondSeasonMonth + "-" + this.setRemindForm.secondSeasonDay + ",";
                            var thirdSeasonTime = this.setRemindForm.thirdSeasonMonth + "-" + this.setRemindForm.thirdSeasonDay + ",";
                            var forthSeasonTime = this.setRemindForm.forthSeasonMonth + "-" + this.setRemindForm.forthSeasonDay;
                            meetingTimeInf = firstSeasonTime + secondSeasonTime + thirdSeasonTime + forthSeasonTime;
                        } else {
                            var month1 = "1-" + this.setRemindForm.day1 + ",";
                            var month2 = "2-" + this.setRemindForm.day2 + ",";
                            var month3 = "3-" + this.setRemindForm.day3 + ",";
                            var month4 = "4-" + this.setRemindForm.day4 + ",";
                            var month5 = "5-" + this.setRemindForm.day5 + ",";
                            var month6 = "6-" + this.setRemindForm.day6 + ",";
                            var month7 = "7-" + this.setRemindForm.day7 + ",";
                            var month8 = "8-" + this.setRemindForm.day8 + ",";
                            var month9 = "9-" + this.setRemindForm.day9 + ",";
                            var month10 = "10-" + this.setRemindForm.day10 + ",";
                            var month11 = "11-" + this.setRemindForm.day11 + ",";
                            var month12 = "12-" + this.setRemindForm.day12;
                            meetingTimeInf = month1 + month2 + month3 + month4 + month5 + month6 + month7 + month8 + month9 + month10 + month11 + month12;
                        }
                        this.partyMeetingList.push({
                            meetingName: this.setRemindForm.partyMeetingSort,
                            meetingTime: meetingTimeInf
                        });

                        console.log("jianglaoban");
                        console.log(this.setRemindForm.firstSeasonMonth);
                        this.$refs['setRemindForm'].resetFields();
                        this.$refs['setRemindForm'].clearValidate();
                        console.log(this.setRemindForm.firstSeasonMonth + "copy");

                    } else {
                        this.$refs['setRemindForm'].resetFields();
                        this.$refs['setRemindForm'].clearValidate();
                        return false;
                    }
                });
            },

            //得到单个党员id---已对完
            setSingleRemind(partyId) {
                this.getRemindMemberList[0] = partyId;
                this.setRemindPopUpVisible = true;
            },


            //根据多选框选中情况-获得选中  的被设置党员id---已对完
            setMoreReminders() {
                //需要选中要设置的党员
                if (this.checkObj.length == 0) {
                    this.$message({
                        message: '请选择设置对象',
                        type: 'warning'
                    });
                    return;
                }
                //获得批量审核稿件的id
                for (var i in this.checkObj) {
                    this.getRemindMemberList[i] = this.checkObj[i].partyId;
                }
                this.setRemindPopUpVisible = true;
            },

            //发送提醒结果---已对完
            submitSetRemindForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addMeetingRecord(formName);
                        this.getListToDataBase();
                        partyMemberJs.setRemindByIdList(this.remindsListToDataBase)
                            .then(res => {
                                this.$message({
                                    message: res.data.message,
                                    type: 'info'
                                });
                                this.$refs['setRemindForm'].resetFields();//清空表单
                                this.partyMeetingList = [];
                                this.remindsListToDataBase = [];
                                this.setRemindPopUpVisible = false;
                            });

                    }
                });
            },

            //整理要传到后台的提醒内容---已对完
            getListToDataBase() {
                var index = 0;
                for (var i = 0; i < this.getRemindMemberList.length; i++) {
                    for (var j = 0; j < this.partyMeetingList.length; j++) {
                        this.reminderSingle.partyId = this.getRemindMemberList[i];
                        this.reminderSingle.meetingName = this.partyMeetingList[j].meetingName;
                        var timeList = this.partyMeetingList[j].meetingTime.split(',');
                        var time = new Date().getFullYear();
                        for (var t = 0; t < timeList.length; t++) {
                            this.reminderSingleTime.time = time + "-" + JSON.parse(JSON.stringify(timeList[t]));
                            this.reminderSingle.list[t] = JSON.parse(JSON.stringify(this.reminderSingleTime));
                        }
                        this.remindsListToDataBase.push(JSON.parse(JSON.stringify(this.reminderSingle)));
                    }
                }
                console.log(this.remindsListToDataBase)

            },

            //功能分区-查询党员信息
            searchMemberInf() {
                if (this.inputName == "" && this.selectPosition == "") {
                    this.$message({
                        message: '请输入查询条件',
                        type: 'warning'
                    });
                } else {
                    console.log("wei输入姓名，查职务");
                    var data = {
                        currentPage: this.currentPage,
                        currentUserOrganizationId: this.userInfo.organizationId,
                        pageSize: this.pageSize,
                        partyName: this.inputName,
                        postName: this.selectPosition,
                        rank: this.userInfo.organizationRank
                    }
                    partyMemberJs.getPartyMemberInf(data).then(
                        res => {
                            if (res.data.code == 404) {
                                this.$message({type: 'warning', message: res.data.message})
                            } else {
                                this.partyMemberList = res.data.data.list;
                                this.totalPartyMember = res.data.data.total;
                                this.query = true;
                                this.afterQueryList();
                            }
                        })
                }
            },

            //在调用完查询接口后--判断是否有符合查询结果的党员信息
            afterQueryList() {
                if (this.partyMemberList.length == 0) {
                    alert("未找到满足查询的条件的党员信息!!!");
                }
            },

            //功能分区-引进党员信息/引进模板
            importMemberInf() {
                this.importFile = '';
                this.importPopUpVisible = true;
            },

            //功能分区-创建新党员信息
            createNewMemberInf() {
                this.createPopUpVisible = true;
                if (this.positions == '') {
                    this.getPost();
                }
                this.getOrganization();

            },


            //显示党员列表信息内容---已对完
            getPartyMemberList() {
                console.log(this.userInfo);
                partyMemberJs.getPartyMemberInf({
                    currentPage: this.currentPage, pageSize: this.pageSize,
                    currentUserOrganizationId: this.userInfo.organizationId
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            this.partyMemberList = res.data.data.list;
                            this.totalPartyMember = res.data.data.total;
                        } else if (res.data.code === 403) {
                            Msg.error('权限不足');
                        } else {
                            Msg.error('网络繁忙');
                        }

                    }).catch(err => {
                    Msg.error('网络繁忙');
                });
            },

            //清楚表单验证
            clearValidate(formName) {
                this.$refs[formName].clearValidate();
            },


            //创建弹窗--提交新增的党员信息
            submitCreateForm(formName) {
                console.log(this.createMemberForm)
                console.log("xxx")
                this.$refs[formName].validate((valid) => {
                    // console.log("zzz")
                    if (valid) {
                        var sex = parseInt(this.createMemberForm.sex);
                        this.createMemberForm.sex = sex;
                        partyMemberJs.addPartyMember(this.createMemberForm).then(res => {
                            // console.log(res);
                            this.getPartyMemberList();
                            this.createPopUpVisible = false;
                        }).catch(err => {
                        });
                    }
                });
            },
            //关闭创建弹窗时操作
            closeCreateForm() {
                this.createPopUpVisible = false;
                this.UpdatePopUpVisible = false;
                if (this.$refs['createMemberForms'] != undefined) {
                    this.$refs['createMemberForms'].resetFields();
                    this.clearValidate('createMemberForms');
                }
                if (this.$refs['updateMemberForm'] != undefined) {
                    this.$refs['updateMemberForm'].resetFields();
                    this.clearValidate('updateMemberForm');
                }
            },


            //校正党员列表性别显示
            formatterTableSex(row, column, cellvalue) {
                var sex;
                if (cellvalue) {
                    sex = "男";
                } else {
                    sex = "女";
                }
                return sex;
            },
            //
            formatterTableClassification(row, column, cellvalue) {
                var type;
                if (cellvalue) {
                    type = "教师";
                } else {
                    type = "学生";
                }
                return type;
            },

            //获取多选框中选中的字
            handleSelectionChange(val) {
                this.checkObj = val;
            },

            //每条多少页--且判断是全部信息的翻页--还是从查询时的翻页
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.isQuery) {
                    this.searchMemberInf();
                } else {
                    this.getPartyMemberList();
                }
            },

            //这是第几页--且判断是全部信息的翻页--还是从查询时的翻页
            handleCurrentChange(val) {
                this.currentPage = val;
                if (this.isQuery) {
                    this.searchMemberInf();
                } else {
                    this.getPartyMemberList();
                }
            },
            handleCloseRemindPopUp() {
                this.$refs['setRemindForm'].resetFields();
                this.partyMeetingList = [];
                this.setRemindPopUpVisible = false;
            },

        },
        mounted() {
            this.getPartyMemberList();
            this.getPost();
        }
    }
</script>

<style scoped>
  /**功能分区css**/
  .function-part, .buttons-box, .selectPosition-box, .inputName-box {
    display: flex;
    align-items: center;
  }

  .function-part {
    margin: 2% 0 2% 0;
  }

  .function-words {
    width: 80px;
    font-size: 14px;
  }

  .selectPosition-box, .buttons-box {
    margin-left: 2%;
  }

  .operate-words, .downLoadFile-words {
    color: red;
  }

  .operate-words, .downLoadFile-words:hover {
    cursor: pointer;
  }

  /**创建弹窗的css**/
  .PopRight {
    margin-left: 30px;
  }

  /**导入弹窗的css**/
  .import-title, .import-file {
    display: flex;
    align-items: center;
  }

  .import-title {
    width: 86%;
    margin: -6% 0 0 3%;
    justify-content: space-between;
  }

  .import-file {
    margin-top: 6%;
  }

  .import-file-title {
    width: 20%;
  }

  .import-file-input {
    width: 50%;
    margin-right: 4%;
  }

  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  /*  设置提醒弹窗css  */
  .selectPartySort, .selectSeasonPart, .selectMonthTime, .first-season, .third-season, .second-season, .forth-season,
  .month1, .month2, .month3, .month4, .month5, .month6, .month7, .month8, .month9, .month10, .month11, .month12 {
    display: flex;
  }

  .selectMonthTime {
    justify-content: space-between;
  }

  .month, .day {
    width: 110px;
    margin-left: 20px;
  }

  .partySortWords {
    padding-top: 1.5%;
  }

  .seasonWords {
    padding-top: 3.5%;
  }

  .monthWords {
    padding-top: 6%;
  }

  >>> .el-button--primary {
    color: #FFF;
    background-color: #ff0000;
    border-color: #ff0000;
  }


</style>
