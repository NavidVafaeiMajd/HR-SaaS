import { FaMinus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { validation } from "./validation";
import { usePostRows } from "@/hook/usePostRows";
import PostLoad from "@/components/ui/postLoad";

export type FormData = z.infer<typeof validation>;

interface Props {
  accordion: boolean;
  setAccordion: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DAYS = [
  {
    key: "saturday",
    label: "شنبه",
    value: 0,
  },
  {
    key: "sunday",
    label: "یک‌شنبه",
    value: 1,
  },
  {
    key: "monday",
    label: "دوشنبه",
    value: 2,
  },
  {
    key: "tuesday",
    label: "سه‌شنبه",
    value: 3,
  },
  {
    key: "wednesday",
    label: "چهارشنبه",
    value: 4,
  },
  {
    key: "thursday",
    label: "پنج‌شنبه",
    value: 5,
  },
  {
    key: "friday",
    label: "جمعه",
    value: 6,
  },
] as const; 

const ShiftForm = ({ accordion, setAccordion }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(validation),
defaultValues: {
    name: "",
    shiftTimes: [
    { dayOfWeek: 0, startTime: "", endTime: "" },
    { dayOfWeek: 1, startTime: "", endTime: "" },
    { dayOfWeek: 2, startTime: "", endTime: "" },
    { dayOfWeek: 3, startTime: "", endTime: "" },
    { dayOfWeek: 4, startTime: "", endTime: "" },
    { dayOfWeek: 5, startTime: "", endTime: "" },
    { dayOfWeek: 6, startTime: "", endTime: "" },
  ]
}
  });

  const { mutation } = usePostRows(
    "shifts",
    ["shifts"],
    {},
    validation,
    "شیفت",
    true
  );

  const onSubmit = (data: FormData) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <div className={`accordion ${accordion ? "mb-10 show" : "h-0 hidden"}`}>
      <div className="relative">
        {mutation.isPending && <PostLoad />}
        <div className="shadow-md bg-bgBack">
          <div className="flex justify-between items-center py-2 px-5 border-b-2 border-red-500 min-h-13">
            <h2>ثبت جدید شیفت اداره</h2>
            <button
              onClick={() => setAccordion(!accordion)}
              className="cart-header-btn flex bg-greenDark text-white items-center py-1 px-2 gap-2 rounded-sm cursor-pointer"
            >
              <FaMinus className="w-5 h-5" />
              مخفی
            </button>
          </div>
          <div className="p-5">
            <Form
              formProp={form}
              onSubmit={onSubmit}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col md:flex-row gap-5">
                <Form.Input
                  name="name"
                  label="نام شیفت"
                  required
                  placeholder="نام شیفت"
                />
              </div>

              {DAYS.map((day, index) => (
                <div
                  key={day.key}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold mb-4 text-lg">{day.label}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.TimePicker
                      name={`shiftTimes.${index}.startTime`}
                      label="ساعت شروع"
                      placeholder="انتخاب ساعت شروع"
                    />
                    <Form.TimePicker
                      name={`shiftTimes.${index}.endTime`}
                      label="ساعت پایان"
                      placeholder="انتخاب ساعت پایان"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-5">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "در حال ثبت..." : "ثبت شیفت"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  بازنشانی
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftForm;
