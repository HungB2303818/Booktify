<script setup>
import { ref } from "vue";
import UserService from "@/services/user.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { userSchema } from "@/validations/user.validation";
import { push } from "notivue";

const userService = new UserService();
const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: userSchema,
});

const { value: name, errorMessage: nameError } = useField("name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthdate, errorMessage: birthdateError } =
  useField("birthdate");
const { value: sex, errorMessage: sexError } = useField("sex");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const handleUserRegister = handleSubmit(async (values) => {
  try {
    await userService.register(values);
    // ? Debug code
    // console.log(data);
    // console.log(response.data);

    push.success("Đăng ký người dùng thành công");
    router.push("/user/login");
  } catch (error) {
    if (error.response.status === 400) {
      console.log(error);
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      console.log(error);
      push.error("Đăng ký thất bại, vui lòng thử lại");
    }
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-zinc-100 flex flex-col justify-center items-center p-6"
  >
    <h1 class="font-bold text-3xl text-center mb-8 text-gray-800">
      Tạo tài khoản mới
    </h1>
    <form @submit.prevent="handleUserRegister" class="w-full max-w-3xl">
      <fieldset class="bg-white rounded-2xl p-10 shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="label font-medium" for="name">Tên</label>
            <input
              v-model="name"
              type="text"
              id="name"
              class="input w-full"
              placeholder="Nhập họ và tên"
            />
            <span class="text-red-600 text-sm">{{ nameError }}</span>
          </div>

          <div>
            <label class="label font-medium" for="username"
              >Tên đăng nhập</label
            >
            <input
              v-model="username"
              type="text"
              id="username"
              class="input w-full"
              placeholder="Nhập tên đăng nhập"
            />
            <span class="text-red-600 text-sm">{{ usernameError }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label class="label font-medium" for="birthdate">Ngày sinh</label>
            <input
              v-model="birthdate"
              type="date"
              id="birthdate"
              class="input w-full"
            />
            <span class="text-red-600 text-sm">{{ birthdateError }}</span>
          </div>

          <div>
            <label class="label font-medium">Giới tính</label>
            <div class="flex items-center gap-8 mt-2">
              <label class="flex items-center gap-2">
                <input v-model="sex" :value="true" type="radio" class="radio" />
                <span>Nam</span>
              </label>

              <label class="flex items-center gap-2">
                <input
                  v-model="sex"
                  :value="false"
                  type="radio"
                  class="radio"
                />
                <span>Nữ</span>
              </label>
            </div>
            <span class="text-red-600 text-sm">{{ sexError }}</span>
          </div>
        </div>

        <!-- HÀNG 3: ĐỊA CHỈ -->
        <div class="mt-6">
          <label class="label font-medium" for="address">Địa chỉ</label>
          <input
            v-model="address"
            type="text"
            id="address"
            class="input w-full"
            placeholder="Nhập địa chỉ"
          />
          <span class="text-red-600 text-sm">{{ addressError }}</span>
        </div>

        <!-- HÀNG 4: SỐ ĐIỆN THOẠI -->
        <div class="mt-6">
          <label class="label font-medium" for="phone">Số điện thoại</label>
          <input
            v-model="phone"
            type="text"
            id="phone"
            class="input w-full"
            placeholder="Nhập số điện thoại"
          />
          <span class="text-red-600 text-sm">{{ phoneError }}</span>
        </div>

        <!-- HÀNG 5: MẬT KHẨU -->
        <div class="mt-6">
          <label class="label font-medium" for="password">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="input w-full"
            placeholder="Nhập mật khẩu"
          />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>
        </div>

        <!-- BUTTON -->
        <div class="flex justify-center mt-8">
          <button
            type="submit"
            class="w-1/4 mt-4 px-4 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-blue-700 to-sky-400 hover:scale-105 hover:shadow-[0_0_35px_rgba(0,123,255,0.7)] transition duration-300"
          >
            Đăng ký
          </button>
        </div>

        <!-- LINK ĐĂNG NHẬP -->
        <p class="mt-8 text-center text-gray-700">
          Bạn đã có tài khoản?
          <RouterLink
            to="/user/login"
            class="font-bold hover:underline"
          >
            Đăng nhập
          </RouterLink>
        </p>
      </fieldset>
    </form>
  </div>
</template>
