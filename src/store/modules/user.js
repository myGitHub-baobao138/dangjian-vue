/**
 * modules
 */

import {LoginApi} from '../../view/login/login';
import {ChangeUserRoleApi} from "../../components/ChangeUserRoleApi";
import {Msg} from '../../tools/message';
import {Auth} from './auth';
import axios from 'axios'

const defaultUser = {account: '', password: '', isRemember: false};

export default {
  state: {
    // /** token */
    // token: Auth.getToken() || null,
    /** 用户登陆角色信息 */
    userInfo: Auth.getUserInfo() || {},
    /** 用户登陆账户密码 */
    accountPwd: Auth.getAccountPwd() || defaultUser,
    // 登录后的信息（可以切换）
    user: Auth.getUser() || {},
    /** 是否登陆 */
    isLogin: Auth.getLogin() || false,
  },
  /** 计算属性 */
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(value => value.done)
    // }
  },
  /** 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation */
  mutations: {
    ACCOUNT_AUTH_STATUS_CHANGED(state, data) {
      const res = data.data; // 返回值
      const param = data.params; // 传参
      console.log('123');
      var str = res.data.organizationMsgList[0].postId.split(',');

      var user = {
        userId: res.data.userId,
        userName: res.data.userName,
        partyId:res.data.partyId,
        organizationId: res.data.organizationMsgList[0].organizationId,
        postId: str[0],
        organizationRank: res.data.organizationMsgList[0].organizationRank,
      }
      console.log(user);
      if (res) {
        // state.token = res.token;
        state.userInfo = res.data;
        state.isLogin = true;
        Auth.setUserInfo(state.userInfo);
        Auth.setLogin(state.isLogin);
        // Auth.setToken(state.token);
        state.user = user;
        Auth.setUser(state.user);
      }

      var params = {
        account: Auth.getAccountPwd().account,
        organizationId: user.organizationId,
        postId: user.postId
      }

      ChangeUserRoleApi.changeUserRole(params).then(res => {
        if (res.data.code === 200) {
          // Msg.success(res.data.message);
        }
      })
    },
    ACCOUNT_LOGOUT_FAILURE(state) {
      state.isLogin = false;
      Auth.removeUserInfo();
      Auth.removeLogin();
      Auth.removeUser();
      // Auth.removeToken();
    },
    handleRemember(state, data) {
      const userInfo = data.params;
      if (userInfo && userInfo.isRemember) {
        this.state.accountPwd = userInfo; //记住用户名和密码
        Auth.setAccountPwd(this.state.accountPwd);
      } else {
        Auth.removeAccountPwd();
        var account = {
          account: userInfo.account
        }
        this.state.accountPwd = account; //记住用户名
        Auth.setAccountPwd(this.state.accountPwd);

      }
    },
    Change_Organization_Post(state, data) {
      state.user = data;
      Auth.setUser(state.user);
    },
  },
  /** Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作。 */
  actions: {
    /** 登录 */
    accountLoginSubmit({commit}, params) {

      return new Promise((resolve, reject) => {


        axios.post('http://localhost:9090/SysLogin/accountLogin', {
            account: params.account,
            password: params.password
          }
          , {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        ).then((res) => {
          if (res.data.code === 200) {

            console.log('%c 身份被服务器接受', 'color:#fa8c16');
            commit('handleRemember', {...res, params});
            commit('ACCOUNT_AUTH_STATUS_CHANGED', {...res, params});
            resolve(res.data)
          } else {
            commit('ACCOUNT_LOGOUT_FAILURE');
            // Msg.error(res.data.message);
            // reject(res.data);
            resolve(res.data)
          }
        }).catch(err => {
          console.log('%c 身份被服务器拒绝', 'color:#fa8c16');
          resolve(err)
          Msg.error('系统繁忙请稍后再试');
          commit('ACCOUNT_LOGOUT_FAILURE');
        })
      })
    },
    /** 登出 */
    accountLogoutSubmit({commit}) {
      return new Promise((resolve, reject) => {
        axios.get("http://localhost:9090/SysLogin/accountLogout").then(res =>{
          if(res.data.code === 200){
            Msg.success(res.dat.message);
          }
            commit('ACCOUNT_LOGOUT_FAILURE');
            resolve(res.data);
        }).catch(err => {

          commit('ACCOUNT_LOGOUT_FAILURE');
        })

      })
    },

    /** 改变组织和职务 */
    changeOrganizationPost({commit}, params) {
      return new Promise((resolve, reject) => {
        commit('Change_Organization_Post',params);
        resolve(params);
      })
    }
,

  }
}
