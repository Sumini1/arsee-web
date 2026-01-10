import { Button } from "@/components/ui/button";
import { Product } from "@/validations/product-validation";
import { convertIDR } from "@/lib/utils";
import { usePricing } from "@/hooks/use-pricing";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Receipt = ({
  order,
  orderProduct,
  orderId,
}: {
  order: {
    customer_name: string;
    tables: { name: string }[];
    status: string;
    created_at: string;
  };
  orderProduct:
    | {
        products: Product;
        quantity: number;
        status: string;
        id: string;
        nominal: number;
      }[]
    | null
    | undefined;
  orderId: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { grandTotal, totalPrice, tax, service } = usePricing(
    orderProduct || []
  );
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="relative">
      <Button onClick={reactToPrintFn}>Print Receipt</Button>
      <div
        ref={contentRef}
        className="w-full flex-col p-8 absolute -z-10 top-0"
      >
        <h4 className="text-2xl font-bold text-center pb-4 border-b border-dashed">
          ARSEE WEB
        </h4>
        <div className="py-4 border-b border-dashed text-sm space-y-2 ">
          <p>
            Bill No: <span className="font-bold ">{orderId}</span>
          </p>
          <p>
            Table:{" "}
            <span className="font-bold ">
              {(order?.tables as unknown as { name: string })?.name}
            </span>
          </p>
          <p>
            Customer: <span className="font-bold ">{order?.customer_name}</span>
          </p>
          <p>
            Date:{" "}
            <span className="font-bold ">
              {new Date(order?.created_at).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2 py-4 border-b border-dashed text-sm ">
          {orderProduct?.map((item) => (
            <div key={item.id} className="flex justify-between items-center ">
              <p>
                {item.products.name} x {item.quantity}
              </p>
              <p>{convertIDR(item.products.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 py-4 border-b border-dashed text-sm ">
          <div className="flex justify-between items-center">
            <p>Subtotal</p>
            <p>{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Tax</p>
            <p>{convertIDR(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Service</p>
            <p>{convertIDR(service)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total</p>
            <p>{convertIDR(grandTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
