import { MdOutlineMail } from "react-icons/md";

type Props = {
    title: string;
  data: string |number| undefined;
};
export const InfoData = ({ data,title }: Props) => {
  return (
    <div className="flex justify-between">
      <span className="flex gap-3">
        <MdOutlineMail className="w-7! h-7!" />
        {title}
      </span>
      <span>{data}</span>
    </div>
  );
};