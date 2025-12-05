<script setup>
import UserService from "../services/user.service";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { push } from "notivue";
// Nhận props
const { user } = defineProps(["user"]);
const userService = new UserService();
const emit = defineEmits(["fetchUsers"]);

const handleDeleteUser = async (user_id) => {
  try {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      await userService.deleteUser(user_id);
      emit("fetchUsers");
      push.success("Xóa người dùng thành công");
    }
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi xóa người dùng");
  }
};
</script>

<template>
  <tr>
    <!-- Họ và tên -->
    <td class="whitespace-nowrap px-6 py-4 text-medium">
      {{ user.name }}
    </td>

    <!-- Tên đăng nhập -->
    <td class="px-6 py-4 text-sm text-black font-bold">
      {{ user.username }}
    </td>

    <!-- Ngày sinh -->
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{
        user.birthdate
          ? new Date(user.birthdate).toLocaleDateString("vi-VN")
          : "Không xác định"
      }}
    </td>
    <td class="px-6 py-4 text-sm text-black">
      {{ user.sex === true ? "Nữ" : "Nam" }}
    </td>
    <td class="px-6 py-4 text-sm text-black">
      {{ user.address }}
    </td>

    <td class="px-6 py-4 text-sm text-black">
      {{ user.phone }}
    </td>

    <td class="px-6 py-4 text-center align-middle">
      <div class="flex justify-center gap-3">
        <button
          @click="handleDeleteUser(user._id)"
          class="text-red-600 transition-all hover:text-green-900 cursor-pointer underline"
        >
          <i class="fa-solid fa-trash text-lg"></i>
        </button>
      </div>
    </td>
  </tr>
</template>
