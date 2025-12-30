import {
  Album,
  Armchair,
  LayoutDashboard,
  SquareMenu,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Order",
      url: "/order",
      icon: Album,
    },
    {
      title: "Table",
      url: "/admin/table",
      icon: SquareMenu,
    },
    {
      title: "Produk",
      url: "/admin/product",
      icon: Armchair,
    },
    {
      title: "User",
      url: "/admin/user",
      icon: Users,
    },
  ],
  cashier: [
    {
      title: "Order",
      url: "/order",
      icon: Album,
    },
  ],
  seller: [
    {
      title: "Order",
      url: "/order",
      icon: Album,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
