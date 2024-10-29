import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/store';
import { accessRole } from "../composables/user";
import { decodeJWT } from '@/stores/token';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/view/home',
      name: 'MembersDashboard',
      component: () => import('../views/members/HomeView.vue'),
      meta: { requiresAuth: 'member' }
    },
    {
      path: '/view/about',
      name: 'MembersAbout',
      component: () => import('../views/members/AboutView.vue'),
      meta: { requiresAuth: 'member' }
    },
    {
      path: '/view/contact',
      name: 'MembersContact',
      component: () => import('../views/members/ContactView.vue'),
      meta: { requiresAuth: 'member' }
    },
    {
      path: '/view/gallery',
      name: 'MembersGallery',
      component: () => import('../views/members/GalleryView.vue'),
      meta: { requiresAuth: 'member' }
    },
    {
      path: '/view/events',
      name: 'MembersEvents',
      component: () => import('../views/members/EventView.vue'),
      meta: { requiresAuth: 'member' }
    },
    {
      path: '/view/profile',
      name: 'MembersProfile',
      component: () => import('../views/members/ProfileView.vue'),
      meta: { requiresAuth: 'member' }
    },
    // leaders
    {
      path: '/view/page/home',
      name: 'LeadersDashboard',
      component: () => import('../views/leaders/HomeView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/post',
      name: 'LeadersPost',
      component: () => import('../views/leaders/PostView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/inflow',
      name: 'LeadersInflow',
      component: () => import('../views/leaders/InflowView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/expense',
      name: 'LeadersExpense',
      component: () => import('../views/leaders/ExpenseView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/savings',
      name: 'LeadersSavings',
      component: () => import('../views/leaders/SavingsView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/summary',
      name: 'LeadersSummary',
      component: () => import('../views/leaders/SummaryView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/profile',
      name: 'LeadersProfile',
      component: () => import('../views/members/ProfileView.vue'),
      meta: { requiresAuth: 'leader' }
    },
    {
      path: '/view/page/manage/home',
      name: 'AdminDashboard',
      component: () => import('../views/admin/HomeView.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/view/page/manage/leader',
      name: 'AdminLeader',
      component: () => import('../views/admin/LeaderView.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/view/page/manage/member',
      name: 'AdminMember',
      component: () => import('../views/admin/MemberView.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/view/page/manage/inflow',
      name: 'AdminInflow',
      component: () => import('../views/admin/InflowView.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/view/page/manage/expense',
      name: 'AdminExpense',
      component: () => import('../views/admin/ExpenseView.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/view/page/manage/inbox',
      name: 'AdminInbox',
      component: () => import('../views/admin/InboxView.vue'),
      meta: { requiresAuth: 'admin' }
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  await accessRole();
  const token = useAuthStore();
  const isToken = token.getToken();
  let accessToken='';
  if(localStorage.getItem("access")){
    accessToken = decodeJWT(localStorage.getItem("access"));
  }
  const switching = accessToken.role || 'member';
  const role = token.getRole().role==='leader'? {role:switching}:token.getRole();


  if (to.meta.requiresAuth) {
    if (isToken) {
      if (to.meta.requiresAuth === role.role) {
        next();
      } else {
        if (role.role === 'admin') {
          next({ name: 'AdminDashboard' });
        } else if (role.role === 'leader') {
          next({ name: 'LeadersDashboard' });
        } else if (role.role === 'member') {
          next({ name: 'MembersDashboard' });
        }
        else {
          next({ name: 'home' });
        }
      }
    } else {
      next({ name: 'home' });
    }
  } else {
    if (isToken) {

      if (role.role === 'admin') {
        next({ name: 'AdminDashboard' });
      } else if (role.role === 'leader') {
        next({ name: 'LeadersDashboard' });
      } else if (role.role === 'member') {
        next({ name: 'MembersDashboard' });
      } else {
        next();
      }
    } else {
      next();

    }
  }

});

export default router