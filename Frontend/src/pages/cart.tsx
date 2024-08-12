import { useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItemComponent from "../components/cart-item";

const subtotal = 20;
const shippingCharges = 10;
const tax = subtotal * 0.18;
const discount = 5;
const total = subtotal + shippingCharges + tax - discount;
const cartItems = [
  {
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-MobxmJY2OXoz8iUZ_cnyaqbms0g2ye4MAw&s",
    productId: 1,
    name: "Product 1",
    price: 10,
    quantity: 2,
  },
  {
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-MobxmJY2OXoz8iUZ_cnyaqbms0g2ye4MAw&s",
    productId: 2,
    name: "Product 2",
    price: 10,
    quantity: 2,
  },
  {
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-MobxmJY2OXoz8iUZ_cnyaqbms0g2ye4MAw&s",
    productId: 3,
    name: "Product 3",
    price: 10,
    quantity: 2,
  },
];

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <CartItemComponent key={cartItem.productId} cartItem={cartItem} />
          ))
        ): (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ${subtotal}</p>
        <p>Shipping Charges: ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>
          Discount: <em className="red"> - ${discount}</em>
        </p>
        <p>
          <b>Total: ${total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;