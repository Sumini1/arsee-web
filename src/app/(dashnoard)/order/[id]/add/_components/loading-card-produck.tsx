import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCardProduct() {
  return (
    <div className="grid grid-cols-2 w-full gap-4 lg:grid-cols-3 ">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={`skeleton-product-${index}`}
          className="w-full h-fit shadow-sm p-0 gap-0"
        >
          <Skeleton className="w-full aspect-square" />
          <CardContent className="px-4 py-2 space-y-2">
            <Skeleton className="w-1/2 h-5" />
            <Skeleton className="w-full h-5" />
          </CardContent>
          <CardFooter className="p-4 gap-4 flex justify-between items-center ">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-1/4 h-5" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
