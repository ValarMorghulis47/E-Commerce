import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/admin/Loader";


const Home = () => {

  const { data, isError, isLoading } = useLatestProductsQuery('');
  
  if (isError) toast.error("Failed to fetch products");

  const addToCartHandler = () => { };

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