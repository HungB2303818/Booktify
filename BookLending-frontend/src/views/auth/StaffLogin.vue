<script setup>
import { ref } from "vue";
import StaffService from "@/services/staff.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { loginSchema } from "@/validations/login.validation";
import { push } from "notivue";

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
      push.success("Đăng nhập thành công");
      router.push("/");
    }else{
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
    <form @submit.prevent=" handleUserLogin ">
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
        <span class="text-red-600 text-sm">{{ usernameError }}</span>

        <label class="label" for="password">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="input w-full mb-2"
          id="password"
          placeholder="Nhập mật khẩu"
        />
        <span class="text-red-600 text-sm">{{ passwordError }}</span>

        <button type="submit" class="btn btn-success text-white w-full mt-4">
          Đăng nhập
        </button>
      </fieldset>
    </form>
  </div>
</template>
