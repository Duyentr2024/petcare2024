import React, { useState, useEffect } from 'react';
import BrandService from '../../service/BrandService';

const ManageBrand = () => {
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState({ brand_id: '', brand_name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await BrandService.getAllBrands();
            console.log('Fetched brands:', response.data);
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setError('Failed to load brands. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateBrand = async () => {
        if (!brand.brand_name.trim()) {
            setError('Brand name is required.');
            return;
        }

        setError(null);
        try {
            if (brand.brand_id) {
                await BrandService.updateBrand(brand.brand_id, brand);
            } else {
                await BrandService.createBrand(brand);
            }
            setBrand({ brand_id: '', brand_name: '' });
            fetchBrands();
        } catch (error) {
            console.error('Error saving brand:', error);
            setError('Failed to save the brand. Please try again.');
        }
    };

    const handleDeleteBrand = async (brand_id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await BrandService.deleteBrand(brand_id);
                fetchBrands();
            } catch (error) {
                console.error('Error deleting brand:', error);
                setError('Failed to delete the brand. Please try again.');
            }
        }
    };

    const handleEditBrand = (brand) => {
        setBrand(brand);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Manage Brands</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    {brand.brand_id ? 'Update Brand' : 'Add New Brand'}
                </h3>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        value={brand.brand_name}
                        onChange={(e) => setBrand({ ...brand, brand_name: e.target.value })}
                        placeholder="Enter brand name"
                    />
                    <button
                        onClick={handleCreateOrUpdateBrand}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {brand.brand_id ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-center">Loading brands...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        No brands available
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.brand_id} className="border-t hover:bg-gray-100">
                                        <td className="py-3 px-6">{brand.brand_id}</td>
                                        <td className="py-3 px-6">{brand.brand_name}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => handleEditBrand(brand)}
                                                className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBrand(brand.brand_id)}
                                                className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBrand;
