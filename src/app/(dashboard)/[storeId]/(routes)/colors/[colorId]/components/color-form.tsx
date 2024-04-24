"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Color } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface ColorsFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  value: z.string().regex(/^#/, {
    message: "Value must need to be a hexadecimal number",
  }),
});

type ColorsFormValueType = z.infer<typeof formSchema>;

export const ColorsForm = ({ initialData }: ColorsFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name!,
      value: initialData?.value!,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const title = initialData ? "Edit a color" : "Add a new color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const actions = initialData ? "Save change" : "Create";
  const toastMsg = initialData ? "Successfully edited" : "Successfully added";

  const onSubmit = async (values: ColorsFormValueType) => {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }
      router.refresh();
      toast.success(toastMsg);
      router.push(`/${params.storeId}/colors/`);
    } catch (error) {
      console.log(error);
      toast.error("Error while submitting");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push("/");
      toast.success("Color deleted successfully");
    } catch (error) {
      toast.error("Error while deleting");
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isSubmitting}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
            disabled={isSubmitting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Color name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Color Value"
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{
                          backgroundColor: field.value,
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} type="submit" className="ml-auto">
            {actions}
          </Button>
        </form>
      </Form>
    </>
  );
};
