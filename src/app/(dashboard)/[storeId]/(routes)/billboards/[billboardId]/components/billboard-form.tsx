"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import { ImageUpload } from "@/components/ui/image-uplolad";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Label is required",
  }),
  imageUrl: z.string().url(),
});

type BillboardFormValueType = z.infer<typeof formSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label!,
      imageUrl: initialData?.imageUrl!,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const title = initialData ? "Edit a billboard" : "Add a new billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const actions = initialData ? "Save change" : "Create";
  const toastMsg = initialData ? "Successfully edited" : "Successfully added";

  const onSubmit = async (values: BillboardFormValueType) => {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }
      router.refresh();
      toast.success(toastMsg);
      router.push(`/${params.storeId}/billboards/`);
    } catch (error) {
      console.log(error);
      toast.error("Error while submitting");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted successfully");
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Billboard Label"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value ? [field.value] : []}
                    disabled={isSubmitting}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => {
                      field.onChange("");
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit" className="ml-auto">
            {actions}
          </Button>
        </form>
      </Form>
    </>
  );
};
