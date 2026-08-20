import { Bell, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useNotification } from "@/hook/useNotification";
import { NavLink } from "react-router-dom";
import { useReadNotification } from "@/hook/useReadNotification";


export const Notification = () => {
    const { data: results } = useNotification();
    const { readAllMutation,readMutation}=useReadNotification()
  console.log(results);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          {results?.unreadCount > 0 && (
            <span className="absolute w-3 h-3 bg-green-500 rounded-full top-0 right-0"></span>
          )}
          <Bell />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px] max-w-[calc(100vw-50px)] p-0!"
          align="start"
        >
          {results?.count == 0 ? (
            <span className="flex justify-center p-3" dir="rtl">
              اعلانی برای شما وجود ندارد!!!
            </span>
          ) : (
            <DropdownMenuGroup className="">
              {results?.items?.slice(0, 3).map((notification) => (
                <DropdownMenuItem
                  className="cursor-pointer rounded-none hover:bg-black/5"
                  dir="rtl"
                >
                  <NavLink
                    to={notification?.url || ""}
                    className={"w-full!"}
                    onClick={() => readMutation.mutate(notification.id)}
                  >
                    <Alert
                      className="border-none flex justify-between items-center"
                      variant={notification.isRead == true ? "read" : "unread"}
                    >
                      <div>
                        <AlertTitle>{notification.title}</AlertTitle>
                        <AlertDescription>
                          {notification.message}
                        </AlertDescription>
                      </div>

                      <div className="flex justify-center items-center gap-1">
                        <span>مشاهده</span>
                        <ChevronLeft width={3} />
                      </div>
                    </Alert>
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}

          {results?.count >= 3 && (
            <DropdownMenuGroup className="h-10 flex justify-center items-center border-t-1">
              <NavLink
                to={"/notifications"}
                className="flex"
                onClick={() => readAllMutation.mutate()}
              >
                <ChevronLeft width={20} />
                <span> اعلانات بیشتر</span>
              </NavLink>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
