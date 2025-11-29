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
  <template v-if="role !== 'staff'">
    <section class="py-16 bg-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
        Mượn sách nhanh – Mở rộng tri thức.
      </h1>
      <p class="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
        Khám phá hàng ngàn đầu sách thuộc mọi thể loại, từ kinh điển đến hiện
        đại, tất cả đều trong tầm tay bạn.
      </p>

      <div class="mt-6 flex justify-center gap-4">
        <button
          class="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          <router-link to="/#books">Khám phá sách</router-link>
        </button>
        <button
          v-if="role !== 'user' && role !== 'staff'"
          class="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-medium shadow hover:bg-gray-200 transition"
        >
          Đăng ký ngay
        </button>
      </div>
    </section>
    <section class="px-4 mb-24">
      <div class="max-w-6xl mx-auto flex gap-4 overflow-x-auto scrollbar-hide">
        <img
          src="/img/banner.webp"
          class="rounded-xl shadow-lg h-40 w-72 object-cover flex-shrink-0"
        />
        <img
          src="/img/lrc1.webp"
          class="rounded-xl shadow-lg h-40 w-72 object-cover flex-shrink-0"
        />
        <img
          src="/img/lrc2.webp"
          class="rounded-xl shadow-lg h-40 w-72 object-cover flex-shrink-0"
        />
        <img
          src="/img/t3_may_tinh_2.jpg"
          class="rounded-xl shadow-lg h-40 w-72 object-cover flex-shrink-0"
        />
      </div>
    </section>
  </template>
  <div class="flex flex-col min-h-screen bg-zinc-100">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-center mb-16 mt-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm sách, tác giả..."
          class="w-full max-w-2xl px-6 py-3 rounded-full shadow bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <!-- Lưới hiển thị sách -->
      <div
        id="books"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          :role="role"
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
<style scoped>
.slide-track {
  animation: scroll 20s linear infinite;
}

.slide-track:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
