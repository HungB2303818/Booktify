<script setup>
import { ref, computed, onMounted } from "vue";
import StaffService from "@/services/staff.service";
import { useRouter } from "vue-router";

const router = useRouter();
const staffService = new StaffService();
const staff = ref({});
const staff_id = computed(() => localStorage.getItem("id"));

const goToUserProfileEdit = async (staff_id) => {
  router.push({ name: "staffprofile.edit", params: { id: staff_id } });
};

onMounted(async () => {
  try {
    const staff_data = await staffService.getStaff(staff_id.value);
    staff.value = staff_data;
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
          v-if="staff.avatar"
          :src="staff.avatar"
          alt="Avatar"
          class="w-full h-full rounded-full object-cover"
        />
        <i v-else class="fa-regular fa-user text-5xl text-gray-500"></i>
      </div>

      <!-- Name -->
      <h2 class="mt-4 text-2xl font-bold text-gray-900">
        {{ staff.name || "Người dùng" }}
      </h2>

      <!-- Username -->
      <p class="text-gray-500 -mt-1">
        @{{ staff.username || "unknown" }}
      </p>
    </div>

    <!-- PERSONAL INFO CARD -->
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow px-8 py-6">
      <h3 class="text-xl font-semibold mb-4">Thông tin nhân viên</h3>

      <!-- GRID INFO (3 COLUMNS) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 py-2">

        <!-- Tên -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-regular fa-user"></i>
            <span>Tên</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ staff.name || "Không xác định" }}
          </p>
        </div>

        <!-- Tên đăng nhập -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-at"></i>
            <span>Tên đăng nhập</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            @{{ staff.username || "Không xác định" }}
          </p>
        </div>
        <!-- Địa chỉ -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-location-dot"></i>
            <span>Địa chỉ</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ staff.address || "Không xác định" }}
          </p>
        </div>

        <!-- Số điện thoại -->
        <div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="fa-solid fa-phone"></i>
            <span>Số điện thoại</span>
          </div>
          <p class="font-medium text-gray-900 mt-1">
            {{ staff.phone || "Không xác định" }}
          </p>
        </div>

      </div>

      <!-- BUTTON -->
      <div class="flex justify-end mt-8">
        <button
          @click="goToUserProfileEdit(staff_id)"
          class="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition active:scale-95 cursor-pointer"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  </div>
</template>
