"use client";

import * as React from "react";
import {
  Command,
  LifeBuoy,
  Send,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CiHome } from "react-icons/ci";
import { FiUsers, FiUserCheck } from "react-icons/fi";
import { TfiTarget } from "react-icons/tfi";
import { GoClock } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRadar } from "react-icons/md";
import { BsExclamationCircle } from "react-icons/bs";
import { useAuthContext } from "@/Context/AuthContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";


const  Navbar =({ ...props }: React.ComponentProps<typeof Sidebar>) =>{
  const { user } = useAuthContext();
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "پیشخوان",
      url: "/",
      icon: CiHome,
      isActive: true,
    },
    {
      title: "پیشخوان مدیران",
      url: "manager-desk",
      icon: CiHome,
      isActive: true,
    },

    {
      title: "پرسنل",
      url: "/staff",
      icon: FiUsers,
      authorize: ["manager", "both"],
      items: [
        {
          title: "لیست پرسنل",
          url: "/staff",
        },
        {
          title: "شیفت و برنامه ریزی",
          url: "/staff/office-shifts",
        },
        {
          title: "انفصال از خدمت",
          url: "/staff/employ-exit",
        },
      ],
    },
    {
      title: "مدیریت نقش های کاربری",
      url: "/roles",
      icon: TfiTarget,
      authorize: ["manager", "both"],
      items: [],
    },

    {
      title: "مدیریت منابع انسانی",
      url: "/hr/departments-list",
      authorize: ["manager", "both"],
      icon: TfiTarget,
      items: [
        {
          title: "واحد سازمانی",
          url: "/hr/departments-list",
        },
        {
          title: "سمت سازمانی",
          url: "/hr/designation-list",
        },
      ],
    },
    {
      title: "ابلاغیه",
      url: "/news-list",
      icon: GoClock,
      items: [],
    },

    {
      title: ` جزییات حضور و غیاب `,
      url: `/user-attendance/${user?.id}`,
      icon: GoClock,
      items: [],
    },
    {
      title: "حضور و غیاب",
      url: "/rollcall/attendance-list",
      icon: GoClock,
      items: [
        {
          title: "حضور و غیاب",
          url: "/rollcall/attendance-list",
        },
        {
          title: "گزارش کارکرد کاربران",
          url: "/rollcall/monthly-attendance",
        },
      ],
    },
    {
      title: ` جزییات حقوق و دستمزد `,
      url: `/user-pay-roll/${user?.id}`,
      icon: GoClock,
      items: [],
    },
    {
      title: " حقوق دستمزد ",
      url: "/pay-roll/pay-roll-period",
      icon: GoClock,
      items: [
        {
          title: " لیست وضعبت حقوق در ماه ",
          url: "/pay-roll/pay-roll-period",
        },
        {
          title: " لیست پرداختی ها در ماه ",
          url: "/pay-roll/pay-roll-payment",
        },
        {
          title: " ثبت حقوق کارکنان  ",
          url: "/pay-roll/employee-salary",
        },
      ],
    },
    {
      title: ` درحواست افزایش حقوق`,
      url: `salary-increase-request`,
      icon: GoClock,
      items: [],
    },
    // {
    //   title: "ارزیابی عملکرد کارکنان",
    //   url: "/performance",
    //   icon: RiCameraLensLine,
    //   items: [
    //     {
    //       title: "رتبه بندی شاخص ها",
    //       url: "/performance/indicator-rating",
    //     },
    //     {
    //       title: "ارزیابی کارکنان",
    //       url: "/performance/employee-rating",
    //     },
    //     {
    //       title: "پیگیری اهداف (OKR)",
    //       url: "/performance/track-goals",
    //     },
    //     {
    //       title: "تنظیم اندیکاتور",
    //       url: "/performance/setup-indicator",
    //     },
    //   ],
    // },
    {
      title: "درخواست مرخصی",
      url: "/user-leave",
      icon: CiSquarePlus,
      authorize: ["employee"],

      items: [],
    },
    {
      title: "مرخصی",
      url: "/leave/list",
      icon: CiSquarePlus,
      items: [
        {
          title: " لیست مرخصی ",
          url: "/leave/list",
        },
        {
          title: " نوع مرخصی  ",
          url: "/leave/type",
        },
      ],
    },
  ],

  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
};

const useGetUser = async () => {
  const res = await api.get(`/company`);
  return res.data;
};

const {
  data: queryData,
} = useQuery<any>({
  queryKey: ["company"],
  queryFn: useGetUser,
});

const apiUrl = import.meta.env.VITE_BASE_URL;

const logoUrl = queryData?.logo && `${apiUrl}/uploads/${queryData.logo}`;


  return (
    <Sidebar
      variant="inset"
      {...props}
      dir="rtl"
      side="right"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={"company"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <div>
                    {queryData?.logo ? (
                      <img className="" src={logoUrl} alt="" />
                    ) : (
                      <Command className="size-4" />
                    )}
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {queryData?.name ? queryData?.name : `نام شرکت`}
                  </span>
                  <span className="truncate text-xs">
                    {queryData?.companyType ? queryData?.companyType : `business`}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default Navbar;