import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cart-details';

class CartDetailService {
    getAllCartDetails() {
        return axios.get(API_URL);
    }

    getCartDetailById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    createCartDetail(cartDetail) {
        return axios.post(API_URL, cartDetail);
    }

    updateCartDetail(id, cartDetail) {
        return axios.put(`${API_URL}/${id}`, cartDetail);
    }

    deleteCartDetail(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new CartDetailService();