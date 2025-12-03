<script setup>
import { ref, computed, onMounted } from "vue";
import BookService from "@/services/book.service";
import UserService from "@/services/user.service";
import BorrowService from "@/services/borrow.service";
import BorrowCard from "@/components/BorrowCard.vue";

const bookService = new BookService();
const userService = new UserService();
const borrowService = new BorrowService();

const userlength = ref(0);
const booklength = ref(0);
const borrowlength = ref(0);
const overdue = ref(0);
const borrowing = ref(0);
const returned = ref(0);

const borrows = ref([]);
const loading = ref(false);
const role = ref(localStorage.getItem("role"));
const userId = ref(localStorage.getItem("userId"));
const totalborrows = ref(0);

const filteredBorrows = computed(() => borrows.value.slice(0,2));

onMounted(async () => {
  try {
    loading.value = true;
    let borrow_data = [];

    if (role.value === "staff") {
      borrow_data = await borrowService.getAllBorrows();
    } else {
      borrow_data = await borrowService.getBorrowByUser(userId.value);
    }

    borrows.value = borrow_data;
    borrowlength.value = borrow_data.length;
    totalborrows.value = borrow_data.length;
    overdue.value = borrow_data.filter((b) => b.status === "overdue").length;
    borrowing.value = borrow_data.filter(
      (b) => b.status === "borrowing"
    ).length;
    returned.value = borrow_data.filter((b) => b.status === "returned").length;


    const user_data = await userService.getAllUsers();
    userlength.value = user_data.length;

    const book_data = await bookService.getAllBooks();
    booklength.value = book_data.length;
  } catch (error) {
    console.error(error);
    push.error("Không thể tải dữ liệu");
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div class="w-full min-h-screen bg-[#f5f7fa] p-8">
    <div class="flex justify-between items-start max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800">
        Trang Chủ Quản Lý Mượn Sách
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8">
      <div class="bg-white rounded-xl border-t-6 border-blue-600 shadow-sm p-6">
        <p class="text-gray-600">Tổng số người dùng</p>
        <h2 class="text-3xl font-bold mt-2">{{ userlength }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border-t-6 border-yellow-400">
        <p class="text-gray-600">Tổng số đơn mượn</p>
        <h2 class="text-3xl font-bold mt-2">{{ borrowlength }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border-t-6 border-green-400">
        <p class="text-gray-600">Đơn đã trả</p>
        <h2 class="text-3xl font-bold mt-2">{{ returned }}</h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-t-6 border-red-500">
        <p class="text-gray-600">Đơn quá hạn</p>
        <h2 class="text-3xl font-bold mt-2">{{ overdue }}</h2>
      </div>
    </div>

    <div class="max-w-6xl mx-auto mt-10">
      <h2 class="text-xl font-bold mb-4">Hoạt Động Mượn Sách Gần Đây</h2>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <table class="w-full">
          <thead class="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th class="px-6 py-4 text-left">TÊN NGƯỜI MƯỢN</th>
              <th class="px-6 py-4 text-left">TÊN SÁCH</th>
              <th class="px-6 py-4 text-left">NGÀY MƯỢN</th>
              <th class="px-6 py-4 text-left">HẠN TRẢ</th>
              <th class="px-6 py-4 text-left">TRẠNG THÁI</th>
              <th class="px-6 py-4 text-left">THAO TÁC</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 bg-white">
            <BorrowCard
              v-for="borrow in filteredBorrows"
              :key="borrow._id"
              :borrow="borrow"
              @fetchBorrows="fetchBorrows"
            />
            <tr v-if="!borrows.length">
              <td colspan="100%" class="text-center py-4 text-base">
                Chưa có đơn mượn
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
