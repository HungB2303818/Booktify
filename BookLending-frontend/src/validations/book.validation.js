import * as yup from "yup";

export const bookSchema = yup.object({
  title: yup.string().required("Vui lòng nhập tên sách"),
  year: yup.string().required("Vui lòng nhập năm xuất bản"),
  quantity: yup
    .number()
    .required("Vui lòng nhập số lượng sách")
    .min(1, "Số lượng sách phải lớn hơn 0"),
  author: yup.string().required("Vui lòng nhập tên tác giả"),
  publisher: yup.string().required("Vui lòng nhập nhà xuất bản"),
});
