
import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('local_products');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Luxury Sports Car", price: 250000, category: "Car", image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500" },
      { id: 2, name: "Gaming Laptop", price: 1299, category: "Computer", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500" },
      { id: 3, name: "Organic Red Apples", price: 4.50, category: "Fruit", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500" }
    ];
  });

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    { id: "ORD-9932", customer: "John Doe", total: 251299, status: "Completed", date: "2026-05-15" }
  ]);

  // NEW STATE: Search Term Input Tracker
  const [searchTerm, setSearchTerm] = useState('');

  const [khqrImage, setKhqrImage] = useState(() => {
    return localStorage.getItem('admin_khqr') || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PleaseSetYourQRInAdmin";
  });

  useEffect(() => {
    localStorage.setItem('local_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('admin_khqr', khqrImage);
  }, [khqrImage]);

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now(), price: Number(product.price) }]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: "Bakong Mobile Client",
      total: totalAmount,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    alert("🇰🇭 KHQR Order request saved successfully! View details inside Admin Panel.");
  };

  return (
    <ShopContext.Provider value={{ 
      products, cart, orders, khqrImage, setKhqrImage, 
      addProduct, deleteProduct, addToCart, removeFromCart, 
      updateQuantity, checkout,
      searchTerm, setSearchTerm // Exported search states
    }}>
      {children}
    </ShopContext.Provider>
  );
};









///////////White mysql

// import React, { createContext, useState, useEffect } from 'react';

// export const ShopContext = createContext();

// export const ShopProvider = ({ children }) => {
//   // 1. Initialize products as an empty array (it will load from database on mount)
//   const [products, setProducts] = useState([]);

//   const [cart, setCart] = useState([]);
//   const [orders, setOrders] = useState([
//     { id: "ORD-9932", customer: "John Doe", total: 251299, status: "Completed", date: "2026-05-15" }
//   ]);

//   // NEW STATE: Search Term Input Tracker
//   const [searchTerm, setSearchTerm] = useState('');

//   const [khqrImage, setKhqrImage] = useState(() => {
//     return localStorage.getItem('admin_khqr') || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PleaseSetYourQRInAdmin";
//   });

//   // 2. NEW EFFECT: Load products dynamically from the Node.js database API on startup
//   useEffect(() => {
//     fetch('http://localhost:5000/api/products')
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to load database entries");
//         return res.json();
//       })
//       .then(data => setProducts(data))
//       .catch(err => console.error("Database fetch warning:", err));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('admin_khqr', khqrImage);
//   }, [khqrImage]);

//   // 3. UPDATED: Sends new entries to Express + MySQL server
//   const addProduct = async (product) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(product),
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         // Appends the server-saved product block containing its real auto-increment MySQL ID
//         setProducts(prevProducts => [data.product, ...prevProducts]);
//       } else {
//         alert("Error from server: " + data.error);
//       }
//     } catch (err) {
//       console.error("Failed to post product to database:", err);
//       alert("Could not reach backend API server.");
//     }
//   };

//   // 4. UPDATED: Deletes rows out of your database system by structural index IDs
//   const deleteProduct = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
//       } else {
//         const data = await response.json();
//         alert("Error deleting entry: " + data.message);
//       }
//     } catch (err) {
//       console.error("Failed to delete item from database:", err);
//       alert("Could not reach backend API server.");
//     }
//   };

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const existing = prev.find(item => item.id === product.id);
//       if (existing) {
//         return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(cart.filter(item => item.id !== id));
//   };

//   const updateQuantity = (id, amount) => {
//     setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
//   };

//   const checkout = () => {
//     if (cart.length === 0) return;
//     const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const newOrder = {
//       id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
//       customer: "Bakong Mobile Client",
//       total: totalAmount,
//       status: "Pending",
//       date: new Date().toISOString().split('T')[0]
//     };
//     setOrders([newOrder, ...orders]);
//     setCart([]);
//     alert("🇰🇭 KHQR Order request saved successfully! View details inside Admin Panel.");
//   };

//   return (
//     <ShopContext.Provider value={{ 
//       products, cart, orders, khqrImage, setKhqrImage, 
//       addProduct, deleteProduct, addToCart, removeFromCart, 
//       updateQuantity, checkout,
//       searchTerm, setSearchTerm // Exported search states
//     }}>
//       {children}
//     </ShopContext.Provider>
//   );
// };


