<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    publisher: {
        type: Object,
        required: true
    }
});

const goToEditPublisher = (publisher_id) => {
    router.push({ name: "publisher.edit", params: { id: publisher_id } });
}

</script>

<template>
  <div
    class="flex flex-col bg-base-100 shadow rounded-lg p-4 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
  >
    <div class="space-y-2">
      <div>
        <dt class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Tên nhà xuất bản</dt>
        <dd class="text-sm font-normal text-gray-800">{{ publisher.name || "Không xác định" }}</dd>
      </div>

      <div>
        <dt class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Địa chỉ</dt>
        <dd class="text-sm text-gray-700">{{ publisher.address || "Không xác định" }}</dd>
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        @click="goToEditPublisher(publisher._id)"
        class="btn btn-sm btn-warning font-medium hover:scale-105 transition-transform duration-150"
      >
        Chỉnh sửa
      </button>
    </div>
  </div>
</template>

