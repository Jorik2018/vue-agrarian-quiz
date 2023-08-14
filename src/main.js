import Vue from 'vue'
import Router from 'vue-router'
import './cdn/vue-ui.js'
import IsobitUI from 'isobit-ui'
import App from './App.vue'
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';

import './cdn/isobit.css'
Vue.use(Router);
Vue.use(IsobitUI);
Vue.use(Ionic);
Vue.config.ignoredElements = [/^ion-/];   // add this line
Vue.config.productionTip = false;



Vue.filter('upper',(s)=>{
	return s?s.toUpperCase():s;
});
const  router  =  new  Router({
	mode: 'history',
	routes: [
		{
			path:'/login',
			component:  r => require.ensure([], () => r(require('./Login.vue')), 'login')
		},
		{
			path:'/register',
			component:  r => require.ensure([], () => r(require('./Register.vue')), 'register')
		},
				{
			path:'/password',
			component:  r => require.ensure([], () => r(require('./Password.vue')), 'passwords')
		},
		{
			path:'/intro',
			component:  r => require.ensure([], () => r(require('./Intro.vue')), 'introduction-pages')
		},
		{
			path:'/admin/poll/search',props: true,
			component:  r => require.ensure([], () => r(require('./Template2.vue')), 'search'),
		},	
		{
			path:'/admin',
			component:  r => require.ensure([], () => r(require('./Template.vue')), 'template'),
			children:[
							{
					path:'',//./admin/poll/List.vue
					component:  r => require.ensure([], () => r(require('./admin/poll/List.vue')), 'productosgeneral'),
				},
				{
					path:'setting',props: true,
					component:  r => require.ensure([], () => r(require('./admin/Setting.vue')), 'productosgeneral'),
				},
				{
					path:'poll',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/List.vue')), 'productosgeneral'),
				},
				{
					path:'poll/create',
					component:  r => require.ensure([], () => r(require('./admin/poll/Create.vue')), 'createe')
				},
				{
					path:'poll/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/Create.vue')), 'createe')
				},
				{
					path:'poll/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/Create.vue')), 'createe')
				},
				{
					path:'poll/sectionA/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/SeccionA.vue')), 'productosgeneral'),
				},
								{
					path:'poll/peoples/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/people/List.vue')), 'productosgeneral'),
				},
				{
					path:'poll/people/:parent',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/people/Create.vue')), 'productosgeneral'),
				},
				{
					path:'poll/people/:parent/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/people/Create.vue')), 'productosgeneral'),
				},
				
				{
					path:'poll/sectionC/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/SeccionC.vue')), 'productosgeneral'),
				},
				{
					path:'poll/supervise',props: true,
					component:  r => require.ensure([], () => r(require('./admin/supervisor/List.vue')), 'productosgeneral'),
				},
				
				{
					path:'poll/sectionH/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/SeccionH.vue')), 'productosgeneral'),
				},
				{
					path:'poll/sectionI/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/SeccionI.vue')), 'productosgeneral'),
				},
				{
					path: 'notification',
					component:  r => require.ensure([], () => r(require('./Notifications.vue')), 'notifications')
				},				
				{
					path:  'profile',
					component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'profile')
				},
				{
					path:  'poll/create',
					component:  r => require.ensure([], () => r(require('./admin/poll/Create.vue')), 'createe')
				},
				{
					path:  'poll/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/poll/Create.vue')), 'createe')
				}
			]
		},
		{
			path:  '/admin/me',
			component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'admins')
		}
	]
});


localStorage.setItem('intro',true);
router.beforeEach((to, from, next)=>{
	var session = localStorage.getItem('session');
	if(session)session=JSON.parse(session);
	//console.log(session);
	if(session&&to.path == '/logout'){	
		window.app.session=null;
		localStorage.removeItem('session');
		next('/login');
	}else if (session&&!localStorage.getItem('intro')&&to.path != '/intro'){
		next('/intro');
	}else if (!session&&to.path !== '/login'){
		/*if (to.path == '/'&&!localStorage.getItem('intro')){
			next('/admin/poll/intro');
		}else if ((to.path == '/admin/poll/intro'&&!localStorage.getItem('intro'))||*/
		
		if (to.path == '/register'||to.path=='/password'){
			next();
		}else 
			next('/login');
	}else if (to.path == '/'){
		next('/admin');
	}else{
		next();
	}
});
new Vue({
	router,
	render: h => h(App),
	created(){window.$app=this;}
}).$mount('#app')
