import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Skeleton } from "../../components/admin/Loader";
import TableHOC from "../../components/admin/TableHOC";
import { useDeleteUserMutation, useGetAllUserQuery } from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError } = useGetAllUserQuery(user?._id!);
  const [deleteUser] = useDeleteUserMutation();

  if (isError) toast.error("Failed to fetch users");

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  const deleteHandler = async(id: string) => {
    try {
      console.log(id);
      
      const res = await deleteUser(id);
      if (res.data?.success){
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (data) {
      setRows(data.users.map((user) => ({
        avatar: (
          <img
            // style={{
            //   borderRadius: "50%",
            // }}
            src={user.photo}
            alt={user.name}
          />
        ),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        action: (
          <button onClick={() => deleteHandler(user._id)}>
            <FaTrash />
          </button>
        ),
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

export default Customers;
