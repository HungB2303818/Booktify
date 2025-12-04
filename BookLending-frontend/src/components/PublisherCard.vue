<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  publisher: {
    type: Object,
    required: true,
  },
});

const goToEditPublisher = (publisher_id) => {
  router.push({ name: "publisher.edit", params: { id: publisher_id } });
};

</script>

<template>
  <div
    class="flex flex-col bg-base-100 shadow rounded-lg p-4 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
  >
    <div class="space-y-2">
      <div>
        <dt
          class="text-xs font-semibold text-gray-500 uppercase tracking-widest"
        >
          Tên nhà xuất bản
        </dt>
        <dd class="text-sm font-normal text-gray-800">
          {{ publisher.name || "Không xác định" }}
        </dd>
      </div>

      <div>
        <dt
          class="text-xs font-semibold text-gray-500 uppercase tracking-widest"
        >
          Địa chỉ
        </dt>
        <dd class="text-sm text-gray-700">
          {{ publisher.address || "Không xác định" }}
        </dd>
      </div>
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <button
        @click="goToEditPublisher(publisher._id)"
        class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
      >
        <i class="fa-solid fa-pen text-sm"></i>
      </button>
      <button
        @click.stop="$emit('delete', publisher._id)"
        class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-red-600 cursor-pointer"
      >
      <i class="fa-solid fa-trash text-lg"></i> 
    </button>
    </div>
  </div>
</template>
