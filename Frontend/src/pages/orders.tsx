import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../components/admin/Loader";
import TableHOC from "../components/admin/TableHOC";
import { useGetMyOrdersQuery } from "../redux/api/OrderAPI";
import { RootState } from "../redux/store";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError } = useGetMyOrdersQuery(user?._id!);

  if (isError) toast.error("Failed to fetch Orders");

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  useEffect(() => {
    if (data) {
      setRows(data.orders.map((order) => ({
        _id: order._id,
        amount: order.total,
        discount: order.discount,
        quantity: order.orderItems.length,
        status: (
          <span
            className={
              order.status === "Processing"
                ? "red"
                : order.status === "Shipped"
                  ? "green"
                  : "purple"
            }
          >
            {order.status}
          </span>
        ),
        action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
      })))
    }
  }, [data])
  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Skeleton length={20} /> :
        rows.length === 0 ? <h1>No Orders</h1> :
          Table
      }
    </div>
  );
};

export default Orders;