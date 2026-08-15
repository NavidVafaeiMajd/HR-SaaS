import { SummaryCard } from "../components/SummaryCart";

const FeedCart = ({ summary }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
      <SummaryCard
        label="تعداد کل کارکنان"
        value={summary?.totalEmployees ?? "-"}
      />

      <SummaryCard
        label="کارکنان حاضر امروز"
        value={summary?.present ?? "-"}
      />

      <SummaryCard
        label="کارکنان غایب امروز"
        value={summary?.absent ?? "-"}
      />

      <SummaryCard
        label="کارکنان در مرخصی امروز"
        value={summary?.onLeave ?? "-"}
      />

      <SummaryCard
        label="کارکنان خارج از شیفت"
        value={summary?.outOfShift ?? "-"}
      />

      <SummaryCard
        label="درخواست‌های در انتظار بررسی"
        value={summary?.pendingRequests ?? "-"}
      />
    </div>
  );
};

export default FeedCart;
