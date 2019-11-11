import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import { MessageBox } from 'element-ui';

import Console from '@/components/index/Console'

import Adlist from '@/components/Advertise/Adlist'
import Poster from '@/components/Advertise/Poster'
import Launchrlist from '@/components/Advertise/Launchrlist'

import GPictures from '@/components/Pictureku/GPictures'
import SPictures from '@/components/Pictureku/SPictures'

import Modellist from '@/components/Model/Modellist'
import Modeltype from '@/components/Model/Modeltype'
import Modelnew from '@/components/Model/Modelnew'


// import Goodlist from '@/components/Good/Goodlist'
// import Goodtype from '@/components/Good/Goodtype'
// // import Goodnew from '@/components/Good/Goodnew'
// import Goodrecycle from '@/components/Good/Goodrecycle'

import Igoodnew from '@/components/Integral/Igoodnew'
import Igoodlist from '@/components/Integral/Igoodlist'

import Orderlist from '@/components/Order/Orderlist'
// import Refund from '@/components/Order/Refund'

import Userlist from '@/components/User/Userlist'

// import Memberlist from '@/components/Member/Memberlist'
// import MemberSet from '@/components/Member/MemberSet'

import Proxyapply from '@/components/Agent/Proxyapply'
import Proxylist from '@/components/Agent/Proxylist'
import Withdraw from '@/components/Agent/Withdraw'
import Commission from '@/components/Agent/Commission'


import Delivelist from '@/components/Delivery/Delivelist'


// import Adminlist from '@/components/Role/Adminlist'
// import Rolelist from '@/components/Role/Rolelist'
// import Roleedit from '@/components/Role/Roleedit'

import Baseset from '@/components/Setting/Baseset'
import Levellist from '@/components/Setting/Levellist'
import Wechatset from '@/components/Setting/Wechatset'
import Document from '@/components/Setting/Document'


// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
    mode: 'history', 
    routes: [{
        path: '/Login',
        name: '登录',
        component: Login
    }, 
    // {
    //     leaf: true,
    //     path: '/',
    //     name: '控制',
    //     component: Home,
    //     redirect: '/index/Console',
    //     menuShow: true,
    //     iconCls: 'iconfont menu-kongzhi',
    //     children: [
    //     {path: '/index/Console',component: Console,name: '控制台',menuShow: true,meta:{permission: ''}},
    //     ]
    // },


    {
        path: '/',
        name: '商品管理',
        component: Home,
        redirect: '/Model/Modellist',
        menuShow: true,
        iconCls: 'iconfont menu-kongzhi',
        children: [
        {path: '/Model/Modellist',component: Modellist,name: '商品列表',menuShow: true,meta:{permission: ''}},
        {path: '/Model/Modeltype',component: Modeltype,name: '商品分类',menuShow: true,meta:{permission: ''}},
        {path: '/Model/Modelnew',component: Modelnew,name: '新增商品',menuShow: false,meta:{permission: ''}}
        ]
    },





    {
        leaf: true,
        path: '/',
        name: '订单管理',
        component: Home,
        redirect: '/Order/Orderlist',
        menuShow: true,
        iconCls: 'iconfont menu-dingdan',
        children: [
        {path: '/Order/Orderlist',component: Orderlist,name: '购物订单',menuShow: true,meta:{permission: ''}}, 
        // {path: '/Order/Refund',component: Refund,name: '退款',menuShow: true,meta:{permission: ''}},
        ]
    }, 



    {
        path: '/',
        name: '广告管理',
        component: Home,
        redirect: '/Advertise/Adlist',
        menuShow: true,
        iconCls: 'iconfont menu-guanggao',
        children: [
        {path: '/Advertise/Adlist',component: Adlist,name: '首页轮播',menuShow: true,meta:{permission: 'advertList'}},
        {path: '/Advertise/Launchrlist',component: Launchrlist,name: '登录页轮播',menuShow: true,meta:{permission: 'advertList'}},
        {path: '/Advertise/Poster',component: Poster,name: '分销海报',menuShow: true,meta:{permission: ''}},

        ]
    },

    {
        // leaf: true,
        path: '/',
        name: '图片库',
        component: Home,
        redirect: '/Pictureku/GPictures',
        menuShow: true,
        iconCls: 'iconfont menu-kongzhi',
        children: [
        {path: '/Pictureku/GPictures',component: GPictures,name: '官方图库',menuShow: true,meta:{permission: ''}},
        {path: '/Pictureku/SPictures',component: SPictures,name: '设计师图库',menuShow: true,meta:{permission: ''}},
        ]
    },



    // {
    //     path: '/',
    //     name: '商品管理',
    //     component: Home,
    //     redirect: '/Good/Goodlist',
    //     menuShow: true,
    //     iconCls: 'iconfont menu-good',
    //     children: [
    //     {path: '/Good/Goodnew',component: Goodnew,name: '添加商品',menuShow: false,meta:{permission: 'productAdd'}}, 
    //     {path: '/Good/Goodlist',component: Goodlist,name: '商品列表',menuShow: true,meta:{permission: ''}}, 
    //     {path: '/Good/Goodtype',component: Goodtype,name: '商品分类',menuShow: true,meta:{permission: 'productTypeList'}}, 
    //     {path: '/Good/Goodrecycle',component: Goodrecycle,name: '商品回收站',menuShow: true,meta:{permission: 'productRecycle'}}
    //     ]
    // }, 

    {
        leaf: true,
        path: '/',
        name: '积分商城',
        component: Home,
        redirect: '/Integral/Igoodlist',
        menuShow: true,
        iconCls: 'iconfont menu-card',
        children: [
        {path: '/Integral/Igoodlist',component: Igoodlist,name: '积分商品',menuShow: true,meta:{permission: ''}}, 
        {path: '/Integral/Igoodnew',component: Igoodnew,name: '添加商品',menuShow: false,meta:{permission: ''}}, 

        ]
    },
    {
        leaf: true,
        path: '/',
        name: '用户管理',
        component: Home,
        redirect: '/User/Userlist',
        menuShow: true,
        iconCls: 'iconfont menu-yonghu',
        children: [
        {path: '/User/Userlist',component: Userlist,name: '用户列表',menuShow: true,meta:{permission: 'userList'}},
        ]
    }, 
     // {
    //     path: '/',
    //     name: '会员管理',
    //     component: Home,
    //     redirect: '/Member/Memberlist',
    //     menuShow: true,
    //     iconCls: 'iconfont menu-yonghu',
    //     children: [
    //     {path: '/Member/Memberlist',component: Memberlist,name: '会员列表',menuShow: true,meta:{permission: 'memberList'}},
    //     {path: '/Member/MemberSet',component: MemberSet,name: '等级设置',menuShow: true,meta:{permission: 'memberLevelList'}}
    //     ]
    // },
    {
        path: '/',
        name: '代理管理',
        component: Home,
        redirect: '/Agent/Proxyapply',
        menuShow: true,
        iconCls: 'iconfont menu-agent',
        children: [
        {path: '/Agent/Proxyapply',component: Proxyapply,name: '分销申请',menuShow: true,meta:{permission: 'proxyApplyList'}}, 
        {path: '/Agent/Proxylist',component: Proxylist,name: '代理列表',menuShow: true,meta:{permission: 'proxyList'}}, 
        {path: '/Agent/Commission',component: Commission,name: '佣金管理',menuShow: true,meta:{permission: 'brokerageList'}}, 
        {path: '/Agent/Withdraw',component: Withdraw,name: '提现管理',menuShow: true,meta:{permission: 'withdrawList'}}
        ]
    },
    // {
    //     leaf: true,
    //     path: '/',
    //     name: '广告管理',
    //     component: Home,
    //     redirect: '/Advertise/Adlist',
    //     menuShow: true,
    //     iconCls: 'iconfont menu-guanggao',
    //     children: [
    //     // {path: '/Advertise/Adlist',component: Adlist,name: '广告设置',menuShow: true,meta:{permission: 'advertList'}}
    //     ]
    // },


    // {
    //     path: '/',
    //     name: '权限管理',
    //     component: Home,
    //     redirect: '/Role/Adminlist',
    //     menuShow: true,
    //     iconCls: 'iconfont menu-quanxian',
    //     children: [
    //     {path: '/Role/Adminlist',component: Adminlist,name: '管理员列表',menuShow: true,meta:{permission: 'adminList'}}, 
    //     {path: '/Role/Rolelist',component: Rolelist,name: '角色列表',menuShow: true,meta:{permission: 'roleList'}},
    //     {path: '/Role/Roleedit',component: Roleedit,name: '编辑角色',menuShow: false,meta:{permission: 'roleAdd'}} 
    //     ]
    // },
    {
        leaf: true,
        path: '/',
        name: '快递配置',
        component: Home,
        redirect: '/Delivery/Delivelist',
        menuShow: true,
        iconCls: 'iconfont menu-kuaidi',
        children: [
        {path: '/Delivery/Delivelist',component: Delivelist,name: '快递列表',menuShow: true,meta:{permission: ''}},
        ]
    },
    {
        path: '/',
        name: '系统设置',
        component: Home,
        redirect: '/Setting/Baseset',
        menuShow: true,
        iconCls: 'iconfont menu-xitong',
        children: [
        {path: '/Setting/Baseset',component: Baseset,name: '基本设置',menuShow: true,meta:{permission: 'baseConfig'}},
        {path: '/Setting/Levellist',component: Levellist,name: '设计师等级',menuShow: true,meta:{permission: ''}},
        {path: '/Setting/Wechatset',component: Wechatset,name: '微信设置',menuShow: true,meta:{permission: 'txConfig'}},
        {path: '/Setting/Document',component: Document,name: '帮助文档',menuShow: true,meta:{permission: 'documentList'}}]
    },
    ]
})





// router.beforeEach((to, from, next) => {
//     if (to.path.startsWith('/Login')) {
//         next()
//     } else {
//         let permissions = window.sessionStorage.getItem('permissions')
//         if(!permissions){
//             next({path: '/Login'})
//         }
//         // console.log(permissions.indexOf(to.meta.permission))
//         if (to.meta.permission && permissions) {
//             if (permissions.indexOf(to.meta.permission)>-1) {
//               next()
//           } else {
//              MessageBox.alert('没有访问权限', '提示', {
//                 confirmButtonText: '确定',
//                 closeOnPressEscape:false,
//                 showClose:false,
//                 callback: action => {

//                 }
//             });
//          }
//      }else{
//        next() 
//    }
// }
// })

router.afterEach((transition) => {

// console.log(transition)

})

export default router