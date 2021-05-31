<template>
  <div class="body">
    <!--面包屑-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/themeDay' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>党主题日管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div class="headerEdit" >

      <span>支部名称：</span><el-input placeholder="请输入" v-model="inputOrganizationName" clearable></el-input>

      <span>发布时间：</span>
      <el-date-picker v-model="inputReleaseTime" type="date"  placeholder="选择日期" clearable></el-date-picker>

      <!--<span v-if="">学院：</span>-->
      <!--<el-select v-model="organization" placeholder="请选择" >-->
        <!--<el-option-->
          <!--v-for="item in organizationList"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->

      <el-button type="danger" @click="getThemeDayList()">查询</el-button>
      <el-button type="danger" @click="postArticle()">发布</el-button>
      <el-button type="danger" @click="createArticle()">创建</el-button>
    </div>

    <!--:align="center" :cell-style="cellStyle" :handee-cell-style="rowClass"-->
    <div class="table">
      <el-table :data="themeDayList" :cell-style="rowClass" :header-cell-style="headClass" @selection-change="handleSelectionChange" style="width: 100%;" >
        <el-table-column fixed align="center" type="selection" :selectable="selectTable" v-model="checked"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="organizationName" label="支部名称" ></el-table-column>
        <el-table-column  prop="branchSecretaryName" label="支部书记" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" width="200px"></el-table-column>
        <el-table-column  prop="releaseTime" label="发布时间" ></el-table-column>
        <el-table-column  prop="editorName" label="编辑人" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" >
          <template slot-scope="scope" width="140px">
            <span v-if="scope.row.status == 1">未发布</span>
            <span v-if="scope.row.status == 2">已发布</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="viewsNumber" label="浏览量" width="80px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="likesNumber" label="点赞数" width="80px"></el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope" class="edit">
            <span style="cursor: pointer;color: #F56C6C;" @click="deleteItem(scope.row.id)">删除</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="updateThemeDayDetail(scope.row.id)" v-if="scope.row.status==1">编辑</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="updateTableTop(scope.row.id)" v-if="scope.row.top !=0 && rank == 1">置顶</span>
            <span style="cursor: pointer;color: #F56C6C;" @click="updateTableNotTop(scope.row.id)" v-if="scope.row.top ==0 && rank == 1">取消置顶</span>

            <span style="cursor: pointer;color: #F56C6C;" @click="viewThemeDay(scope.row.id)">查看</span>
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


    <el-dialog
      title="查看党主题日信息"
      :visible.sync="dialogVisibleView"
      width="54%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="themeDayDetails" label-width="120px" >

        <el-form-item label="标题："  prop="title">
          <el-input size="small" style="width:580px;" v-model="themeDayDetails.title" readOnly/>
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-form-item label="支部名称："  prop="name">
              <el-input size="small" v-model="themeDayDetails.organizationName" readOnly/>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="支部党员数：" class="read" prop="title" >
              <el-input size="small" v-model="themeDayDetails.partyMembersNumber " readOnly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="支部书记：" prop="shuji">
              <el-input size="small" v-model="themeDayDetails.branchSecretaryName  " readOnly/>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="联系电话：" prop="phone">
              <el-input size="small" v-model="themeDayDetails.phone" readOnly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="学习时间：" class="read" prop="time">
              <el-input
                v-model="themeDayDetails.learningTime" size="small" style="width: 180px" readOnly>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="学习地点：" class="read" prop="didian">
              <el-input size="small" v-model="themeDayDetails.learningPlace" readOnly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="学习内容："prop="content">
          <el-input v-model="themeDayDetails.learningContent" type="textarea" :rows="7" style="width: 570px;" readOnly></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-form-item label="学习方式："class="read" prop="way">
              <el-input size="small"  v-model="themeDayDetails.learningWay" readOnly/>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="月份：" class="read">
              <el-input v-model="themeDayDetails.month" size="small" style="width: 180px" readOnly>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="参与人员：" class="read">
          <el-input size="small"  v-model="themeDayDetails.participantsName " readOnly/>
        </el-form-item>

        <el-form-item label="总体效果：" class="read" prop="title">
          <el-input size="small" v-model="themeDayDetails.overallEffect  " style="width:580px;margin-left: 6px" readOnly/>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
     <el-button @click="dialogVisibleView = false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑党主题日信息"
      :visible.sync="dialogVisibleUpdate"
      width="54%"
      :before-close="handleClose" class="summaryBox">

      <el-form :model="themeDayDetails"  label-width="120px" >

        <el-form-item label="标题："  prop="title">
          <el-input size="small" style="width:580px;" v-model="themeDayDetails.title" />
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-form-item label="支部名称："  prop="name">
              <el-input size="small" v-model="themeDayDetails.organizationName" readOnly/>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="支部党员数：" class="read" prop="title" >
              <el-input size="small" v-model="themeDayDetails.partyMembersNumber " readOnly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="支部书记：" prop="shuji">
              <el-input size="small" v-model="themeDayDetails.branchSecretaryName  " readOnly />
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="联系电话：" prop="phone">
              <el-input size="small" v-model="themeDayDetails.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="学习时间：" class="read" prop="learning_time">
              <el-time-picker
                v-model="themeDayDetails.learningTime" size="small" style="width: 180px"
                placeholder="请选择">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="学习地点：" class="read" prop="didian">
              <el-input size="small" v-model="themeDayDetails.learningPlace"  />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="学习内容："prop="content">
          <el-input v-model="themeDayDetails.learningContent" type="textarea" :rows="7" style="width: 570px;" ></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-form-item label="学习方式："class="read" prop="way">
              <el-input size="small"  v-model="themeDayDetails.learningWay" />
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 108px;">
            <el-form-item label="月份：" class="read" prop="month">
              <el-date-picker v-model="themeDayDetails.month"
                              type="month" size="small" style="width: 180px"
                              placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="参与人员：" class="read">
          <el-input size="small"  v-model="themeDayDetails.participantsName " />
        </el-form-item>

        <el-form-item label="总体效果：" class="read" prop="title">
          <el-input size="small" v-model="themeDayDetails.overallEffect  " style="width:580px;margin-left: 6px" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleUpdate = false">返回</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import {ThemeDayMethods} from './themeDayJs'
  import {Auth} from "../../../../store/modules/auth";
  import {Msg} from "../../../../tools/message.js"

  export default {
    name: "themeDay",
    data(){
      return{
        inputReleaseTime:'',
        inputOrganizationName:'',

        checkedEssayId:"",//单个被审核稿件id
        checkedItem:[],//多选框->多个被审核稿件id
        checked:false,
        checkObj:[],

        rank:'',
        dialogVisibleView:false,
        dialogVisibleUpdate:false,
        time:'09:11:12',

        currentPage:1,//当前页
        pageSize:5,
        total:0,//总共的文章数量

        organization:'',
        organizationList:[
          { value:0,label: '重庆理工大学'},
          { value:1,label: '人工智能'},
          { value:2,label:"计算机科学与工程"},
        ],

        themeDayList:[],

        themeDayDetails:{
        },
        themeDayDetailsRules:{
          learningTime:{
            required: true, message: '请选择学习时间', trigger: 'blur'
          },
          learningPlace:{
            required: true, message: '请输入学习地点', trigger: 'blur'
          },
          learningContent:{
            required: true, message: '请输入学习内容', trigger: 'blur'
          },
          learningWay:{
            required: true, message: '请输入学习方式', trigger: 'blur'
          },
          month:{
            required: true, message: '请选择月份', trigger: 'blur'
          },
          participantsName:{
            required: true, message: '请选择参与人员', trigger: 'blur'
          },
          overallEffect:{
            required: true, message: '请输入总体效果', trigger: 'blur'
          },
        }
      }
    },

    created(){
      this.getThemeDayList();
      this.rank = Auth.getUser().organizationRank;
    },
    methods: {
      /**elementUI 实现table第一列加checkbox，控制仅未审核的可以选*/
      selectTable(row) {
        if (row.status == 1) {
          return true;
        } else {
          return false;
        }
      },
      handleSelectionChange(val) {
        this.checkObj = val;
      },
      //表头居中
      headClass() {
        return 'text-align: center;background:#eef1f6;'
      },
      // 表格样式设置
      rowClass() {
        return 'text-align: center;'
      },
      //翻页设置
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getThemeDayList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getThemeDayList();
        console.log(`当前页: ${val}`);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      //更改日期格式辅助函数
      p(s) {
        return s < 10 ? '0' + s : s
      },
      //得到表格数据
      getThemeDayList() {

        if (this.inputReleaseTime != '' && this.inputReleaseTime != null) {
          const d = new Date(this.inputReleaseTime)
          const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
          // const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
          // this.select_checkTime = resDate+' '+resTime;
          this.inputReleaseTime = resDate;
        }

        var query = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          organizationId: '01a41de5ee5942b3a4bbdd80dd32e819',
          organizationName: this.inputOrganizationName,
          partyId: '',
          postId: '',
          rank: '1',
          releaseTime: this.inputReleaseTime
        };
        ThemeDayMethods.getThemeDayTableList(query).then(res => {
            if (res.data.code === 200) {
                this.themeDayList = res.data.data.list;
                this.total = res.data.data.total;
            } else if (res.data.code === 403) {
                Msg.error('权限不足');
            } else {
                Msg.error('网络繁忙');
            }

        }).catch(err =>{
            Msg.error('网络繁忙');
        })
      },
      //创建文章
      createArticle() {
        this.$router.push({
          path: '/createArticle',
          query: { flag: 1 }
        });
      },
      //发布文章
      postArticle() {
        if(this.checkObj == ''){
          Msg.warn("请选择要发布的文章！")
        }
        else {
          this.$confirm('确定要发布选中的文章么?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let checkedThemeDayID = [];
            for (var i = 0; i < this.checkObj.length; i++) {
              checkedThemeDayID.push(this.checkObj[i].id);
            }
            ThemeDayMethods.postThemeDay(checkedThemeDayID).then(res => {
              this.getThemeDayList();
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
      //  删除
      deleteItem(data) {
        this.$confirm('确定要删除么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ThemeDayMethods.deleteThemeDay({id: data}).then(res => {
            this.getThemeDayList();
          });
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
      //  查看
      viewThemeDay(data) {
        this.dialogVisibleView = true;
        ThemeDayMethods.getThemeDayDetails({id:data}).then(res=>{
          this.themeDayDetails = res.data.data;
        })
      },
      //置顶
      updateTableTop(data) {
        this.$confirm('确定要置顶么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ThemeDayMethods.updateTop({id: data}).then(res => {
            this.getThemeDayList();
          });
          this.$message({
            type: 'success',
            message: '置顶成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消置顶'
          });
        });
      },
      //取消置顶
      updateTableNotTop(data){
        this.$confirm('确定要取消置顶么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ThemeDayMethods.updateNotTop({id: data}).then(res => {
            this.getThemeDayList();
          });
          this.$message({
            type: 'success',
            message: '取消置顶成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //编辑
      updateThemeDayDetail(data) {
        this.$router.push({
          path: '/createArticle',
          query: { flag: 2,themeDayId:data }
        });

        // this.dialogVisibleUpdate = true;
        // ThemeDayMethods.getThemeDayDetails({id:data}).then(res =>{
        //   this.themeDayDetails = res.data.data;
        // })
        // // this.themeDayDetails.learningTime =new Date(this.themeDayDetails.learningTime),
        // console.log(this.themeDayDetails)
      },
    }
  }
</script>

<style scoped>

  .headerEdit{
    margin-top: 20px;margin-bottom: 20px;
    display: flex;text-align: center;align-items: center;
  }
  .headerEdit >>>.el-input{
    width:200px;margin-right: 20px;
  }
  .headerEdit >>>.el-input__inner{
    height: 32px;
  }
  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }
  .edit{
    color: #ff0000;
  }
  .pages{
    display: flex;
    justify-content: center;
    margin-top:10px;
  }

</style>
