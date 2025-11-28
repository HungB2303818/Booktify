import * as yup from "yup";

const birthdayValidate = new Date();
birthdayValidate.setFullYear(birthdayValidate.getFullYear() - 7);

export const staffSchema = yup.object({
  name: yup.string().required("Vui lòng nhập họ và tên"),
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(3, "Vui lòng nhập ít nhất 3 ký tự")
    .max(30, "Mật khẩu tối đa 30 ký tự"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .min(10, "Số điện thoại phải có 10 chữ số")
    .max(10, "Số điện thoại phải có 10 chữ số"),
});
