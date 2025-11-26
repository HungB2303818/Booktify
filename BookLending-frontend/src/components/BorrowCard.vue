<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import BorrowService from "../services/borrow.service";
import BookService from "../services/book.service";
import { push } from "notivue";

const role = computed(() => localStorage.getItem("role"));
const staff_id = computed(() => localStorage.getItem("id"));
const router = useRouter();
const borrowService = new BorrowService();
const bookService = new BookService();
const emit = defineEmits(["fetchBorrows"]);

const { borrow } = defineProps(["borrow"]);

const handleApproveBook = async (borrow_id) => {
  try {
    if (borrow.book_id?.quantity <= 0) {
      push.error("Duyệt sách thất bại do số lượng sách đã hết");
      return;
    }

    await borrowService.updateBorrow(borrow._id, {
      employee_id: staff_id.value,
      status: "borrowing",
    });
    await bookService.updateBook(borrow.book_id?._id, {
      quantity: borrow.book_id?.quantity - 1,
    });
    emit("fetchBorrows");
    push.success("Duyệt sách thành công");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt sách");
  }
};

const handleApproveReturnBook = async (borrow_id) => {
  try {
    await borrowService.updateBorrow(borrow._id, {
      employee_id: staff_id.value,
      status: "returned",
    });
    await bookService.updateBook(borrow.book_id?._id, {
      quantity: borrow.book_id?.quantity + 1,
    });
    emit("fetchBorrows");
    push.success("Duyệt trả sách thành công");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt trả sách");
  }
};

const handleRejectBook = async (borrow_id) => {
  try {
    if (borrow.book_id?.quantity <= 0) {
      push.error("Duyệt sách thất bại do số lượng sách đã hết");
      return;
    }
    await borrowService.updateBorrow(borrow._id, {
      employee_id: staff_id.value,
    });
    await borrowService.updateBorrow(borrow._id, { status: "rejected" });
    push.success("Từ chối duyệt sách thành công");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt sách");
  }
};

const handleReturnBook = async (borrow_id) => {
  try {
    await borrowService.updateBorrow(borrow._id, {
      status: "returnpending",
    });
    push.info("Đang xử lý trả sách");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi trả sách");
  }
};
const handleDeleteBorrow = async (borrow_id) => {
  try {
    if (confirm("Bạn có chắc chắn muốn xóa đơn mượn này không?")) {
      await borrowService.deleteBorrow(borrow_id);
      push.success("Xóa đơn mượn thành công");
      emit("fetchBorrows");
    }
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi xóa đơn mượn");
  }
};
const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    class:
      "px-2 py-[2px] rounded-xl bg-amber-100 text-amber-700 font-medium text-sm",
    actions: {
      approve: true,
      reject: true,
      approveReturn: false,
      delete: false,
      returnpending: false,
    },
  },

  borrowing: {
    label: "Đang mượn",
    class:
      "px-2 py-[2px] rounded-xl bg-sky-100 text-sky-700 font-medium text-sm",
    actions: {
      approve: false,
      reject: false,
      approveReturn: false,
      delete: false,
      returnpending: true,
    },
  },

  returnpending: {
    label: "Chờ duyệt trả",
    class:
      "px-3 py-[2px] rounded-xl bg-amber-100 text-amber-700 font-medium text-sm",
    actions: {
      approveReturn: true,
      reject: false,
      approve: false,
      delete: false,
      returnpending: false,
    },
  },

  returned: {
    label: "Đã trả",
    class:
      "px-3 py-[2px] rounded-xl font-medium text-sm bg-green-100 text-green-800",
    actions: {
      delete: true,
    },
  },

  rejected: {
    label: "Từ chối",
    class:
      "px-3 py-[2px] rounded-xl bg-red-100 text-red-700 font-medium text-sm",
    actions: {
      delete: true,
    },
  },

  overdue: {
    label: "Quá hạn",
    class: "px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium",
    actions: {
      delete: true,
    },
  },
};

// Lấy config theo status
const currentStatus = computed(() => {
  return (
    statusConfig[borrow.status] ?? {
      label: "Không xác định",
      class: "text-gray-500 font-bold",
      actions: {},
    }
  );
});

onMounted(() => {
  console.log("Borrow Debug:", borrow);
  console.log("Book ID:", borrow?.book_id?._id);
  console.log("Quantity:", borrow?.book_id?.quantity);
});
</script>

<template>
  <tr>
    <!-- Người mượn -->
    <td class="whitespace-nowrap px-6 py-4 text-xl font-bold">
      {{ borrow.reader_id?.name || "Không xác định" }}
    </td>

    <!-- Tựa sách -->
    <td
      class="min-w-[150px] max-w-[220px] px-6 py-4 text-sm text-black font-bold flex items-center gap-3"
    >
      <img
        v-if="borrow.book_id?.image"
        :src="borrow.book_id.image"
        alt="Book cover"
        class="w-10 h-14 object-cover rounded shadow"
      />

      <div class="flex flex-col">
        <span class="font-bold">
          {{ borrow.book_id?.title || "Không xác định" }}
        </span>

        <span class="text-gray-600 text-xs mt-1 font-medium">
          {{ borrow.book_id?.author || "Không rõ tác giả" }}
        </span>
      </div>
    </td>

    <!-- Ngày mượn -->
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{
        borrow.borrowDate
          ? new Date(borrow.borrowDate).toLocaleDateString("vi-VN")
          : "Không xác định"
      }}
    </td>

    <!-- Ngày trả -->
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{
        borrow.returnDate
          ? new Date(borrow.returnDate).toLocaleDateString("vi-VN")
          : "Không xác định"
      }}
    </td>

    <!-- Trạng thái -->
    <td class="whitespace-nowrap px-6 py-4 text-start align-middle">
      <span :class="currentStatus.class" class="inline-block">
        {{ currentStatus.label }}
      </span>
    </td>

    <td class="px-6 py-4 text-start align-middle">
      <!--staff-->
      <div v-if="role === 'staff'" class="flex mt-4 gap-3 ">
        <button
          v-if="currentStatus.actions.approve"
          @click="handleApproveBook(borrow._id)"
          class="text-green-600 transition-all hover:text-green-900 cursor-pointer underline"
        >
          Duyệt
        </button>
        <span v-if="currentStatus.actions.approve && currentStatus.actions.reject" class="text-base-300">|</span>
        <button
          v-if="currentStatus.actions.reject"
          @click="handleRejectBook(borrow._id)"
          class="text-red-600 transition-all hover:text-red-900 cursor-pointer underline"
        >
          Từ chối
        </button>

        <button
          v-if="currentStatus.actions.approveReturn"
          @click="handleApproveReturnBook(borrow._id)"
          class="text-purple-500 transition-all hover:text-purple-900 cursor-pointer underline"
        >
          Duyệt trả
        </button>
        <button
          v-if="currentStatus.actions.delete"
          @click="handleDeleteBorrow(borrow._id)"
          class="font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer underline"
        >
          Xóa
        </button>
      </div>

      <!-- ================== NÚT HÀNH ĐỘNG USER ================== -->
      <div v-if="role === 'user'" class="mt-4 space-y-2">
        <button
          v-if="currentStatus.actions.returnpending"
          @click="handleReturnBook(borrow._id)"
          class="text-green-600 font-semibold transition-all hover:text-green-900 cursor-pointer underline"
        >
          Trả sách
        </button>
        <button
          v-if="currentStatus.actions.delete"
          @click="handleDeleteBorrow(borrow._id)"
          class="font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer underline"
        >
          Xóa
        </button>
      </div>
    </td>
  </tr>
</template>
