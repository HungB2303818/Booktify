<script setup>
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import PublisherService from "@/services/publisher.service";
import { useForm, useField } from "vee-validate";
import { publisherSchema } from "@/validations/publisher.validation";

const router = useRouter();
const publisherService = new PublisherService();
const role = computed(() => localStorage.getItem("role"));

const { handleSubmit } = useForm({
  validationSchema: publisherSchema,
});

const handleCreatePublisher = handleSubmit(async (values) => {
  try {
    await publisherService.createPublisher(values);
    push.success("Thêm nhà xuất bản thành công");

    router.push("/publishers");
  } catch (error) {
    console.log(error);
    push.error("Đã có lỗi xảy ra khi tạo nhà xuất bản");
  }
});

const { value: name, errorMessage: nameError } = useField("name");
const { value: address, errorMessage: addressError } = useField("address");

onMounted(() => {
  if (role.value !== "staff") {
    router.push("/");
  }
});
</script>

<template>
  <div class="min-h-screen bg-zinc-100 flex justify-center items-center px-4">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6">Thêm nhà xuất bản</h2>

      <form @submit.prevent="handleCreatePublisher">
        <dl>
          <div class="py-2 grid grid-cols-3 items-center">
            <dt class="font-semibold text-gray-800 text-sm">Nhà xuất bản</dt>
            <dd class="col-span-2">
              <input
                v-model="name"
                type="text"
                placeholder="Nhập tên nhà xuất bản"
                class="input input-bordered w-full input-sm"
              />
              <span class="text-xs text-red-600">{{ nameError }}</span>
            </dd>
          </div>

          <div class="py-2 grid grid-cols-3 items-center">
            <dt class="font-semibold text-gray-800 text-sm">Địa chỉ</dt>
            <dd class="col-span-2">
              <input
                v-model="address"
                type="text"
                placeholder="Nhập địa chỉ"
                class="input input-bordered w-full input-sm"
              />
              <span class="text-xs text-red-600">{{ addressError }}</span>
            </dd>
          </div>
        </dl>

        <div class="flex justify-end mt-6 space-x-2">
          <RouterLink
            to="/publishers"
            class="btn btn-ghost text-sm hover:underline"
          >
            Quay lại
          </RouterLink>
          <button
            class="btn bg-blue-600 text-white text-sm hover:scale-[1.02] transition"
          >
            Thêm nhà xuất bản
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
