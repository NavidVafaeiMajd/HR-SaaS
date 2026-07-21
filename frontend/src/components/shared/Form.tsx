import React, { createContext, useCallback, useContext } from "react";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import {
//   Select as ShadcnSelect,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type {
  FieldValues,
  Path,
  UseFormReturn,
  SubmitHandler,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import CuDatePicker from "./DatePicker";
import RichTextEditor from "./RichTextEditor";
import { ImageUploadInput } from "./ImageUploadInput";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "react-select";
import StarRating from "./StarRating";
import TimePicker from "./TimePicker";

// ---------- Context ----------
interface FormContextType<T extends FieldValues> {
  form: UseFormReturn<T>;
}

const FormContext = createContext<FormContextType<any> | null>(null);

function useFormContextSafe<T extends FieldValues>() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("Form.* components must be used inside <Form>");
  }
  return ctx.form as UseFormReturn<T>;
}

// ---------- Root ----------
interface FormRootProps<T extends FieldValues> {
  formProp: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  children: React.ReactNode;
  accordion?: boolean;
  accordionTitle?: string;
  defaultAccordionOpen?: boolean;
}

function FormRoot<T extends FieldValues>({
  formProp,
  onSubmit,
  className,
  children,
  accordion = false,
  accordionTitle = "Form",
  defaultAccordionOpen = false,
}: FormRootProps<T>) {
  const content = (
    <form onSubmit={formProp.handleSubmit(onSubmit)} className={cn(className)}>
      {children}
    </form>
  );

  return (
    <FormContext.Provider value={{ form: formProp }}>
      <ShadcnForm {...formProp}>
        {accordion ? (
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultAccordionOpen ? "item-1" : undefined}
            className="w-full border-b-red-500 border-b-2! px-5"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg!">
                {accordionTitle}
              </AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          content
        )}
      </ShadcnForm>
    </FormContext.Provider>
  );
}

// ---------- Input ----------
interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  className,
  inputClassName,
  disabled,
}: FormInputProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              className={`min-h-12 ${inputClassName ?? ""}`}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

///---------------password--------

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FormPasswordProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

function FormPassword<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  className,
  inputClassName,
  disabled,
}: FormPasswordProps<T>) {
  const { control } = useFormContextSafe<T>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>

          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                className={`min-h-12 ps-12 ${inputClassName ?? ""}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// ---------- Date ----------
interface FormDateProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  className?: string;
  onlyMonthPicker?: boolean;
}

function FormDate<T extends FieldValues>({
  name,
  label,
  className,
  onlyMonthPicker = false,
}: FormDateProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2  ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label}
            <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <CuDatePicker
              value={field.value}
              onChange={field.onChange}
              onlyMonthPicker={onlyMonthPicker}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ---------- RichText ----------
interface FormRichTextProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;

  className?: string;
}

function FormRichText<T extends FieldValues>({
  name,
  label,
  required,
  className,
}: FormRichTextProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <RichTextEditor value={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// // ---------- Select ----------
// interface FormSelectProps<T extends FieldValues> {
//   name: Path<T>;
//   label: string;
//   required?: boolean;
//   placeholder?: string;
//   className?: string;
//   children: React.ReactNode;
// }

// function FormSelect<T extends FieldValues>({
//   name,
//   label,
//   required,
//   placeholder,
//   className,
//   children,
// }: FormSelectProps<T>) {
//   const { control } = useFormContextSafe<T>();

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
//           <FormLabel className="text-base">
//             {label} {required && <span className="text-red-500">*</span>}
//           </FormLabel>
//           <FormControl>
//             <ShadcnSelect
//               value={field.value}
//               onValueChange={field.onChange}
//               dir="rtl"
//             >
//               <SelectTrigger className="w-full min-h-12">
//                 <SelectValue placeholder={placeholder} />
//               </SelectTrigger>
//               <SelectContent>{children}</SelectContent>
//             </ShadcnSelect>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }

// ---------- Textarea ----------
interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
}

function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  className,
  textareaClassName,
}: FormTextareaProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <textarea
              placeholder={placeholder}
              className={`w-full  p-2 border rounded-md ${
                textareaClassName ?? ""
              }`}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ---------- Image Upload ----------
interface FormImageProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  className?: string;
}

function FormImage<T extends FieldValues>({
  name,
  label,
  required,
  className,
}: FormImageProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          {label && (
            <FormLabel className="text-base">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <ImageUploadInput field={field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

//---------- MultiSelect ----------

interface MultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: { label: string; value: any }[];
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect<T extends FieldValues>({
  name,
  label,
  options,
  required,
  className,
  placeholder,
  disabled,
}: MultiSelectProps<T>) {
  const { control } = useFormContextSafe<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`grid gap-0! w-full ${className ?? ""}`}>
          <FormLabel className="text-md mb-4!">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="select-box">
              <Select<{ label: string; value: string }, false>
                isRtl
                closeMenuOnSelect
                placeholder={placeholder}
                options={options}
                className=" m-0!"
                value={options.find((opt) => opt.value === field.value) ?? null}
                onChange={(val) =>
                  field.onChange(
                    val ? (val as { label: string; value: string }).value : ""
                  )
                }
                isDisabled={disabled}
              />
            </div>
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

//---------- STAR ----------

interface StarRateProps<T extends FieldValues> {
  name: Path<T>;
  className?: string;
}

export function StarRate<T extends FieldValues>({
  name,
  className,
}: StarRateProps<T>) {
  const { control } = useFormContextSafe<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-col w-full  space-y-0 ${
            className ?? ""
          }`}
        >
          <FormControl>
            <StarRating star={field.value} onChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// ---------- Checkbox ----------
interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  className?: string;
}

function FormCheckbox<T extends FieldValues>({
  name,
  label,
  required,
  className,
}: FormCheckboxProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-center space-x-2 space-y-0 ${
            className ?? ""
          }`}
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="size-6"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-md">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// ---------- TimePicker ----------
interface FormTimePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

function FormTimePicker<T extends FieldValues>({
  name,
  label,
  required,
  className,
  placeholder,
}: FormTimePickerProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <TimePicker
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// ---------- Hidden Input ----------
interface FormHiddenProps<T extends FieldValues> {
  name: Path<T>;
  value?: any;
}

function FormHidden<T extends FieldValues>({ name, value }: FormHiddenProps<T>) {
  const { control } = useFormContextSafe<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <input
          type="hidden"
          {...field}
          value={value ?? field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
}


/////////////////////////////////
interface FormPriceInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function FormPriceInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  className,
  inputClassName,
  disabled,
}: FormPriceInputProps<T>) {
  const { control } = useFormContextSafe<T>();

  const formatPrice = useCallback((value: string) => {
    if (!value) return "";
    const onlyInteger = value.split(".")[0];
    const numeric = onlyInteger.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full space-y-2 ${className ?? ""}`}>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                className={`min-h-12 pr-16 text-end ${inputClassName ?? ""}`}
                disabled={disabled}
                value={formatPrice(field.value ?? "")}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  field.onChange(formatted.replace(/,/g, "")); // در فرم عدد خام ذخیره شود
                }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                تومان
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export const Form = Object.assign(FormRoot, {
  Input: FormInput,
  // Select: FormSelect,
  Date: FormDate,
  RichText: FormRichText,
  Textarea: FormTextarea,
  Image: FormImage,
  Checkbox: FormCheckbox,
  // SelectItem,
  Select: MultiSelect,
  StarRate: StarRate,
  TimePicker: FormTimePicker,
  Hidden: FormHidden,
  PriceInput: FormPriceInput,
  Password: FormPassword,
});
