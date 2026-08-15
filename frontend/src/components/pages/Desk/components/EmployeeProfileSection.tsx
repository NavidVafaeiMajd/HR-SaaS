import type { EmployeeProfileDashboard } from "../types/EmployeeProfileDashboard";

const profileRows: Array<{
  label: string;
  key: keyof EmployeeProfileDashboard;
}> = [
  { label: "نام", key: "firstName" },
  { label: "نام خانوادگی", key: "lastName" },
  { label: "کد پرسنلی", key: "personnelCode" },
  { label: "دپارتمان", key: "departmentName" },
  { label: "سمت", key: "positionName" },
  { label: "شیفت", key: "shiftName" },
];

const EmployeeProfileSection = ({
  profile,
}: {
  profile: EmployeeProfileDashboard;
}) => (
  <section>

    <div className=" overflow-hidden rounded-xl border bg-white">
      <div className="flex items-center gap-4 border-b p-5">

        <div>
          <h4 className="text-lg font-bold">
            {profile.firstName} {profile.lastName}
          </h4>

          <p className="mt-1 text-sm text-muted-foreground">
            {profile.positionName || "سمت ثبت نشده"}
          </p>
        </div>
      </div>

      <table className="w-full text-right text-sm">
        <tbody>
          {profileRows.map(({ label, key }) => (
            <tr key={key} className="border-b last:border-b-0">
              <td className="w-1/2 bg-muted/50 p-3 font-medium">{label}</td>

              <td className="p-3">{profile[key] || "ثبت نشده"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default EmployeeProfileSection;
