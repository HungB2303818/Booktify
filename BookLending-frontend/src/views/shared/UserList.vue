<script setup>
import { ref, onMounted } from "vue";
import UserService from "@/services/user.service";
import { push } from "notivue";
import UserCard from "@/components/UserCard.vue";
const users = ref([]);

const userService = new UserService();
const totalUsers = ref(0);
const fetchUsers = async () => {
  try {
    users.value = await userService.getAllUsers();
    totalUsers.value = users.value.length;
  } catch (error) {
    console.log(error);
    push.error("Không thể tải danh sách người dùng");
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="p-4 w-screen min-h-screen bg-zinc-100 mx-auto">
    <div class="max-w-6xl mx-auto mb-6">
      <h1 class="text-4xl font-bold">Danh sách người dùng</h1>
      <p class="text-gray-600 mt-1 text-lg">Tổng người dùng: {{ totalUsers }}</p>
    </div>
    <div
      class="max-w-6xl mx-auto rounded-box border border-base-content/5 bg-base-100"
    >
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-content-neutral">
          <tr>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Họ và tên
            </th>
            <th
              class="w-[140px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Tên đăng nhập
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Ngày sinh
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Giới tính
            </th>
            <th
              class="w-[100px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Địa chỉ
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Số điện thoại
            </th>
            <th
              class="w-[100px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <UserCard
            v-for="user in users"
            :key="user._id"
            :user="user"
            @fetchUsers="fetchUsers"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
