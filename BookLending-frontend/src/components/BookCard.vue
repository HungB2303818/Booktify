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
const defaultImage = computed(() => "/img/harry.jpg");
</script>

<template>
  <div
    @click="$emit('view-detail', book._id)"
    class="flex flex-col shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.01] transition bg-base-100 cursor-pointer"
  >
    <!-- Ảnh bìa sách -->
    <div class="relative">
      <img
        :src="book.image || defaultImage"
        alt="Book cover"
        class="w-full h-56 object-cover"
      />
    </div>

    <!-- Thông tin sách -->
    <div class="p-4 flex flex-col justify-between flex-1">
      <div>
        <h2 class="font-semibold text-lg truncate">{{ book.title }}</h2>
        <p class="text-sm text-gray-600">
          <span class="font-bold">Tác giả: </span> {{ book.author }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-bold">Nhà xuất bản: </span> {{ book.publisher }}
        </p>
        <p class="my-2 text-xl text-red-700 font-semibold">{{ Number(book.price).toLocaleString("vi-VN") }} <span> đ</span></p>
      </div>
    </div>
  </div>
</template>
