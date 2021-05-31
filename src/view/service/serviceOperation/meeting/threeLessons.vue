<template>
  <div>
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/three' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>三会一课</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="headerEdit" >
      <div>
        <span>内容：</span><el-input placeholder="请输入" v-model="input"  clearable></el-input>
      </div>
      <div>
        <span>发布时间：</span>
        <el-date-picker v-model="select_checkTime" type="date"  placeholder="选择日期"></el-date-picker>
      </div>
      <div>
        <span>类别：</span>
        <el-select v-model="select_type" placeholder="请选择" clearable>
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="danger" @click="getThreeSessionOneClassList()">查询</el-button>
      <el-button type="danger" @click="postThree()">发布</el-button>
      <el-button type="danger" @click="createThree()">创建</el-button>
    </div>

    <div class="table">
      <el-table :data="threeOneList"  :cell-style="rowClass" :header-cell-style="headClass" @selection-change="handleSelectionChange" style="width: 100%;" >
        <el-table-column fixed align="center" type="selection" :selectable="selectTable" v-model="checked"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" width="180px" ></el-table-column>
        <el-table-column  prop="meetingCategory" label="类别"  width="100px">
         <template slot-scope="scope">
           <span v-if="scope.row.meetingCategory==1">党委会</span>
           <span v-if="scope.row.meetingCategory==2">委员会</span>
           <span v-if="scope.row.meetingCategory==3">小组会</span>
           <span v-if="scope.row.meetingCategory==4">党课</span>
         </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="organizationName" label="组织" ></el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" >
          <template slot-scope="scope">
            <span v-if="scope.row.meetingStatus!=1">-</span>
            <span v-else>{{scope.row.releaseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetingEditorName" label="编辑人" width="80px"></el-table-column>
        <el-table-column prop="meetingStatus" label="发布状态" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.meetingStatus == 1">已发布</span>
            <span v-if="scope.row.meetingStatus == 0">预览</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetingTime" label="会议时间" >
          <template slot-scope="scope">
            <span v-if="scope.row.meetingStatus!=1">-</span>
            <span v-else>{{scope.row.meetingTime}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作"  >
          <template slot-scope="scope" class="edit">
            <span style="cursor: pointer;color: #F56C6C;" @click="viewThreeOneDetails(scope.row.id)">查看</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="deleteItem(scope.row)" v-if="scope.row.meetingEditorId == userInformation.partyId">删除</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="updateThreeOneDetail(scope.row)" v-if="scope.row.meetingEditorId == userInformation.partyId && scope.row.meetingStatus == 0">编辑</span>
            <span style="cursor: pointer;;color: #F56C6C;" @click="viewSummer(scope.row.id)"
                  v-if="scope.row.minutesMeetingId != null  && scope.row.meetingEditorId != userInformation.partyId">查看纪要</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="updateSummary(scope.row.id)"
                  v-if=" scope.row.minutesMeetingId != null
                  && scope.row.meetingEditorId == userInformation.partyId">编辑纪要</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="insertSummary(scope.row)"
                  v-if="scope.row.meetingEditorId == userInformation.partyId
                   && scope.row.minutesMeetingId == null
                   && scope.row.meetingStatus == 1">填写纪要</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>


    <!--查看会议纪要-->
    <el-dialog
      title="查看会议纪要"
      :visible.sync="dialogVisibleSummaryView"
      width="50%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="viewSummaryForm" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="纪要内容">
          <el-input size="small" type="textarea" v-model="viewSummaryForm.minuteContent" :rows="4"  readOnly></el-input>
        </el-form-item>
        <el-form-item label="参会人员">
          <el-input size="small" type="textarea"  v-model="viewSummaryForm.hostParticipateName" :rows="4"  readOnly></el-input>
        </el-form-item>
        <el-form-item label="记录人">
          <el-input size="small" v-model="viewSummaryForm.meetingRecorderName"  readOnly></el-input>
        </el-form-item>
        <el-form-item label="记录时间">
          <el-input size="small"  v-model="viewSummaryForm.recorderTime" readOnly></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleSummaryView = false">取 消</el-button>
  </span>
    </el-dialog>

    <!--添加/编辑会议纪要-->
    <el-dialog
      title="添加/编辑会议纪要"
      :visible.sync="dialogVisibleSummaryUpdate"
      width="50%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="summaryForm" ref="summaryFormRef" :rules="summaryFormRules" label-width="100px">
        <el-form-item label="会议纪要：" prop="minuteContent">
          <el-input size="small" type="textarea" placeholder="请输入至少5个字符" :rows="4"  v-model="summaryForm.minuteContent"></el-input>
        </el-form-item>
        <el-form-item label="参会人员：">
          <el-input v-model="summaryForm.hostParticipateName" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item >
            记录人： {{userInformation.userName}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="记录时间" prop="recorderTime">
              <el-date-picker   type="datetime"
                  v-model="summaryForm.recorderTime" size="small" style="width: 180px"
                  placeholder="请选择">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="clearUpdateSummaryForm()">取 消</el-button>
    <el-button type="primary" @click="submitSummary('summaryFormRef')">确 定</el-button>
  </span>
    </el-dialog>

    <!--查看会议/课程信息-->
    <el-dialog
      title="查看会议/课程信息"
      :visible.sync="dialogVisibleView"
      width="54%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="threeOneDetails" label-width="120px" >

        <el-row>
          <el-col :span="10">
            <el-form-item label="标题">
              <el-input size="small" v-model="threeOneDetails.title" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="类别">
              <el-input size="small" v-model="typeName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="会议形式">
              <el-input size="small" type="textarea" v-model="threeOneDetails.meetingForm" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发布组织">
              <el-input size="small" v-model="threeOneDetails.organizationName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="开始时间">
              <el-input size="small" v-model="threeOneDetails.meetingTime" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="时长(h)">
              <el-input size="small" v-model="threeOneDetails.meetingDuration" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

          <el-form-item label="参会/授课人员"  style="width: 84%">
            <el-input size="small" type="textarea" v-model="threeOneDetails.hostParticipateName" readonly></el-input>
          </el-form-item>

        <el-form-item label="主题内容" style="width: 84%">
          <el-input size="small" type="textarea" v-model="threeOneDetails.mainContent" :rows="4" readonly></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleView = false">返回</el-button>
  </span>
    </el-dialog>

    <!--编辑会议/课程信息-->
    <el-dialog
      title="编辑会议/课程信息"
      :visible.sync="dialogVisibleUpdate"
      width="54%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="threeOneDetails" ref="threeOneDetailsForm" :rules="threeOneDetailsRules" label-width="120px" >

        <el-row>
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input size="small" v-model="threeOneDetails.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="类别" prop="meetingCategory">
              <el-select v-model="threeOneDetails.meetingCategory">
              <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="会议形式" prop="meetingForm">
              <el-input size="small" type="textarea" v-model="threeOneDetails.meetingForm" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发布组织" prop="organizationName">
              <el-input size="small" v-model="threeOneDetails.organizationName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="开始时间" prop="meetingTime">
              <el-date-picker   type="datetime"
                v-model="threeOneDetails.meetingTime" size="small" style="width: 180px"
                placeholder="请选择">
              </el-date-picker>
              <!--<el-input size="small" v-model="threeOneDetails.meetingTime"></el-input>-->
            </el-form-item>

          </el-col>
          <el-col :span="10">
            <el-form-item label="时长" prop="meetingDuration">
              <el-input size="small" v-model="threeOneDetails.meetingDuration" ></el-input>
              <!--<el-input-number v-model="threeOneDetails.meetingDuration"  :min="1" :max="10"></el-input-number>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="参会/授课人员"  style="" prop="checkedParticipateId">
          <!--<el-input size="small" type="textarea" v-model="threeOneDetails.participateName" ></el-input>-->
          <el-transfer style="text-align: left;height: 180px;"
          v-model="checkedParticipateId" :titles="['人员表', '参会人员']"
          :button-texts="['','']" @change="handleParticipateIdChange" :data="participateList">
          </el-transfer>
        </el-form-item>

        <el-form-item label="主题内容" style="width: 84%" prop="mainContent">
          <el-input size="small" type="textarea" v-model="threeOneDetails.mainContent" :rows="4" ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleUpdate = false">返回</el-button>
    <el-button @click="submitThreeOne(threeOneDetailsForm)">提交</el-button>

  </span>
    </el-dialog>



  </div>
</template>

<script>

  import {threeLessonsMethods} from './threeLessonsJS';
  import {Auth} from "../../../../store/modules/auth";
  import {Msg} from "../../../../tools/message.js"

  import treeTransfer from 'el-tree-transfer' // 引入

  export default {
    name: "threeLessons",
    data(){

      return{
        loading: true,
        // v-loading="loading"
        userInformation:{},
        input:'',
        select_checkTime:'',
        select_type:'',

        dialogVisibleSummaryView:false,
        dialogVisibleSummaryUpdate: false,
        dialogVisibleView:false,
        dialogVisibleUpdate:false,

        summaryChange:0,//区分修改 、新建会议纪要 1-新建  2-修改
        //三会一课的类别
        type:[
          {value:1,label:"1.党委会"},
          {value:2,label:"2.委员会"},
          {value:3,label:"3.小组会"},
          {value:4,label:"4.党课"},
        ],
        typeName:'',//类型名
        currentUserName:'',//记录人名字

        viewSummaryForm:{
        },
        summaryForm:{
          id:'',title:'',minuteType:'',organizationName:'',hostParticipateId:'',
          hostParticipateName:'',meetingId:'',meetingRecorderId:'',meetingRecorderName:'',
          recorderTime:'',minuteContent:''
        },
        summaryFormRules:{
          minuteContent:{
            required: true, message: '请输入会议纪要内容', trigger: 'blur'
          },
          recorderTime:{
            required:true, message:'请选择记录时间',trigger:'blur'
          },
        },
        threeOneDetailsForm:{
          title:'',  meetingCategory:'',  meetingForm:'',  meetingTime:'', meetingDuration:'',  checkedParticipateId:'', mainContent:'',
        },
        threeOneDetailsRules:{
          title:{
            required: true, message: '请输入标题', trigger: 'blur'
          },
          meetingCategory:{
            required: true, message: '请选择类别', trigger: 'blur'
          },
          meetingForm:{
            required: true, message: '请输入会议形式', trigger: 'blur'
          },
          meetingTime:{
            required: true, message: '请输入会议时间', trigger: 'blur'
          },
          meetingDuration:[
            {required: true, message: '请输入会议时长', trigger: 'blur'},
          ],
          checkedParticipateId:[
            {required: true, message: '请选择参会/授课人员', trigger: 'blur'},
          ],
          mainContent:{
            required: true, message: '请输入会议内容', trigger: 'blur'
          },
        },
        rules:{},
        ruleForm:{},
        checkedEssayId:"",//单个被审核稿件id
        checkedItem:[],//多选框->多个被审核稿件id
        checked:false,
        checkObj:[],

        threeOneList:[],//三会一课列表
        threeOneDetails:{},//三会一课详细信息
        summaryDetail:{},//会议纪要信息

        currentPage:1,//当前页
        pageSize:5,
        total:0,//总共的文章数量

        participateList:[],
        participateIdNameList:[],
        checkedParticipateId:[],//被选中的参会人员id
        organization_party:[],
        organizationList:[],
        partyMemberList:[],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        }

      }
    },
    created(){

      this.userInformation = Auth.getUser();
    },
    mounted() {
      this.getThreeSessionOneClassList();
    },

    methods:{
      /**elementUI 实现table第一列加checkbox，控制仅未审核的可以选*/
      selectTable(row){
        if(row.meetingStatus == 0 ){
          return true;
        }else{
          return false;
        }
      },
      handleSelectionChange(val) {
        this.checkObj = val;
      },
      //表头居中
      headClass () {
        return 'text-align: center;background:#eef1f6;'
      },
      // 表格样式设置
      rowClass () {
        return 'text-align: center;'
      },
      //翻页设置
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getThreeSessionOneClassList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getThreeSessionOneClassList();
      },
      handleSelectionChange(val) {
        this.checkObj = val;
        console.log(this.checkObj)
      },
      //创建三会一课
      createThree(){
        this.$router.push({
          path:'/createThree',
          query:{
            flag:1
          }
        })
      },

      //发布会议or党课
      postThree(){
        if(this.checkObj == ''){
          Msg.warn("请选择要发布的文章！")
        }
        else {
            this.$confirm('确定要发布选中的文章么?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let checkedItemIds=[];
              for(var i=0;i<this.checkObj.length;i++){
                checkedItemIds.push(this.checkObj[i].id)
              }
              threeLessonsMethods.postThreeOne(checkedItemIds).then(res=>{
                this.getThreeSessionOneClassList();
              });
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消发布'
              });
            });
        }
      },

      //查看三会一课详情
      viewThreeOneDetails(data){
        threeLessonsMethods.getThreeOneDetails({id:data}).then(res=>{
          this.threeOneDetails = res.data.data;
        });

        if(this.threeOneDetails.meetingCategory==1)
          this.typeName='党委会';
        if(this.threeOneDetails.meetingCategory==2)
          this.typeName='委员会';
        if(this.threeOneDetails.meetingCategory==3)
          this.typeName='小组会';
        if(this.threeOneDetails.meetingCategory==4)
          this.typeName='党课';

        this.dialogVisibleView = true;
      },

      //得到要修改的三会一课得详情
      updateThreeOneDetail(data){
        this.$router.push({
          path:'/createThree',
          query:{
            flag:2,
            id:data.id,
          }
        })
      },

      //提交修改后的三会一课
      submitThreeOne(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.threeOneDetails.meetingTime = threeLessonsMethods.changeDateYMDHMS(this.threeOneDetails.meetingTime);
            var updateInfo = {
              id:this.threeOneDetails.id,
              title:this.threeOneDetails.title,
              hostParticipate: '123',
              mainContent:this.threeOneDetails.mainContent,
              meetingForm:this.threeOneDetails.meetingForm,
              meetingCategory:this.threeOneDetails.meetingCategory,
              meetingTime:this.threeOneDetails.meetingTime,
              meetingDuration:this.threeOneDetails.meetingDuration,
            };
            console.log(this.threeOneDetails);
            threeLessonsMethods.updateThreeOne(this.threeOneDetails).then(res=>{
              this.getThreeSessionOneClassList();
            });
            this.dialogVisibleUpdate = false;
          } else {
            // console.log('error submit!!');
            Msg.error("请根据提示填写正确的数据！")
            return false;
          }
        });

      },

      //删除三会一课
      deleteItem(data){
        this.$confirm('确定要删除么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          threeLessonsMethods.deleteThreeOne({id:data.id}).then(res=>{
            this.getThreeSessionOneClassList();
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },

      //查看会议纪要
      viewSummer(data){
        threeLessonsMethods.getMinuteMeetingByTheeOneId({meetingId:data}).then(res=>{
          this.viewSummaryForm = res.data.data;
          this.dialogVisibleSummaryView = true;
          console.log("会议纪要详情：")
          console.log(this.viewSummaryForm)
        })
      },

      //编辑会议纪要
      updateSummary(data){
        threeLessonsMethods.getMinuteMeetingByTheeOneId({meetingId:data}).then(res=>{
          this.summaryForm = res.data.data;
          this.dialogVisibleSummaryUpdate = true;
          this.summaryChange = 2;
        });
      },

      //新建会议纪要
      insertSummary(data){

        this.dialogVisibleSummaryUpdate = true;
        this.summaryForm.meetingId=data.id;
        this.summaryForm.minuteType = data.meetingCategory;
        threeLessonsMethods.getParticipateName({meetingId:data.id}).then(res=>{
          this.summaryForm.hostParticipateName = res.data.data;
          console.log(res.data.data)
          this.summaryChange=1;
          console.log("summaryForm:");
          console.log(this.summaryForm)
        });
      },

      //提交会议纪要
      submitSummary(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            ///提交修改的会议纪要
            if(this.summaryChange == 2){
              var data2 = {
                id:this.summaryForm.id,
                minuteContent:this.summaryForm.minuteContent
              };
              threeLessonsMethods.updateSummary(data2).then(res=>{});
            }

            //提交新增的会议纪要
            if(this.summaryChange == 1){
              this.userInformation = Auth.getUser();
              this.summaryForm.recorderTime = threeLessonsMethods.changeDateYMDHMS(this.summaryForm.recorderTime);
              var data1={
                meetingId: this.summaryForm.meetingId,
                meetingRecorderId:this.userInformation.partyId,
                minuteContent:this.summaryForm.minuteContent,
                minuteType:this.summaryForm.minuteType,
                recorderTime:threeLessonsMethods.changeDateYMDHMS(this.summaryForm.recorderTime),
              };
              console.log("data1:")
              console.log(data1)
              threeLessonsMethods.insertSummary(data1);
            }
            this.clearUpdateSummaryForm();
            //        this.dialogVisibleSummaryUpdate = false;

            // this.$refs['summaryForm'].resetFields();
          } else {
            // console.log('error submit!!');
            Msg.error("请根据提示填写正确的数据！")
            return false;
          }
        });

      },

      clearUpdateSummaryForm(){
        this.dialogVisibleSummaryUpdate = false;
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },


      //得到三会一课列表
      getThreeSessionOneClassList(){
        this.userInformation = Auth.getUser();
        //更改日期格式
        if(this.select_checkTime != '' && this.select_checkTime != null){
          this.select_checkTime = threeLessonsMethods.changeDateYMD(this.select_checkTime);
        }
        //传给后端的参数
        var dto={
          title:this.input,
          releaseTime:this.select_checkTime,
          meetingCategory:this.select_type,
          partyId:this.userInformation.partyId,
          organizationId:this.userInformation.organizationId,
          rank:this.userInformation.organizationRank,
          currentPage:this.currentPage,
          pageSize:this.pageSize,
        };
        threeLessonsMethods.getThreeOneList(dto).then(res=>{
            if(res.data.code === 200){
                this.threeOneList = res.data.data.list;
                this.total = res.data.data.total;
            } else if(res.data.code === 403){
                Msg.error('权限不足');
            } else {
                Msg.error('网络繁忙');
            }

        });

        // this.input='';this.select_checkTime='';this.select_type='';
      },

      handleParticipateIdChange(value, direction, movedKeys) {
      },

      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
      changeMode() {
        if (this.mode == "transfer") {
          this.mode = "addressList";
        } else {
          this.mode = "transfer";
        }
      },

      // 监听穿梭框组件添加
      add(organization_party,toParticipate,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("organization_party:", organization_party);
        console.log("toParticipate:", toParticipate);
        console.log("obj:", obj);
        let partyIdList=[];
        for(var i=0;i<obj.nodes.length;i++){
          if(obj.nodes[i].partyId!=null)
            partyIdList.push(obj.nodes[i].partyId);
        }
        console.log("party ids:");
        console.log(partyIdList);
      },

      // 监听穿梭框组件移除
      remove(organization_party,toParticipate,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("organization_party:", organization_party);
        console.log("toParticipate:", toParticipate);
        console.log("obj:", obj);
      },

      getSelectPeople(){
        console.log("this get select people:")
        threeLessonsMethods.getOrganizationAndLowerList({id:'01a41de5ee5942b3a4bbdd80dd32e819'}).then(res=>{
          this.organizationList = res.data.data;
        });
        threeLessonsMethods.getPartyMemberListByOrganization({id:'01a41de5ee5942b3a4bbdd80dd32e819'}).then(res=> {
          this.partyMemberList = res.data.data;
        });

        for(let i=0;i<this.organizationList.length;i++){
          this.fromData2.push(this.organizationList[1])
        }
        for(let i=0;i<this.partyMemberList.length;i++){
          this.fromData2.push(this.partyMemberList[1])
        }
      },
    },

    components:{ treeTransfer } // 注册
  }
</script>

<style scoped>
  .headerEdit{
    margin-top: 20px;margin-bottom: 20px;
  }
  .headerEdit div,.headerEdit{
    display: flex;align-items: center;
  }
  .headerEdit div span{
    width: 100px;
  }
  .headerEdit >>>.el-input{
    /*margin-right: 10px;*/
  }
  .headerEdit >>>.el-input__inner{
    height: 32px;
  }
  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-left: 20px;
  }
  >>>.el-transfer-panel{
    width: 147px;
  }
  .edit{
    color: #ff0000;
  }
  .pages{
    display: flex;
    justify-content: center;
    margin-top:10px;
  }
  .summaryBox{
    display: flex;align-items: center;
  }

</style>
