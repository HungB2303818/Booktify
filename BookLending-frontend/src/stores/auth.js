import { ref } from "vue";

export const authRole = ref(localStorage.getItem("role"));
export const authUsername = ref(localStorage.getItem("username"));
export const authUserId = ref(localStorage.getItem("id"));
