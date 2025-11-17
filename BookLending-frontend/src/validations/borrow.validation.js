import * as yup from "yup";

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);

export const borrowSchema = yup.object({
  returnDate: yup
    .date()
    .required("Vui lòng chọn ngày trả")
    .min(new Date(), "Ngày trả phải sau ngày mượn")
    .max(maxDate, "Chỉ được mượn sách tối đa 30 ngày")
    .typeError("Vui lòng chọn ngày trả"),
});
