import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronLeft, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductAddView = ({ setActiveSection }) => {
  const [products, setProducts] = useState([
    {
      name: "",
      sku_code: "",
      hsn_sac_code: "",
      barcode: "",
      purchase_price: "",
      purchase_gst: "",
      retail_price: "",
      wholesale_price: "",
      unit_of_measurement: "",
      discount: "",
      gst_rate: "",
      stock_quantity: "",
      re_order_level: "",
      category: "",
      searchQuery: '',
      filteredProducts: [],
      isDropdownVisible: false,
      highlightedIndex: -1,
    },
  ]);

  const [categories, setCategories] = useState([]);
  const [isNewProduct, setIsNewProduct] = useState(true);

  const unitOptions = [
    "pcs", "nos", "kg", "g", "ton", "litre", "ml", "m", "cm", "inch", "session", "package"
  ];

  const gstOptions = [
    "0", "1.5", "3", "5", "6", "7.5", "12", "18", "28", "40", "Nil rated", "exempt", "non-gst"
  ];

  const inputRef = useRef(null); // Reference for the input field

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch products with search query
  const fetchProducts = async (searchQuery, index) => {
    if (searchQuery.length > 2 || searchQuery.length === 0) {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/?search=${searchQuery}`);
        const allProducts = response.data;

        // If there's a searchQuery, filter products
        let filteredProducts = allProducts;
        if (searchQuery.length > 0) {
          filteredProducts = allProducts.filter(product => {
            const query = searchQuery.toLowerCase();
            return (
              product.name.toLowerCase().includes(query) ||
              product.sku_code.toLowerCase().includes(query) ||
              product.hsn_sac_code.toLowerCase().includes(query)
            );
          });
        }
        // Sort filtered products, prioritize exact matches at the top
        filteredProducts.sort((a, b) => {
          const matchA = (a.name.toLowerCase() === searchQuery.toLowerCase()) ||
            (a.sku_code.toLowerCase() === searchQuery.toLowerCase()) ||
            (a.hsn_sac_code.toLowerCase() === searchQuery.toLowerCase());
          const matchB = (b.name.toLowerCase() === searchQuery.toLowerCase()) ||
            (b.sku_code.toLowerCase() === searchQuery.toLowerCase()) ||
            (b.hsn_sac_code.toLowerCase() === searchQuery.toLowerCase());

          if (matchA && !matchB) return -1;
          if (!matchA && matchB) return 1;
          return 0;
        });

        // Update the filtered products list for the current row
        const updatedItems = [...products];
        updatedItems[index].filteredProducts = filteredProducts;
        setProducts(updatedItems);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const inputRefs = useRef([]); // Array of refs for each row's input field

  // Handle product selection from the dropdown
  const handleProductSelect = (product, index) => {
    const updatedItems = [...products];
    updatedItems[index] = {
      ...updatedItems[index],
      product: product.id,
      name: product.name,
      sku_code: product.sku_code,
      barcode: product.barcode,
      purchase_price: product.purchase_price,
      purchase_gst: product.purchase_gst,
      retail_price: product.retail_price,
      wholesale_price: product.wholesale_price,
      unit_of_measurement: product.unit_of_measurement,
      hsn_sac_code: product.hsn_sac_code,
      gst_rate: product.gst_rate,
      stock_quantity: product.stock_quantity,
      re_order_level: product.re_order_level,
      discount: product.discount,
      category: product.category,
      searchQuery: product.name, // Set the product name in searchQuery
      isDropdownVisible: false, // Hide dropdown after selection
    };

    // Ensure the selected product has an 'id' to perform a PUT request
    if (product.id) {
      console.log("productID:", product.id)
      updatedItems[index].id = product.id; // Add the id field explicitly
    }

    console.log('product Select', updatedItems)

    setProducts(updatedItems);
  };

  // Handle input change for each row
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;

    // If searchQuery is being edited, ensure default values for name, gst_rate, and unit_of_measurement
    if (name === 'searchQuery') {
      updatedProducts[index].isDropdownVisible = true;  // Show dropdown on search
      if (!updatedProducts[index].product) {
        // Update the name field with searchQuery
        updatedProducts[index].name = value;

        // Set default values if no product is selected yet
        updatedProducts[index].gst_rate = '0'; // Default GST rate (adjust as needed)
        updatedProducts[index].unit_of_measurement = 'pcs'; // Default UOM (adjust as needed)
      }
    }

    setProducts(updatedProducts);
  };

  // Handle dropdown visibility on click outside
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      const updatedProducts = [...products];
      updatedProducts.forEach((product, index) => {
        if (product.isDropdownVisible) {
          updatedProducts[index].isDropdownVisible = false;
        }
      });
      setProducts(updatedProducts);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [products]);

  // Add new product row
  const addProductRow = (e) => {
    e.preventDefault();
    const newProduct = {
      name: "",
      sku_code: "",
      hsn_sac_code: "",
      barcode: "",
      purchase_price: "",
      purchase_gst: "",
      retail_price: "",
      wholesale_price: "",
      unit_of_measurement: "",
      discount: "",
      gst_rate: "",
      stock_quantity: "",
      re_order_level: "",
      category: "",
      searchQuery: '', // Added per row search query
      filteredProducts: [], // Added per row filtered products
      isDropdownVisible: false, // Added per row to control dropdown visibility
      highlightedIndex: -1,
    };
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct];
      return updatedProducts;
    });

    // Focus the "Name" field of the newly added row
    setTimeout(() => {
      const newIndex = products.length; // The newly added row is at the last index
      if (inputRefs.current[newIndex]) {
        inputRefs.current[newIndex].focus();
      }
    }, 100); // Use timeout to ensure the new row is added before focusing
  };


  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e, index) => {
    const updatedItems = [...products];
    if (e.key === "ArrowDown") {
      let highlightedIndex = updatedItems[index].highlightedIndex;
      if (highlightedIndex < updatedItems[index].filteredProducts.length - 1) {
        highlightedIndex++;
        inputRefs.current[index + 1]?.focus();
      }
      updatedItems[index].highlightedIndex = highlightedIndex;
      setProducts(updatedItems);
    } else if (e.key === "ArrowUp") {
      let highlightedIndex = updatedItems[index].highlightedIndex;
      if (highlightedIndex > 0) {
        highlightedIndex--;
      }
      updatedItems[index].highlightedIndex = highlightedIndex;
      setProducts(updatedItems);
    } else if (e.key === "Enter" && updatedItems[index].highlightedIndex !== -1) {
      const selectedProduct = updatedItems[index].filteredProducts[updatedItems[index].highlightedIndex];
      handleProductSelect(selectedProduct, index);
    }
  };


  // Remove product row
  const removeProductRow = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const saveProducts = async (e) => {
    e.preventDefault();

    // Validate that required fields are filled
    for (let product of products) {
      if (!product.name || !product.sku_code || !product.purchase_price) {
        toast.error("Please fill all the required fields.");
        return;
      }
    }

    try {
      for (let product of products) {
        if (product.id) {
          // If the product has an id, update the existing product (PUT request)
          await axios.put(`http://localhost:8000/api/products/${product.id}/`, product);
        } else {
          // If the product doesn't have an id, create a new product (POST request)
          await axios.post("http://localhost:8000/api/products/", product);
        }
      }
      toast.success("Products saved successfully!");
      setActiveSection("product-view");
    } catch (error) {
      console.error("Error saving products:", error.response?.data || error);

      // Handle specific validation errors from the backend
      if (error.response?.data?.sku_code) {
        toast.error("Product with this SKU code already exists.");
      } else if (error.response?.data?.name) {
        toast.error("Product name cannot be empty.");
      } else {
        toast.error("Failed to save products.");
      }
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
        <div className="flex items-center">
          <button
            onClick={() => setActiveSection("product-view")}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
          >
            <ChevronLeft className="text-white" />
          </button>
          <h1
            className="text-2xl font-semibold text-blue-700 p-1"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            New Products
          </h1>
        </div>
        <div
          onClick={saveProducts}
          className="flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          <Save className="w-5 h-5" />
          <span>Save Products</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md m-2 p-2">
        <form>
          {/* Table */}
          <table className="w-full bg-white rounded-md border border-gray-400">
            <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-400">
              <tr>
                <th className="p-1 w-40 text-center">Name</th>
                <th className="p-1 text-center">SKU</th>
                <th className="p-1 text-center">HSN</th>
                <th className="p-1 text-center">Barcode</th>
                <th className="p-1 text-center">Purchase Price</th>
                <th className="p-1 w-5 text-center">Purchase GST</th>
                <th className="p-1 text-center">Retail Price</th>
                <th className="p-1 text-center">Wholesale Price</th>
                <th className="p-1 w-20 text-center">UOM</th>
                <th className="p-1 w-20 text-center">Discount</th>
                <th className="p-1 w-15 text-center">GST</th>
                <th className="p-1 text-center">Stock</th>
                <th className="p-1 w-15 text-center">Reorder</th>
                <th className="p-1 w-25 text-center">Category</th>
                <th className="p-1 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-all duration-300 border-b"
                >
                  {/* Name Field (with Search Dropdown) */}
                  <td className="p-1 text-center text-sm relative">
                    <input
                      type="text"
                      name="searchQuery"
                      value={product.searchQuery}
                      onChange={(e) => {
                        handleInputChange(index, e);
                        fetchProducts(e.target.value, index);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Search product"
                    />
                    {/* Search Dropdown */}
                    {product.filteredProducts.length > 0 && product.isDropdownVisible && (
                      <div className="absolute bg-white border border-gray-300 mt-1 w-full z-10">
                        {product.filteredProducts.map((result, idx) => (
                          <div
                            key={result.id}
                            className={`p-2 cursor-pointer ${idx === product.highlightedIndex ? 'bg-gray-200' : ''}`}
                            onClick={() => handleProductSelect(result, index)}
                          >
                            {result.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* SKU Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="text"
                      name="sku_code"
                      value={product.sku_code}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter SKU"
                    />
                  </td>

                  {/* HSN Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="text"
                      name="hsn_sac_code"
                      value={product.hsn_sac_code}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter HSN"
                    />
                  </td>

                  {/* Barcode Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="text"
                      name="barcode"
                      value={product.barcode}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Barcode"
                    />
                  </td>

                  {/* Purchase Price Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="purchase_price"
                      value={product.purchase_price}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Purchase Price"
                    />
                  </td>

                  {/* Purchase GST Field */}
                  <td className="p-1 text-center text-sm">
                    <select
                      name="purchase_gst"
                      value={product.purchase_gst}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                    >
                      {gstOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Retail Price Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="retail_price"
                      value={product.retail_price}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Retail Price"
                    />
                  </td>

                  {/* Wholesale Price Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="wholesale_price"
                      value={product.wholesale_price}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Wholesale Price"
                    />
                  </td>

                  {/* UOM Field */}
                  <td className="p-1 text-center text-sm">
                    <select
                      name="unit_of_measurement"
                      value={product.unit_of_measurement}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                    >
                      {unitOptions.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Discount Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="discount"
                      value={product.discount}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Discount"
                    />
                  </td>

                  {/* GST Rate Field */}
                  <td className="p-1 text-center text-sm">
                    <select
                      name="gst_rate"
                      value={product.gst_rate}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                    >
                      {gstOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Stock Quantity Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="stock_quantity"
                      value={product.stock_quantity}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Stock Quantity"
                    />
                  </td>

                  {/* Reorder Level Field */}
                  <td className="p-1 text-center text-sm">
                    <input
                      type="number"
                      name="re_order_level"
                      value={product.re_order_level}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      placeholder="Enter Reorder Level"
                    />
                  </td>

                  {/* Category Field */}
                  <td className="p-1 text-center text-sm">
                    <select
                      name="category"
                      value={product.category}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border p-1 border-gray-400 w-full text-gray-800"
                      onKeyDown={(e) => handleKeyDown(e, index, 'category')} // Arrow key handler

                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions (Remove Button) */}
                  <td className="p-1 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => removeProductRow(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons */}
          <div className="flex justify-end mt-6">
            <button
              onClick={addProductRow}
              className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
            >
              Add Row
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAddView;
