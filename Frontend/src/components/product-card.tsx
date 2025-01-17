import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItemType } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: { url: string; public_id: string; _id: string };
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItemType) => string | undefined
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  
  return (
    <div className="product-card">
      <img src={photo.url} alt={name} />
      <p>{name}</p>
      <span>${price}</span>

      <div>
        <button
          onClick={() => {
            handler({
              name,
              price,
              productId,
              quantity: 1,
              photo: photo.url,
              stock,
            });
          }}
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