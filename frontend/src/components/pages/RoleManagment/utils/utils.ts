export const getPermissionLabel = (permission: string) => {
  const action = permission.split("_")[1];

  const labels: Record<string, string> = {
    view: "خواندن",
    post: "نوشتن",
    edit: "ویرایش",
    delete: "حذف",
  };

  return labels[action] || action;
};

 export const permission = [
   {
     name: "پرسنل",
     itemPermission: ["Users_view", "Users_post", "Users_edit", "Users_delete"],
   },
      {
     name: "پیشخوان مدیریتی",
     itemPermission: ["Manager_Dashboard"],
   },
   {
     name: "دپارتمان",
     itemPermission: ["Department_view", "Department_post", "Department_edit", "Department_delete"],
   },
   {
     name: "سمت شغلی",
     itemPermission: ["Position_view", "Position_post", "Position_edit", "Position_delete"],
   },
   {
     name: "شیفت کاری",
     itemPermission: ["Shift_view", "Shift_post", "Shift_edit", "Shift_delete"],
   },
      {
     name: "ابلاغیه ها ",
     itemPermission: ["Announcement_view","Announcement_post", "Announcement_edit", "Announcement_delete"],
   },
   {
     name: "مدیریت نقش های کاربری",
     itemPermission: ["Role_view", "Role_post", "Role_edit", "Role_delete"],
   },
      {
     name: "حضور غیاب",
     itemPermission: ["Attendance_view", "Attendance_post", "Attendance_edit", "Attendance_delete"],
   },
      {
     name: "نمایش حضور غیاب کاربران",
     itemPermission: ["UserAttendance_view", "UserAttendance_post", "UserAttendance_edit", "UserAttendance_delete"],
   },
 ];