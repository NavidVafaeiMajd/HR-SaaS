import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useDepartments } from "@/hook/useDepartments";
import { useUpdateRows } from "@/hook/useUpdateRows";
import type { PolicyColumnProps } from "./columns";
import { validation } from "./validation";
import { usePositionQuery } from "./hooks/usePositionQuery";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function AnnouncementFields() {
  const { watch, setValue } = useFormContext();

  const selectedDepartments = watch("departmentIds") ?? [];

  const selectedPositions = watch("positionIds") ?? [];

  const { data: departments, isPending: departmentsLoading } = useDepartments();

  const { data: positions, isPending: positionsLoading } =
    usePositionQuery(selectedDepartments);

  const { data: users, isPending: usersLoading } =
    useUsersQuery(selectedPositions);

  useEffect(() => {
    setValue("positionIds", []);

    setValue("userIds", []);
  }, [selectedDepartments, setValue]);

  useEffect(() => {
    setValue("userIds", []);
  }, [selectedPositions, setValue]);

  const departmentsOptions =
    departments?.data?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

  return (
    <>
      <div className="flex flex-col gap-5">
        <Form.Input name="title" label="موضوع ابلاغیه" required />

        <div className="grid grid-cols-2 gap-4">
          <Form.Date name="publish_date" label="تاریخ شروع" />

          <Form.Date name="end_date" label="تاریخ پایان" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Form.MultiSelect
          name="departmentIds"
          label="واحدهای سازمانی"
          options={departmentsOptions}
          disabled={departmentsLoading}
          placeholder="انتخاب واحد سازمانی"
        />

        <Form.MultiSelect
          name="positionIds"
          label="سمت‌ها / پوزیشن‌ها"
          options={positions ?? []}
          disabled={positionsLoading || selectedDepartments.length === 0}
          placeholder="ابتدا واحد سازمانی را انتخاب کنید"
        />

        <Form.MultiSelect
          name="userIds"
          label="کاربران"
          options={users ?? []}
          disabled={usersLoading || selectedPositions.length === 0}
          placeholder="ابتدا پوزیشن را انتخاب کنید"
        />
      </div>

      <Form.RichText name="content" label="متن ابلاغیه" required />
    </>
  );
}
export function AnnouncementActions({ news }: { news: PolicyColumnProps }) {
  const deleteRow = useDeleteRows({
    url: "hr-news",
    queryKey: ["hr-news"],
  });

  const { mutation } = useUpdateRows(
    `hr-news/${news?.id}`,
    ["hr-news"],
    validation,
    "ابلاغیه",
  );
  console.log("news",news)

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="ویرایش ابلاغیه"
        triggerLabel="ویرایش"
        fields={<AnnouncementFields />}
        defaultValues={{
          title: news.title,

          publish_Date: news.startDate,

          end_date: news.endDate,

          departmentIds: news.departments ?? [],

          positionIds: news.positions ?? [],

          userIds: news.users ?? [],

          content: news.content,
        }}
        onSave={(data) => {
          const payload = {
            title: data.title,

            content: data.content,

            startDate:
              data.publish_date instanceof Date
                ? data.publish_date.toISOString().slice(0, 19).replace("T", " ")
                : data.publish_date,

            endDate:
              data.end_date instanceof Date
                ? data.end_date.toISOString().slice(0, 19).replace("T", " ")
                : data.end_date,

            departmentIds: data.departmentIds.map((x: any) => Number(x.value)),

            positionIds: data.positionIds.map((x: any) => Number(x.value)),

            userIds: data.userIds.map((x: any) => x.value),
          };
          console.log(data)
          mutation.mutate(payload);
        }}
        schema={validation}
      />

      <DeleteDialog
        onConfirm={() => {
          deleteRow.mutate(news.id as any);
        }}
      />

      <ActionsCell
        actions={[
          {
            label: "نمایش جزئیات",
            path: `/news-list/${news.id}`,
          },
        ]}
      />
    </div>
  );
}
