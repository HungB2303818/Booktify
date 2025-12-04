<script setup>
import { onMounted } from "vue";

// Nhận props
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});
onMounted(() => {
  console.log("ROLE RECEIVED:", props.role);
});
</script>

<template>
  <div
    @click="$emit('view-detail', book._id)"
    class="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer mt-3"
  >
    <div class="relative w-full bg-zinc-100 p-4">
      <span
        v-if="role === 'staff'"
        class="absolute top-2 right-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1 rounded-full shadow"
      >
        Số lượng còn lại: {{ book.quantity }}
      </span>

      <div class="w-full flex justify-center bg-zinc-100">
        <img
          :src="`http://localhost:8080${book.image}`"
          alt="Book cover"
          class="h-56 object-cover rounded-md shadow-sm transform"
        />
      </div>
    </div>
    <!-- Thông tin sách -->
    <div class="p-4 flex flex-col justify-between flex-1">
      <div>
        <h2 class="font-semibold text-lg truncate">{{ book.title }}</h2>
        <p class="text-sm text-gray-600">
          <span class="font-bold"></span> {{ book.author }}
        </p>
      </div>
      <div class="pr-2 pt-3 flex items-center justify-between mt-1">
        <p class="mt-4 mb-2 text-base font-semibold">
          {{ Number(book.price).toLocaleString("vi-VN") }} <span> đ</span>
        </p>
        <div v-if="role==='staff'" class="flex items-center gap-3">
          <!-- Nút chỉnh sửa (staff) -->
          <button
            v-if="role === 'staff'"
            class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            @click.stop="$emit('view-edit', book._id)"
          >
            <i class="fa-solid fa-pen text-sm"></i>
          </button>

          <!-- Nút xem chi tiết -->
          <button
            @click.stop="$emit('view-detail', book._id)"
            class="px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm cursor-pointer"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
