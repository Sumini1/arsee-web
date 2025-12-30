export const HEADER_TABLE_PRODUCT = [
    "No",
    "Name",
    "Category",
    "Price",
    "Available",
    "Action",
];

export const CATEGORY_LIST = [
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
 
export const INITIAL_PRODUCT = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_PRODUCT = {
  status: "idle",
  errors: {
    id: [],
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  }
};