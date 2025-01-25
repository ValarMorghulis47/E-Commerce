import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/OrderAPI";
import { clearCart } from "../redux/reducers/cartReducer";
import { RootState } from "../redux/store";
import { OrderResponse } from "../types/api-types";
import { newOrderRequest } from "../types/types";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY! as string;

const stripePromise = loadStripe(stripeKey);

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } = useSelector((state: RootState) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setIsProcessing(true);

        const orderData: newOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: {
                name: user?.name!,
                _id: user?._id!,
            },
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something Went Wrong");
        }

        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(clearCart());
            if (res.data?.success) {
                toast.success(res.data.message);
                navigate("/orders");
            } else {
                const error = res.error as FetchBaseQueryError;
                const messageResponse = error.data as OrderResponse;
                toast.error(messageResponse.message);
            };
        }
        setIsProcessing(false);
    };
    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button type="submit" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { cartItems } = useSelector((state: RootState) => state.cartReducer);
    const clientSecret: string | undefined = location.state;

    if (!clientSecret) return <Navigate to={"/shipping"} />;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems]);

    return (
        <Elements
            options={{
                clientSecret,
            }}
            stripe={stripePromise}
        >
            <CheckOutForm />
        </Elements>
    );
};

export default Checkout;