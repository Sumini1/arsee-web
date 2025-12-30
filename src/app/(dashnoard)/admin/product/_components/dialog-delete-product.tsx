import { Profile } from "@/types/auth";
import { startTransition, useActionState, useEffect } from "react";
import { deleteProduct } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import DialogDelete from "../../user/_components/dialog-delete";
import { Product } from "@/validations/product-validation";


export default function DialogDeleteProduct({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Product | undefined;  
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteProductState, deleteProductAction, isPendingDeleteProduct] =
    useActionState(deleteProduct, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    formData.append("image_url", currentData!.image_url as string);
    startTransition(() => {
      deleteProductAction(formData);
    });
  };

  useEffect(() => {
    if (deleteProductState?.status === "error") {
      toast.error("Delete Product Failed", {
        description: deleteProductState.errors?._form?.[0],
      });
    }

    if (deleteProductState?.status === "success") {
      toast.success("Delete Product Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteProductState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProduct}
      onSubmit={onSubmit}
      title="Product"
    />
  );
}
