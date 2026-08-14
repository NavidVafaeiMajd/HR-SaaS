import { useParams } from "react-router-dom";
import SalaryStatus from "./components/SalaryStatus";

const PayRollDetailsPage = () => {
  const { id } = useParams();

  return (
    <main dir="rtl">
      <SalaryStatus userId={id} />
    </main>
  );
};

export default PayRollDetailsPage;
