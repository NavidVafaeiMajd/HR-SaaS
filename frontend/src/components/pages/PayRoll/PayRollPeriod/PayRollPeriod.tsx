import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import Table from "@/components/shared/section/Table";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { validation } from "./validation";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import { usePayRollPeriod } from "./usePayRollPeriod";
import PostLoad from "@/components/ui/postLoad";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { JsonTable } from "@/components/shared/json-table";

const PayRollPeriod = () => {
   useEffect(() => {
      document.title = "لیست وضعیت حقوق و دستمزد کاربران در ماه  ";
   });

     useEffect(() => {
       const today = new DateObject({
         date: new Date(),
         calendar: persian,
       });

       const year = today.year;
       const month = today.month.number;

       form.setValue("date", new Date());

       monthlyMutation.mutate({
         year,
         month,
       });
     }, []);

     const form = useForm<z.infer<typeof validation>>({
       resolver: zodResolver(validation),
       defaultValues: {
         date: new Date(),
       },
     });

     const [monthlyRows, setMonthlyRows] = useState<MonthlyReport | null>(null);

     const monthlyMutation = usePayRollPeriod({ setMonthlyRows });

     const onSubmit = (data: z.infer<typeof validation>) => {
       const date = new DateObject(data.date).convert(persian);

       const payload = {
         year: date.year,
         month: date.month.number,
       };

       monthlyMutation.mutate(payload);
     };

     
   return (
     <div>
       <Form formProp={form} onSubmit={onSubmit}>
         <div className="grid grid-cols-2 bg-white items-end gap-5 p-5  rounded-t-md">
           {monthlyMutation.isPending && <PostLoad />}
           <Form.Date
             label="جست و جو بر اساس ماه"
             name="date"
             onlyMonthPicker
           />
           <Button
             type="submit"
             className="py-6!"
             disabled={monthlyMutation.isPending ? true : false}
           >
             {monthlyMutation.isPending
               ? "در حال جست و جو ...."
               : " جست و جو"}{" "}
           </Button>
         </div>
       </Form>
       <Table
         table={<JsonTable columns={columns} data={monthlyRows?.items ?? []} />}
         Title="لیست وضعیت حقوق و دستمزد کاربران در ماه  "
       />
     </div>
   );
};
export default PayRollPeriod;
