import { useEffect } from "react";
import Table from "./Table";
import SectionAccImg from "@/components/shared/section/SectionAccImg";
import { Form } from "@/components/shared/Form";
import z from "zod";
import { validation } from "./validation";
import { usePostRows } from "@/hook/usePostRows";

import SectionAcc from "@/components/shared/section/SectionAcc";
import { getPermissionLabel, permission } from "../utils/utils";


const RolesList: React.FC = () => {
  const title = "نقش کاربری ها";
  useEffect(() => {
    document.title = title;
  }, []);

const defaultValues = {
  name: "",
  description: "",

  ...permission.reduce(
    (acc, curr) => {
      curr.itemPermission.forEach((item) => {
        acc[item] = false;
      });

      return acc;
    },
    {} as Record<string, boolean>,
  ),
};
  
  const { mutation, form } = usePostRows(
    "roles",
    ["roles"],
    defaultValues,
    validation,
    "نقش کاربری ها",
    true,
  );

  const formFields = (
    <div className="relative grid lg:grid-cols-3 gap-5 md:grid-cols-2! grid-cols-1!">
      {mutation.isPending && (
        <div className="flex justify-center items-center absolute p-4 top-0 left-0 right-0 bottom-0 bg-bgBack/90 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="mr-2">در حال ارسال اطلاعات...</span>
        </div>
      )}
      <Form.Input name="name" label="نام نقش کاربری" required />
      <Form.Input name="description" label="توضیحات" required />

      {permission.map((permission) => (
        <div className="flex flex-col gap-3">
          <h2>{permission.name} :</h2>
          <div className="flex flex-col md:flex-row gap-5">
            {permission.itemPermission.map((item) => (
              <Form.Checkbox name={item} label={getPermissionLabel(item)} required />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const onSubmit = (data) => {
    const permissions =Object.entries(data)
  .filter(([_, value]) => value === true)
  .map(([key]) => key);
    const body = {
  name: data.name,
  permissions,
};
    console.log(body);
    mutation.mutate(body);
  };

  return (
    <>
      <SectionAcc
        form={form}
        formFields={formFields}
        onSubmit={onSubmit}
        table={<Table />}
        defaultValues={{}}
        schema={validation}
        FirstTitle="ثبت جدید نقش کاربری جدید  "
        SecoundTitle="لیست همه نقش های کاربری"
      />
    </>
  );
};

export default RolesList;
