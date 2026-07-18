import React from "react";
import { 
  CompanyStatusChart, 
  LeadPriorityChart, 
  PipelineStageChart, 
  ContractValueChart 
} from "../Charts";

const CRMStatistics: React.FC = () => {
  // Sample data - replace with real data from API
  const companyStatusData = [
    { name: "فعال", count: 45 },
    { name: "غیرفعال", count: 12 },
    { name: "در انتظار", count: 8 },
    { name: "لغو شده", count: 3 },
    ];
    

  const leadPriorityData = [
    { priority: "فوری", count: 15 },
    { priority: "مهم", count: 32 },
    { priority: "کم اهمیت", count: 18 },
  ];

  const pipelineStageData = [
    { stage: "ارتباط", count: 25 },
    { stage: "مذاکره", count: 18 },
    { stage: "ارسال پیشنهاد", count: 12 },
    { stage: "عقد قرارداد", count: 8 },
  ];

  const contractValueData = [
    { month: "فروردین", value: 15000000 },
    { month: "اردیبهشت", value: 22000000 },
    { month: "خرداد", value: 18000000 },
    { month: "تیر", value: 25000000 },
    { month: "مرداد", value: 30000000 },
    { month: "شهریور", value: 28000000 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">آمار CRM</h1>
        <p className="text-gray-600">نمایش آمار و گزارش‌های مدیریت ارتباط با مشتری</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Status Chart */}
        <div className="lg:col-span-1">
          <CompanyStatusChart data={companyStatusData} />
        </div>

        {/* Lead Priority Chart */}
        <div className="lg:col-span-1">
          <LeadPriorityChart data={leadPriorityData} />
        </div>

        {/* Pipeline Stage Chart */}
        <div className="lg:col-span-1">
          <PipelineStageChart data={pipelineStageData} />
        </div>

        {/* Contract Value Chart */}
        <div className="lg:col-span-1">
          <ContractValueChart data={contractValueData} />
        </div>
      </div>
    </div>
  );
};

export default CRMStatistics;
