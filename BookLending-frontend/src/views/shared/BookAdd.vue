<script setup>
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import BookService from "@/services/book.service";
import { useForm, useField } from "vee-validate";
import { bookSchema } from "@/validations/book.validation";

const router = useRouter();
const bookService = new BookService();
const role = computed(() => localStorage.getItem("role"));

const { handleSubmit } = useForm({
  validationSchema: bookSchema,
});

const handleCreateBook = handleSubmit(async (values) => {
  try {
    await bookService.createBook(values);
    push.success("Thêm sách thành công");

    router.push("/books");
  } catch (error) {
    console.log(error);
    push.error("Đã có lỗi xảy ra khi tạo sách");
  }
});

const { value: title, errorMessage: titleError } = useField("title");
const { value: quantity, errorMessage: quantityError } = useField("quantity");
const { value: author, errorMessage: authorError } = useField("author");
const { value: year, errorMessage: yearError } = useField("year");
const { value: publisher, errorMessage: publisherError } =
  useField("publisher");
const { value: price, errorMessage: priceError } = useField("price");
onMounted(() => {
  if (role.value !== "staff") {
    router.push("/");
  }
});
</script>

<template>
  <div class="min-h-screen bg-zinc-100 p-10">
    <div class="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-blue-600 mb-6">Thêm sách</h2>

      <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <div class="flex flex-col items-start">
          <div
            class="w-64 h-92 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 mb-3"
          >
            <img
              v-if="previewImage"
              :src="previewImage"
              class="object-cover w-full h-full"
            />
            <span v-else class="text-gray-400 text-sm">Chưa có ảnh</span>
          </div>
        </div>

        <form @submit.prevent="handleCreateBook" class="space-y-4">
          <div>
            <dt class="font-medium text-gray-800 text-sm mb-1">Tên sách</dt>
            <dd>
              <input
                v-model="title"
                type="text"
                placeholder="Nhập tên sách"
                class="input input-bordered w-full input-md"
              />
              <span class="text-xs text-red-600">{{ titleError }}</span>
            </dd>
          </div>

          <div>
            <dt class="font-medium text-gray-800 text-sm mb-1">Tác giả</dt>
            <dd>
              <input
                v-model="author"
                type="text"
                placeholder="Nhập tên tác giả"
                class="input input-bordered w-full input-md"
              />
              <span class="text-xs text-red-600">{{ authorError }}</span>
            </dd>
          </div>

          <div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-medium text-gray-800 text-sm mb-1 block">
                  Nhà xuất bản
                </label>
                <input
                  v-model="publisher"
                  type="text"
                  placeholder="Nhà xuất bản"
                  class="input input-bordered w-full input-md"
                />
                <span class="text-xs text-red-600">{{ publisherError }}</span>
              </div>

              <div>
                <label class="font-medium text-gray-800 text-sm mb-1 block">
                  Năm xuất bản
                </label>
                <input
                  v-model="year"
                  type="number"
                  placeholder="Năm xuất bản"
                  class="input input-bordered w-full input-md"
                />
                <span class="text-xs text-red-600">{{ yearError }}</span>
              </div>
            </div>
          </div>

          <div>
            <dt class="font-medium text-gray-800 text-sm mb-1">Số lượng</dt>
            <dd>
              <input
                v-model="quantity"
                type="number"
                placeholder="Nhập số lượng"
                class="input input-bordered w-full input-md"
              />
              <span class="text-xs text-red-600">{{ quantityError }}</span>
            </dd>
          </div>

          <div>
            <dt class="font-medium text-gray-800 text-sm mb-1">Đơn giá</dt>
            <dd>
              <input
                v-model="price"
                type="number"
                placeholder="Nhập đơn giá"
                class="input input-bordered w-full input-md"
              />
              <span class="text-xs text-red-600">{{ priceError }}</span>
            </dd>
          </div>

          <div class="flex justify-end pt-3">
            <button
              class="px-6 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-blue-700 to-sky-400 hover:scale-105 hover:shadow-lg transition duration-300"
            >
              Thêm sách
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
