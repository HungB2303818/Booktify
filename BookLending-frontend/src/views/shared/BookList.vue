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

const defaultImage = "https://cdn-icons-png.flaticon.com/512/29/29302.png";
// Lấy danh sách sách từ API (hoặc dữ liệu mẫu)
onMounted(async () => {
  try {
    const res = await bookService.getAllBooks();
    books.value = res;
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

// Điều hướng tới trang thêm mới
const goToAddBook = () => {
  router.push("/books/add");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-zinc-100">
    <div class="flex-grow container mx-auto px-4 py-8">
      <!-- Tiêu đề + Thanh tìm kiếm -->

      <div class="flex flex-col justify-end gap-2 w-full md:w-1/3 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm sách..."
          class="input input-bordered w-full"
        />
      </div>

      <!-- Lưới hiển thị sách -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          @view-detail="goToDetail"
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
