import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { convertIDR } from "@/lib/utils";
import { Product } from "@/validations/product-validation";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CardProduct({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, action: "increment" | "decrement") => void;
}) {
  return (
    <Card
      key={product.id}
      className="w-full flex flex-col justify-between border p-0 gap-0 shadow-sm"
    >
      <CardContent className="p-0">
        <Image
          src={`${product.image_url}`}
          width={400}
          height={400}
          alt={`${product.name}`}
          className="w-full rounded-t-lg object-cover"
        />
        <div className="px-4 py-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-forground line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center ">
        <div>
          {product.discount > 0 && (
            <div className="text-sm font-bold line-through text-muted-foreground">
              {convertIDR(product.price)}
            </div>
          )}
           <div className="text-xl font-bold">
            {
              product.discount > 0
                ? convertIDR(product.price - (product.price * product.discount) / 100)
                : convertIDR(product.price)
            }
           </div>
        </div>
       
        <Button
          className="cursor-pointer"
          onClick={() => onAddToCart(product, "increment")}
        >
          <ShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
}
