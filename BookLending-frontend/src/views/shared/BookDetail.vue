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
      <div
        class="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-start gap-3 items-stretch"
      >
        <!-- Ảnh bìa -->
        <div
          class="flex flex-col items-center space-y-4 bg-white rounded-xl shadow"
        >
          <div class="w-full flex justify-center py-4 bg-zinc-50">
            <img
              :src="`http://localhost:8080${book.image}`"
              alt="Bìa sách"
              class="w-48 h-63 object-cover rounded-md"
            />
          </div>
          <div class="mb-2 flex gap-3">
            <!-- Staff buttons -->
            <button
              v-if="role === 'staff'"
              @click="goToEdit"
              class="flex items-center gap-2 bg-yellow-50 text-yellow-600 border-2 border-yellow-300 px-4 py-2 rounded-xl hover:bg-yellow-100 hover:border-yellow-400 transition-all cursor-pointer"
            >
              <i class="fa-solid fa-pen-to-square text-sm"></i>
              Chỉnh sửa
            </button>

            <button
              v-if="role === 'staff'"
              @click="deleteBook"
              class="flex items-center gap-2 bg-red-50 text-red-600 border-2 border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
            >
              <i class="fa-solid fa-trash text-sm"></i>
              Xóa
            </button>

            <!-- User button -->
            <button
              v-else-if="role === 'user'"
              @click="gotoBorrow"
              class="flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <i class="fa-solid fa-book-open text-sm"></i>
              Mượn sách
            </button>
          </div>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="space-y-4 bg-white p-4 rounded-xl">
          <h1 class="text-3xl font-bold">{{ book.title }}</h1>

          <div class="text-gray-700 space-y-1 text-sm">
            <p>
              Tác giả:
              <span class="font-semibold"> {{ book.author }}</span>
            </p>
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
            <p class="text-3xl font-semibold my-4">
              {{ Number(book.price).toLocaleString("vi-VN") }} đ
            </p>
          </div>

          <div class="pt-4">
            <h2 class="font-semibold text-lg mb-1">Mô tả</h2>
            <p class="text-gray-600 leading-relaxed">
              Một hành trình đầy bất ngờ mở ra khi nhân vật chính buộc phải bước
              ra khỏi vùng an toàn của mình và đối mặt với những thử thách chưa
              từng được chuẩn bị trước. Mỗi quyết định đều có thể thay đổi số
              phận, và những thử thách nối tiếp nhau không chỉ thử lòng can đảm
              mà còn mở ra những bài học sâu sắc về tình bạn, niềm tin và ý
              nghĩa của sự trưởng thành.
            </p>
          </div>
        </div>
        <div class="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-6 ml-12">Đánh giá sản phẩm</h2>

          <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
            <!-- ================== CỘT 1: ĐIỂM TRUNG BÌNH ================== -->
            <div class="flex flex-col items-center justify-start">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
