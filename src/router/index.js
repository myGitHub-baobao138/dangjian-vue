import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export const asyncRouterMap = [

  {
    path: '/admin',
    meta: {
      requireAuth: true
    },
    redirect: '/dynamicContent',
    component: () => import('../components/ui/containerNav'),
    children: [
      /*
      ****************************************************************************************************************
       */
      {
        path: '/dynamicContent',
        meta: {
          requireAuth: true,
          title: '党建动态'
        },
        redirect: '/styleManagement',
        component: () => import('../view/dynamic/dynamicContent.vue'),
        children: [
          {
            path: '/styleManagement',
            meta: {
              requireAuth: true,
              title: '风采管理'
            },
            redirect: '/checkEssay',
            component: () => import('../components/container.vue'),
            children: [
              {
                path: '/checkEssay',
                meta: {
                  requireAuth: true,
                  title: '稿件审核管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/dynamic/dynamicOperation/mien/checkEssay')
                  },
                  {
                    path: '/checkEssayDetails',
                    meta: {
                      requireAuth: true,
                      title: "查看稿件详情"
                    },
                    component: () => import('../view/dynamic/dynamicOperation/mien/checkEssayDetails')
                  },
                ]
              },
              {
                path: '/like',
                meta: {
                  requireAuth: true,
                  title: "点赞管理",
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/dynamic/dynamicOperation/mien/likeManage'),
                  },
                  {
                    path: '/essayDetails',
                    meta: {
                      requireAuth: true,
                      title: '查看详情',
                    },
                    component: () => import('../view/dynamic/dynamicOperation/mien/essayDetails'),
                  },
                  {
                    path: '/likeListManage',
                    meta: {
                      requireAuth: true,
                      title: '点赞列表管理',
                    },
                    component: () => import('../view/dynamic/dynamicOperation/mien/likeListManage.vue')
                  },
                ]
              },
              {
                path: '/publish',
                meta: {
                  requireAuth: true,
                  title: "文章发布管理",
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/dynamic/dynamicOperation/mien/publishEssay')
                  },
                  {
                    path: '/establishEssay',
                    meta: {
                      requireAuth: true,
                      title: '发布文章'
                    },
                    component: () => import('../view/dynamic/dynamicOperation/mien/EstablishEssay'),
                  },
                  {
                    path: '/essayDetails',
                    meta: {
                      requireAuth: true,
                      title: '查看详情',
                    },
                    component: () => import('../view/dynamic/dynamicOperation/mien/essayDetails'),
                  },
                ]
              },


            ]

          },
          {
            path: '/cultivate',
            meta: {
              requireAuth: true,
              title: '党校培训管理',
              hidden: true
            },
            component: () => import('../components/container1.vue'),
            children: [
              {
                path: '/',
                component: () => import('../view/dynamic/dynamicOperation/cultivate/cultivateManage'),
              },
              {
                path: '/cultivateEstablish',
                meta: {
                  requireAuth: true,
                  title: '发布文章'
                },
                component: () => import('../view/dynamic/dynamicOperation/cultivate/cultivateEstablish'),
              },
            ]

          },

        ]
      },
      /*
      ***************************************************************************************************************
       */
      {
        path: '/service',
        meta: {
          requireAuth: true,
          title: '党建服务'
        },
        redirect: '/activityManage',
        component: () => import('../view/service/serviceContent.vue'),
        children: [
          {
            path: '/activityManage',
            meta: {
              requireAuth: true,
              title: '志愿活动管理'
            },
            redirect: '/checkActivity',
            component: () => import('../components/container.vue'),
            children: [
              {
                path: '/checkActivity',
                meta: {
                  requireAuth: true,
                  title: '志愿活动审核管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/service/serviceOperation/volunteer/checkActivity.vue')
                  },
                  {
                    path: '/checkActivityDetail',
                    meta: {
                      requireAuth: true,
                      title: '查看活动详情'
                    },
                    component: () => import('../view/service/serviceOperation/volunteer/checkActivityDetail.vue')
                  },

                ]
              },
              {
                path: '/register',
                meta: {
                  requireAuth: true,
                  title: '活动报名管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/service/serviceOperation/volunteer/registerActivity')
                  }, {
                    path: '/registerActivityDetail',
                    meta: {
                      requireAuth: true
                    },
                    component: () => import('../view/service/serviceOperation/volunteer/registerActivityDetail.vue')
                  },
                ]
              },
            ]
          },
          {
            path: '/threeLessons',
            meta: {
              requireAuth: true,
              title: '三会一课'
            },
            redirect: '/three',
            component: () => import('../components/container.vue'),
            children: [
              {
                path: '/three',
                meta: {
                  requireAuth: true,
                  title: '三会一课管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/service/serviceOperation/meeting/threeLessons')
                  },
                  {
                    path: '/createThree',
                    meta: {
                      requireAuth: true,
                      title: '发布会议/课程'
                    },
                    component: () => import('../view/service/serviceOperation/meeting/createThree'),
                  },
                ]
              },
              {
                path: '/summary',
                meta: {
                  requireAuth: true,
                  title: '纪要管理'
                },
                component: () => import('../view/service/serviceOperation/meeting/summaryManage'),
              },
            ]
          },
          {
            path: '/leave',
            meta: {
              requireAuth: true,
              title: '留言管理'
            },
            component: () => import('../view/service/serviceOperation/leaveMessage/leaveMessage'),
          },
          {
            path: '/vote',
            meta: {
              requireAuth: true,
              title: '投票管理'
            },
            component: () => import('../view/service/serviceOperation/vote/voteManage'),
          },
          {
            path: '/turn',
            meta: {
              requireAuth: true,
              title: '转组织关系'
            },
            component: () => import('../view/service/serviceOperation/turnOrganization/turnOrganization'),
          },
          {
            path: '/onlineAnswer',
            meta: {
              requireAuth: true,
              title: '在线答题'
            },
            redirect: '/questions',
            component: () => import('../components/container.vue'),
            children: [
              //问题管理
              {
                path: '/questions',
                meta: {
                  requireAuth: true,
                  title: '考题管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/service/serviceOperation/online/examQuestionsManage')
                  },
                  {
                    path: '/createExamQuestion',
                    meta: {requireAuth: true, title: '考题页面'},
                    component: () => import('../view/service/serviceOperation/online/createExamQuestion.vue')
                  },
                ]
              },
              {
                path: '/questionsRecord',
                meta: {
                  requireAuth: true,
                  title: '答题记录管理',
                  hidden: true
                },
                component: () => import('../components/container1.vue'),
                children: [
                  {
                    path: '/',
                    component: () => import('../view/service/serviceOperation/online/questionsRecord')
                  },
                  {
                    path: '/recordDetails',
                    meta: {
                      requireAuth: true,
                      title: '查看答题记录详情页面'
                    },
                    component: () => import('../view/service/serviceOperation/online/questionsRecordDetails.vue')
                  },
                ]
              },
              {
                path: '/questionsClassify',
                meta: {
                  requireAuth: true,
                  title: '问题分类管理'
                },
                component: () => import('../view/service/serviceOperation/online/questionsClassify'),
              },
              {
                path: '/questionBank',
                meta: {
                  requireAuth: true,
                  title: '题库管理'
                },
                component: () => import('../view/service/serviceOperation/online/questionBank'),
              },
            ]

          },
          {
            path: '/themeDay',
            meta: {
              requireAuth: true,
              title: '党主题日管理',
              hidden: true
            },
            component: () => import('../components/container1.vue'),
            children: [
              {
                path: '/',
                component: () => import('../view/service/serviceOperation/themeDay/themeDay')
              },
              {
                path: '/createArticle',
                meta: {
                  requireAuth: true,
                  title: '发布文章'
                },
                component: () => import('../view/service/serviceOperation/themeDay/createArticle'),
              },
            ]
          }
        ]
      },
      /*
      ***************************************************************************************************************
       */
      {
        path: '/managementContent',
        meta: {
          requireAuth: true,
          title: '基础管理'
        },
        redirect: '/organization',
        component: () => import('../view/management/managementContent.vue'),
        children: [
          {
            path: '/organization',
            meta: {
              requireAuth: true,
              title: '组织架构'
            },
            component: () => import('../view/management/organization/organizationFramework'),
          },
          {
            path: '/partyMemberManagement',
            meta: {
              requireAuth: true,
              title: '党员管理'
            },
            component: () => import('../view/management/partyMember/partyMember'),
          },
          {
            path: '/userManage',
            meta: {
              requireAuth: true,
              title: '用户管理'
            },
            component: () => import('../view/management/user/userManage'),
          },
          {
            path: '/authenticationManage',
            meta: {
              requireAuth: true,
              title: '认证管理',
              hidden: true
            },
            component: () => import('../components/container.vue'),
            children: [
              {
                path: '/',
                component: () => import('../view/management/authenticationManage/authenticationManage.vue')
              },
              {
                path: '/viewIdentifyDetails',
                meta: {
                  requireAuth: true,
                  title: '查看认证详情'
                },
                component: () => import('../view/management/authenticationManage/viewIdentifyDetails.vue')
              },
            ]
          },
          {
            path: '/officeManage',
            meta: {
              requireAuth: true,
              title: '职务管理'
            },
            component: () => import('../view/management/officeManage/officeManage'),
          },
          {
            path: '/authorityManage',
            meta: {
              requireAuth: true,
              title: '权限管理'
            },
            component: () => import('../view/management/authorityManage/authorityManage'),
          },
          {
            path: '/systemNotice',
            meta: {
              requireAuth: true,
              title: '系统公告'
            },
            component: () => import('../view/management/systemNotice/systemNotice'),
          },
          {
            path: '/operationLog',
            meta: {
              requireAuth: true,
              title: '操作日志'
            },
            component: () => import('../view/management/operationLog/operationLog'),
          },
          {
            path: '/accountManage',
            meta: {
              requireAuth: true,
              title: '后台账号管理'
            },
            component: () => import('../view/management/accountManage/accountManage'),
          },

        ],
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../components/errorPage/404.vue')
  },
  {
    path: '*',
    name: 'error',
    redirect: '/404'
  }
]

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../view/login/index.vue')
  },
  {
    path: '/',
    redirect: '/admin'
  }

]
const router = new Router({
  mode: 'history',
  routes: constantRouterMap.concat(asyncRouterMap)
})


export default router
