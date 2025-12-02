<script setup>
import StaffService from "@/services/staff.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { loginSchema } from "@/validations/login.validation";
import { push } from "notivue";
import { authRole, authUsername, authUserId } from "@/stores/auth";
const staffService = new StaffService();
const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: loginSchema,
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

const handleUserLogin = handleSubmit(async () => {
  try {
    const response = await staffService.login(username.value, password.value);
    console.log(response.data);
    if (response?.data?.token) {
      localStorage.setItem("authenticateToken", response.data.token);
      localStorage.setItem("username", response.data.employee.username);
      localStorage.setItem("id", response.data.employee.id);
      localStorage.setItem("role", "staff");
      authRole.value = "staff";
      authUsername.value = response.data.employee.username;
      authUserId.value = response.data.employee.id;
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
  <div class="bg-zinc-100 min-h-screen p-4 flex flex-col justify-center items-center">
    <form @submit.prevent="handleUserLogin">
      <fieldset
        class="w-96 bg-base-100 border-base-300 rounded-box border p-6 shadow"
      >
        <h1 class="font-bold text-2xl text-center mb-4">Đăng nhập nhân viên</h1>

        <label class="label" for="username">Tên đăng nhập</label>
        <input
          v-model="username"
          type="text"
          class="input w-full mb-2"
          id="username"
          placeholder="Nhập tên đăng nhập"
        />
        <div class="text-red-600 text-sm">{{ usernameError }}</div>

        <label class="label" for="password">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="input w-full mb-2"
          id="password"
          placeholder="Nhập mật khẩu"
        />
        <div class="text-red-600 text-sm">{{ passwordError }}</div>
        <div class="flex justify-center">
        <button type="submit" class="w-1/2 mt-4 px-4 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-blue-700 to-sky-400 hover:scale-105 hover:shadow-[0_0_35px_rgba(0,123,255,0.7)] transition duration-300">
          Đăng nhập
        </button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
