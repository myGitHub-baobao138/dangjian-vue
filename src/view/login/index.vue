<template>
  <div id="login-page">
    <div class="login-container">
      <h2>士继理工党建管理系统</h2>
      <p>用户登录</p>
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <el-form-item prop="account">
          <el-input class="input" v-model="loginForm.account" placeholder="账号" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="input" type="password" v-model="loginForm.password" autocomplete="off"
                    placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>

          <el-col :span="24">
            <el-checkbox class="checkbox" v-model="loginForm.isRemember">自动登录</el-checkbox>
          </el-col>
          <!--          <el-col :span="12" class="a-forget-parent"><a href="#login" class="a-forget"-->
          <!--                                                        @click="forgetPassword()">忘记密码</a></el-col>-->

        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button-login" @click="submitForm('loginForm')">登录
          </el-button>
        </el-form-item>


      </el-form>
    </div>
  </div>
</template>

<script>
    import {Msg} from "../../tools/message";
    import {Auth} from "../../store/modules/auth";
    import router from "../../router";
    import {store} from '../../store'

    export default {
        name: "index",
        data() {
            return {

                loginForm: {
                    account: '',
                    password: '',
                    isRemember: false
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                isDisabled: false,

            }
        },
        mounted() {
            this.getUser();
        },
        methods: {
            // 点击忘记密码
            forgetPassword: function () {

            },
            saveData() {
                this.$store.dispatch('accountLoginSubmit', this.loginForm).then((res => {


                    if (res.code === 200) {
                        Msg.success('登录成功');
                        this.$router.push('/');

                    } else {
                        console.log(res);
                        if (res.toString() === 'Error: Network Error') {
                            this.isDisabled = false;//解除锁定
                        } else {
                            this.isDisabled = false;//解除锁定
                            Msg.error(res.message);
                        }

                    }

                }))
            },
            // 登录提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var that = this;
                        if (!this.isDisabled) {
                            this.isDisabled = true;//锁定

                            this.saveData(() => {//回调以避免同步
                                that.isDisabled = false;//解除锁定
                            });
                        }
                    } else {
                        console.log('error submit!')
                    }

                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 获取用户名和密码
            getUser() {
                this.loginForm = Auth.getAccountPwd() || {};
            },

        }

    }
</script>

<style scoped>
  #login-page {
    width: 100%;
    height: 100%;
    background: url("../../assets/login-bg.jpg") no-repeat fixed center;
    background-size: cover; /**拉伸图片 */
    text-align: left;
  }

  h2 {
    margin-top: 0;
  }

  .login-container {
    width: 300px;
    margin: 0 auto;
    position: absolute;
    left: 41%;
    top: 20%;
  }

  .a-forget {
    color: red;
    text-decoration: none;
  }

  .a-forget-parent {
    text-align: right;
  }

  .input >>> .el-input__inner:focus {
    border-color: #f33;
  }

  .el-button {
    width: 300px;
    background: #f33;
    border-color: #f33;
  }

  .el-button:focus, .el-button:hover {
    border-color: #fab5b5;
    background-color: #ef0e0e;
  }

  .el-button:active {
    background: #f33;
    border-color: #f33;
  }

  .checkbox >>> .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: red;
    border-color: red;
  }

  .checkbox >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    color: red;
  }
</style>
