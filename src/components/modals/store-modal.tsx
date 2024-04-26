"use client";

import * as z from "zod";
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formValidation = z.object({
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

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formValidation),
    defaultValues: {
      name: "",
      frontEndStoreUrl: "",
      stripeKey: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formValidation>) => {
    try {
      const res = await axios.post("/api/stores", data);

      toast.success("Store created successfully");

      // await new Promise<void>((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 2500);
      // });

      router.push(`/${res.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      form.reset();
      onClose();
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to this dashboard to mange your ecommerce. (Shopify Alternative)"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Name</Label>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="frontEndStoreUrl"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="mt-6">
                      <Label>Store URL</Label>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="https://abc.ecommerce.xyz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="stripeKey"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="mt-6">
                      <Label>Payment key</Label>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Stripe Secret..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
