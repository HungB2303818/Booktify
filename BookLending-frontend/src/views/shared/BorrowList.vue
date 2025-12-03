<script setup>
import { ref, onMounted, computed } from "vue";
import BorrowService from "@/services/borrow.service";
import BorrowCard from "@/components/BorrowCard.vue";
import { authUserId, authRole } from "@/stores/auth";
import { push } from "notivue";

const borrows = ref([]);
const loading = ref(true);
const totalborrows = ref(0);
const role = authRole;
const userId = authUserId;
const statusFilter = ref("all");

const borrowService = new BorrowService();
const searchQuery = ref("");

const filteredBorrows = computed(() => {
  let list = borrows.value;

  if (statusFilter.value !== "all") {
    list = list.filter((b) => b.status === statusFilter.value);
  }
  if (!searchQuery.value.trim()) return list;

  const query = searchQuery.value.toLowerCase();

  return list.filter((b) => {
    const title = b.book_id?.title?.toLowerCase() || "";
    const reader = b.reader_id?.name?.toLowerCase() || "";

    return title.includes(query) || reader.includes(query);
  });
});

const fetchBorrows = async () => {
  try {
    loading.value = true;

    if (role.value === "staff") {
      borrows.value = await borrowService.getAllBorrows();
    } else {
      borrows.value = await borrowService.getBorrowByUser(userId.value);
    }
    totalborrows.value = borrows.value.length;
    console.log("STATUS:", borrows.value.map(b => b.status));
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
    <div class="max-w-6xl mx-auto mb-6">
      <h1 class="text-4xl font-bold">Danh sách đơn mượn</h1>
      <p class="text-gray-600 mt-1 text-lg">Tổng đơn: {{ totalborrows }}</p>
    </div>

    <!-- TABLE LIST -->
    <div
      class="max-w-6xl mx-auto rounded-box border border-base-content/5 bg-base-100"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
      >
        <!-- SEARCH BAR -->
        <div class="relative w-full max-w-md">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm đơn mượn..."
            class="w-full pl-12 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div class="flex items-center gap-4 px-6 py-4">
          <button
            @click="statusFilter = 'all'"
            :class="
              statusFilter === 'all'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Tất cả
          </button>

          <!-- ĐANG MƯỢN -->
          <button
            @click="statusFilter = 'borrowing'"
            :class="
              statusFilter === 'borrowing'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Đang mượn
          </button>

          <!-- ĐÃ TRẢ -->
          <button
            @click="statusFilter = 'returned'"
            :class="
              statusFilter === 'returned'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Đã trả
          </button>
        </div>
      </div>
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-content-neutral">
          <tr>
            <th
              class="w-[140px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Người mượn
            </th>
            <th
              class="w-[200px] px-6 py-3 text-left text-xs uppercase tracking-wider"
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
              class="w-[150px] px-6 py-3 text-left text-xs uppercase tracking-wider"
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <BorrowCard
            v-for="borrow in filteredBorrows"
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
