<script setup>
import UserService from "@/services/user.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { loginSchema } from "@/validations/login.validation";
import { push } from "notivue";
import { authRole, authUsername, authUserId } from "@/stores/auth";
const userService = new UserService();
const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: loginSchema,
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

const handleUserLogin = handleSubmit(async () => {
  try {
    const response = await userService.login(username.value, password.value);
    console.log(response.data);
    if (response?.data?.token) {
      localStorage.setItem("authenticateToken", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("id", response.data.user.id);
      localStorage.setItem("role", "user");
      authRole.value = "user";
      authUsername.value = response.data.user.username;
      authUserId.value = response.data.user.id;
      push.success("Đăng nhập thành công");
      router.push("/");
    } else {
      push.error("Đăng nhập thất bại, vui lòng thử lại");
    }
  } catch (error) {
    if (error.response.status === 400) {
      console.log(error);
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 401) {
      push.error("Tên đăng nhập hoặc mật khẩu không đúng");
    } else {
      console.log(error);
      push.error("Đăng nhập thất bại, vui lòng thử lại");
    }
  }
});
</script>
<template>
  <div class="min-h-screen bg-zinc-100 flex">
    <div class="hidden md:flex flex-col justify-center px-16 w-1/2 bg-zinc-100">
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-8">
          <span class="text-4xl font-semibold text-blue-600">Booktify</span>
        </div>

        <h1 class="text-4xl font-bold mb-4">
          Khám phá thế giới sách<br />
          Của riêng bạn.
        </h1>

        <p class="text-gray-500 max-w-md">
          Borrow, read, and share thousands of titles with our community.
        </p>
      </div>
    </div>

    <!-- RIGHT SECTION - LOGIN FORM -->
    <div class="flex justify-center items-center w-full md:w-1/2 p-6">
      <form @submit.prevent="handleUserLogin" class="w-full max-w-md">
        <fieldset
          class="bg-white border border-base-300 rounded-2xl shadow p-8"
        >
          <h1 class="font-bold text-2xl text-center mb-2">Đăng nhập</h1>
          <!-- Username -->
          <label class="label font-medium" for="username">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            class="input input-bordered w-full mb-1"
            id="username"
            placeholder="Nhập tên đăng nhập"
          />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <!-- Password -->
          <label class="label font-medium mt-3" for="password">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="input input-bordered w-full mb-1"
            id="password"
            placeholder="Nhập mật khẩu"
          />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>

          <!-- Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="btn w-full mt-6 bg-blue-600 text-white hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </div>

          <!-- Links -->
          <p class="text-sm mt-4">
            Chưa có tài khoản?
            <RouterLink to="/user/register" class="text-base font-semibold underline">
              Đăng ký ngay
            </RouterLink>
          </p>

          <p class="text-sm mt-2">
            Đăng nhập với vai trò quản trị viên?
            <RouterLink to="/staff/login" class="text-base font-semibold underline">
              Đăng nhập tại đây
            </RouterLink>
          </p>
        </fieldset>
      </form>
    </div>
  </div>
</template>
