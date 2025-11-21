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

const { borrow } = defineProps({
  borrow: {
    type: Object,
    required: true,
  },
});

const handleApproveBook = async (borrow_id) => {
  try {
    if (borrow.book_id?.quantity <= 0) {
      push.error("Duyệt sách thất bại do số lượng sách đã hết");
      return;
    }
    await borrowService.updateBorrow(borrow._id, {
      staff_id: staff_id.value,
    });
    await borrowService.updateBorrow(props.borrow._id, { status: "borrowing" });
    await bookService.updateBook(props.borrow.book_id?._id, {
      quantity: props.borrow.book_id?.quantity - 1,
    });
    push.success("Duyệt sách thành công");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt sách");
  }
};

const handleApproveReturnBook = async (borrow_id) => {
  try {
    await borrowService.updateBorrow(props.borrow._id, {
      staff_id: staff_id.value,
    });
    await borrowService.updateBorrow(props.borrow._id, { status: "returned" });
    await bookService.updateBook(props.borrow.book_id?._id, {
      quantity: props.borrow.book_id?.quantity + 1,
    });
    push.success("Duyệt trả sách thành công");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt trả sách");
  }
};

const handleRejectBook = async (borrow_id) => {
  try {
    if (props.borrow.book_id?.quantity <= 0) {
      push.error("Duyệt sách thất bại do số lượng sách đã hết");
      return;
    }
    await borrowService.updateBorrow(props.borrow._id, {
      staff_id: staff_id.value,
    });
    await borrowService.updateBorrow(props.borrow._id, { status: "rejected" });
    push.success("Từ chối duyệt sách thành công");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi duyệt sách");
  }
};

const handleReturnBook = async (borrow_id) => {
  try {
    await borrowService.updateBorrow(props.borrow._id, {
      status: "return_pending",
    });
    push.info("Đang xử lý trả sách");
    emit("fetchBorrows");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi trả sách");
  }
};

const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    class: "text-amber-500 font-bold",
    actions: {
      approve: true,
      reject: true,
      approveReturn: false,
      delete: false,
      requestReturn: false,
    },
  },
  borrowing: {
    label: "Đang mượn",
    class: "text-sky-500 font-bold",
    actions: {
      approve: false,
      reject: false,
      approveReturn: false,
      delete: false,
      requestReturn: true,
    },
  },
  return_pending: {
    label: "Chờ duyệt trả",
    class: "text-amber-500 font-bold",
    actions: {
      approveReturn: true,
      reject: false,
      approve: false,
      delete: false,
      requestReturn: false,
    },
  },
  returned: {
    label: "Đã trả",
    class: "text-emerald-500 font-bold",
    actions: {
      delete: true,
    },
  },
  rejected: {
    label: "Từ chối",
    class: "text-red-600 font-bold",
    actions: {
      delete: true,
    },
  },
  overdue: {
    label: "Quá hạn",
    class: "text-red-600 font-bold",
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
    <td v-if="role === 'staff'" class="whitespace-nowrap px-6 py-4">
      {{ borrow.reader_id?.name || "Không xác định" }}
    </td>

    <!-- Tựa sách -->
    <td class="min-w-[220px] max-w-[315px] px-6 py-4 text-sm text-black">
      {{ borrow.book_id?.title || "Không xác định" }}
    </td>

    <!-- Ngày mượn -->
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{
        borrow.borrowDate
          ? new Date(borrow.borrow_date).toLocaleDateString("vi-VN")
          : "Không xác định"
      }}
    </td>

    <!-- Ngày trả -->
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{
        borrow.returnDate
          ? new Date(borrow.return_date).toLocaleDateString("vi-VN")
          : "Không xác định"
      }}
    </td>

    <!-- Trạng thái -->
    <td class="whitespace-nowrap px-6 py-4" :class="currentStatus.class">
      {{ currentStatus.label }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
      <div v-if="role === 'staff'" class="mt-4 space-y-2">
        <button
          v-if="currentStatus.actions.approve"
          @click="handleApproveBook(props.borrow._id)"
          class="text-green-600 transition-all hover:text-green-900"
        >
          Duyệt sách
        </button>

        <button
          v-if="currentStatus.actions.reject"
          @click="handleRejectBook(props.borrow._id)"
          class="text-red-600 transition-all hover:text-red-900"
        >
          Từ chối
        </button>

        <button
          v-if="currentStatus.actions.approveReturn"
          @click="handleApproveReturnBook(props.borrow._id)"
          class="text-purple-400 transition-all hover:text-purple-900"
        >
          Duyệt trả sách
        </button>

      </div>

      <!-- ================== NÚT HÀNH ĐỘNG USER ================== -->
      <div v-if="role === 'user'" class="mt-4">
        <button
          v-if="currentStatus.actions.requestReturn"
          @click="handleReturnBook(props.borrow._id)"
          class="btn btn-success w-full text-white"
        >
          Trả sách
        </button>

        <button
          v-else
          disabled
          class="btn w-full opacity-50 cursor-not-allowed"
        >
          Trả sách
        </button>
      </div>
    </td>
  </tr>

  
</template>
