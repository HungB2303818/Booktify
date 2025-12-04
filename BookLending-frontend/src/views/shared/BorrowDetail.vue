<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import BorrowService from "@/services/borrow.service";
import BookService from "@/services/book.service";
import { push } from "notivue";

const route = useRoute();
const borrowService = new BorrowService();
const bookService = new BookService();

const staff_id = computed(() => localStorage.getItem("id"));
const role = computed(() => localStorage.getItem("role"));
const borrow = ref({});
const loading = ref(true);

// Lấy chi tiết đơn mượn
const fetchBorrowDetail = async () => {
  try {
    const id = route.params.id;
    const data = await borrowService.getBorrowById(id);

    if (!data) {
      push.error("Không tìm thấy đơn mượn");
      return;
    }

    borrow.value = data;
  } catch (err) {
    push.error("Không thể tải chi tiết đơn mượn");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBorrowDetail);

//
// ====== HÀNH ĐỘNG DUYỆT ======
//
const handleApproveBook = async () => {
  try {
    if (borrow.value.book_id?.quantity <= 0) {
      push.error("Duyệt thất bại: sách đã hết");
      return;
    }

    await borrowService.updateBorrow(borrow.value._id, {
      employee_id: staff_id.value,
      status: "borrowing",
    });

    await bookService.updateBook(borrow.value.book_id._id, {
      quantity: borrow.value.book_id.quantity - 1,
    });

    push.success("Duyệt thành công");
    fetchBorrowDetail();
  } catch (err) {
    console.error(err);
    push.error("Lỗi khi duyệt sách");
  }
};

const handleApproveReturnBook = async () => {
  try {
    await borrowService.updateBorrow(borrow.value._id, {
      employee_id: staff_id.value,
      status: "returned",
      actualReturnDate: new Date(),
    });

    await bookService.updateBook(borrow.value.book_id._id, {
      quantity: borrow.value.book_id.quantity + 1,
    });

    push.success("Duyệt trả thành công");
    fetchBorrowDetail();
  } catch (err) {
    console.error(err);
    push.error("Lỗi khi duyệt trả");
  }
};

const handleRejectBook = async () => {
  try {
    await borrowService.updateBorrow(borrow.value._id, {
      employee_id: staff_id.value,
      status: "rejected",
    });

    push.success("Từ chối thành công");
    fetchBorrowDetail();
  } catch (err) {
    console.error(err);
    push.error("Lỗi khi từ chối");
  }
};

const handleReturnBook = async () => {
  try {
    await borrowService.updateBorrow(borrow.value._id, {
      status: "returnpending",
    });
    push.info("Đang xử lý trả");
    fetchBorrowDetail();
  } catch (err) {
    console.error(err);
    push.error("Lỗi khi trả sách");
  }
};

const handleDeleteBorrow = async () => {
  try {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

    await borrowService.deleteBorrow(borrow.value._id);
    push.success("Xóa thành công");
  } catch (err) {
    console.error(err);
    push.error("Lỗi khi xóa");
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

const currentStatus = computed(() => {
  if (!borrow.value) return { label: "Đang tải...", class: "" };
  return (
    statusConfig[borrow.value.status] ?? {
      label: "Không xác định",
      class: "text-gray-500 font-bold",
      actions: {},
    }
  );
});
</script>

<template>
  <div class="w-full min-h-screen bg-zinc-100 p-6">
    <!-- HEADER -->
    <div class="max-w-6xl mx-auto relative mt-4 mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-3">Chi tiết đơn mượn</h1>
    </div>

    <!-- GRID 2 CỘT -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      <!-- CARD THÔNG TIN NGƯỜI MƯỢN -->
      <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          >
            <i class="fa-solid fa-user text-gray-500"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Thông tin người mượn</h2>
            <p class="text-gray-500 text-sm">
              Chi tiết về thành viên mượn sách
            </p>
          </div>
        </div>

        <div class="text-gray-700 grid grid-cols-[150px_1fr] gap-y-4 text-sm">
          <!-- Họ và tên -->
          <p class="text-gray-500">Họ và tên</p>
          <p class="font-semibold">{{ borrow.reader_id?.name }}</p>

          <!-- Email -->
          <p class="text-gray-500">Tên đăng nhập</p>
          <p class="font-semibold">{{ borrow.reader_id?.username }}</p>

          <!-- Số điện thoại -->
          <p class="text-gray-500">Số điện thoại</p>
          <p class="font-semibold">{{ borrow.reader_id?.phone }}</p>

          <!-- Mã người dùng -->
          <p class="text-gray-500">Địa chỉ</p>
          <p class="font-semibold">{{ borrow.reader_id?.address }}</p>
        </div>
      </div>
      <!-- CARD THÔNG TIN SÁCH -->
      <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div class="flex items-start gap-4">
          <!-- ẢNH SÁCH -->
          <img
            :src="`http://localhost:8080${borrow.book_id?.image}`"
            alt="Book cover"
            class="w-48 h-68 object-cover rounded shadow"
          />
          <!-- THÔNG TIN SÁCH -->
          <div>
            <h2 class="text-gray-800 mb-1">Tựa sách</h2>
            <p class="font-semibold mb-2">{{ borrow.book_id?.title }}</p>

            <p class="text-sm text-gray-600">Tác giả</p>
            <p class="font-semibold mb-2">{{ borrow.book_id?.author }}</p>

            <p class="text-sm text-gray-600">Nhà xuất bản</p>
            <p class="font-semibold mb-2">{{ borrow.book_id?.publisher }}</p>

            <p class="text-sm text-gray-600">Năm xuất bản</p>
            <p class="font-semibold mb-3">{{ borrow.book_id?.year }}</p>

            <button
              class="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition"
            >
              <RouterLink :to="`/books/${borrow.book_id?._id}`"
                >Xem chi tiết sách</RouterLink
              >
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CARD THÔNG TIN MƯỢN -->
    <div
      class="max-w-6xl mx-auto mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 class="font-semibold text-gray-800 mb-4">
        Thông tin mượn và trả sách
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 text-gray-700">
        <div>
          <p class="text-sm">Số quyển</p>
          <p class="font-semibold">1</p>
        </div>
        <div>
          <p class="text-sm">Ngày mượn</p>
          <p class="font-semibold">
            {{
              borrow.borrowDate
                ? new Date(borrow.borrowDate).toLocaleDateString("vi-VN")
                : "Không xác định"
            }}
          </p>
        </div>

        <div>
          <p class="text-sm">Hạn trả</p>
          <p class="font-semibold">
            {{
              borrow.returnDate
                ? new Date(borrow.returnDate).toLocaleDateString("vi-VN")
                : "Không xác định"
            }}
          </p>
        </div>
        <div>
          <p class="text-sm">Trạng thái</p>
          <p :class="currentStatus.class" class="inline-block">
            {{ currentStatus.label }}
          </p>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-6 flex justify-end">
        <div v-if="role === 'user'">
          <button
            v-if="currentStatus.actions.returnpending"
            @click="handleReturnBook(borrow._id)"
            class="flex items-center font-semibold gap-2 bg-purple-50 text-purple-600 border-2 border-purple-200 px-4 py-2 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer"
          >
            Trả sách
          </button>
          <button
            v-if="currentStatus.actions.delete"
            @click="handleDeleteBorrow(borrow._id)"
            class="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
            title="Xóa đơn mượn"
          >
            <i class="fa-solid fa-trash text-base"></i>
            <span class="font-medium">Xóa</span>
          </button>
        </div>
        <div v-if="role === 'staff'" class="flex gap-2 items-center">
          <button
            v-if="currentStatus.actions.approve"
            @click="handleApproveBook(borrow._id)"
            class="flex items-center font-semibold gap-2 bg-green-50 text-green-600 border-2 border-green-200 px-4 py-2 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer"
            title="Duyệt"
          >
            Duyệt
          </button>

          <button
            v-if="currentStatus.actions.reject"
            @click="handleRejectBook(borrow._id)"
            class="flex items-center gap-2 bg-red-50 text-red-600 border-2 border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
            title="Từ chối"
          >
            Từ chối
          </button>

          <button
            v-if="currentStatus.actions.approveReturn"
            @click="handleApproveReturnBook(borrow._id)"
            class="flex items-center font-semibold gap-2 bg-purple-50 text-purple-600 border-2 border-purple-200 px-4 py-2 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer"
            title="Duyệt trả"
          >
            Duyệt trả
          </button>

          <button
            v-if="currentStatus.actions.delete"
            @click="handleDeleteBorrow(borrow._id)"
            class="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
            title="Xóa đơn mượn"
          >
            <i class="fa-solid fa-trash text-base"></i>
            <span class="font-medium">Xóa</span>
          </button>
        </div>
      </div>
    </div>

    <!-- BUTTON TRẢ SÁCH -->
  </div>
</template>
