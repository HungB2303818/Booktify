<script setup>
import { ref, computed, onMounted } from "vue";
import UserService from "@/services/user.service";
import { useRouter } from "vue-router";

const router = useRouter();
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
  <div class="min-h-screen bg-gray-100 pt-10 px-4 pb-20">
    <!-- AVATAR + NAME SECTION -->
    <div class="flex flex-col items-center mb-10">
      <!-- Avatar -->
      <div class="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          alt="Avatar"
          class="w-full h-full rounded-full object-cover"
        />
        <i v-else class="fa-regular fa-user text-5xl text-gray-500"></i>
      </div>

      <!-- Name -->
      <h2 class="mt-4 text-2xl font-bold text-gray-900">
        {{ user.name || "Người dùng" }}
      </h2>

      <!-- Username -->
      <p class="text-gray-500 -mt-1">
        @{{ user.username || "unknown" }}
      </p>
    </div>

    <!-- PERSONAL INFO CARD -->
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow px-8 py-6">
      <h3 class="text-xl font-semibold mb-4">Thông tin cá nhân</h3>

      <!-- GRID INFO (3 COLUMNS) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">

        <!-- Tên -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-regular fa-user"></i>
            <span>Tên</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ user.name || "Không xác định" }}
          </p>
        </div>

        <!-- Tên đăng nhập -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-at"></i>
            <span>Tên đăng nhập</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            @{{ user.username || "Không xác định" }}
          </p>
        </div>

        <!-- Ngày sinh -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-regular fa-calendar"></i>
            <span>Ngày sinh</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{
              user.birthdate
                ? new Date(user.birthdate).toLocaleDateString("vi-VN")
                : "Không xác định"
            }}
          </p>
        </div>

        <!-- Giới tính -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-people-group"></i>
            <span>Giới tính</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            <template v-if="user.sex === 'true'">Nam</template>
            <template v-else-if="user.sex === 'false'">Nữ</template>
            <template v-else>Không xác định</template>
          </p>
        </div>

        <!-- Địa chỉ -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-location-dot"></i>
            <span>Địa chỉ</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ user.address || "Không xác định" }}
          </p>
        </div>

        <!-- Số điện thoại -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-phone"></i>
            <span>Số điện thoại</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ user.phone || "Không xác định" }}
          </p>
        </div>

      </div>

      <!-- BUTTON -->
      <div class="flex justify-end mt-8">
        <button
          @click="goToUserProfileEdit(user_id)"
          class="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  </div>
</template>

