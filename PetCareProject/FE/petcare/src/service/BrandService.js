import axios from 'axios';

const API_URL = 'http://localhost:8080/api/brands'; // Adjust as necessary

const BrandService = {
    getAllBrands: () => axios.get(API_URL),
    createBrand: (brand) => axios.post(API_URL, brand),
    updateBrand: (brand_id, brand) => axios.put(`${API_URL}/${brand_id}`, brand),
    deleteBrand: (brand_id) => axios.delete(`${API_URL}/${brand_id}`)
};

export default BrandService;
