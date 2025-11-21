<script setup>
import { ref, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import BorrowCard from "@/components/BorrowCard.vue";
import { push } from "notivue";

const borrows = ref([]);
const loading = ref(true);

const borrowService = new BorrowService();

const fetchBorrows = async () => {
  try {
    loading.value = true;
    borrows.value = await borrowService.getAllBorrows();
  } catch (error) {
    console.log(error);
    push.error("Không thể tải danh sách đơn mượn");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBorrows);
</script>

<template>
  <div class="p-4">

    <!-- LOADING -->
    <div v-if="loading" class="text-gray-600">Đang tải...</div>

    <!-- TABLE LIST -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-blue-600">
          <tr>
            <th class="w-[140px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Người mượn</th>
            <th class="w-[220px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Sách</th>
            <th class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Ngày mượn</th>
            <th class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Ngày trả</th>
            <th class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Trạng thái</th>
            <th class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider text-white">Thao tác</th>
          </tr>
        </thead>

        <tbody>
              <BorrowCard
                v-for="borrow in borrows"
                :key="borrow._id"
                :borrow="borrow"
                @fetchBorrows="fetchBorrows"
              />
        </tbody>
      </table>
    </div>

  </div>
</template>
