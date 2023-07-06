import { createRouter, createWebHashHistory } from "vue-router"

import INDEX from '@/components/index.vue'
const Home = () => import(/* webpackChunkName: 'Home' */'@/views/home.vue')
const company_home = () => import(/* webpackChunkName: 'company_home' */'@/views/company_home/index.vue')
const perfect_company = () => import(/* webpackChunkName: 'perfect_company' */'@/views/perfect_company.vue')

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import("../views/login.vue"),
      meta: {}
    },
    {
      path: '/',
      redirect: '/home',
      component: INDEX,
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
          meta: {
            bgColor:'#ffffff'
          }
        },
        {
          path: 'company_home',
          name: 'company_home',
          component: company_home
        },
        {
          path: 'perfect_company',
          name: 'perfect_company',
          component: perfect_company
        }
      ]
    },
    {
      path: '/404',
      component: () => import('../views/404.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})
