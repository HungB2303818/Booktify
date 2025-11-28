<template>
  <main class="w-full bg-white text-gray-800">
    <!-- Header -->
    <section class="py-12 bg-gradient-to-r from-white to-slate-50">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-4xl font-bold text-gray-900">Liên hệ Booktify</h1>
        <p class="mt-3 text-gray-600 text-lg leading-relaxed">
          Bạn có câu hỏi, góp ý hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng lắng
          nghe.
        </p>
      </div>
    </section>

    <!-- Contact grid -->
    <section class="py-12">
      <div class="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">
            Thông tin liên hệ
          </h2>
          <p class="mt-3 text-gray-600 leading-relaxed">
            Đừng ngần ngại liên hệ với chúng tôi qua các kênh dưới đây. Đội ngũ
            Booktify sẽ phản hồi sớm nhất.
          </p>

          <ul class="mt-6 space-y-4 text-gray-700">
            <li class="flex items-start gap-3">
              <span class="text-blue-700 text-xl">📍</span>
              <p>
                Địa chỉ: Khu II, đường 3/2, phường Xuân Khánh, quận Ninh Kiều,
                thành phố Cần Thơ.
              </p>
            </li>

            <li class="flex items-start gap-3">
              <span class="text-blue-700 text-xl">📞</span>
              <p>Số điện thoại: 0901 234 567</p>
            </li>

            <li class="flex items-start gap-3">
              <span class="text-blue-700 text-xl">✉️</span>
              <p>Email: support@booktify.vn</p>
            </li>

            <li class="flex items-start gap-3">
              <span class="text-blue-700 text-xl">🕒</span>
              <p>Thời gian làm việc: 8:00 – 20:00 (T2 – CN)</p>
            </li>
          </ul>

          <p class="mt-8 text-gray-600 text-sm">
            Hoặc bạn có thể gửi tin nhắn trực tiếp bằng biểu mẫu bên cạnh.
          </p>
        </div>

        <!-- Contact Form -->
        <div>
          <form
            class="space-y-5 p-6 bg-white rounded-lg border border-gray-100 shadow-sm"
          >
            <div>
              <label class="block text-gray-700 font-medium">Họ và tên</label>
              <input
                type="text"
                class="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                class="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium"
                >Tin nhắn của bạn</label
              >
              <textarea
                class="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập nội dung..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-700 text-white py-2 rounded-lg font-medium transition hover:bg-blue-600 hover:brightness-110"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-10 bg-slate-50">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h3 class="text-xl font-semibold text-gray-900">
          Bạn có thể tìm thấy chúng tôi tại đây
        </h3>
        <p class="mt-2 text-gray-600">
          Chúng tôi luôn sẵn sàng giúp bạn tìm được cuốn sách phù hợp.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
// Bạn có thể thêm xử lý submit form tại đây
</script>

<style scoped></style>
