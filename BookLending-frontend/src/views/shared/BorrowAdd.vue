<script setup>

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";
import PublisherService from '@/services/publisher.service';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { borrowSchema } from '@/validations/borrow.validation';

const bookService = new BookService();
const borrowService = new BorrowService();
const publisherService = new PublisherService();

const route = useRoute();
const router = useRouter();

const user_id = computed(() => localStorage.getItem("id"));
const role = computed(() => localStorage.getItem("role"));
const book_id = route.params.id;
const book = ref([]);
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
      quantity: quantity.value
    };

    await borrowService.createBorrow(data);
    push.success("Tạo đơn mượn sách thành công");
    router.push("/books");
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
  <div class="flex flex-col min-h-screen bg-gray-50 p-6">
    <div class="flex flex-grow justify-center items-center">
      <form @submit.prevent="handleCreateBorrow" class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <fieldset class="border border-gray-300 rounded-md p-4">
          <legend class="text-2xl font-semibold mb-4">Thêm đơn mượn sách</legend>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="title">Tựa sách</label>
            <input
              type="text"
              id="title"
              :value="book.title"
              readonly
              class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="author">Tác giả</label>
            <input
              type="text"
              id="author"
              :value="book.author"
              readonly
              class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="publisher">Tên nhà xuất bản</label>
            <input
              type="text"
              id="publisher"
              :value="book.publisher"
              readonly
              class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="quantity">Số quyển</label>
            <input
              v-model="quantity"
              type="number"
              id="quantity"
              readonly
              class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              value="1"
            />
          </div>

          <!-- Ngày mượn và ngày trả ngang hàng -->
          <div class="mb-4 flex space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1" for="borrow_date">Ngày mượn</label>
              <input
                type="date"
                id="borrow_date"
                :value="new Date().toISOString().slice(0, 10)"
                readonly
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium mb-1" for="return_date">Ngày trả sách</label>
              <input
                v-model="returnDate"
                type="date"
                id="return_date"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <span class="text-red-600 text-sm mt-1 inline-block">{{ returnDateError }}</span>
            </div>
          </div>

          <button
            type="submit"
            class="mt-4 w-full bg-success hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-transform transform hover:scale-[1.02]"
          >
            Thêm phiếu mượn
          </button>

          <div class="mt-6 text-center">
            <RouterLink to="/books" class="text-blue-600 font-bold hover:underline font-medium">
              Quay lại
            </RouterLink>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
