import { formatMinutes } from "../../AttendanceList/columns";
import { getAttendanceStatusInfo } from "../column";

const TodayTable = ({ attendanceData }) => {
    const status = getAttendanceStatusInfo(attendanceData?.today?.status);
  return (
    <>
      <table className="w-full text-center ">
        <tbody>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">تاریخ</td>
            <td className="p-3!">
              {attendanceData?.today?.date
                ? new Date(attendanceData?.today?.date).toLocaleDateString(
                    "fa-IR",
                  )
                : "—"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">وضعیت</td>
            <td className="p-3!">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">زمان ورود </td>
            <td className="p-3!">{attendanceData?.today?.checkIn || "-"}</td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">زمان خروج </td>
            <td className="p-3!">{attendanceData?.today?.checkOut || "-"}</td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">تاخیر </td>
            <td className="p-3!">
              {formatMinutes(attendanceData?.today?.lateMinutes) || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">اضافه کاری </td>
            <td className="p-3!">
              {formatMinutes(attendanceData?.today?.overtimeMinutes) || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-3! bg-gray-100">حضور زود هنگام </td>
            <td className="p-3!">
              {formatMinutes(attendanceData?.today?.overtimeMinutes) || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
 
export default TodayTable;