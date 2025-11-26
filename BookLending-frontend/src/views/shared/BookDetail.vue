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

const goToEdit = () => router.push(`/books/edit/${book.value._id}`);
const gotoBorrow = () => router.push(`/borrows/add/${book.value._id}`);
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
  <div class="w-full flex justify-center bg-zinc-100 py-4 px-4 min-h-screen">
    <div class="w-full max-w-6xl rounded-xl">
      <!-- grid 2 cột -->
      <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-3 items-stretch">
        <!-- Ảnh bìa -->
        <div class="flex flex-col items-center space-y-4 bg-white rounded-xl">
          <div class="p-4 rounded-lg">
            <img
              :src="book.image || defaultImage"
              alt="Bìa sách"
              class="w-64 h-86 object-cover rounded-md"
            />
          </div>
          <div class="mb-2">
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
            <button
              v-else-if="role === 'user'"
              class="btn btn-success"
              @click="gotoBorrow"
            >
              Mượn sách
            </button>
          </div>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="space-y-4 bg-white p-4 rounded-xl">
          <h1 class="text-3xl font-bold">{{ book.title }}</h1>

          <div class="text-gray-700 space-y-1 text-sm">
            <p>
              Nhà xuất bản:
              <span class="font-semibold"> {{ book.publisher }}</span>
            </p>
            <p>
              Năm xuất bản: <span class="font-semibold"> {{ book.year }}</span>
            </p>
            <p>
              Còn lại:
              <span class="font-semibold"> {{ book.quantity }}</span>
            </p>
            <p class="text-red-700 text-3xl font-semibold my-4">
              {{ Number(book.price).toLocaleString("vi-VN") }} đ
            </p>
          </div>

          <div class="pt-4">
            <h2 class="font-semibold text-lg mb-1">Mô tả</h2>
            <p class="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
              qui animi, eveniet nesciunt ipsam cumque. Odit doloribus
              voluptatum rerum dolorem! A mollitia placeat quam ea cupiditate
              dolore earum pariatur consequatur?
            </p>
          </div>
        </div>
        <div class="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- ================== CỘT 1: ĐIỂM TRUNG BÌNH ================== -->
            <div class="flex flex-col items-center">
              <p class="text-5xl font-bold">
                0<span class="text-3xl">/5</span>
              </p>

              <!-- icon sao -->
              <div class="flex gap-1 my-2 text-gray-300 text-2xl">
                <span>★</span><span>★</span><span>★</span><span>★</span
                ><span>★</span>
              </div>

              <p class="text-gray-500 text-sm">(0 đánh giá)</p>
            </div>

            <!-- ================== CỘT 2: BIỂU ĐỒ TỈ LỆ ================== -->
            <div class="space-y-2">
              <div class="flex items-center gap-3 text-sm">
                <span class="w-10">5 sao</span>
                <div class="flex-1 bg-gray-200 h-2 rounded"></div>
                <span>0%</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <span class="w-10">4 sao</span>
                <div class="flex-1 bg-gray-200 h-2 rounded"></div>
                <span>0%</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <span class="w-10">3 sao</span>
                <div class="flex-1 bg-gray-200 h-2 rounded"></div>
                <span>0%</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <span class="w-10">2 sao</span>
                <div class="flex-1 bg-gray-200 h-2 rounded"></div>
                <span>0%</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <span class="w-10">1 sao</span>
                <div class="flex-1 bg-gray-200 h-2 rounded"></div>
                <span>0%</span>
              </div>
            </div>

            <!-- ================== CỘT 3: THÔNG BÁO VIẾT ĐÁNH GIÁ ================== -->
            <div class="flex items-center justify-center text-gray-600">
              <p>
                Chỉ có thành viên mới có thể viết nhận xét. Vui lòng
                <a href="#" class="text-blue-500 hover:underline">đăng nhập</a>
                hoặc
                <a href="#" class="text-blue-500 hover:underline">đăng ký</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
