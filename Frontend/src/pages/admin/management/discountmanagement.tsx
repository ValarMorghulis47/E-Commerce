import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/admin/Loader";
import { useDeleteCouponMutation, useGetSingleCouponQuery, useUpdateCouponMutation } from "../../../redux/api/couponAPI";
import { RootState } from "../../../redux/store";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const {data, isError, isLoading} = useGetSingleCouponQuery({id:user?._id!, couponId:id!});

  if (isError) {
    toast.error("Failed to fetch the coupon");
  }

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    // submit handler
    e.preventDefault();

    setBtnLoading(true);

    try {
      const res = await updateCoupon({body:{
        code,
        amount
      }, id: user?._id!, couponId: id!})

      if (res.data?.success) {
        toast.success("Coupon Updated Successfully");
        setAmount(0);
        setCode("");
        navigate("/admin/discount");
      }
    } catch (error) {
      toast.error("Failed to update coupon")
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const res = await deleteCoupon({id:user?._id!, couponId:id!})

      if (res.data?.success) {
        toast.success(res.data?.message);
        navigate("/admin/discount");
      }
    } catch (error) {
        toast.error("Failed to delete coupon")
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article>
              <button className="product-delete-btn" disabled={btnLoading} onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;