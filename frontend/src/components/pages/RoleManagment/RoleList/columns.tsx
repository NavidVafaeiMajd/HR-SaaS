import type { ColumnDef } from "@tanstack/react-table";
import type { Roles } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { validation } from "./validation";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { getPermissionLabel, permission } from "../utils/utils";

export const userColumns: ColumnDef<Roles>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نام
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name");
      return name ? name : "—";
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          توضیحات
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description ? description : "—";
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => {
      const deleteRow = useDeleteRows({
        url: "roles",
        queryKey: ["roles"],
      });
      const { mutation } = useUpdateRows(
        `roles/${row.original.id}`,
        ["roles"],
        validation,
        "نقش کاربری",
      );

      const role = row.original;

      const defaultValues = {
        name: role.name,
        description: role.description,

        ...permission.reduce(
          (acc, curr) => {
            curr.itemPermission.forEach((item) => {
              acc[item] = role.permissions?.includes(item) ?? false;
            });

            return acc;
          },
          {} as Record<string, boolean>,
        ),
      };

      console.log("defulte", defaultValues, role);

      return (
        <div className="flex items-center gap-2">
          <EditDialog
            title="ویرایش  "
            triggerLabel="ویرایش"
            fields={
              <>
                <Form.Input name="name" label="نام نقش کاربری" required />
                <Form.Input name="description" label="توضیحات" required />

                {permission.map((permission) => (
                  <div className="flex flex-col gap-3">
                    <h2>{permission.name} :</h2>
                    <div className="flex flex-col md:flex-row gap-5">
                      {permission.itemPermission.map((item) => (
                        <Form.Checkbox
                          name={item}
                          label={getPermissionLabel(item)}
                          required
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            }
            defaultValues={defaultValues}
            onSave={(data) => {
              const permissions = Object.entries(data)
                .filter(([_, value]) => value === true)
                .map(([key]) => key);
              const body = {
                name: data.name,
                permissions,
              };
              mutation.mutate(body);
            }}
            schema={validation}
          />
          <DeleteDialog
            onConfirm={() => {
              deleteRow.mutate(role.id);
            }}
          />
        </div>
      );
    },
    header: () => {
      return <span className="font-normal">عملیات</span>;
    },
  },
];
