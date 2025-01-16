import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useSingleProductQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { DeleteResponse } from "../../../types/api-types";
import { Skeleton } from "../../../components/admin/Loader";

const Productmanagement = () => {

  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleProductQuery(params.id!);

  const { name, price, stock, category, photos, _id } = data?.product || {
    name: "Product Name",
    price: 0,
    stock: 0,
    category: "Category",
    photos: [{ url: "img", public_id: "public_id", _id: "id" }],
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photo, setPhoto] = useState<string>(photos[0].url);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (photoFile) formData.append("photos", photoFile);

      if (nameUpdate) formData.append("name", nameUpdate);

      if (priceUpdate) formData.append("price", String(priceUpdate));

      if (stockUpdate !== undefined) formData.append("stock", String(stockUpdate));

      if (categoryUpdate) formData.append("category", categoryUpdate);

      const res = await updateProduct({ formData, id: user?._id!, productId: _id! });
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const res = await deleteProduct({ id: user?._id!, productId: _id! });
    if ("data" in res && res.data?.success) {
      toast.success(res.data.message);
      navigate("/admin/product");
    }
    else {
      const error = res.error as FetchBaseQueryError;
      const errorMessage = (error.data as DeleteResponse).message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setPhoto(data.product.photos[0].url);
    }
  }, [data]);

  if (isError) return navigate("/admin/product");


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {
          isLoading ? <Skeleton length={10} /> : (
            <>
              <section>
                <strong>ID - ${_id}</strong>
                <img src={photo} alt="Product" />
                <p>{name}</p>
                {stock > 0 ? (
                  <span className="green">{stock} Available</span>
                ) : (
                  <span className="red"> Not Available</span>
                )}
                <h3>${price}</h3>
              </section>
              <article>
                <button className="product-delete-btn" onClick={handleDelete}>
                  <FaTrash />
                </button>
                <form onSubmit={submitHandler}>
                  <h2>Manage</h2>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={nameUpdate}
                      onChange={(e) => setNameUpdate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={priceUpdate}
                      onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="eg. laptop, camera etc"
                      value={categoryUpdate}
                      onChange={(e) => setCategoryUpdate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Photo</label>
                    <input type="file" onChange={changeImageHandler} />
                  </div>

                  {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                  <button type="submit" disabled={loading}>Update</button>
                </form>
              </article>
            </>
          )
        }
      </main>
    </div>
  );
};

export default Productmanagement;
