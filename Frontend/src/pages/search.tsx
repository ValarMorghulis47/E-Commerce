import { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
import { useGetCategoriesQuery, useGetSearchProductsQuery } from "../redux/api/productAPI";
import { Skeleton } from "../components/admin/Loader";

const Search = () => {

  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useGetCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError, } = useGetSearchProductsQuery({ search, price: maxPrice, category, sort, page });

  const addToCartHandler = () => {
    toast.success("Added to cart");
  };

  if (categoryError) {
    toast.error("Failed to fetch categories");
  };

  if (productIsError) {
    toast.error("Failed to fetch products");
  };
  if (searchedData) {
    console.log(searchedData.products);
    
  }

  const isPrevPage = page > 1;
  const isNextPage = page < searchedData?.totalPages!;
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {

              categoryLoading ? <Skeleton length={5} /> :
                categoryData?.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {
          !productError && productLoading ? <Skeleton length={5} /> : (
            searchedData?.products.map((product) => (
              <div className="search-product-list">
                <ProductCard
                  productId={product._id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  handler={addToCartHandler}
                  photo={product.photos[0]}
                />
              </div>
            ))
          )
        }

        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            {page} of {searchedData?.totalPages}
          </span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;