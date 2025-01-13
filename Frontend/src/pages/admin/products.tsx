import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/admin/Loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector((state: RootState) => state.userReducer);
  
  const { data, isError, isLoading } = useAllProductsQuery(user?._id!);

  if (isError) toast.error("Failed to fetch products");

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();
  
  useEffect(() => {
    if (data){
      setRows(data.products.map((product) => ({
        photo: <img src={product.photos[0].url} alt={product.name} />,
        name: product.name,
        price: product.price,
        stock: product.stock,
        action: <Link to={`/admin/product/${product._id}`}>Manage</Link>,
      })))
    }
  }, [data])
  

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
