<script setup>
import { computed } from "vue";

// Nhận props
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

// Ảnh mặc định nếu sách không có ảnh
const defaultImage = computed(
  () =>
    "https://cdn-icons-png.flaticon.com/512/29/29302.png"
);
</script>

<template>
  <div
    class="flex flex-col shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.01] transition bg-base-100"
  >
    <!-- Ảnh bìa sách -->
    <!-- <div class="relative">
      <img
        :src="book.image || defaultImage"
        alt="Book cover"
        class="w-full h-56 object-cover"
      />
      <span
        v-if="book.availableCopies === 0"
        class="absolute top-2 right-2 bg-error text-white text-xs px-2 py-1 rounded"
      >
        Hết sách
      </span>
    </div> -->

    <!-- Thông tin sách -->
    <div class="p-4 flex flex-col justify-between flex-1">
      <div>
        <h2 class="font-semibold text-lg truncate">{{ book.title }}</h2>
        <p class="text-sm text-gray-600">Tác giả: {{ book.author }}</p>
      </div>

      <!-- Nút hành động -->
      <div class="mt-4 flex justify-between items-center">
        <button
          class="btn btn-sm btn-outline btn-primary"
          @click="$emit('view-detail', book._id)"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  </div>
</template>

