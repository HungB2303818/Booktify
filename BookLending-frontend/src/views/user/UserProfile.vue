<script setup>
import { useAuth } from "@/logout/useAuth";
import { ref, computed, onMounted } from "vue";
import UserService from "@/services/user.service";
import { useRouter } from "vue-router";

const router = useRouter();
const { logOut } = useAuth();
const userService = new UserService();
const user = ref({});
const user_id = computed(() => localStorage.getItem("id"));

const goToUserProfileEdit = async (user_id) => {
  router.push({ name: "userprofile.edit", params: { id: user_id } });
};

onMounted(async () => {
  try {
    const user_data = await userService.getUser(user_id.value);
    user.value = user_data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10"
  >
    <div class="card bg-base-100 shadow-xl w-full max-w-2xl">
      <div class="card-body">
        <div class="mb-4">
          <h2 class="text-2xl font-bold">Thông tin người dùng</h2>
        </div>

        <!-- Danh sách thông tin -->
        <dl class="divide-y divide-base-300 text-base">
          <!-- Họ tên -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Tên</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ user.name || "Không xác định" }}
            </dd>
          </div>

          <!-- Tên đăng nhập -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Tên đăng nhập</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ user.username || "Không xác định" }}
            </dd>
          </div>

          <!-- Ngày sinh -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Ngày sinh</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{
                user.birthdate
                  ? new Date(user.birthdate).toLocaleDateString("vi-VN")
                  : "Không xác định"
              }}
            </dd>
          </div>

          <!-- Giới tính -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Giới tính</dt>
            <dd class="text-gray-700 sm:col-span-2">
              <template v-if="user.sex === true">Nam</template>
              <template v-else-if="user.sex === false">Nữ</template>
              <template v-else>Không xác định</template>
            </dd>
          </div>

          <!-- Địa chỉ -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Địa chỉ</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ user.address || "Không xác định" }}
            </dd>
          </div>

          <!-- Số điện thoại -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Số điện thoại</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ user.phone || "Không xác định" }}
            </dd>
          </div>
        </dl>

        <!-- Nút chỉnh sửa -->
        <div class="card-actions justify-end mt-6">
          <button
            @click="goToUserProfileEdit(user_id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            <i class="fa-solid fa-pen-to-square text-white text-sm"></i>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
