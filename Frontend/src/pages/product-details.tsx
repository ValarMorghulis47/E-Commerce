import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowLeftLong,
    FaArrowRightLong,
    FaRegStar,
    FaStar,
    FaTrash
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/admin/Loader";
import RatingsComponent from "../components/ratings";
import { useSingleProductQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducers/cartReducer";
import { CartItemType, Review } from "../types/types";
import { RootState } from "../redux/store";
import { useDeleteReviewMutation, useGetAllReviewsQuery, useNewReviewMutation } from "../redux/api/reviewAPI";
import { FiEdit } from "react-icons/fi";

const ProductDetails = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const params = useParams();
    const dispatch = useDispatch();

    const { isLoading, isError, data } = useSingleProductQuery(params.id!);
    const { isLoading: reviewsLoading, isError: reviewsError, data: reviewResponse } = useGetAllReviewsQuery(params.id!);
    const [createReview] = useNewReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const [carouselOpen, setCarouselOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [reviewComment, setReviewComment] = useState("");
    const reviewDialogRef = useRef<HTMLDialogElement>(null);
    const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

    const decrement = () => {
        if (quantity === 1 || quantity === 0) return;
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

    const showDialog = () => {
        reviewDialogRef.current?.showModal();
    };

    const {
        Ratings: RatingsEditable,
        rating,
        setRating,
    } = useRating({
        IconFilled: <FaStar />,
        IconOutline: <FaRegStar />,
        value: 0,
        selectable: true,
        styles: {
            fontSize: "1.75rem",
            color: "coral",
            justifyContent: "flex-start",
        },
    });

    const reviewCloseHandler = () => {
        reviewDialogRef.current?.close();
        setRating(0);
        setReviewComment("");
    };

    const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        reviewCloseHandler();

        try {
            const res = await createReview({
                comment: reviewComment,
                rating,
                userId: user?._id!,
                productId: params.id!,
            });
            setReviewSubmitLoading(false);

            if (res.data?.success) {
                toast.success(res.data.message);
            } else {
                toast.error("Couldn't create review");
            }
        } catch (error) {
            toast.error("Something went wrong while creating review");
        } finally {
            setReviewSubmitLoading(true);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const res = await deleteReview({ reviewId, userId: user?._id! });
            if (res.data?.success) {
                toast.success(res.data.message);
            } else {
                toast.error("Couldn't delete review");
            }
        } catch (error) {
            toast.error("Something went wrong while deleting review");
        }
    };

    useEffect(() => {
        if (data) setQuantity(data.product.stock > 0 ? 1 : 0);
    }, []);

    if (isError) return <Navigate to="/not-found" />;
    if (reviewsError) toast.error("Failed to fetch reviews")
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
                            <p style={{ color: Number(data?.product.stock) >= 1 ? "green" : "red" }}>{Number(data?.product.stock) >= 1 ? "In Stock" : "Out Of Stock"}</p>
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
            <dialog ref={reviewDialogRef} className="review-dialog">
                <button onClick={reviewCloseHandler}>X</button>
                <h2>Write a Review</h2>
                <form onSubmit={submitReview}>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Review..."
                    ></textarea>
                    <RatingsEditable />
                    <button disabled={reviewSubmitLoading} type="submit">
                        Submit
                    </button>
                </form>
            </dialog>

            <section>
                <article>
                    <h2>Reviews</h2>

                    {reviewsLoading
                        ? null
                        : user && (
                            <button onClick={showDialog}>
                                <FiEdit />
                            </button>
                        )}
                </article>
                <div
                    style={{
                        display: "flex",
                        gap: "2rem",
                        overflowX: "auto",
                        padding: "2rem",
                    }}
                >
                    {reviewsLoading ? (
                        <>
                            <Skeleton width="45rem" length={5} />
                            <Skeleton width="45rem" length={5} />
                            <Skeleton width="45rem" length={5} />
                        </>
                    ) : (
                        reviewResponse?.reviews.map((review) => (
                            <ReviewCard
                                handleDeleteReview={handleDeleteReview}
                                userId={user?._id}
                                key={review._id}
                                review={review}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

const ReviewCard = ({
    review,
    userId,
    handleDeleteReview,
}: {
    userId?: string;
    review: Review;
    handleDeleteReview: (reviewId: string) => void;
}) => (
    <div className="review">
        <RatingsComponent value={review.rating} />
        <p>{review.comment}</p>
        <div>
            <img src={review.user.photo} alt="User" />
            <small>{review.user.name}</small>
        </div>
        {userId === review.user._id && (
            <button onClick={() => handleDeleteReview(review._id)}>
                <FaTrash />
            </button>
        )}
    </div>
);

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