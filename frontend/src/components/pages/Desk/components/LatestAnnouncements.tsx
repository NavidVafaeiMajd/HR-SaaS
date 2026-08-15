import type { ColumnDef } from "@tanstack/react-table";

import type { AnnouncementDashboardItem } from "../types/AnnouncementDashboardItem";
import { JsonTable } from "@/components/shared/json-table";
import Table from "@/components/shared/section/Table";

type LatestAnnouncementsProps = {
  announcements: AnnouncementDashboardItem[];
};

const announcementColumns: ColumnDef<AnnouncementDashboardItem>[] = [
  {
    accessorKey: "title",
    header: "عنوان ابلاغیه",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ انتشار",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return (
        <span className="text-muted-foreground">
          {date.toLocaleDateString("fa-IR")}
        </span>
      );
    },
  },
];

const LatestAnnouncements = ({ announcements }: LatestAnnouncementsProps) => {
    return (
    <div>
    <Table
      Title="آخرین ابلاغیه‌ها"
      table={<JsonTable columns={announcementColumns} data={announcements} />}
            />
    </div>
  );
};

export default LatestAnnouncements;
