<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import BookService from "@/services/book.service";
import { useForm, useField } from "vee-validate";
import { bookSchema } from "@/validations/book.validation";

const router = useRouter();
const route = useRoute();
const bookService = new BookService();
const role = computed(() => localStorage.getItem("role"));
const { handleSubmit, resetForm } = useForm({
  validationSchema: bookSchema,
});
const book = ref({});

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
const { value: publisher, errorMessage: publisherError } =
  useField("publisher");
const { value: price, errorPrice: priceError } = useField("price");
onMounted(async () => {
  if (role.value !== "staff") {
    router.push("/");
  }
  const id = route.params.id;
  const res = await bookService.getBookById(id);
  book.value = res;
  resetForm({
    values: {
      title: book.value.title || "",
      image: book.value.image || "",
      quantity: book.value.quantity || 0,
      year: book.value.year || 0,
      publisher: book.value.publisher,
      price: book.value.price || 0,
      author: book.value.author || "",
    },
  });
});
</script>

<template>
  <div class="w-full flex justify-center bg-gray-100 py-10 px-4 min-h-screen">
    <div class="w-full max-w-6xl flex flex-col gap-8">
      <!-- Tiêu đề -->
      <h2 class="text-4xl font-bold text-center">
        Chỉnh sửa sách
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <!-- Bìa sách -->
        <div
          class="rounded-2xl  p-6 flex flex-col items-center justify-start"
        >
          <img
            name="image"
            :src="`http://localhost:8080${book.image}`"
            alt="Book cover"
            class="w-64 h-96 object-cover rounded-xl shadow-md"
          />
        </div>

        <!-- Form chỉnh sửa -->
        <form
          @submit.prevent="handleUpdateBook"
          class="bg-white rounded-2xl shadow p-8"
        >
          <div class="space-y-6">
            <!-- Tên sách -->
            <div>
              <label class="font-semibold text-gray-700">Tên sách</label>
              <input
                name="title"
                v-model="title"
                type="text"
                class="input input-bordered w-full mt-1"
              />
              <span class="text-xs text-red-600">{{ titleError }}</span>
            </div>

            <!-- Nhà xuất bản -->
            <div>
              <label class="font-semibold text-gray-700">Nhà xuất bản</label>
              <input
                name="publisher"
                v-model="publisher"
                type="text"
                class="input input-bordered w-full mt-1"
              />
              <span class="text-xs text-red-600">{{ publisherError }}</span>
            </div>

            <!-- Tác giả -->
            <div>
              <label class="font-semibold text-gray-700">Tác giả</label>
              <input
                name="author"
                v-model="author"
                type="text"
                class="input input-bordered w-full mt-1"
              />
              <span class="text-xs text-red-600">{{ authorError }}</span>
            </div>

            <!-- 3 ô: năm / số lượng / giá -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="font-semibold text-gray-700">Năm xuất bản</label>
                <input
                  v-model="year"
                  type="number"
                  class="input input-bordered w-full mt-1"
                />
                <span class="text-xs text-red-600">{{ yearError }}</span>
              </div>

              <div>
                <label class="font-semibold text-gray-700">Số lượng</label>
                <input
                  name="quantity"
                  v-model="quantity"
                  type="number"
                  class="input input-bordered w-full mt-1"
                />
                <span class="text-xs text-red-600">{{ quantityError }}</span>
              </div>

              <div>
                <label class="font-semibold text-gray-700">Đơn giá</label>
                <input
                  name="price"
                  v-model="price"
                  type="number"
                  class="input input-bordered w-full mt-1"
                />
                <span class="text-xs text-red-600">{{ priceError }}</span>
              </div>
            </div>
          </div>

          <!-- Nút -->
          <div class="flex justify-end mt-8 gap-3">
            <RouterLink
              to="/books"
              class="btn btn-ghost text-sm hover:underline"
            >
              Quay lại
            </RouterLink>

            <button
              class="w-1/8 px-4 py-2 rounded-2xl text-white font-medium bg-gradient-to-r from-blue-700 to-sky-400 hover:scale-105 transition duration-300 cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
