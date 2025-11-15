<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { push } from 'notivue';
import BookService from "@/services/book.service";
import { useForm, useField } from "vee-validate";
import { bookSchema } from '@/validations/book.validation';

const router = useRouter();
const route  = useRoute();
const bookService = new BookService();
const role = computed(() => localStorage.getItem("role"));
const { handleSubmit } = useForm({
    validationSchema: bookSchema,
});

const handleUpdateBook = handleSubmit(async (values) => {
    try {
        await bookService.updateBook(route.params.id, values);
        push.success("Chỉnh sửa sách thành công");

        router.push("/books");
    } catch (error) {
        console.log(error);
        push.error("Đã có lỗi xảy ra khi sửa sách");
    }
});

const { value: title, errorMessage: titleError } = useField("title");
const { value: quantity, errorMessage: quantityError } = useField("quantity");
const { value: author, errorMessage: authorError } = useField("author");
const { value: year, errorMessage: yearError } = useField("year");
const { value: publisher, errorMessage: publisherError } = useField("publisher");
onMounted(() => {
    if (role.value !== "staff") {
        router.push("/");
    }
});
</script>

<template>
  <div class="max-w-md mx-auto my-8 bg-white shadow-sm rounded-lg p-6">
    <!-- Tiêu đề -->
    <h2 class="text-2xl font-semibold text-blue-600 mb-6">
      Chỉnh sửa sách
    </h2>

    <!-- Form -->
    <form @submit.prevent="handleUpdateBook">
      <dl class="divide-y divide-gray-200">
        <!-- Tên sách -->
        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Tên sách</dt>
          <dd class="col-span-2">
            <input
              v-model="title"
              type="text"
              placeholder="Nhập tên sách"
              class="input input-bordered w-full input-sm"
            />
            <span class="text-xs text-red-600">{{ titleError }}</span>
          </dd>
        </div>

        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Nhà xuất bản</dt>
          <dd class="col-span-2">
            <input
              v-model="publisher"
              type="text"
              placeholder="Nhập nhà xuất bản"
              class="input input-bordered w-full input-sm"
            />
            <span class="text-xs text-red-600">{{ publisherError }}</span>
          </dd>
        </div>
        <!-- Tên sách -->
        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Tác giả</dt>
          <dd class="col-span-2">
            <input
              v-model="author"
              type="text"
              placeholder="Nhập tác giả"
              class="input input-bordered w-full input-sm"
              
            />
            <span class="text-xs text-red-600">{{ authorError }}</span>
          </dd>
        </div>
        <!-- Tên sách -->
        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Năm xuất bản</dt>
          <dd class="col-span-2">
            <input
              v-model="year"
              type="number"
              placeholder="Nhập năm xuất bản"
              class="input input-bordered w-full input-sm"
            />
            <span class="text-xs text-red-600">{{ yearError }}</span>
          </dd>
        </div>
        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Số lượng</dt>
          <dd class="col-span-2">
            <input
              v-model="quantity"
              type="number"
              placeholder="Nhập số lượng"
              class="input input-bordered w-full input-sm"
            />
            <span class="text-xs text-red-600">{{ quantityError }}</span>
          </dd>
        </div>
        <div class="py-4 grid grid-cols-3 items-center">
          <dt class="font-semibold text-gray-800 text-sm">Đơn giá</dt>
          <dd class="col-span-2">
            <input
              v-model="price"
              type="number"
              placeholder="Nhập giá sách"
              class="input input-bordered w-full input-sm"
            />
            <span class="text-xs text-red-600">{{ priceError }}</span>
          </dd>
        </div>
      </dl>

      <!-- Nút -->
      <div class="flex justify-end mt-6 space-x-2">
        <RouterLink
          to="/books"
          class="btn btn-ghost text-sm hover:underline"
        >
          Quay lại
        </RouterLink>
        <button class="btn btn-success text-sm hover:scale-[1.02] transition">
          Lưu
        </button>
      </div>
    </form>
  </div>
</template>