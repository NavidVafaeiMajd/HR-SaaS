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
     name: "منابع انسانی",
     itemPermission: ["Hr_view", "Hr_post", "Hr_edit", "Hr_delete"],
   },
   {
     name: "مدیریت نقش های کاربری",
     itemPermission: ["Role_view", "Role_post", "Role_edit", "Role_delete"],
   },
 ];
    
