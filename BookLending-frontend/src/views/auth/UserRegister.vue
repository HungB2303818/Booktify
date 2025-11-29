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
      class="min-h-screen bg-zinc-100 flex justify-center items-center p-6"
    >
      <form @submit.prevent="handleUserRegister" class="w-full max-w-md">
        <fieldset
          class="fieldset bg-white border-base-300 rounded-2xl border p-8 shadow"
        >
          <h1 class="font-bold text-2xl text-center mb-6">Tạo tài khoản mới</h1>

          <label class="label font-medium" for="name">Tên</label>
          <input
            v-model="name"
            type="text"
            class="input w-full mb-1"
            id="name"
            placeholder="Nhập họ và tên"
          />
          <span class="text-red-600 text-sm">{{ nameError }}</span>

          <label class="label" for="username">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            class="input w-full"
            id="username"
            placeholder="Nhập tên đăng nhập"
          />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <label class="label" for="birthdate">Ngày sinh</label>
          <input v-model="birthdate" type="date" id="birthdate" class="input w-full mb-1" />
          <span class="text-red-600 text-sm">{{ birthdateError }}</span>

          <label class="label">Giới tính</label>
          <div class="flex gap-8">
            <div>
              <input
                v-model="sex"
                :value="true"
                type="radio"
                name="radio-1"
                class="radio mr-1"
              />
              <span>Nam</span>
            </div>
            <div class="">
              <input
                v-model="sex"
                :value="false"
                type="radio"
                name="radio-1"
                class="radio mr-1"
              />
              <span>Nữ</span>
            </div>
          </div>
          <span class="text-red-600 text-sm">{{ sexError }}</span>

          <label class="label" for="address">Địa chỉ</label>
          <input
            v-model="address"
            type="text"
            class="input w-full mb-1"
            id="address"
            placeholder="Nhập địa chỉ"
          />
          <span class="text-red-600 text-sm">{{ addressError }}</span>

          <label class="label" for="phone">Số điện thoại</label>
          <input
            v-model="phone"
            type="text"
            class="input w-full mb-1"
            id="phone"
            placeholder="Nhập số điện thoại"
          />
          <span class="text-red-600 text-sm">{{ phoneError }}</span>

          <label class="label" for="password">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="input w-full mb-1"
            id="password"
            placeholder="Nhập mật khẩu"
          />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>
          <div class="flex justify-center">
            <button
              type="submit"
              class="btn w-72 btn-success text-white mt-4 hover:scale-[1.01] text-base"
            >
              Đăng Ký
            </button>
          </div>
          <span class="mt-8 text-base"
            >Bạn đã có tài khoản?
            <strong class="hover:underline">
              <RouterLink to="/user/login" class="text-base underline"
                >Đăng nhập</RouterLink
              >
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
</template>
