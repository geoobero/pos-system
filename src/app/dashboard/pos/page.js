"use client";

import { useState, useEffect } from "react";
import BarcodeInput from "@/components/pos/barcodeInput";
import Cart from "@/components/pos/cart";
import Payment from "@/components/pos/payment";
import Receipt from "@/components/pos/receipt";
import { getProducts } from "@/lib/supabase/products";
import { createTransaction } from "@/lib/supabase/transactions";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";
import { getCategories } from "@/lib/supabase/categories";
import { useAuth } from "@/contexts/authContext";

export default function POSPage() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user } = useAuth();

    // Reset transaction to start a new sale
    const startNewSale = () => {
        setTransaction(null);
    };


    useEffect(() => {
        async function loadProducts() {
            const { data, error } = await getProducts();
            if (error) {
                setError(error.message);
                return;
            }
            setProducts(data);
        }

        loadProducts();
    }, []);



    // Add product to cart by barcode
    const handleScan = (barcode) => {
        const product = products.find((p) => p.barcode === barcode);
        if (!product) {
            alert("Product not found!");
            return;
        }

        setCartItems((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Cart handlers
    const increaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Confirm payment
    const handleConfirmPayment = async ({ total, cash, change }) => {
        try {
            setLoading(true);
            const cashierName = user?.name || user?.email || "Unknown";
            
            // Extract product names and categories from cart items
            const productNames = cartItems.map(item => item.name);
            const categories = cartItems.map(item => item.category_name || item.category || "Unknown");
            
            const { data, error } = await createTransaction({
                items: cartItems,
                total,
                cash,
                change,
                cashier: cashierName,
                product_names: productNames.join(", "),
                categories: categories.join(", "),
            });

            if (error) {
                alert(error.message);
                return;
            }

            setTransaction({
                items: cartItems,
                total,
                cash,
                change,
                cashier: cashierName,
                date: new Date().toISOString(),
            });

            // Clear cart
            setCartItems([]);
        } catch (err) {
            alert("Transaction failed!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className="flex flex-col gap-4 md:gap-6 lg:mt-0 mt-15">
            <BarcodeInput onScan={handleScan} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Cart
                    initialItems={cartItems}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeItem}
                />
                <Payment
                    total={cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                    onConfirm={handleConfirmPayment}
                />
            </div>

            {transaction && (
                <Receipt
                    transaction={transaction}
                    onNewSale={startNewSale}
                />
            )}

        </div>
    );
}
