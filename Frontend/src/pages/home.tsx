import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/admin/Loader";
import { CartItemType } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";


const Home = () => {

  const dispatch = useDispatch();
  const { data, isError, isLoading } = useLatestProductsQuery('');
  
  if (isError) toast.error("Failed to fetch products");

  const addToCartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  return (
    <>
      <div className="home">
        <section></section>
        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>
          {
            isLoading ? (
              <Skeleton />
            ) : (
             data?.products?.map((product) => (
                <ProductCard
                  key={product._id}
                  productId={product._id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  handler={addToCartHandler}
                  photo={product.photos[0]} />
              ))
            )
          }
        </main>
      </div>
    </>
  );
};

export default Home;