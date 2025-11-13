<script setup>
import { useAuth } from "@/logout/useAuth";
import { ref, computed, onMounted } from "vue";
import StaffService from "@/services/staff.service";
import { useRouter } from "vue-router";

const router = useRouter();
const { logOut } = useAuth();
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
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
    <div class="card bg-base-100 shadow-xl w-full max-w-2xl">
      <div class="card-body">
        <!-- Tiêu đề -->
        <h2 class="card-title text-2xl font-bold text-center text-blue-700 mb-6">
          Thông tin nhân viên
        </h2>

        <!-- Danh sách thông tin -->
        <dl class="divide-y divide-base-300 text-base">
          <!-- Họ tên -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Tên</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ staff.name || "Không xác định" }}
            </dd>
          </div>

          <!-- Tên đăng nhập -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Tên đăng nhập</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ staff.username || "Không xác định" }}
            </dd>
          </div>

          <!-- Giới tính -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Giới tính</dt>
            <dd class="text-gray-700 sm:col-span-2">
              <template v-if="staff.sex === true">Nam</template>
              <template v-else-if="staff.sex === false">Nữ</template>
              <template v-else>Không xác định</template>
            </dd>
          </div>

          <!-- Địa chỉ -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Địa chỉ</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ staff.address || "Không xác định" }}
            </dd>
          </div>

          <!-- Số điện thoại -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
            <dt class="font-semibold text-gray-900">Số điện thoại</dt>
            <dd class="text-gray-700 sm:col-span-2">
              {{ staff.phone || "Không xác định" }}
            </dd>
          </div>
        </dl>

        <!-- Nút hành động -->
        <div class="card-actions justify-start mt-6">
          <button
            @click="goToUserProfileEdit(user_id)"
            class="btn btn-warning hover:scale-[1.02] transition-transform"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

