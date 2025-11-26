import { useRouter } from "vue-router";
import { push } from "notivue";

export function useAuth(role, username, user_id) {
  const router = useRouter();

  const logOut = () => {
    if (confirm("Xác nhận đăng xuất?")) {
      localStorage.clear();
      role.value = null;
      username.value = null;
      user_id.value = null;

      push.info("Đăng xuất thành công");
      router.push("/");
    }
  };

  return { logOut };
}
