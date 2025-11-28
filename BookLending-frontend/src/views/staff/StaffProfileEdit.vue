<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import { staffSchema } from "@/validations/staff.validation";
import StaffService from "@/services/staff.service";
import { useForm, useField } from "vee-validate";

const staffService = new StaffService();
const router = useRouter();
const route = useRoute();
const role = computed(() => localStorage.getItem("role"));
const staff = ref({});
const staff_id = computed(() => localStorage.getItem("id"));

const { handleSubmit, resetForm } = useForm({
  validationSchema: staffSchema,
});

const { value: name, errorMessage: nameError } = useField("name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const handleUserProfileEdit = handleSubmit(async (values) => {
  try {
    await staffService.updateStaff(staff_id.value, values);
    push.success("Cập nhật thông tin nhân viên thành công");
    router.push("/staff/profile");
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response?.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      push.error("Đã xảy ra lỗi khi cập nhật thông tin nhân viên");
    }
  }
});

// ====== INIT VALUES ======
onMounted(async () => {
  const staff_data = await staffService.getStaff(staff_id.value);
  staff.value = staff_data;
  resetForm({
    values: {
      name: staff.value.name || "",
      username: staff.value.username || "",
      password: "",
      address: staff.value.address || "",
      phone: staff.value.phone || "",
    },
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4 py-10">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-center mb-10">Chỉnh sửa thông tin</h1>

    <!-- Avatar -->
    <div class="flex flex-col items-center mb-8">
      <div
        class="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow"
      >
        <img v-if="avatar" :src="avatar" class="w-full h-full object-cover" />
        <i v-else class="fa-regular fa-user text-5xl text-gray-500"></i>
      </div>
    </div>

    <!-- FORM CARD -->
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
      <form @submit.prevent="handleUserProfileEdit" class="space-y-6">
        <!-- GRID FORM 2 COLUMNS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- TÊN -->
          <div>
            <label class="font-medium flex items-center gap-2 mb-1">
              <i class="fa-regular fa-user"></i>
              Tên
            </label>
            <input
              name="name"
              v-model="name"
              type="text"
              class="input input-bordered w-full"
              placeholder="Nhập tên"
            />
            <p class="text-sm text-red-600">{{ nameError }}</p>
          </div>

          <!-- TÊN ĐĂNG NHẬP -->
          <div>
            <label class="font-medium flex items-center gap-2 mb-1">
              <i class="fa-solid fa-at"></i>
              Tên đăng nhập
            </label>
            <input
              name="username"
              v-model="username"
              type="text"
              class="input input-bordered w-full"
              placeholder="Nhập tên đăng nhập"
            />
            <p class="text-sm text-red-600">{{ usernameError }}</p>
          </div>          
        </div>

        <!-- ĐỊA CHỈ -->
        <div>
          <label class="font-medium flex items-center gap-2 mb-1">
            <i class="fa-solid fa-location-dot"></i>
            Địa chỉ
          </label>
          <input
            name="address"
            v-model="address"
            type="text"
            class="input input-bordered w-full"
            placeholder="Nhập địa chỉ"
          />
          <p class="text-sm text-red-600">{{ addressError }}</p>
        </div>

        <!-- SỐ ĐIỆN THOẠI -->
        <div>
          <label class="font-medium flex items-center gap-2 mb-1">
            <i class="fa-solid fa-phone"></i>
            Số điện thoại
          </label>
          <input
            name="phone"
            v-model="phone"
            type="text"
            class="input input-bordered w-full"
            placeholder="Nhập số điện thoại"
          />
          <p class="text-sm text-red-600">{{ phoneError }}</p>
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="font-medium flex items-center gap-2 mb-1">
            <i class="fa-solid fa-lock"></i>
            Mật khẩu
          </label>
          <input
            name="password"
            v-model="password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Nhập mật khẩu mới"
          />
          <p class="text-sm text-red-600">{{ passwordError }}</p>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex justify-end gap-3 pt-4">
          <RouterLink
            v-if="role === 'staff'"
            to="/users"
            class="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </RouterLink>
          <RouterLink
            v-else
            to="/staff/profile"
            class="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </RouterLink>

          <button
            class="btn bg-blue-600 text-white hover:bg-blue-700"
            type="submit"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
