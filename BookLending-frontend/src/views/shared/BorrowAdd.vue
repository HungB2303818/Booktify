<script setup>

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";

import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { borrowSchema } from '@/validations/borrow.validation';

const bookService = new BookService();
const borrowService = new BorrowService();

const route = useRoute();
const router = useRouter();

const user_id = computed(() => localStorage.getItem("id"));
const role = computed(() => localStorage.getItem("role"));
const book_id = route.params.id;
const book = ref({});
const quantity = ref(1);

const { handleSubmit } = useForm({
  validationSchema: borrowSchema,
});

const { value: returnDate, errorMessage: returnDateError } = useField("returnDate");

const handleCreateBorrow = handleSubmit(async () => {
  // debug code
  // console.log(return_date.value);

  try {
    const data = {
      reader_id: user_id.value,
      book_id: book_id,
      returnDate: returnDate.value,
      quantity: quantity.value,
      employee_id: null,
    };

    await borrowService.createBorrow(data);
    push.success("Tạo đơn mượn sách thành công");
    router.push("/");
  } catch (error) {
    console.log(error);
    if (error.response.status === 422) {
      push.warning("Bạn đã mượn tối đa 3 quyển sách này");
    }
    else if (error.response.status === 409) {
      push.warning("Bạn chỉ có thể mượn tối đa 10 quyển sách");
    }
    else {
      push.error("Đã có lỗi xảy ra trong quá trình tạo đơn mượn");
    }
  }
});


onMounted(async () => {
  if (role.value !== "user") {
    router.push("/");
  }
  try {
    const book_data = await bookService.getBookById(book_id);
    book.value = book_data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex justify-center">

    <div class="w-full max-w-6xl flex flex-col">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] mb-12">

        <!-- =================== BOOK COVER =================== -->
        <div class="flex flex-col items-center">
          <div class="p-4 rounded-xl">
            <img
              :src="book.image || defaultImage"
              class="w-72 h-92 object-cover rounded-lg"
            />
          </div>

          <p class="text-3xl font-semibold mt-2">{{ book.title }}</p>
          <p class="text-gray-500 ">{{ book.author }}</p>
        </div>

        <!-- =================== FORM =================== -->
        <form
          @submit.prevent="handleCreateBorrow"
          class="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 class="text-xl font-bold mb-6">Thông tin mượn sách</h2>

          <!-- Book Title -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm font-medium block mb-1">Tựa sách</label>
              <input
                type="text"
                :value="book.title"
                readonly
                class="w-full rounded-lg px-3 py-2 bg-gray-100 border border-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="text-sm font-medium block mb-1">Tác giả</label>
              <input
                type="text"
                :value="book.author"
                readonly
                class="w-full rounded-lg px-3 py-2 bg-gray-100 border border-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Publisher -->
          <div class="mb-4">
            <label class="text-sm font-medium block mb-1">Tên nhà xuất bản</label>
            <input
              type="text"
              :value="book.publisher"
              readonly
              class="w-full rounded-lg px-3 py-2 bg-gray-100 border border-gray-300 cursor-not-allowed"
            />
          </div>

          <!-- Quantity -->
          <div class="mb-4">
            <label class="text-sm font-medium block mb-1">Số quyển</label>
            <input
              v-model="quantity"
              type="number"
              readonly
              class="w-full rounded-lg px-3 py-2 bg-gray-100 border border-gray-300 cursor-not-allowed"
            />
          </div>

          <!-- Borrow + Return Date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium block mb-1">Ngày mượn</label>
              <input
                type="date"
                :value="new Date().toISOString().slice(0, 10)"
                readonly
                class="w-full rounded-lg px-3 py-2 bg-gray-100 border border-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="text-sm font-medium block mb-1">Ngày trả sách</label>
              <input
                v-model="returnDate"
                type="date"
                class="w-full rounded-lg px-3 py-2 border border-gray-300"
              />
              <span class="text-red-600 text-sm">{{ returnDateError }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="mt-6 py-3 px-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-lg rounded-lg shadow transition"
          >
            Thêm phiếu mượn
          </button>

          <!-- Back Link -->
          <div class="mt-4">
            <RouterLink to="/#books" class="font-semibold hover:underline">
              Quay lại
            </RouterLink>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

