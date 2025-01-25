import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/admin/Loader";
import { useDeleteOrderMutation, useGetSingleOrderQuery, useUpdateOrderMutation } from "../../../redux/api/OrderAPI";
import { RootState } from "../../../redux/store";
import { OrderResponse } from "../../../types/api-types";
import { OrderItemType } from "../../../types/types";

const TransactionManagement = () => {

    const params = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.userReducer);
    const { data, isLoading, isError } = useGetSingleOrderQuery(params.id!);
    const [updateOrder] = useUpdateOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const { shippingInfo, orderItems, subtotal, shippingCharges, tax, discount, total, status, user: User } = data?.order || {
        shippingInfo: {
            address: "Address",
            city: "City",
            state: "State",
            country: "Country",
            pinCode: "Pincode"
        },
        orderItems: [],
        subtotal: 0,
        shippingCharges: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: "Status",
        user: { name: "User Name", _id: "id" },
    };

    const updateHandler = async () => {
        const res = await updateOrder({ userId: user?._id!, orderId: params.id! });
        if (res.data?.success) {
            toast.success(res.data.message);
            navigate("/admin/transaction");
        } else {
            const error = res.error as FetchBaseQueryError;
            const messageResponse = error.data as OrderResponse;
            toast.error(messageResponse.message);
        };
    }
    const deleteHandler = async() => {
        const res = await deleteOrder({ userId: user?._id!, orderId: params.id! });
        if (res.data?.success) {
            toast.success(res.data.message);
            navigate("/admin/transaction");
        } else {
            const error = res.error as FetchBaseQueryError;
            const messageResponse = error.data as OrderResponse;
            toast.error(messageResponse.message);
        };
    };

    if (isError) return navigate("/NotFound");

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="product-management">
                {
                    isLoading ? <Skeleton length={10} /> :
                        <>
                            <section
                                style={{
                                    padding: "2rem",
                                }}
                            >
                                <h2>Order Items</h2>

                                {orderItems.map((i) => (
                                    <ProductCard
                                        key={i._id}
                                        name={i.name}
                                        photo={i.photo}
                                        productId={i.productId}
                                        _id={i._id}
                                        quantity={i.quantity}
                                        price={i.price}
                                    />
                                ))}
                            </section>

                            <article className="shipping-info-card">
                                <button className="product-delete-btn" onClick={deleteHandler}>
                                    <FaTrash />
                                </button>
                                <h1>Order Info</h1>
                                <h5>User Info</h5>
                                <p>Name: {User.name}</p>
                                <p>
                                    Address: {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} ${shippingInfo.pinCode}`}
                                </p>
                                <h5>Amount Info</h5>
                                <p>Subtotal: {subtotal}</p>
                                <p>Shipping Charges: {shippingCharges}</p>
                                <p>Tax: {tax}</p>
                                <p>Discount: {discount}</p>
                                <p>Total: {total}</p>

                                <h5>Status Info</h5>
                                <p>
                                    Status:{" "}
                                    <span
                                        className={
                                            status === "Delivered"
                                                ? "purple"
                                                : status === "Shipped"
                                                    ? "green"
                                                    : "red"
                                        }
                                    >
                                        {status}
                                    </span>
                                </p>
                                <button className="shipping-btn" onClick={updateHandler}>
                                    Process Status
                                </button>
                            </article>
                        </>
                }
            </main>
        </div>
    );
};

const ProductCard = ({
    name,
    photo,
    price,
    quantity,
    productId,
}: OrderItemType) => (
    <div className="transaction-product-card">
        <img src={photo} alt={name} />
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>
            ${price} X {quantity} = ${price * quantity}
        </span>
    </div>
);

export default TransactionManagement;
