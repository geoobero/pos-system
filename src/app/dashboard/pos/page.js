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

export default function POSPage() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset transaction to start a new sale
    const startNewSale = () => {
        setTransaction(null);
    };


    useEffect(() => {
        async function testCategories() {
            const { data, error } = await getCategories();
            console.log("CATEGORIES:", data);
            console.log("ERROR:", error);
        }

        testCategories();
    }, []);


    // Load products on mount
    useEffect(() => {
        async function loadProducts() {
            const { data, error } = await getProducts();
            if (error) {
                console.error("PRODUCT ERROR:", error);
                return;
            }
            console.log("PRODUCTS:", data);
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
            const { data, error } = await createTransaction({
                items: cartItems,
                total,
                cash,
                change,
                cashier: "Admin",
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
                cashier: "Admin",
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
        <div className="flex flex-col gap-6">
            <BarcodeInput onScan={handleScan} />

            <div className="grid grid-cols-2 gap-6">
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
