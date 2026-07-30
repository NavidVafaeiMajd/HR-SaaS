import { IoDocumentTextOutline } from "react-icons/io5";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { IoPersonAddSharp } from "react-icons/io5";
import BasicInfo from "./BasicInfo/BasicInfo";
import Personalnfo from "./Personalnfo/Personalnfo";
import ProfileImg from "./ProfileImg/ProfileImg";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HiUserCircle } from "react-icons/hi2";
import ChangePass from "./ChangePass/ChangePass";
import api from "@/api/axios";

const EmployeDetailse = () => {
  const { id } = useParams();

const location = useLocation();

const useGetEmployee = async () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const url = location.pathname.includes("/account")
    ? `${baseUrl}/account`
    : `${baseUrl}/employees/${id}`;

  const res = await api.get(url);
  return res.data;
};

  const {
    data: queryData,
    isLoading,
    isError,
    error,
  } = useQuery<any>({
    queryKey: ["employeesDetailse", id],
    queryFn: useGetEmployee,
  });

  if (isLoading) return <div className="p-4">در حال بارگذاری...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">خطا: {(error as Error)?.message}</div>
    );

  return (
    <>
      <Tabs defaultValue="basicInfo">
        <TabsList className="flex flex-col">
          <div>
            <div className="flex justify-between p-5 items-center">
              <div className="flex gap-3">
                <div>
                  {queryData?.image ? (
                    <img
                      className="w-25 h-25 object-cover rounded-full"
                      src={`http://localhost:5000/uploads/${queryData?.image}`}
                      alt=""
                    />
                  ) : (
                    <HiUserCircle className="w-20 h-25" />
                  )}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span>
                    {queryData?.firstName} {queryData?.lastName}
                  </span>
                  <span className="text-gray-400">
                    {queryData?.position?.name}{" "}
                  </span>
                </div>
              </div>
              <div>
                <span className="bg-greenLight text-greenDark py-1 px-4 rounded-sm text-sm!">
                  {queryData?.isActive ? "فعال" : "غیر فعال"}
                </span>
              </div>
            </div>
            <div className="p-5 bg-white">
              <div>
                <span className="flex gap-3">
                  <FaRegUser className="w-7! h-7!" />
                  مدیر
                </span>
              </div>
              <div className="h-[1px] bg-gray-200 my-5"></div>
              <div className="flex justify-between">
                <span className="flex gap-3">
                  <MdOutlineMail className="w-7! h-7!" />
                  ایمیل
                </span>
                <span>{queryData?.email}</span>
              </div>
            </div>
          </div>
          <TabsTrigger value="basicInfo">
            <span className="flex gap-2 justify-center items-center">
              <IoDocumentTextOutline className="w-7! h-7!" />
              اطلاعات اولیه
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="personalInfo">
            <span className="flex gap-2 justify-center items-center">
              <IoPersonAddSharp className="w-7! h-7!" />
              اطلاعات شخصی
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="profImg">
            <span className="flex gap-2 justify-center items-center">
              <CiImageOn className="w-7! h-7!" />
              تصویر پروفایل
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="ChangePassword">
            <span className="flex gap-2 justify-center items-center">
              <IoMdInformationCircleOutline className="w-7! h-7!" />
             عوض کردن رمز
            </span>
            <span>
              <IoIosArrowBack className="w-7! h-7!" />
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basicInfo">
          <BasicInfo queryData={queryData} />
        </TabsContent>
        <TabsContent value="personalInfo">
          <Personalnfo queryData={queryData} />
        </TabsContent>
        <TabsContent value="profImg">
          <ProfileImg queryData={queryData} />
        </TabsContent>
        <TabsContent value="ChangePassword">
          <ChangePass />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EmployeDetailse;
