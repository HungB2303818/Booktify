<template>
  <div class="flex min-h-screen bg-gray-100">
    
    <!-- MAIN CONTENT -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold">Staff Dashboard</h2>
          <p class="text-gray-600">Welcome back. Here’s your overview.</p>
        </div>

        <div class="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search members, books..."
            class="px-4 py-2 border rounded-lg w-64"
          />

          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <i class="fa-solid fa-plus"></i>
            Create Borrow Record
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500">Total Books</p>
          <h3 class="text-3xl font-bold"> {{ booklength }}</h3>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500">Total Members</p>
          <h3 class="text-3xl font-bold">{{ userlength }}</h3>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500">Borrowed</p>
          <h3 class="text-3xl font-bold">{{ borrowlength }}</h3>
        </div>

        <div class="bg-white rounded-xl shadow p-6 border border-yellow-300 bg-yellow-50">
          <p class="text-gray-500">Overdue</p>
          <h3 class="text-3xl font-bold text-yellow-600">12</h3>
        </div>
      </div>

      <!-- Lower Panels -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Chart -->
        <div class="bg-white rounded-xl shadow p-6 col-span-2">
          <h3 class="font-bold mb-2">Borrowing Activity</h3>
          <p class="text-sm text-gray-500 mb-6">Last 30 Days</p>

          <!-- Fake Chart -->
          <div class="flex items-end gap-6 h-48">
            <div class="w-10 bg-blue-200 h-16 rounded"></div>
            <div class="w-10 bg-blue-300 h-32 rounded"></div>
            <div class="w-10 bg-blue-200 h-10 rounded"></div>
            <div class="w-10 bg-blue-600 h-40 rounded"></div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="font-bold mb-4">Recent Activity</h3>

          <ul class="flex flex-col gap-4">
            <li class="flex gap-3 items-start">
              <span class="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <i class="fa-solid fa-user-plus"></i>
              </span>
              <div>
                <p>New member registered.</p>
                <span class="text-xs text-gray-500">2 minutes ago</span>
              </div>
            </li>

            <li class="flex gap-3 items-start">
              <span class="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                <i class="fa-solid fa-arrow-up"></i>
              </span>
              <div>
                <p>A book was borrowed.</p>
                <span class="text-xs text-gray-500">15 minutes ago</span>
              </div>
            </li>

            <li class="flex gap-3 items-start">
              <span class="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
                <i class="fa-solid fa-plus"></i>
              </span>
              <div>
                <p>New book added to system.</p>
                <span class="text-xs text-gray-500">1 hour ago</span>
              </div>
            </li>

            <li class="flex gap-3 items-start">
              <span class="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                <i class="fa-solid fa-arrow-down"></i>
              </span>
              <div>
                <p>A book was returned.</p>
                <span class="text-xs text-gray-500">3 hours ago</span>
              </div>
            </li>

          </ul>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BookService from "@/services/book.service";
import UserService from "@/services/user.service";
import BorrowService from "@/services/borrow.service";

const bookService = new BookService();
const userService = new UserService();
const borrowService = new BorrowService();

const userlength = ref();
const booklength = ref();
const borrowlength = ref();
const overdue = ref();

onMounted(async () => {
  try{
    const user_data = await userService.getAllUsers();
    userlength.value = user_data.length;
    const book_data = await bookService.getAllBooks();
    booklength.value = book_data.length;
    const borrow_data = await borrowService.getAllBorrows();
    borrowlength.value = borrow_data.length;
    
  }catch(e){
    console.log(e);
  }
})
</script>
