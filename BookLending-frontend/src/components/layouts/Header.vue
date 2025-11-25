<script setup>
import { computed, ref } from "vue";
import { useAuth } from "@/logout/useAuth";
import { useRouter } from "vue-router";
const username = computed(() => localStorage.getItem("username"));
const role = computed(() => localStorage.getItem("role"));
const user_id = computed(() => localStorage.getItem("id"));
const { logOut } = useAuth();
const router = useRouter();
const gotoBorrowRecords = () => {
  const path =
    role.value === "user"
      ? `/borrowrecords/${user_id.value}`
      : "/borrowrecords";

  router.push(path);
};
</script>

<template>
  <div class="navbar bg-blue-700 shadow text-white">
    <!-- PHẦN TRÁI -->
    <div class="navbar-start">
      <!-- Logo -->
      <RouterLink
        to="/"
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
              class="text-base font-medium hover:font-bold"
              >Danh mục sách</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/borrowrecords" class="text-base hover:font-bold"
              >Đơn mượn sách</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/publishers" class="text-base hover:font-bold"
              >Nhà xuất bản</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/users" class="text-base hover:font-bold"
              >Người dùng</RouterLink
            >
          </li>
          <li>
            <a class="text-base hover:font-bold">Nhân viên</a>
          </li>
        </template>
        <!-- USER MENU -->
        <template v-if="role === 'user'">
          <li>
            <RouterLink
              to="/books"
              class="text-base hover:font-bold hover:underline"
              >Danh mục sách</RouterLink
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
          class="px-4 py-1 rounded-md bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
        >
          Đăng Nhập
        </RouterLink>
      </template>
      <!-- Đã đăng nhập - user -->
      <template v-else-if="role === 'user'">
        <div class="text-white">
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
            <li>
              <RouterLink to="/user/profile" class="text-base-content">
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
