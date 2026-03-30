import { createContext, useContext, useState, useEffect } from 'react';
import { getCart as getCartApi, addToCart as addToCartApi, updateCartItem as updateCartItemApi, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchCart();
        else setCart({ items: [], totalAmount: 0 });
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await getCartApi();
            setCart(res.data.data);
        } catch (e) {
            console.error('Cart fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (args, q) => {
        // Support both object {productId, quantity} and positional productId, quantity
        const productId = args?.productId !== undefined ? args.productId : args;
        const quantity = args?.quantity !== undefined ? args.quantity : (q || 1);
        const res = await addToCartApi({ productId, quantity });
        setCart(res.data.data);
    };

    const updateQuantity = async (cartItemId, quantity) => {
        const res = await updateCartItemApi(cartItemId, quantity);
        setCart(res.data.data);
    };

    const removeFromCart = async (cartItemId) => {
        const res = await removeFromCartApi(cartItemId);
        setCart(res.data.data);
    };

    const clearCart = async () => {
        await clearCartApi();
        setCart({ items: [], totalAmount: 0 });
    };

    const cartItems = cart?.items || [];
    const cartTotal = cart?.totalAmount || 0;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            cartItems,
            cartTotal,
            itemCount,
            loading,
            fetchCart,
            loadCart: fetchCart, // Alias
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
