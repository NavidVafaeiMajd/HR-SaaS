import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import Introductions from "./introductions/introductions";
import { useParams } from "react-router-dom";
import { MdPhone } from "react-icons/md";
import Activities from "./activities/activities";
import Lead from "./lead/lead";
import Pipeline from "./pipeline/pipeline";
import Contract from "./contract/contract";
import { IoPeopleOutline } from "react-icons/io5";
import { IoFlagOutline } from "react-icons/io5";
import { IoGitBranchOutline } from "react-icons/io5";
import { IoDocumentOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useGetData } from "@/hook/useGetData";
import type { CompanyData } from "./types";

const CompanyDetails = () => {
  const { id } = useParams();

  const { data: queryData , isLoading, isError, error } = useGetData<CompanyData>(`companies/${id}`);

  if (isLoading) return <div className="p-4">در حال بارگذاری...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">خطا: {(error as Error)?.message}</div>
    );

  return (
    <>
      <Tabs defaultValue="introductions">
        <TabsList className="flex flex-col">
          <div>
            <div className="flex justify-between p-5 items-center">
              <div className="flex gap-3">
                <div className="flex flex-col justify-center items-center">
                  <span>
                    {queryData?.first_name} {queryData?.last_name}
                  </span>
                  <span className="text-gray-400">
                    {queryData?.company_name}
                  </span>
                </div>
              </div>
              <div>
                <span className="bg-greenLight text-greenDark py-1 px-4 rounded-sm text-sm!">
                  فعال
                </span>
              </div>
            </div>
            <div className="p-5 bg-white">
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <MdOutlineMail className="w-7! h-7!" />
                  ایمیل شرکت
                </span>
                <span>{queryData?.company_email || "ثبت نشده"}</span>
              </div>
              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <MdPhone className="w-7! h-7!" />
                  تلفن شرکت
                </span>
                <span>{queryData?.company_phone || "ثبت نشده"}</span>
              </div>

              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <IoCheckmarkCircleOutline className="w-7! h-7!" />
                  روش اشنایی
                </span>
                <span>{queryData?.introductions[0]?.method || "ثبت نشده"}</span>
              </div>

              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <IoCheckmarkCircleOutline className="w-7! h-7!" />
                  وضعیت اشنایی
                </span>
                <span>{queryData?.introductions[0]?.status || "ثبت نشده"}</span>
              </div>

              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <IoFlagOutline className="w-7! h-7!" />
                  اولویت 
                </span>
                <span>{queryData?.leads[0]?.priority || "ثبت نشده"}</span>
              </div>

              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <IoGitBranchOutline className="w-7! h-7!" />
                  کاریز فعلی
                </span>
                <span>{queryData?.pipelines[0]?.stage || "ثبت نشده"}</span>
              </div>
            </div>
          </div>
          <TabsTrigger value="introductions">
            <span className="flex gap-2 justify-center items-center">
              <IoPeopleOutline className="w-7! h-7!" />
              اشنایی
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
                  </TabsTrigger>
          <TabsTrigger value="activities">
            <span className="flex gap-2 justify-center items-center">
              <IoIosArrowBack className="w-7! h-7!" />
              فعالیت
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="lead">
            <span className="flex gap-2 justify-center items-center">
              <IoFlagOutline className="w-7! h-7!" />
              سرنخ
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="pipeline">
            <span className="flex gap-2 justify-center items-center">
              <IoGitBranchOutline className="w-7! h-7!" />
              کاریز
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="contract">
            <span className="flex gap-2 justify-center items-center">
              <IoDocumentOutline className="w-7! h-7!" />
              قرارداد
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="introductions">
          <Introductions queryData={queryData?.introductions || []} />
        </TabsContent>
        <TabsContent value="activities">
          <Activities/>
        </TabsContent>
        <TabsContent value="lead">
          <Lead queryData={queryData?.leads || []} />
        </TabsContent>
        <TabsContent value="pipeline">
          <Pipeline queryData={queryData?.pipelines || []} />
        </TabsContent>
        <TabsContent value="contract">
          <Contract queryData={queryData?.contracts || []} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CompanyDetails;
