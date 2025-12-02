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
    <section class="relative w-full py-24 text-center overflow-hidden">
      <!-- Background image -->
      <img
        src="/img/library.jpg"
        alt="background"
        class="absolute inset-0 w-full h-full"
      />

      <!-- GRADIENT FADE (từ trong suốt → trắng) -->
      <div
        class="absolute inset-0 z-[5]"
        style="
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.75) 35%,
            rgba(255, 255, 255, 0.85) 55%,
            rgba(255, 255, 255, 0.95) 75%,
            rgba(255, 255, 255, 1) 100%
          );
        "
      ></div>

      <!-- CONTENT -->
      <div class="relative z-10 max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
          Mượn sách nhanh – Mở rộng tri thức
        </h1>

        <p class="mt-3 text-gray-600 text-lg">
          Khám phá hàng ngàn đầu sách thuộc mọi thể loại từ kinh điển đến hiện
          đại <br />
          Tất cả đều trong tầm tay bạn.
        </p>

        <div class="mt-6 flex justify-center gap-4">
          <router-link
            to="/#books"
            class="px-7 py-3 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-blue-700 to-blue-500 hover:scale-[1.04] transition duration-200"
          >
            Khám phá sách
          </router-link>
          <RouterLink to="/user/register">
            <button
              v-if="role !== 'user' && role !== 'staff'"
              class="px-7 py-3 rounded-xl border-2 font-semibold cursor-pointer border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition duration-200"
            >
              Đăng ký ngay
            </button>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="px-4 mt-24 mb-24">
      <h2 class="text-center text-2xl font-semibold text-gray-900 mb-6">
        Không gian thư viện & tiện ích
      </h2>
      <div class="max-w-6xl mx-auto flex gap-4 overflow-x-auto scrollbar-hide">
        <img
          src="/img/unnamed.webp"
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
