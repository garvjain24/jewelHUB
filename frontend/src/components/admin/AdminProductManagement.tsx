import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import api from '../../api';

interface Product {
  _id?: string;
  name: string;
  price: number;
  weight: number;
  category: string;
  description: string;
  imageUrl: string;
}

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    price: 0,
    weight: 0,
    category: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.admin.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await api.admin.updateProduct(editingProduct._id!, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.products.delete(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await api.admin.addProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        weight: 0,
        category: '',
        description: '',
        imageUrl: '',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-6 text-royal-header">Product Management</h2>
      
      {/* Add New Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
          />
          <input
            type="number"
            placeholder="Weight"
            value={newProduct.weight}
            onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
            rows={3}
          ></textarea>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-royal-interactive text-white px-4 py-2 rounded-md hover:bg-royal-accent-diamond transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-highlight">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Weight</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">₹{product.price}</td>
                <td className="px-4 py-2">{product.weight}g</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-royal-interactive hover:text-royal-accent-diamond mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-royal-header">Edit Product</h3>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md mb-2"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md mb-2"
            />
            <input
              type="number"
              value={editingProduct.weight}
              onChange={(e) => setEditingProduct({ ...editingProduct, weight: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md mb-2"
            />
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md mb-2"
            />
            <textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md mb-2"
              rows={3}
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingProduct(null)}
                className="mr-2 px-4 py-2 text-royal-interactive"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-royal-interactive text-white px-4 py-2 rounded-md hover:bg-royal-accent-diamond transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;