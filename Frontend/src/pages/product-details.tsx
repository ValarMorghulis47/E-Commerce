import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowLeftLong,
    FaArrowRightLong
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/admin/Loader";
import RatingsComponent from "../components/ratings";
import { useSingleProductQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducers/cartReducer";
import { CartItemType } from "../types/types";

const ProductDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const { isLoading, isError, data } = useSingleProductQuery(params.id!);
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const decrement = () => {
        if (quantity === 1 || quantity===0) return;
        setQuantity((prev) => prev - 1)
    };
    const increment = () => {
        if (data?.product?.stock === quantity)
            return toast.error("Cannot exceed the available stock amount");
        setQuantity((prev) => prev + 1);
    };

    const addToCartHandler = (cartItem: CartItemType) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");

        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
    };

    useEffect(() =>{
        if(data) setQuantity(data.product.stock > 0 ? 1 : 0);
    }, []);

    if (isError) return <Navigate to="/not-found" />;
    return (
        <div className="product-details">
            {isLoading ? (
                <ProductLoader />
            ) : (
                <>
                    <main>
                        <section>
                            <Slider
                                showThumbnails
                                showNav={false}
                                onClick={() => setCarouselOpen(true)}
                                images={data?.product?.photos.map((i) => i.url) || []}
                            />
                            {carouselOpen && (
                                <MyntraCarousel
                                    NextButton={NextButton}
                                    PrevButton={PrevButton}
                                    setIsOpen={setCarouselOpen}
                                    images={data?.product?.photos.map((i) => i.url) || []}
                                />
                            )}
                        </section>
                        <section>
                            <p style={{color: Number(data?.product.stock) >= 1 ? "green" : "red"}}>{Number(data?.product.stock) >= 1 ? "In Stock" : "Out Of Stock"}</p>
                            <code>{data?.product?.category}</code>
                            <h1>{data?.product?.name}</h1>
                            <em
                                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                            >
                                <RatingsComponent value={data?.product?.ratings || 0} />
                            </em>
                            <h3>${data?.product?.price}</h3>
                            <article>
                                <div>
                                    <button onClick={decrement}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={increment}>+</button>
                                </div>
                                <button
                                    onClick={() =>
                                        addToCartHandler({
                                            productId: data?.product?._id!,
                                            name: data?.product?.name!,
                                            price: data?.product?.price!,
                                            stock: data?.product?.stock!,
                                            quantity,
                                            photo: data?.product?.photos[0].url || "",
                                        })
                                    }
                                >
                                    Add To Cart
                                </button>
                            </article>

                            <p>{data?.product?.description}</p>
                        </section>
                    </main>
                </>
            )}
        </div>
    );
};

const ProductLoader = () => {
    return (
        <div
            style={{
                display: "flex",
                gap: "2rem",
                border: "1px solid #f1f1f1",
                height: "80vh",
            }}
        >
            <section style={{ width: "100%", height: "100%" }}>
                <Skeleton
                    width="100%"
                    containerHeight="100%"
                    height="100%"
                    length={1}
                />
            </section>
            <section
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4rem",
                    padding: "2rem",
                }}
            >
                <Skeleton width="40%" length={3} />
                <Skeleton width="50%" length={4} />
                <Skeleton width="100%" length={2} />
                <Skeleton width="100%" length={10} />
            </section>
        </div>
    );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
        <FaArrowRightLong />
    </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
        <FaArrowLeftLong />
    </button>
);

export default ProductDetails;