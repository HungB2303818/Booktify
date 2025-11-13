<script setup>
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import { userSchema } from "@/validations/user.validation";
import UserService from "@/services/user.service";
import { useForm, useField } from "vee-validate";

const userService = new UserService();
const router = useRouter();
const route = useRoute();
const role = computed(() => localStorage.getItem("role"));

const { handleSubmit, resetForm } = useForm({
  validationSchema: userSchema,
});

const user_id = route.params.id;

const handleUserProfileEdit = handleSubmit(async (values) => {
  try {
    await userService.updateUser(user_id, values);
    push.success("Cập nhật thông tin người dùng thành công");
    if (role.value === "staff") {
      router.push("/users");
    } else {
      router.push("/user/profile");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      push.error("Đã xảy ra lỗi khi cập nhật thông tin người dùng");
    }
  }
});

const handleUserProfileDelete = async (user_id) => {
  try {
    if (confirm("Xác nhận xóa người dùng?")) {
      await userService.deleteUser(user_id);
      push.success("Xóa người dùng thành công");
      router.push("/users");
    }
  } catch (error) {
    push.error("Đã xảy ra lỗi khi xóa người dùng");
  }
};

const { value: name, errorMessage: nameError } = useField("name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthdate, errorMessage: birthdateError } =
  useField("birthdate");
const { value: sex, errorMessage: sexError } = useField("sex");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

onMounted(async () => {
  const user = await userService.getUser(user_id);
  console.log();
  resetForm({
    values: {
      name: user.name,
      gender: user.gender,
      address: user.address,
      birthday: new Date(user.birthday).toISOString().slice(0, 10),
      phone: user.phone,
      username: user.username,
      // password: userData.password
    },
  });
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex justify-center items-center flex-grow">
      <form @submit.prevent>
        <fieldset
          class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow"
        >
          <legend class="fieldset-legend text-xl">Cập nhật người dùng</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tên -->
            <div>
              <label class="label font-medium" for="name">Tên</label>
              <input
                v-model="name"
                type="text"
                class="input input-bordered w-full"
                id="name"
                placeholder="Nhập tên"
              />
              <span class="text-sm text-red-600">{{ nameError }}</span>
            </div>

            <!-- Ngày sinh -->
            <div>
              <label class="label font-medium" for="birthdate">Ngày sinh</label>
              <input
                v-model="birthdate"
                type="date"
                id="birthdate"
                class="input input-bordered w-full"
              />
              <span class="text-sm text-red-600">{{ birthdateError }}</span>
            </div>

            <!-- Giới tính -->
            <div class="md:col-span-2">
              <label class="label font-medium">Giới tính</label>
              <div class="flex gap-8 items-center pl-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="sex"
                    :value="true"
                    type="radio"
                    name="radio-1"
                    class="radio"
                  />
                  <span>Nam</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="sex"
                    :value="false"
                    type="radio"
                    name="radio-1"
                    class="radio"
                  />
                  <span>Nữ</span>
                </label>
              </div>
              <span class="text-sm text-red-600">{{ sexError }}</span>
            </div>

            <!-- Địa chỉ -->
            <div class="md:col-span-2">
              <label class="label font-medium">Địa chỉ</label>
              <input
                v-model="address"
                type="text"
                class="input input-bordered w-full"
                placeholder="Nhập địa chỉ"
              />
              <span class="text-sm text-red-600">{{ addressError }}</span>
            </div>

            <!-- Số điện thoại -->
            <div>
              <label class="label font-medium">Số điện thoại</label>
              <input
                v-model="phone"
                type="text"
                class="input input-bordered w-full"
                placeholder="Nhập số điện thoại"
              />
              <span class="text-sm text-red-600">{{ phoneError }}</span>
            </div>

            <!-- Tên đăng nhập -->
            <div>
              <label class="label font-medium" for="username"
                >Tên đăng nhập</label
              >
              <input
                v-model="username"
                type="text"
                class="input input-bordered w-full"
                id="username"
                placeholder="Nhập tên đăng nhập"
              />
              <span class="text-sm text-red-600">{{ usernameError }}</span>
            </div>

            <!-- Mật khẩu -->
            <div class="md:col-span-2">
              <label class="label font-medium" for="password">Mật khẩu</label>
              <input
                v-model="password"
                type="password"
                minlength="3"
                class="input input-bordered w-full"
                id="password"
                placeholder="Nhập mật khẩu"
              />
              <span class="text-sm text-red-600">{{ passwordError }}</span>
            </div>
          </div>

          <template v-if="role === 'staff'">
            <div class="grid grid-cols-2 gap-2">
              <button
                class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleUserProfileEdit(user_id)"
              >
                Lưu thay đổi
              </button>
              <button
                class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleUserProfileDelete(user_id)"
              >
                Xóa
              </button>
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-1 gap-2">
              <button
                class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleUserProfileEdit(user_id)"
              >
                Lưu thay đổi
              </button>
            </div>
          </template>
          <span class="mt-4">
            <strong class="hover:underline">
              <template v-if="role === 'staff'">
                <RouterLink to="/users" class="text-base">Quay lại</RouterLink>
              </template>
              <template v-else>
                <RouterLink to="/user/profile" class="text-base"
                  >Quay lại</RouterLink
                >
              </template>
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
  </div>
</template>
