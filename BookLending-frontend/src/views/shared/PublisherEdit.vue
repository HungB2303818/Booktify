<script setup>
import PublisherService from "@/services/publisher.service";
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { push } from "notivue";
import { publisherSchema } from "@/validations/publisher.validation";
import { useForm, useField } from "vee-validate";
const router = useRouter();
const route = useRoute();
const role = ref(localStorage.getItem("role"));
const publisherService = new PublisherService();

const publisher = ref({});
const { handleSubmit, resetForm } = useForm({
  validationSchema: publisherSchema,
});
const handleupdatePublisher = handleSubmit(async (values) => {
  try {
    await publisherService.updatePublisher(route.params.id, values);
    push.success("Cập nhật nhà xuất bản thành công");

    router.push("/publishers");
  } catch (error) {
    console.log(error);
    push.error("Đã có lỗi xảy ra khi cập nhật nhà xuất bản");
  }
});
const { value: name, errorMessage: nameError } = useField("name");
const { value: address, errorMessage: addressError } = useField("address");

onMounted(async () => {
  if (role.value !== "staff") {
    router.push("/");
  }
  const id = route.params.id;
  const res = await publisherService.getPublisherById(id);
  publisher.value = res;
  resetForm({
    values: {
      name: publisher.value.name || "",
      address: publisher.value.address || "",
    },
  });
});
</script>
<template>
  <div class="min-h-screen bg-zinc-100 flex justify-center items-center px-4">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <!-- Tiêu đề -->
      <h2 class="text-2xl font-semibold mb-6">Chỉnh sửa nhà xuất bản</h2>

      <!-- Form -->
      <form @submit.prevent="handleupdatePublisher">
        <dl>
          <!-- Tên nhà xuất bản -->
          <div class="py-2 grid grid-cols-3 items-center">
            <dt class="font-semibold text-gray-800 text-sm">Nhà xuất bản</dt>
            <dd class="col-span-2">
              <input
                name="name"
                v-model="name"
                type="text"
                placeholder="Nhập tên nhà xuất bản"
                class="input input-bordered w-full input-sm"
              />
              <span class="text-xs text-red-600">{{ nameError }}</span>
            </dd>
          </div>

          <!-- Địa chỉ -->
          <div class="py-2 grid grid-cols-3 items-center">
            <dt class="font-semibold text-gray-800 text-sm">Địa chỉ</dt>
            <dd class="col-span-2">
              <input
                name="address"
                v-model="address"
                type="text"
                placeholder="Nhập địa chỉ"
                class="input input-bordered w-full input-sm"
              />
              <span class="text-xs text-red-600">{{ addressError }}</span>
            </dd>
          </div>
        </dl>

        <!-- Nút -->
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
            Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
