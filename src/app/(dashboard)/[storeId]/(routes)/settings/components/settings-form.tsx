"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  frontEndStoreUrl: z.string().url({
    message: "Invalid frontend",
  }),
  stripeKey: z.string().min(10, {
    message: "Invalid stripe key",
  }),
});

type SettingFormValueType = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      frontEndStoreUrl: initialData.frontEndStoreUrl,
      stripeKey: initialData.stripeKey,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SettingFormValueType) => {
    try {
      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh();
      toast.success("Store updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while submitting");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error(
        "Make sure to delete all off your products, billboards, colors, sizes etc. To remove the store"
      );
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
        <Heading
          title="Settings"
          description="Manage your ecommerce settings. (Shopify Alternative)"
        />
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
                      placeholder="Store Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frontEndStoreUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="URL"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stripeKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Stripe key"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} type="submit" className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="admin"
      />
    </>
  );
};
