// LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Form } from "@/components/shared/Form";
import NProgress from "@/lib/nprogress";
import api from "@/api/axios";

// -----------------
// Zod Validation
// -----------------
const validation = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormData = z.infer<typeof validation>;

// -----------------
// Default Values
// -----------------
const defaultValues: LoginFormData = {
  username: "",
  password: "",
};

// -----------------
// Component
// -----------------
const LoginPage: React.FC = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(validation),
    defaultValues,
  });

  // -----------------
  // React Query Mutation
  // -----------------
  const mutation = useMutation({
    mutationFn: async (values: LoginFormData) => {
      NProgress.start();
      const { data } = await api.post("/auth/login", values);

      return data;
    },
    onSuccess: (data) => {
      login(data);
      navigate("/");
      NProgress.done();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ورود");
      NProgress.done();
    },
  });

  // Access loading state via mutation.status
  const isLoading = mutation.status === "pending";

  const onSubmit = (values: LoginFormData) => {
    console.log(values);
    mutation.mutate(values);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">ورود به حساب</h2>
        <Form formProp={form} onSubmit={onSubmit}>
          <Form.Input label="نام کاربری" name="username" />
          <Form.Password label="رمز عبور" name="password" />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "در حال ورود..." : "ورود"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
