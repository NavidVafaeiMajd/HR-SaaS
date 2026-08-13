import { useEffect } from "react";
import Table from "./Table";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { validation } from "./validation";
import { Form } from "@/components/shared/Form";
import type z from "zod";
import { usePostRows } from "@/hook/usePostRows";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { formatPrice } from "./utils";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";

const EmployeeSalary: React.FC = () => {
  const title = "حقوق و دستمزد";

  useEffect(() => {
    document.title = title;
  }, []);

  const defaultValues = {
    userId: "",

    baseSalary: 0,

    housingAllowance: 0,
    foodAllowance: 0,
    transportationAllowance: 0,
    childAllowance: 0,
    seniorityAllowance: 0,

    latePerHour: 0,
    leavePerDay: 0,
    absentPerDay: 0,
    overtimePerHour: 0,

    tax: 0,
    insurance: 0,

    effectiveFrom: null,
  };

  const { data: users, isPending: usersLoading } = useUsersQuery();

  const { mutation, form } = usePostRows(
    "employee-salary",
    ["employee-salary"],
    defaultValues,
    validation,
    "حقوق کارمند",
    true,
  );

  const usersMapped =
    users?.map((item) => ({
      value: String(item.value),
      label: item.label,
    })) || [];

  const baseSalary = form.watch("baseSalary");

  const workingDays = 30;
  const workingHoursPerDay = 7.33;
  const overtimeMultiplier = 1.4;

  const dailySalary = baseSalary / workingDays;

  const hourlySalary = dailySalary / workingHoursPerDay;

  const overtimePerHour = hourlySalary * overtimeMultiplier;
  useEffect(() => {
    if (!baseSalary) {
      form.setValue("dailySalary", 0);
      form.setValue("hourlySalary", 0);
      form.setValue("latePerHour", 0);
      form.setValue("leavePerDay", 0);
      form.setValue("absentPerDay", 0);
      form.setValue("overtimePerHour", 0);

      return;
    }

    form.setValue("dailySalary", Math.round(dailySalary));
    form.setValue("hourlySalary", Math.round(hourlySalary));

    form.setValue("latePerHour", Math.round(hourlySalary));
    form.setValue("leavePerDay", Math.round(dailySalary));
    form.setValue("absentPerDay", Math.round(dailySalary));
    form.setValue("overtimePerHour", Math.round(overtimePerHour));
  }, [baseSalary, dailySalary, hourlySalary, overtimePerHour, form]);

  const formFields = (
    <div className="relative">
      {mutation.isPending || usersLoading ? (
        <div className="flex justify-center items-center absolute p-4 top-0 left-0 right-0 bottom-0 bg-bgBack/90 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      ) : null}

      {/* کارمند و تاریخ شروع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Form.Select
          name="userId"
          label="کارمند"
          options={usersMapped}
          required
          placeholder="انتخاب کارمند"
        />

        <Form.Date onlyMonthPicker name="effectiveFrom" label="تاریخ شروع حقوق" />
      </div>

      {/* حقوق پایه */}
      <div className="mt-6 w-full  ">
        <h3 className="text-lg font-semibold mb-4">حقوق پایه</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-5 w-full!">
          <Form.PriceInput
            name="baseSalary"
            label="حقوق پایه"
            required
            placeholder="حقوق پایه"
          />
          <div className="flex  flex-col justify-between">
            <span>حقوق روزانه: {formatPrice(dailySalary)} تومان</span>
            <span>حقوق ساعتی: {formatPrice(hourlySalary)} تومان</span>
            <p className="text-amber-400">
              نکته : این حقوق ساعتی و روزانه بر اساس 30 روز در ماه و 7:30 ساعت
              کار در روز لحاظ شده، در غیر این صورت میتنوانید با هر عددی که مورد
              نظر شماست پر کنید. این نکته برای کسری مرخصی، غیبت و ... به همین
              شکل است.
            </p>
          </div>
        </div>
      </div>

      {/* مزایا */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">مزایا</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* نرخ محاسبات حضور و غیاب */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">محاسبات حضور و غیاب</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Form.PriceInput
            name="latePerHour"
            label="کسری هر ساعت تأخیر"
            placeholder="مبلغ هر ساعت"
          />

          <Form.PriceInput
            name="leavePerDay"
            label="کسری هر روز مرخصی"
            placeholder="مبلغ هر روز"
          />

          <Form.PriceInput
            name="absentPerDay"
            label="کسری هر روز غیبت"
            placeholder="مبلغ هر روز"
          />

          <Form.PriceInput
            name="overtimePerHour"
            label="اضافه‌کاری هر ساعت"
            placeholder="مبلغ هر ساعت"
          />
        </div>
      </div>

      {/* بیمه و مالیات */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">بیمه و مالیات</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
    </div>
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
        const date = new DateObject(data.effectiveFrom).convert(persian);

    const formData = {
      userId: data.userId,

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
    };

    console.log(formData);

    mutation.mutate(formData);
  };

  return (
    <>
      <SectionAcc
        form={form}
        defaultValues={defaultValues}
        schema={validation}
        formFields={formFields}
        onSubmit={onSubmit}
        table={<Table />}
        FirstTitle="ثبت حقوق کارمند"
        SecoundTitle="لیست حقوق کارکنان"
      />
    </>
  );
};

export default EmployeeSalary;
