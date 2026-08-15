import { FaUserTie, FaUsers } from "react-icons/fa6";
import { SummaryCard } from "../components/SummaryCart";

const FeedCart = ({today}) => {
    return (
      <>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <SummaryCard label="وضعیت حضور امروز" value={today?.status} />
          <SummaryCard
            label="ساعت ورود  "
            value={today?.checkIn ? today.checkIn : "-"}
          />
          <SummaryCard
            label="ساعت خروج  "
            value={today?.checkOut ? today.checkOut : "-"}
          />
          <SummaryCard
            label="تعداد روز های باقی مانده از مزخصی ها شما در سال"
            value={today?.remainingLeaveDays ? today.remainingLeaveDays : "-"}
          />
          <SummaryCard
            label="تعداد درخواست های دحال بررسی مرخصی"
            value={today?.pendingLeaveRequests ? today.pendingLeaveRequests : "-"}
          />
          <SummaryCard
            label="حقوق این ماه شما"
            value={today?.currentSalary ? today.currentSalary : "-"}
          />
        </div>
      </>
    );
}
 
export default FeedCart;