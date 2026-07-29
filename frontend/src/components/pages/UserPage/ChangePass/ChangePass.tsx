import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import { z } from "zod";
import { validation } from "./validation";
import { useChangePassword } from "@/hook/useChangePassword";
import { useParams } from "react-router-dom";

const ChangePass = () => {
  const { id } = useParams();

  const mutation = useChangePassword(id!);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof validation>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div>
      <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
        <IoDocumentTextOutline className="w-7 h-7" />
        <span>تغییر رمز عبور</span>
      </div>

      <div className="p-3">
        <Form
          formProp={form}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
        >

          <div className="flex gap-5">
            <Form.Password
              label="رمز جدید"
              name="newPassword"
              placeholder="رمز جدید را وارد کنید"
              required
            />

            <Form.Password
              label="تکرار رمز جدید"
              name="confirmPassword"
              placeholder="رمز جدید را دوباره وارد کنید"
              required
            />
          </div>

          <Button type="submit" className="mt-4" disabled={mutation.isPending}>
            {mutation.isPending ? "در حال تغییر..." : "تغییر رمز عبور"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePass;
