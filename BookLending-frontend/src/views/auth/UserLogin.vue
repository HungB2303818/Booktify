<script setup>
import { ref } from "vue";
import UserService from "@/services/user.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { loginSchema } from "@/validations/login.validation";
import { push } from "notivue";
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
  <div class="bg-zinc-100 min-h-screen p-4 flex justify-center items-center">
    <form @submit.prevent="handleUserLogin">
      <fieldset
        class="w-96 bg-base-100 border-base-300 rounded-box border p-6 shadow"
      >
        <h1 class="font-bold text-2xl text-center mb-4">Đăng nhập</h1>

        <label class="label" for="username">Tên đăng nhập</label>
        <input
          v-model="username"
          type="text"
          class="input w-full mb-2"
          id="username"
          placeholder="Nhập tên đăng nhập"
        />
        <span class="text-red-600 text-sm ">{{ usernameError }}</span>

        <label class="label " for="password">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="input w-full mb-2"
          id="password"
          placeholder="Nhập mật khẩu"
        />
        <span class="text-red-600 text-sm">{{ passwordError }}</span>
        <div class="flex jutify-center">
          <button type="submit" class="btn btn-success text-white w-48 mt-4">
            Đăng nhập
          </button>
        </div>
        <p class="text-sm mt-4">
          Chưa có tài khoản?
          <RouterLink to="/user/register" class="text-blue-600 underline"
            >Đăng ký ngay</RouterLink
          >
        </p>
        <p class="text-sm mt-2">
          Đăng nhập với vai trò quản trị viên?
          <RouterLink to="/staff/login" class="text-blue-600 underline"
            >Đăng nhập tại đây</RouterLink
          >
        </p>
      </fieldset>
    </form>
  </div>
</template>
