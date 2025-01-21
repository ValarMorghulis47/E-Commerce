export type User = {
    _id: string;
    name: string;
    email: string;
    gender: string;
    dob: string;
    photo: string;
    role: string;
};

export type Product = {
    _id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    photos: Photos[];
}

type Photos = {
    url: string;
    public_id: string;
    _id: string;
}

export type newProductBodyType = {
    id: string;
    formData: FormData;
};

export type updateProductBodyType = newProductBodyType & {
    productId: string;
};

export type deleteProductParamsType = {
    id: string;
    productId: string;
};

export type SearchProductType = {
    search: string;
    price: number;
    category: string;
    sort: string;
    page: number;
};

export type CartItemType = {
    name: string;
    price: number;
    quantity: number;
    productId: string;
    photo: string;
    stock: number;
};

export type ShippingInfo = {
    address: string;
    city: string;
    pinCode: string;
    country: string;
    state: string;
};

export type CouponApplyBodyType = {
    code: string;
};