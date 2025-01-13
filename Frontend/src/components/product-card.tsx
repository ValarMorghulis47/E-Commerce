import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

type ProductsProps = {
  productId: string;
  photo: { url: string; public_id: string; _id: string };
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  console.log(photo);
  
  return (
    <div className="product-card">
      <img src={photo.url} alt={name} />
      <p>{name}</p>
      <span>${price}</span>

      <div>
        <button
          onClick={handler}
        >
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;