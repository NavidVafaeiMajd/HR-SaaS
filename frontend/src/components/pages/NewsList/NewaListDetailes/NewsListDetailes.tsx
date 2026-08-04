import api from "@/api/axios";
import SkeletonLoading from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const NewsListDetailes = () => {
  const { id } = useParams();
  const useGetEmployee = async (): Promise<any> => {
    const res = api.get(`hr-news/${id}`);
    return (await res).data;
  };

  const {
    data: queryData,
    isLoading,
    isError,
    error,
  } = useQuery<any>({
    queryKey: ["hr-news-detailes", id],
    queryFn: useGetEmployee,
  });

  console.log(queryData);
  if (isLoading) {
    return <SkeletonLoading />;
  }

  if (isError)
    return (
      <div className="h-[200px]! flex justify-center items-center">
        خطا در دریافت دیتا: {(error as Error).message}
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 h-full!">
        <div className="bg-bgBack col-span-2">
          <div className="border-b-2 border-red-500 p-5">
            <h1>اطلاعات ابلاغیه</h1>
          </div>
          <div className="p-5">
            <div className="flex justify-between gap-2 p-5 border-b-2 border-gray-200">
              <span>عنوان :</span>
              <span>{queryData?.title}</span>
            </div>
            <div className="flex justify-between gap-2 p-5 border-b-2 border-gray-200">
              <span>واحد سازمانی :</span>
              <span>
                {queryData?.departments?.map((items) => items.label)}{" "}
              </span>
            </div>
            <div className="flex justify-between gap-2 p-5 border-b-2 border-gray-200">
              <span> سمت شغلی :</span>
              <span>{queryData?.positions?.map((items) => items.label)} </span>
            </div>
            <div className="flex justify-between gap-2 p-5 border-b-2 border-gray-200">
              <span>تاریخ شروع :</span>
              <span>
                {new Date(
                  queryData?.startDate?.replace(" ", "T"),
                ).toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="flex justify-between gap-2 p-5 border-b-2 border-gray-200">
              <span>تاریخ پایان :</span>
              <span>
                {new Date(
                  queryData?.endDate?.replace(" ", "T"),
                ).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-bgBack col-span-4">
          <div className="border-b-2 border-red-500 p-5">
            <h1>متن ابلاغیه</h1>
          </div>
          <div className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="font-bold my-3">شرح :</div>
              <div className=""
                dangerouslySetInnerHTML={{ __html: queryData?.content }}
              ></div>
            </div>

            <div className="flex justify-between">
              <div>
                <span>منتشر شده توسط : </span>
                <span>
                  {queryData?.createdBy.firstName}{" "}
                  {queryData?.createdBy.lastName}
                </span>
              </div>
              <div>
                <span>منتشر شده در تاریخ : </span>
                <span>
                  <span>
                    {new Date(
                      queryData?.createdAt?.replace(" ", "T"),
                    ).toLocaleDateString("fa-IR")}
                  </span>{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsListDetailes;
