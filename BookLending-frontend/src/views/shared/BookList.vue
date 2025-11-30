<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service"; // nếu bạn có service

const router = useRouter();
const bookService = new BookService();

const books = ref([]);
const searchQuery = ref("");

const role = computed(() => localStorage.getItem("role"));

onMounted(async () => {
  try {
    const res = await bookService.getAllBooks();
    books.value = res;
    console.log("ROLE:", role);
  } catch (err) {
    console.error("Lỗi tải sách:", err);
  }
});

// Lọc theo từ khóa tìm kiếm
const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) return books.value;
  return books.value.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Điều hướng tới trang chi tiết
const goToDetail = (id) => {
  router.push(`/books/${id}`);
};
const goToEdit = (id) => router.push(`/books/edit/${id}`);
// Điều hướng tới trang thêm mới
const goToAddBook = () => {
  router.push("/books/add");
};
const deleteBook = async (id) => {
  if (confirm("Xác nhận xóa sách này?")) {
    try {
      await bookService.deleteBook(id);
      router.push("/books");
      push.success("Xóa sách thành công");
    } catch (err) {
      console.error("Lỗi xóa sách:", err);
    }
  }
};
</script>

<template>
  <div v-if="role === 'staff'" class="flex flex-col min-h-screen bg-zinc-100">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col items-center mb-16 mt-10 w-full">
        <div class="flex items-center w-full max-w-2xl relative">
          <!-- Icon search -->
          <span class="absolute left-4 text-gray-400">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>

          <!-- Ô tìm kiếm -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm sách..."
            class="w-full pl-12 pr-4 py-3 rounded-full shadow-md bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <!-- Nút thêm sách (hiển thị khi staff) -->
          <button
            v-if="role === 'staff'"
            @click="goToAddBook"
            title="Thêm sách mới"
            class="ml-4 w-13 h-12 flex items-center justify-center rounded-full bg-blue-600 cursor-pointer text-white text-2xl shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-transform"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <!-- Lưới hiển thị sách -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mx-8"
      >
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          :role="role"
          @view-detail="goToDetail"
          @view-edit="goToEdit"
          @delete="deleteBook"
        />
      </div>

      <!-- Nút thêm sách -->
    </div>
  </div>
</template>
