import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/shared/HomeUser.vue"),
  },
  {
    path: "/user/login",
    name: "user.login",
    component: () => import("../views/auth/UserLogin.vue"),
  },
  {
    path: "/user/register",
    name: "user.register",
    component: () => import("../views/auth/UserRegister.vue"),
  },
  {
    path: "/user/profile",
    name: "userprofile",
    component: () => import("../views/user/UserProfile.vue"),
  },
  {
    path: "/user/:id/edit",
    name: "userprofile.edit",
    component: () => import("../views/user/UserProfileEdit.vue"),
  },
  {
    path: "/staff/login",
    name: "staff.login",
    component: () => import("../views/auth/StaffLogin.vue"),
  },
  {
    path: "/staff/profile",
    name: "staffprofile",
    component: () => import("../views/staff/StaffProfile.vue"),
  },
  {
    path: "/staff/:id/edit",
    name: "staffprofile.edit",
    component: () => import("../views/staff/StaffProfileEdit.vue"),
  },
  {
    path: "/publishers",
    name: "publishers",
    component: () => import("../views/shared/PublisherList.vue"),
  },
  {
    path: "/books",
    name: "books",
    component: () => import("../views/shared/BookList.vue"),
  },
  {
    path: "/borrowrecords",
    name: "borrowrecords",
    component: () => import("../views/shared/BorrowList.vue"),
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/shared/UserList.vue"),
  },
  {
    path: "/publishers/add",
    name: "publisher.add",
    component: () => import("../views/shared/PublisherAdd.vue"),
  },
  {
    path: "/books/:id",
    name: "book.detail",
    component: () => import("../views/shared/BookDetail.vue"),
  },
  {
    path: "/books/add",
    name: "book.add",
    component: () => import("../views/shared/BookAdd.vue"),
  },
  {
    path: "/books/edit/:id",
    name: "book.edit",
    component: () => import("../views/shared/BookEdit.vue"),
  },
  {
    path: "/borrows/add/:id",
    name: "borrow.add",
    component: () => import("../views/shared/BorrowAdd.vue"),
  },
  {
    path: "/borrowrecords/:id",
    name: "borrowrecord.detail",
    component: () => import("../views/shared/BorrowList.vue"),
  },
  {
    path: "/home/staff",
    name: "home.staff",
    component: () => import("../views/shared/HomeStaff.vue")
  },
  {
    path: "/aboutus",
    name: "aboutus",
    component: () => import("../views/shared/AboutUs.vue")
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/shared/Contact.vue")
  },
  {
    path: "/borrow/:id",
    name: "borrow.detail",
    component: () => import("../views/shared/BorrowDetail.vue")
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;