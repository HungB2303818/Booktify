<script setup>
import { ref, onMounted, computed, warn } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookService from "@/services/book.service";
import { push } from "notivue";
const route = useRoute();
const router = useRouter();
const bookService = new BookService();

const book = ref({});

const defaultImage = "https://cdn-icons-png.flaticon.com/512/29/29302.png";
const role = computed(() => localStorage.getItem("role"));
// Lấy thông tin sách theo ID
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await bookService.getBookById(id);
    book.value = res;
  } catch (err) {
    console.error("Lỗi tải chi tiết sách:", err);
  }
});

const goBack = () => router.push("/books");
const goToEdit = () => router.push(`/books/edit/${book.value._id}`);

const deleteBook = async () => {
  if (confirm("Xác nhận xóa sách này?")) {
    try {
      await bookService.deleteBook(book.value._id);
      router.push("/books");
      push.success("Xóa sách thành công");
    } catch (err) {
      console.error("Lỗi xóa sách:", err);
    }
  }
};
</script>

<template>
  <div class="container mx-auto px-6 py-10">
    <div class="flex flex-col md:flex-row items-start gap-8">
      <!-- Ảnh bìa -->
      <div class="w-full md:w-1/3 flex justify-center border-">
        <img
          :src="book.image || defaultImage"
          alt="Bìa sách"
          class="w-64 h-80 object-cover rounded-lg shadow"
        />
      </div>

      <!-- Thông tin chi tiết -->
      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold ">{{ book.title }}</h1>

        <div class="text-gray-700 space-y-1">
          <p><span class="font-semibold">Tác giả:</span>{{ book.author }}</p>
          <p><span class="font-semibold">Năm xuất bản:</span>{{ book.year }}</p>
          <p><span class="font-semibold">Số lượng:</span>{{ book.quantity }}</p>
        </div>

        <div class="pt-4">
          <h2 class="font-semibold text-lg mb-1">Mô tả</h2>
          <p class="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae qui
            animi, eveniet nesciunt ipsam cumque. Odit doloribus voluptatum
            rerum dolorem! A mollitia placeat quam ea cupiditate dolore earum
            pariatur consequatur?
          </p>
        </div>

        <div class="flex gap-3 pt-6">
          <button
            v-if="role === 'staff'"
            class="btn btn-warning"
            @click="goToEdit"
          >
            Chỉnh sửa
          </button>
          <button
            v-if="role === 'staff'"
            class="btn bg-red-600 text-white hover:bg-red-700"
            @click="deleteBook"
          >
            Xóa
          </button>
          <button v-else-if="role === 'user'" class="btn btn-success">
            Mượn sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
