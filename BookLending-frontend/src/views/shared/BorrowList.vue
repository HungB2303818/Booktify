<script setup>
import { ref, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import BorrowCard from "@/components/BorrowCard.vue";
import { authUserId, authRole } from "@/stores/auth";
import { push } from "notivue";

const borrows = ref([]);
const loading = ref(true);
const role = authRole; // "user" hoặc "staff"
const userId = authUserId;

const borrowService = new BorrowService();

const fetchBorrows = async () => {
  try {
    loading.value = true;

    if (role.value === "staff") {
      // STAFF → xem tất cả đơn mượn
      borrows.value = await borrowService.getAllBorrows();
    } else {
      // USER → xem đơn mượn của chính họ
      borrows.value = await borrowService.getBorrowByUser(userId.value);
    }
  } catch (error) {
    console.error(error);
    push.error("Không thể tải danh sách đơn mượn");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBorrows);
</script>

<template>
  <div class="p-4 w-screen min-h-screen bg-zinc-100 mx-auto">
    <!-- TABLE LIST -->
    <div
      class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100"
    >
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-content-neutral">
          <tr>
            <th
              class="w-[140px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Người mượn
            </th>
            <th
              class="w-[220px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Sách
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Ngày mượn
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Ngày trả
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Trạng thái
            </th>
            <th
              class="w-[130px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <BorrowCard
            v-for="borrow in borrows"
            :key="borrow._id"
            :borrow="borrow"
            @fetchBorrows="fetchBorrows"
          />
          <tr v-if="!borrows.length">
            <td colspan="100%" class="text-center py-4 text-base">
              Chưa có đơn mượn
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
