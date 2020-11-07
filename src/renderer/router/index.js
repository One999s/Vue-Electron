import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/index').default
    },
    {
      path: '/logs',
      name: 'logs',
      component: ()=>import('@/pages/logs/index')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
