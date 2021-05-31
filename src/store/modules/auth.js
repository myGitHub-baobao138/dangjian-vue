import Cookies from 'js-cookie'
const sessionStorage = window.sessionStorage;
const localStorage = window.localStorage;

export class Auth {
  static setUserInfo(value = {}) {
    return sessionStorage.setItem('modules.userInfo', JSON.stringify(value))
  }

  static getUserInfo() {
    return JSON.parse(sessionStorage.getItem('modules.userInfo'))
  }

  static removeUserInfo() {
    return sessionStorage.removeItem('modules.userInfo')
  }

  static setAccountPwd(value = {}) {
    return localStorage.setItem('modules.accountPwd', JSON.stringify(value))
  }

  static getAccountPwd() {
    return JSON.parse(localStorage.getItem('modules.accountPwd'))
  }

  static removeAccountPwd() {
    return localStorage.removeItem('modules.accountPwd')
  }

  static setLogin() {
    return sessionStorage.setItem('modules.isLogin', true)
  }

  static getLogin() {
    return !!sessionStorage.getItem('modules.isLogin')
  }

  static removeLogin() {
    return sessionStorage.removeItem('modules.isLogin')
  }

  // static setToken(value) {
  //   return Cookies.set('modules.token', value)
  // }
  //
  // static getToken() {
  //   return Cookies.get('modules.token')
  // }
  //
  // static removeToken() {
  //   return Cookies.remove('modules.token')
  // }



  static setUser(value = {}) {
    return sessionStorage.setItem('modules.modules', JSON.stringify(value))
  }

  static getUser() {
    return JSON.parse(sessionStorage.getItem('modules.modules'))
  }

  static removeUser() {
    return sessionStorage.removeItem('modules.modules')
  }

  static ACCOUNT_LOGOUT_FAILURE(state) {
    Auth.removeAccountPwd();
    Auth.removeUserInfo();
    Auth.removeLogin();
    Auth.removeUser();
  }
}
