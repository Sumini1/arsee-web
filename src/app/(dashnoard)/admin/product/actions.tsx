"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { ProductFormSatate } from "@/types/product";
import { productSchema } from "@/validations/product-validation";

export async function createProduct(
  prevState: ProductFormSatate,
  formData: FormData
) {
  let validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    discount: parseFloat(formData.get("discount") as string),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    is_available: formData.get("is_available") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "products",
      validatedFields.data.image_url
    );
    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    price: validatedFields.data.price,
    discount: validatedFields.data.discount,
    category: validatedFields.data.category,
    image_url: validatedFields.data.image_url,
    is_available: validatedFields.data.is_available,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

// update product
export async function updateProduct(
  prevState: ProductFormSatate,
  formData: FormData
) {
  let validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    discount: parseFloat(formData.get("discount") as string),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    is_available: formData.get("is_available") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.image_url instanceof File) {
    const oldImageUrl = formData.get("old_image_url") as string;
    const { errors, data } = await uploadFile(
      "images",
      "products",
      validatedFields.data.image_url,
      oldImageUrl.split("/images/")[1]
    );
    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      discount: validatedFields.data.discount,
      category: validatedFields.data.category,
      image_url: validatedFields.data.image_url,
      is_available: validatedFields.data.is_available,
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

// delete product
export async function deleteProduct(
  prevState: ProductFormSatate,
  formData: FormData
) {
  const supabase = await createClient();
  const image = formData.get("image_url") as string;
  const {status, errors} = await deleteFile(
    "images",
    image.split("/images/")[1]
  );

   if (status === 'error') {
     return {
       status: "error",
       errors: {
         ...prevState.errors,
         _form: [errors?._form?.[0] ?? "Uknown Error"],
       },
     };
   }


   const {error} = await supabase.from("products").delete().eq("id", formData.get("id"));
   if (error) {
     return {
       status: "error",
       errors: {
         ...prevState.errors,
         _form: [error.message],
       },
     };
   }

   return {
     status: "success",
   };
}

