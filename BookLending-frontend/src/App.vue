<script setup>
import {
  Notivue,
  Notification,
  NotificationProgress,
  NotivueSwipe,
} from "notivue";
import { RouterView } from "vue-router";
import Header from "./components/layouts/Header.vue";
import Footer from "./components/layouts/Footer.vue"
</script>

<template>
  <Header />
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item">
        <NotificationProgress :item="item" />
      </Notification>
    </NotivueSwipe>
  </Notivue>

  <RouterView />
  <Footer />
</template>
