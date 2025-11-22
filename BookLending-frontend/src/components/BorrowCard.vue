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
      quantity: borrow.book_id?.quantity - 1
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
      employee_id: employee_id.value,
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
    await borrowService.deleteBorrow(borrow_id);
    push.success("Xóa đơn mượn thành công");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi xóa đơn mượn");
  }
};
const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    class: "px-3 py-1 border bg-amber-100 text-amber-700 font-medium",
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
    class: "px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium",
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
    class: "inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800",
    actions: {
      delete: true,
    },
  },

  rejected: {
    label: "Từ chối",
    class: "px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium",
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
</script>

<template>
  <tr>
    <!-- Người mượn (staff mới thấy) -->
    <td class="whitespace-nowrap px-6 py-4 text-xl font-bold">
      {{ borrow.reader_id?.name || "Không xác định" }}
    </td>

    <!-- Tựa sách -->
    <td
      class="min-w-[150px] max-w-[220px] px-6 py-4 text-sm text-black font-bold"
    >
      {{ borrow.book_id?.title || "Không xác định" }}
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
    <td class="flex justify-center item-center whitespace-nowrap px-6 py-4" :class="currentStatus.class">
      {{ currentStatus.label }}
    </td>

    <!--staff-->
    <td class="whitespace-nowrap px-6 py-4 text-sm font-bold cursor-pointer">
      <div v-if="role === 'staff'" class="mt-4 space-y-2">
        <button
          v-if="currentStatus.actions.approve"
          @click="handleApproveBook(borrow._id)"
          class="text-green-600 transition-all hover:text-green-900"
        >
          Duyệt sách
        </button>

        <button
          v-if="currentStatus.actions.reject"
          @click="handleRejectBook(borrow._id)"
          class="text-red-600 transition-all hover:text-red-900"
        >
          Từ chối
        </button>

        <button
          v-if="currentStatus.actions.approveReturn"
          @click="handleApproveReturnBook(borrow._id)"
          class="text-purple-400 transition-all hover:text-purple-900"
        >
          Duyệt trả sách
        </button>
      </div>

      <!-- ================== NÚT HÀNH ĐỘNG USER ================== -->
      <div v-if="role === 'user'" class="mt-4 space-y-2">
        <button
          v-if="currentStatus.actions.returnpending"
          @click="handleReturnBook(borrow._id)"
          class="btn btn-success w-full text-white"
        >
          Trả sách
        </button>

        <button
          v-else
          disabled
          class="btn opacity-50 cursor-not-allowed"
        >
          Trả sách
        </button>
        <button v-if="currentStatus.actions.delete"
          @click="handleDeleteBorrow(borrow._id)"
          class="btn btn-error rounded-full  w-[40px] text-white">
          Xóa
        </button>
      </div>
    </td>
  </tr>
</template>
