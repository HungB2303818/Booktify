<script setup>
import { authRole, authUsername, authUserId } from "@/stores/auth";
import { useAuth } from "@/logout/useAuth";
import { useRouter } from "vue-router";

const role = authRole;
const username = authUsername;
const user_id = authUserId;

const { logOut } = useAuth(role, username, user_id);
const router = useRouter();
const gotoBorrowRecords = () => {
  const path =
    role.value === "user"
      ? `/borrowrecords/${user_id.value}`
      : "/borrowrecords";

  router.push(path);
};
window.addEventListener("storage", () => {
  role.value = localStorage.getItem("role");
  username.value = localStorage.getItem("username");
  user_id.value = localStorage.getItem("id");
});

</script>

<template>
  <div class="sticky top-0 z-50 navbar bg-blue-700 shadow text-white h-[48px]">
    <!-- PHẦN TRÁI -->
    <div v-if="role !== 'staff'" class="navbar-start">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="ml-2 text-base md:text-xl lg:text-2xl font-bold cursor-pointer"
        >Booktify</RouterLink
      >
    </div>
    <div v-else class="navbar-start">
      <RouterLink
        to="/home/staff"
        class="ml-2 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
        >Booktify</RouterLink
      >
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-base gap-6">
        <!-- STAFF MENU-->
        <template v-if="role === 'staff'">
          <li>
            <RouterLink
              to="/books"
              class="text-base rounded-xl font-semibold hover:font-bold"
              >Danh mục sách</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/borrowrecords"
              class="text-base rounded-xl font-semibold hover:font-bold"
              >Đơn mượn sách</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/publishers"
              class="text-base rounded-xl font-semibold hover:font-bold"
              >Nhà xuất bản</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/users"
              class="text-base rounded-xl font-semibold hover:font-bold"
              >Người dùng</RouterLink
            >
          </li>
        </template>
        <template v-if="role !== 'staff'">
          <ul class="hidden md:flex items-center gap-6 font-medium">
            <li class="hover:bg-blue-600 rounded-xl transition cursor-pointer">
              <RouterLink to="/">Trang chủ</RouterLink>
            </li>
            <li class="hover:text-black cursor-pointer">
              <router-link to="/#books">Sách</router-link>
            </li>
            <li class="hover:bg-blue-600 rounded-xl transition cursor-pointer">
              <RouterLink to="/aboutus">Giới thiệu</RouterLink>
            </li>
            <li class="hover:bg-blue-600 rounded-xl transition cursor-pointer">
              <RouterLink to="/contact">Liên hệ</RouterLink>
            </li>
          </ul>
        </template>
      </ul>
    </div>

    <!-- PHẦN PHẢI -->
    <div class="navbar-end">
      <!-- Chưa đăng nhập -->
      <template v-if="!username">
        <RouterLink
          to="/user/login"
          class="px-5 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-100 active:scale-95 transition"
        >
          Đăng Nhập
        </RouterLink>
      </template>
      <!-- Đã đăng nhập - user -->
      <template v-else>
        <div v-if="role==='user'" class="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 hover:scale-[1.05] cursor-pointer"
            @click="gotoBorrowRecords"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>

        <div class="dropdown dropdown-end">
          <label
            tabindex="0"
            class="btn btn-ghost normal-case text-base font-bold"
          >
            {{ username }}
            <svg
              class="ml-2 h-4 w-4 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>

          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
          >
            <li v-if="role==='user'">
              <RouterLink to="/user/profile" class="text-base-content">
                Xem thông tin
              </RouterLink>
            </li>
             <li v-else>
              <RouterLink to="/staff/profile" class="text-base-content">
                Xem thông tin
              </RouterLink>
            </li>
            <li>
              <button @click="logOut" class="text-error">Đăng xuất</button>
            </li>
          </ul>
        </div>
      </template>
      <!-- Đã đăng nhập - staff -->
      
    </div>
  </div>
</template>

<style scoped></style>
