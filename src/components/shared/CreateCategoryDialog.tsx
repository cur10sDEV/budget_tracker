"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { categorySchema } from "@/schemas/category";
import { createCategory } from "@/server/actions/categories";
import { CategorySchema, TransactionType } from "@/types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ICreateCategoryDialogProps {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: ReactNode;
}
const CreateCategoryDialog = ({
  type,
  successCallback,
  trigger,
}: ICreateCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
      limit: 0,
      isLimit: false,
      type,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      if (data) {
        toast.success(`Category ${data.name} created successfully 🎉`, {
          id: "create-category",
        });
      }

      if (data) {
        successCallback(data);
      }

      queryClient.invalidateQueries({
        queryKey: ["userCategories", type],
      });

      setOpen((prev) => !prev);
    },
    onError: () =>
      toast.error("Something went wrong!", {
        id: "create-category",
      }),
  });

  const onSubmit = (values: CategorySchema) => {
    toast.loading("Creating category...", {
      id: "create-category",
    });

    if (!values.isLimit) {
      delete values.limit;
    }

    mutate({
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
          >
            <PlusSquare className="mr-2 size-4" />
            <span>Create New</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={isPending} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "expense" && (
              <FormField
                control={form.control}
                name="isLimit"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Set Limit</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === "expense" && form.getValues("isLimit") && (
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isPending} />
                    </FormControl>
                    <FormDescription>
                      Limits the amount that you can spend on this category of
                      expenses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-[100px]"
                          disabled={isPending}
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="size-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          theme={theme.resolvedTheme}
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            type="submit"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateCategoryDialog;
