// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Form } from "@/components/shared/Form";
import NProgress from "@/lib/nprogress";
import api from "@/api/axios";
import { toast, ToastContainer } from "react-toastify";

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
  const [errorMessage, setErrorMessage] = useState("");
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
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
      setErrorMessage( error.response?.data?.title ||error.response?.data);

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
    <div className="flex flex-col gap-5 justify-center items-center h-screen w-full!">
      <div className="fixed z-0 ">
        <h2 className="font-black text-primary! text-[100px]  md:text-[150px]  lg:text-[250px] tracking-widest! align-middle! text-center">
          HR SaaS
        </h2>
      </div>
      {errorMessage && <div className="bg-red-400/50 backdrop-blur-md p-3 rounded-md text-red-700 border border-red-700">{errorMessage}</div>}

      <div className="w-full max-w-md p-6 border border-primary/50 rounded-2xl shadow z-1 backdrop-blur-sm bg-white/20">
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
