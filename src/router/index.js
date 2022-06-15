import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LoginRegister from '@/pages/LoginRegister'
import Home from '@/pages/Home'
import SearchBooks from '@/pages/Home/SearchBooks'
import AdminSubscribe from '@/pages/Home/AdminSubscribe'
import ReaderBorrows from '@/pages/Home/ReaderBorrows'
import AdminBorrows from '@/pages/Home/AdminBorrows'
import Comment from '@/pages/Home/Comment'
import Introduce from '@/pages/Home/Introduce'
import AdminPerson from '@/pages/Home/AdminPerson'
import AdminAddBooks from '@/pages/Home/AdminAddBooks'
import AdminReport from '@/pages/Home/AdminReport'
import ReaderReport from '@/pages/Home/ReaderReport'

export default new VueRouter({
    routes: [{
            path: '*',
            redirect: '/LoginRegister'
        },
        {
            path: '/LoginRegister',
            component: LoginRegister
        },
        {
            path: '/home',
            component: Home,
            children: [{
                    path: '/',
                    component: Introduce,
                },
                {
                    //    主页介绍
                    path: 'introduce',
                    component: Introduce,
                },
                {
                    //    人员管理
                    path: 'person',
                    component: AdminPerson,
                },
                {
                    //    书籍查询
                    path: 'search',
                    component: SearchBooks,
                },
                {
                    //    举报审核
                    path: 'adminreport',
                    component: AdminReport,
                },
                {
                    //    评论区记录
                    path: 'comment',
                    component: Comment,
                },
                {
                    //    读者借阅记录
                    path: 'readerborrows',
                    component: ReaderBorrows,
                },
                {
                    //     读者举报反馈
                    path: 'readerreport',
                    component: ReaderReport
                },
                {
                    //    管理员管理借阅记录
                    path: 'adminborrows',
                    component: AdminBorrows,
                },
                {
                    //    管理员管理预约记录
                    path: 'adminsubcribe',
                    component: AdminSubscribe,
                }, {
                    //    管理员添加图书
                    path: 'adminaddbooks',
                    component: AdminAddBooks,
                },
            ]
        }
    ]
})