<script setup>
import { computed, ref } from "vue";
import { useAuth } from "@/logout/useAuth";

const username = computed(() => localStorage.getItem("username"));
const role = computed(() => localStorage.getItem("role"));

const { logOut } = useAuth();
</script>

<template>
  <div class="navbar bg-blue-700 shadow text-white">
    <!-- PHẦN TRÁI -->
    <div class="navbar-start">
      <!-- Mobile menu (dropdown) -->
      <template v-if="role === 'user' || role === 'staff'">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <!-- STAFF MENU (mobile) -->
            <template v-if="role === 'staff'">
              <li><a class="text-base">Danh mục sách</a></li>
              <li><a class="text-base">Đơn mượn sách</a></li>
              <li><a class="text-base">Nhà xuất bản</a></li>
              <li><a class="text-base">Người dùng</a></li>
              <li><a class="text-base">Nhân viên</a></li>
              <li><a class="text-base">Thông tin nhân viên</a></li>
            </template>
            <!-- USER MENU (mobile) -->
            <template v-if="role === 'user'">
              <li><a class="text-base">Danh mục sách</a></li>
              <li><a class="text-base">Kiểm tra đơn mượn sách</a></li>
              <li><a class="text-base">Thông tin người dùng</a></li>
            </template>
          </ul>
        </div>
      </template>

      <!-- Logo -->
      <RouterLink
        to="/"
        class="ml-2 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
        >Booktify</RouterLink
      >
    </div>

    <!-- PHẦN GIỮA (Desktop menu) -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-base">
        <!-- STAFF MENU (desktop) -->
        <template v-if="role === 'staff'">
          <li>
            <RouterLink
              to="/books"
              class="text-base hover:font-bold hover:underline"
              >Danh mục sách</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/borrowrecords"
              class="text-base hover:font-bold hover:underline"
              >Đơn mượn sách</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/publishers"
              class="text-base hover:font-bold hover:underline"
              >Nhà xuất bản</RouterLink
            >
          </li>
          <li>
          <RouterLink
            to="/users"
            class="text-base hover:font-bold hover:underline"
            >Người dùng</RouterLink
          >
          </li>
          <li>
            <a class="text-base hover:font-bold hover:underline">Nhân viên</a>
          </li>
        </template>
        <!-- USER MENU (desktop) -->
        <template v-if="role === 'user'">
          <li>
            <a class="text-base hover:font-bold hover:underline"
              >Danh mục sách</a
            >
          </li>
          <li>
            <a class="text-base hover:font-bold hover:underline"
              >Kiểm tra đơn mượn sách</a
            >
          </li>
        </template>
      </ul>
    </div>

    <!-- PHẦN PHẢI -->
    <div class="navbar-end">
      <!-- Chưa đăng nhập -->
      <template v-if="!username">
        <RouterLink
          to="/user/login"
          class="btn btn- px-4 text-base mr-2 hover:scale-[1.01] cursor-pointer"
        >
          Đăng Nhập
        </RouterLink>
      </template>
      <!-- Đã đăng nhập - user -->
      <template v-else-if="role === 'user'">
        <div class="dropdown dropdown-end">
          <label
            tabindex="0"
            class="btn btn-ghost normal-case text-base font-bold"
          >
            Xin chào, {{ username }}
            <svg
              class="ml-2 h-4 w-4 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
          >
            <li>
              <RouterLink
                to="/user/profile"
                class="text-base-content justify-between"
              >
                Xem thông tin
              </RouterLink>
            </li>
            <li>
              <button @click="logOut" class="text-secondary">Đăng xuất</button>
            </li>
          </ul>
        </div>
      </template>
      <!-- Đã đăng nhập - staff -->
      <template v-else-if="role === 'staff'">
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
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
          >
            <li>
              <RouterLink
                to="/staff/profile"
                class="text-base-content justify-between"
              >
                Xem thông tin
              </RouterLink>
            </li>
            <li>
              <button @click="logOut" class="text-secondary">Đăng xuất</button>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Giữ nguyên hiệu ứng hover, active */
a {
  transition: all 0.2s ease-in-out;
}
</style>
