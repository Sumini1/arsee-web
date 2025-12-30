import { INITIAL_STATE_ACTION } from "./general-constant";

export const HEADER_TABLE_ORDER = [
  "No",
  "Order ID",
  "Customer Name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_ORDER = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_STATE_ORDER = {
  status: "idle",
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

export const STATUS_CREATE_ORDER = [
  {
    value: "reserved",
    label: "Pending",
  },
  {
    value: "process",
    label: "Process",
  },
];

export const HEADER_TABLE_DETAIL_ORDER = [
  "No",
  "Product Name",
  "Total",
  "Status",
  "Action",
];

export const FILTER_PRODUCT = [
  {
    value: "",
    label: "All",
  },
  {
    value: "khimar",
    label: "Khimar",
  },
  {
    value: "abaya",
    label: "Abaya",
  },
  {
    value: "one-set-abaya-khimar", 
    label: "One Set Abaya & Khimar",
  },
];

export const INITIAL_STATE_GENERATE_PAYMENT = {
  ...INITIAL_STATE_ACTION,
  data: {
    payment_token: ""
  }
}