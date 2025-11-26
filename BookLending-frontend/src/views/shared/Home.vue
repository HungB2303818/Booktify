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
    <div class="py-6 bg-white text-center">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800">
        <span class="text-blue-600 font-bold">Booktify</span> – Mượn sách nhanh,
        mở rộng tri thức.
      </h2>
    </div>
    <div class="flex justify-center mt-4">
      <div
        class="carousel h-[224px] max-w-6xl mx-auto rounded-xl shadow-lg overflow-hidden"
      >
        <div id="slide1" class="carousel-item relative w-full">
          <img src="/img/banner.webp" class="w-full" />
          <div
            class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
          >
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide2" class="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            class="w-full"
          />
          <div
            class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
          >
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide3" class="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
            class="w-full"
          />
          <div
            class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
          >
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide4" class="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            class="w-full"
          />
          <div
            class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
          >
            <a href="#slide3" class="btn btn-circle">❮</a>
            <a href="#slide1" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <div class="flex flex-col min-h-screen bg-zinc-100">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-end mx-8 my-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm sách..."
          class="input input-bordered w-64"
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
</style>
