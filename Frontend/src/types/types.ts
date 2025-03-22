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
    description: string;
    price: number;
    stock: number;
    category: string;
    ratings: number;
    photos: Photos[];
};

export type Order = {
    shippingInfo: ShippingInfo;
    user: {
        name: string;
        _id: string;
    };
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    orderItems: OrderItemType[];
    _id: string;
};

export type Review = {
    rating: number;
    comment: string;
    user: {
        _id: string;
        name: string;
        photo: string;
    };
    product: string;
    _id: string;
}

type Photos = {
    url: string;
    public_id: string;
    _id: string;
};

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

export type OrderItemType = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    productId: string;
    photo: string;
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

export type updateCouponBodyType = {
    id: string;
    couponId: string;
    body: {
        code:string;
        amount: number;
    }
}

export type newCouponBodyType = {
    id: string;
    body: {
        code:string;
        amount: number;
    }
}

export type newReviewRequestType = {
    id: string;
    userId: string;
    rating: number;
    comment: string;
}

export type singleCouponRequestType = {
    id: string;
    couponId: string;
}

export type OrderUpdateAndDeleteType = {
    userId: string;
    orderId: string;
};

export type newOrderRequest = {
    shippingInfo: ShippingInfo;
    user: {
        name: string;
        _id: string;
    };
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: CartItemType[];
};

export type DashboardStats = {
    changePercent: {
        revenue: number;
        users: number;
        transactions: number;
        products: number;
    },
    totalCount: {
        totalRevenue: number;
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
    },
    chartData: {
        order: number[];
        revenue: number[];
    },
    inventoryData: Record<string, number>[],
    userRatio: {
        male: number;
        female: number;
    },
    recentOrders: {
        _id: string;
        discount: number;
        total: number;
        status: string;
        quantity: number;
    }[]
};

export type barChartsStats = {
    userChartData: number[],
    productChartData: number[],
    ordersChartData: number[],
};

export type pieChartStats = {
    orderStatusData: {
        processing: number;
        shipped: number;
        delivered: number;
    },
    inventoryData: Record<string, number>[],
    stockRatio: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: {
        netMargin: number;
        marketingCost: number;
        totalDiscount: number;
        burnt: number;
        productionCost: number;
    },
    userAgeRatio: {
        teenage: number;
        adult: number;
        old: number;
    },
    userRoleRatio: {
        admin: number;
        user: number;
    }
};

export type lineChartStats = {
    usersChartData : number[],
    productsChartData : number[],
    revenueData : number[],
    discountData : number[],
};

export type Coupon = {
    _id: string;
    code: string;
    amount: number;
};