import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";


const Home = () => {

  const addToCartHandler = () => {};

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
          <ProductCard productId="1" name="Product 1" price={100} stock={10} handler={addToCartHandler} photo={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-MobxmJY2OXoz8iUZ_cnyaqbms0g2ye4MAw&s"} />
        </main>
      </div>
    </>
  );
};

export default Home;