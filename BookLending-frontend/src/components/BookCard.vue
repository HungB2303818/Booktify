<script setup>
import { computed,onMounted } from "vue";

// Nhận props
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  role: {
    type: String,
    required: true,
  }
});
const defaultImage = computed(() => "/img/harry.jpg");
onMounted(() => {
  console.log("ROLE RECEIVED:", props.role);
});
</script>

<template>
  <div
    @click="$emit('view-detail', book._id)"
    class="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
  >
    <!-- Ảnh bìa sách -->
    <div class="w-full flex justify-center py-4 bg-zinc-100">
      <img
        :src="book.image || defaultImage"
        alt="Book cover"
        class="h-56 object-cover rounded-md shadow-sm"
      />
    </div>

    <!-- Thông tin sách -->
    <div class="p-4 flex flex-col justify-between flex-1">
      <div>
        <h2 class="font-semibold text-lg truncate">{{ book.title }}</h2>
        <p class="text-sm text-gray-600">
          <span class="font-bold"></span> {{ book.author }}
        </p>
        <p class="mt-4 mb-2 text-base font-semibold">
          {{ Number(book.price).toLocaleString("vi-VN") }} <span> đ</span>
        </p>
      </div>
    </div>
    <div v-if="role==='user'" class="px-4 pb-4">
      <button
        class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
        @click.stop="$emit('view-detail', book._id)"
      >
        Mượn ngay
      </button>
    </div>
    <div v-else-if="role==='staff'" class="px-4 pb-4 flex gap-2 justify-center">
      <button
        class="h-9 w-9 bg-yellow-500 text-black hover:bg-yellow-600 font-medium rounded-full cursor-pointer"
        @click.stop="$emit('view-edit', book._id)"
      ><i class="fa-solid fa-pen text-sm"></i>
      </button>

      <button
        class="h-9 w-9 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 cursor-pointer"
        @click.stop="$emit('delete', book._id)"
      >
        <i class="fa-solid fa-trash text-sm"></i>
      </button>
    </div>
  </div>
</template>
