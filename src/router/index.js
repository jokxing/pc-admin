import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    component: resolve => require(['../views/index.vue'], resolve),
    redirect: '/home',
    meta:{
			requireAuth: true,
		},
    children:[
      { 
        path:'/home', 
        name: '首页',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/home/home.vue'], resolve)
			},
      { 
        path:'/notice', 
        name: '公告',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/notice/notice.vue'], resolve)
			},
      { 
        path:'/notice/noticeDetails/:id', 
        name: '公告详情',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/notice/noticeDetails.vue'], resolve)
      },
      // 管理中心
      { 
        path:'/memberList', 
        name: '会员管理',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/management/memberList.vue'], resolve)
			},
      { 
        path:'/lowerLevelMemberList', 
        name: 'lowerLevelMemberList',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/management/lowerLevelMemberList.vue'], resolve)
			},
      { 
        path:'/checUser', 
        name: '会员注销查询',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/management/checUser.vue'], resolve)
			},
      { 
        path:'/changeLine', 
        name: '会员转线申请',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/management/changeLine.vue'], resolve)
			},
      { 
        path:'/changeLine/changeLineLogsList', 
        name: '调线记录',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/management/changeLineLogsList.vue'], resolve)
			},
      { 
        path:'/changeLeve', 
        name: '会员调级申请',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/management/changeLeve.vue'], resolve)
			},
      { 
        path:'/changeLeve/transformRecord', 
        name: '调级记录',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/management/transformRecord.vue'], resolve)
      },
      { 
        path:'/agentSubordinate', 
        name: '下级管理',
        meta:{
          requireAuth: true,
          level: ['1','2']
        },
        component: resolve => require(['../views/management/agentSubordinate.vue'], resolve)
      },
      { 
        path:'/agentSubordinate/threeLevelAgency/:id', 
        name: '三级代理',
        meta:{
          requireAuth: true,
          level: ['1']
        },
        component: resolve => require(['../views/management/threeLevelAgency.vue'], resolve)
      },
      { 
        path:'/userFund', 
        name: '存提款记录',
        meta:{
          requireAuth: true,
          level: ['1','2','3']
        },
        component: resolve => require(['../views/memberRecord/userFund.vue'], resolve)
      },
      // 财务中心
      { 
        path:'/withdraw', 
        name: '提现专区',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/finance/withdraw.vue'], resolve)
			},
      { 
        path:'/withdraw/drawing', 
        name: 'drawing',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/finance/drawing.vue'], resolve)
			},
      { 
        path:'/withdraw/safetyVerification', 
        name: '提款安全验证',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/finance/safetyVerification.vue'], resolve)
			},
      { 
        path:'/agentDeposit', 
        name: '会员代存',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/finance/agentDepBon.vue'], resolve)
			},
      { 
        path:'/agentBonus', 
        name: '礼金赠送',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/finance/agentDepBon.vue'], resolve)
      },
      { 
        path:'/agentFundflow', 
        name: '代存转账记录',
        meta:{
          requireAuth: true,
          level: ['1','2']
        },
        component: resolve => require(['../views/finance/agentFundflow.vue'], resolve)
      },
      // 报表中心
      { 
        path:'/payoutReport', 
        name: 'payoutReport',
        meta:{
          requireAuth: true,
          level: ['1','2', '3']
        },
        component: resolve => require(['../views/reportCenter/payoutReport.vue'], resolve)
			},
      { 
        path:'/payoutReport/threePayoutReport/:id', 
        name: 'threePayoutReport',
        meta:{
          requireAuth: true,
          level: ['1']
        },
        component: resolve => require(['../views/reportCenter/threePayoutReport .vue'], resolve)
			},
      { 
        path:'/commissionReport', 
        name: '财务报表',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/reportCenter/commissionReport.vue'], resolve)
			},
      { 
        path:'/userReport', 
        name: '会员报表',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/reportCenter/userReport.vue'], resolve)
			},
      { 
        path:'/invitationRewardReport', 
        name: '邀请有奖报表',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/reportCenter/invitationRewardReport.vue'], resolve)
      },
      { 
        path:'/InvitAgentRewardReport', 
        name: '代理邀请报表',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/reportCenter/InvitAgentRewardReport.vue'], resolve)
      },
      // 推广专区
      { 
        path:'/agentImport', 
        name: '推广网址',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/promotionZone/agentImport.vue'], resolve)
			},
      { 
        path:'/agentSet', 
        name: '推广素材',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/promotionZone/agentSet.vue'], resolve)
      },
      { 
        path:'/generaAgentRegImport', 
        name: '代理邀请推广',
        meta:{
          requireAuth: true,
          level: ['3']
        },
        component: resolve => require(['../views/promotionZone/generaAgentRegImport.vue'], resolve)
			},
      // 个人中心
      { 
        path:'/information', 
        name: '个人资料',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/personalCenter/information.vue'], resolve)
			},
      { 
        path:'/contactUs', 
        name: '联系我们',
        meta:{
          requireAuth: true,
        },
        component: resolve => require(['../views/personalCenter/contactUs.vue'], resolve)
			},
      { 
        path:'/vipOnly', 
        name: 'VIP专享',
        meta:{
          requireAuth: true,
          level: ['1','2','3']
        },
        component: resolve => require(['../views/personalCenter/vipOnly.vue'], resolve)
			},
    ]
  },
  { 
    path:'/login', 
    name: '登录',
    component: resolve => require(['../views/login/login.vue'], resolve)
  },
  { 
    path:'/register', 
    name: '注册',
    component: resolve => require(['../views/login/login.vue'], resolve)
  },

  { 
    path:'/generatePicture', 
    name: '生成图片',
    meta:{
      requireAuth: true,
      level: ['3']
    },
    component: resolve => require(['../views/promotionZone/generatePicture.vue'], resolve)
  },

  { 
    path:'/404', 
    name: '404',
    component: resolve => require(['../views/404.vue'], resolve)
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.query.access_token && to.query.access_token != ''){
    localStorage.setItem('access_token', to.query.access_token)
  }
  
  var level_id = localStorage.getItem('level_id')

	if(to.meta.requireAuth == true){
    if(localStorage.getItem("access_token") || to.query.access_token) {
      if(to.meta.level){
        // PC端
        if(!to.query.access_token){
          if(to.meta.level.indexOf(level_id) != -1){
            next()
          }else{
            if(to.path.indexOf('withdraw') != -1 || to.path.indexOf('commissionReport')){
              var bill_wtd = JSON.parse(localStorage.getItem('bill_wtd'))
              if(bill_wtd){
                next()
              }else{
                next('/404')
              }
            }else{
              next('/404')
            }
          }
        // app在url传access_token
        }else{
          next()
        }
      }else{
        next()
      }
    }else{
      next('/login')
    }
	}else{
    if(localStorage.getItem("access_token") && to.path == '/login') {
      next('/home')
    }else{
      next()
    }
  }
});

//路由跳转后，页面回到顶部
router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router
