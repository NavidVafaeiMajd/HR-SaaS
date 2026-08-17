import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import type { EmployeeSalaryColumnProps } from "./columns";
import { validation } from "./validation";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";

export function EmployeeSalaryFields() {
  const { watch, setValue } = useFormContext();

  const baseSalary = watch("baseSalary") ?? 0;

  /*
   * فعلاً این مقادیر را ثابت در نظر گرفتیم.
   * بعداً می‌توانیم از PayrollSettings بگیریم.
   */
  const workingDaysPerMonth = 30;
  const workingHoursPerDay = 7.33;
  const overtimeMultiplier = 1.4;

  useEffect(() => {
    const salary = Number(baseSalary) || 0;

    if (!salary) {
      setValue("dailySalary", 0);
      setValue("hourlySalary", 0);

      setValue("latePerHour", 0);
      setValue("leavePerDay", 0);
      setValue("absentPerDay", 0);
      setValue("overtimePerHour", 0);

      return;
    }

    const dailySalary = salary / workingDaysPerMonth;

    const hourlySalary = dailySalary / workingHoursPerDay;

    const overtimePerHour = hourlySalary * overtimeMultiplier;

    setValue("dailySalary", Math.round(dailySalary));

    setValue("hourlySalary", Math.round(hourlySalary));

    setValue("latePerHour", Math.round(hourlySalary));

    setValue("leavePerDay", Math.round(dailySalary));

    setValue("absentPerDay", Math.round(dailySalary));

    setValue("overtimePerHour", Math.round(overtimePerHour));
  }, [baseSalary, setValue]);

  const { data: users, isPending: usersLoading } = useUsersQuery();

  const usersMapped =
    users?.map((item) => ({
      value: String(item.value),
      label: item.label,
    })) || [];

  return (
    <>
      {/* کارمند و تاریخ شروع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Form.Select
          name="userId"
          label="کارمند"
          options={usersMapped}
          required
          placeholder="انتخاب کارمند"
          disabled={usersLoading}
        />

        <Form.Date
          onlyMonthPicker
          name="effectiveFrom"
          label="تاریخ شروع حقوق"
        />
      </div>
      {/* حقوق پایه */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">حقوق پایه</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <Form.PriceInput
            name="baseSalary"
            label="حقوق پایه"
            required
            placeholder="حقوق پایه"
          />
        </div>
      </div>
      {/* مزایا */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">مزایا</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <Form.PriceInput
            name="housingAllowance"
            label="حق مسکن"
            placeholder="مبلغ حق مسکن"
          />

          <Form.PriceInput
            name="foodAllowance"
            label="حق غذا"
            placeholder="مبلغ حق غذا"
          />

          <Form.PriceInput
            name="transportationAllowance"
            label="حق ایاب و ذهاب"
            placeholder="مبلغ ایاب و ذهاب"
          />

          <Form.PriceInput
            name="childAllowance"
            label="حق اولاد"
            placeholder="مبلغ حق اولاد"
          />

          <Form.PriceInput
            name="seniorityAllowance"
            label="سنوات"
            placeholder="مبلغ سنوات"
          />
        </div>
      </div>
      {/* محاسبات حضور و غیاب */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">محاسبات حضور و غیاب</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <Form.PriceInput
            name="latePerHour"
            label="کسری هر ساعت تأخیر"
            disabled
          />

          <Form.PriceInput
            name="leavePerDay"
            label="کسری هر روز مرخصی"
            disabled
          />

          <Form.PriceInput
            name="absentPerDay"
            label="کسری هر روز غیبت"
            disabled
          />

          <Form.PriceInput
            name="overtimePerHour"
            label="اضافه‌کاری هر ساعت"
            disabled
          />
        </div>
      </div>
      {/* بیمه و مالیات */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">بیمه و مالیات</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.PriceInput
            name="tax"
            label="مالیات"
            placeholder="مبلغ مالیات"
          />

          <Form.PriceInput
            name="insurance"
            label="بیمه"
            placeholder="مبلغ بیمه"
          />
        </div>
      </div>
      // داخل EmployeeSalaryFields بعد از بخش بیمه و مالیات
      {/* اطلاعات بانکی */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">اطلاعات بانکی</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <Form.Input name="bankName" label="نام بانک" placeholder="نام بانک" />

          <Form.Input
            name="accountHolderName"
            label="نام صاحب حساب"
            placeholder="نام صاحب حساب"
          />

          <Form.Input
            name="accountNumber"
            label="شماره حساب"
            placeholder="شماره حساب"
          />

          <Form.Input
            name="cardNumber"
            label="شماره کارت"
            placeholder="شماره کارت"
          />

          <Form.Input
            name="shebaNumber"
            label="شماره شبا"
            placeholder="شماره شبا"
          />
        </div>
      </div>
    </>
  );
}

export function EmployeeSalaryAction({
  salary,
}: {
  salary: EmployeeSalaryColumnProps;
}) {
  const deleteRow = useDeleteRows({
    url: "employee-salary",
    queryKey: ["employee-salary"],
  });

  const { mutation } = useUpdateRows(
    `employee-salary/${salary?.userId}/increase`,
    ["employee-salary"],
    validation,
    "حقوق کارمند",
  );

  
  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="تغییر حقوق"
        triggerLabel="افزایش/کاهش حقوق"
        fields={<EmployeeSalaryFields />}
        defaultValues={{
          userId: salary?.userId,

          baseSalary: salary?.baseSalary,

          dailySalary: salary?.baseSalary / 30,

          hourlySalary: salary?.baseSalary / 30 / 7.33,

          housingAllowance: salary?.housingAllowance,

          foodAllowance: salary?.foodAllowance,

          transportationAllowance: salary?.transportationAllowance,

          childAllowance: salary?.childAllowance,

          seniorityAllowance: salary?.seniorityAllowance,

          latePerHour: salary?.latePerHour,

          leavePerDay: salary?.leavePerDay,

          absentPerDay: salary?.absentPerDay,

          overtimePerHour: salary?.overtimePerHour,

          tax: salary?.tax,

          insurance: salary?.insurance,
          bankName: salary?.bankName,

          accountHolderName: salary?.accountHolderName,

          accountNumber: salary?.accountNumber,

          cardNumber: salary?.cardNumber,

          shebaNumber: salary?.shebaNumber,
        }}
        onSave={(data) => {
          const date = new DateObject(data.effectiveFrom).convert(persian);

          const payload = {
            baseSalary: data.baseSalary,

            housingAllowance: data.housingAllowance,

            foodAllowance: data.foodAllowance,

            transportationAllowance: data.transportationAllowance,

            childAllowance: data.childAllowance,

            seniorityAllowance: data.seniorityAllowance,

            latePerHour: data.latePerHour,

            leavePerDay: data.leavePerDay,

            absentPerDay: data.absentPerDay,

            overtimePerHour: data.overtimePerHour,

            tax: data.tax,

            insurance: data.insurance,

            EffectiveYear: date.year,
            EffectiveMonth: date.month.number,

            changeReason: "Salary Change",
            bankName: data.bankName,

            accountHolderName: data.accountHolderName,

            accountNumber: data.accountNumber,

            cardNumber: data.cardNumber,

            shebaNumber: data.shebaNumber,
          };

          console.log("salary change:", payload);

          mutation.mutate(payload);
        }}
        schema={validation}
      />

      <DeleteDialog
        onConfirm={() => {
          deleteRow.mutate(salary.id as any);
        }}
      />

      <ActionsCell
        actions={[
          {
            label: "نمایش جزئیات",
            path: `/user-pay-roll/${salary?.userId}`,
          },
        ]}
      />
    </div>
  );
}
