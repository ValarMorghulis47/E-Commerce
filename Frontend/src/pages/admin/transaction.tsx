import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Skeleton } from "../../components/admin/Loader";
import TableHOC from "../../components/admin/TableHOC";
import { useGetAllOrdersQuery } from "../../redux/api/OrderAPI";
import { RootState } from "../../redux/store";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Name",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError } = useGetAllOrdersQuery(user?._id!);

  if (isError) toast.error("Failed to fetch Orders");

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  useEffect(() => {
    if (data) {
      setRows(data.orders.map((order) => ({
        user: order.user.name,
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
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Transaction;
