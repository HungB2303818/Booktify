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
      <div class="flex justify-center mb-16 mt-10">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm sách..."
          class="w-full max-w-2xl px-6 py-3 rounded-full shadow bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
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
      <div v-if="role === 'staff'" class="flex justify-end mt-10">
        <button
          class="btn btn-primary btn-circle text-2xl"
          @click="goToAddBook"
          title="Thêm sách mới"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
