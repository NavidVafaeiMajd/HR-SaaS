import { lazy } from "react";

const MDEditor = lazy(
   () => import("@uiw/react-md-editor")
 );
import { FormControl } from "@/components/ui/form";

type Props = {
   value: string;
   onChange: (value: string) => void;
};

function RichTextEditor({ value, onChange }: Props) {
   return (
      <FormControl>
         <div
            className="border rounded-md overflow-hidden text-right editor-wrapper"
            dir="rtl"
            style={{ 
               direction: "rtl", 
               textAlign: "right",
               fontFamily: "Vazir, Arial, sans-serif"
            }}
         >
            <MDEditor
               value={value}
               onChange={(val) => onChange(val || "")}
               data-color-mode="light"
               height={200}
               preview="edit"
               hideToolbar={false}
               visibleDragbar={false}
               textareaProps={{
                  placeholder: "چیزی بنویسید...",
                  dir: "rtl",
                  style: { 
                     direction: "rtl", 
                     textAlign: "right", 
                     color: "black",
                     fontFamily: "Vazir, Arial, sans-serif"
                  } 
               }}
            />
         </div>
      </FormControl>
   );
}

export default RichTextEditor;