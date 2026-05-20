const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Persistent storage setup
const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function loadJSON(filePath, defaultData) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
    }
    return defaultData;
}

function saveJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err);
    }
}

// Load users and orders from files
const users = loadJSON(USERS_FILE, []);
const orders = loadJSON(ORDERS_FILE, []);

// Mock products data with rich specifications and features
const products = [
    {
        id: 1,
        name: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry Leading Noise Canceling with Auto Noise Canceling Optimizer",
        longDescription: "The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE Extreme and Hi-Res audio support, these headphones provide awe-inspiring audio quality.",
        price: 398.00,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
        rating: 4.8,
        reviews: 12450,
        features: [
            "Industry-leading noise cancellation optimized automatically based on your wearing conditions and environment.",
            "Magnificent Sound, engineered to perfection with the new Integrated Processor V1.",
            "Crystal clear hands-free calling with 4 beamforming microphones and advanced audio signal processing.",
            "Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback).",
            "Ultra-comfortable, lightweight design with soft fit leather."
        ],
        specifications: {
            "Brand": "Sony",
            "Model Name": "WH1000XM5/B",
            "Color": "Black",
            "Form Factor": "Over Ear",
            "Connectivity": "Wireless, Bluetooth 5.2",
            "Battery Life": "Up to 30 Hours"
        }
    },
    {
        id: 2,
        name: "Apple Watch Series 9",
        description: "Smartwatch with Midnight Aluminum Case with Midnight Sport Band",
        longDescription: "Apple Watch Series 9 helps you stay connected, active, healthy, and safe. Featuring the S9 SiP, which enables a superbright display and a magical new way to quickly and easily interact with your Apple Watch without touching the screen.",
        price: 399.00,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
        rating: 4.7,
        reviews: 8320,
        features: [
            "S9 SiP enables a bright Always-On Retina display and double-tap gesture.",
            "Advanced health sensors track blood oxygen, ECG, sleep phases, and temperature sensing.",
            "Workout app gives you a range of ways to train plus advanced metrics.",
            "Crash Detection and Fall Detection can connect you with emergency services in the event of a hard fall or severe car crash."
        ],
        specifications: {
            "Brand": "Apple",
            "Model": "Series 9",
            "Case Size": "41mm or 45mm",
            "Display": "Always-On Retina display",
            "Connectivity": "GPS, LTE optional, Wi-Fi, Bluetooth",
            "Water Resistance": "WR50 (50 meters)"
        }
    },
    {
        id: 3,
        name: "MacBook Pro 14-inch (M3 Pro)",
        description: "Apple M3 Pro chip with 11‑core CPU, 14‑core GPU, 18GB Unified Memory, 512GB SSD Storage",
        longDescription: "The 14-inch MacBook Pro blasts forward with M3 Pro, an incredibly advanced chip that brings serious speed and capability for demanding workflows. With best-in-class battery life—up to 18 hours—and a beautiful Liquid Retina XDR display, it is a pro laptop without equal.",
        price: 1999.00,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviews: 3100,
        features: [
            "Supercharged by M3 Pro chip with an 11-core CPU and 14-core GPU.",
            "Up to 18 hours of battery life to keep you productive all day.",
            "Breathtaking Liquid Retina XDR display with Extreme Dynamic Range and 1000 nits sustained brightness.",
            "Advanced 1080p FaceTime HD camera, studio-quality three-mic array, and six-speaker sound system with Spatial Audio."
        ],
        specifications: {
            "Brand": "Apple",
            "Model": "MacBook Pro 14-inch M3 Pro",
            "Processor": "Apple M3 Pro Chip",
            "Memory": "18GB Unified Memory",
            "Storage": "512GB SSD Storage",
            "Operating System": "macOS"
        }
    },
    {
        id: 4,
        name: "Canon EOS R5 Mirrorless Camera",
        description: "45 Megapixel Full-Frame CMOS Sensor, 8K Video Recording",
        longDescription: "For the professional image-maker who needs resolution, speed, and video capabilities, the Canon EOS R5 features a newly developed 45MP CMOS sensor, which offers 8K raw video recording, 12 fps continuous shooting with a mechanical shutter, and is the first EOS camera to feature 5-axis sensor-shift image stabilization.",
        price: 3899.00,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
        rating: 4.8,
        reviews: 950,
        features: [
            "45 Megapixel Full-frame CMOS Sensor for high-resolution images.",
            "DIGIC X Image Processor with an ISO range of 100-51200.",
            "High-Speed Continuous Shooting of up to 12 fps with Mechanical Shutter and up to 20 fps with Electronic Shutter.",
            "8K RAW, 4K up to 120fps, 10-bit 4:2:2 DCI/UHD video recording.",
            "In-body Image Stabilizer provides up to 8 stops of Shake Correction."
        ],
        specifications: {
            "Brand": "Canon",
            "Model": "EOS R5",
            "Sensor Resolution": "45.0 Megapixels",
            "Sensor Type": "Full-Frame CMOS",
            "Video Capture": "8K RAW, 4K 120p",
            "Stabilization": "5-axis In-body Image Stabilization"
        }
    },
    {
        id: 5,
        name: "PlayStation 5 Console",
        description: "Experience lightning-fast loading with an ultra-high speed SSD",
        longDescription: "The PS5 console unleashes new gaming possibilities that you never anticipated. Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviews: 45210,
        features: [
            "Ultra-High Speed SSD maximizes your play sessions with near-instant load times.",
            "Integrated I/O lets creators pull data from the SSD quickly to design games in ways never before possible.",
            "Marvel at incredible graphics and experience new PS5 features.",
            "Discover a deeper gaming experience with support for haptic feedback, adaptive triggers, and 3D Audio technology."
        ],
        specifications: {
            "Brand": "Sony Interactive Entertainment",
            "Model": "PlayStation 5 Console",
            "Storage Capacity": "825GB Custom SSD",
            "Graphics": "AMD Radeon RDNA 2-based graphics engine",
            "4K Gaming": "Yes, up to 120 fps",
            "HDR Support": "Yes"
        }
    },
    {
        id: 6,
        name: "Samsung 49\" Odyssey G9 Gaming Monitor",
        description: "Dual QHD, 240Hz, 1ms, 1000R Curved Gaming Monitor",
        longDescription: "Samsung's largest 1000R curved gaming monitor matches the curve of the human eye for maximum immersion and minimal eye strain. With the screen space of two 27-inch panels, you can take command on the battlefield or multitask in breeze.",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
        rating: 4.6,
        reviews: 3200,
        features: [
            "49-inch curved screen with 32:9 aspect ratio matches the curvature of the human eye.",
            "240Hz refresh rate and 1ms response time prevent lag and motion blur.",
            "QLED technology ensures pixel perfect picture quality with every frame.",
            "G-Sync and FreeSync Premium Pro compatibility keeps your GPU and panel synced."
        ],
        specifications: {
            "Brand": "Samsung",
            "Model": "Odyssey G9",
            "Screen Size": "49 Inches",
            "Resolution": "5120 x 1440 Pixels (Dual QHD)",
            "Refresh Rate": "240Hz",
            "Response Time": "1ms (GTG)"
        }
    },
    {
        id: 7,
        name: "Apple iPad Pro 12.9-inch",
        description: "M2 chip, Liquid Retina XDR display, Wi-Fi 6E, 256GB storage",
        longDescription: "iPad Pro. With astonishing performance, superfast wireless connectivity, and next-generation Apple Pencil experience. Plus powerful productivity and collaboration features in iPadOS. iPad Pro is the ultimate iPad experience.",
        price: 1099.00,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviews: 14200,
        features: [
            "Brilliant 12.9-inch Liquid Retina XDR display with ProMotion, True Tone, and P3 wide color.",
            "M2 chip with 8-core CPU and 10-core GPU for breakthrough performance.",
            "12MP Wide camera, 10MP Ultra Wide back camera, and LiDAR Scanner for immersive AR.",
            "Stay connected with superfast Wi-Fi 6E."
        ],
        specifications: {
            "Brand": "Apple",
            "Model": "iPad Pro 12.9-inch (6th Gen)",
            "Processor": "Apple M2 Chip",
            "Storage": "256GB",
            "Display Type": "Liquid Retina XDR",
            "Weight": "1.5 lbs"
        }
    },
    {
        id: 8,
        name: "Keychron Q1 Pro Mechanical Keyboard",
        description: "QMK/VIA Wireless Custom Mechanical Keyboard",
        longDescription: "The Keychron Q1 Pro is a fully customizable mechanical keyboard with QMK/VIA support, a full aluminum body, double-gasket design, and hot-swappable switches. Designed to elevate your typing experience to the next level with ultimate comfort and luxury.",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600",
        rating: 4.7,
        reviews: 1800,
        features: [
            "Full aluminum CNC machined body designed for premium rigidity and style.",
            "Wireless Bluetooth and wired Type-C connectivity for ultimate convenience.",
            "QMK/VIA support allows you to easily program and remap each key.",
            "Double-gasket mount design provides a flexible, soft, and quiet typing feedback."
        ],
        specifications: {
            "Brand": "Keychron",
            "Model": "Q1 Pro",
            "Layout": "75% Layout",
            "Body Material": "Full CNC machined aluminum",
            "Connectivity": "Bluetooth 5.1 & Type-C wired",
            "Hot-swappable": "Yes"
        }
    }
];

// API endpoint to get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// API endpoint to get a single product
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});

// API endpoint for registration
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already exists" });
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveJSON(USERS_FILE, users);
    
    res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// API endpoint for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

// API endpoints for orders and tracking
app.post('/api/orders', (req, res) => {
    const { userEmail, userName, items, shippingAddress, paymentMethod, total } = req.body;
    
    if (!items || !items.length || !shippingAddress || !total) {
        return res.status(400).json({ error: "Invalid order data" });
    }
    
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NEX-${dateStr}-${rand}`;
    
    const newOrder = {
        id: orderId,
        userEmail: userEmail || "guest@nexshop.com",
        userName: userName || "Guest Customer",
        items,
        shippingAddress,
        paymentMethod,
        total,
        status: "Ordered",
        createdAt: new Date().toISOString(),
        statusHistory: [
            { status: "Ordered", timestamp: new Date().toISOString(), comment: "Order placed successfully." }
        ]
    };
    
    orders.push(newOrder);
    saveJSON(ORDERS_FILE, orders);
    
    res.json({ success: true, order: newOrder });
});

app.get('/api/orders', (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email query parameter required" });
    }
    const userOrders = orders.filter(o => o.userEmail === email);
    res.json(userOrders);
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
});

app.post('/api/orders/:id/cancel', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
        return res.status(400).json({ error: "Cannot cancel order that has already been shipped." });
    }
    
    order.status = "Cancelled";
    order.statusHistory.push({
        status: "Cancelled",
        timestamp: new Date().toISOString(),
        comment: "Order cancelled by customer."
    });
    
    saveJSON(ORDERS_FILE, orders);
    res.json({ success: true, order });
});

app.post('/api/orders/:id/advance', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    const statusSequence = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    const currentIndex = statusSequence.indexOf(order.status);
    
    if (currentIndex === -1) {
        return res.status(400).json({ error: "Cannot advance status of a Cancelled order" });
    }
    
    if (currentIndex === statusSequence.length - 1) {
        return res.status(400).json({ error: "Order is already Delivered" });
    }
    
    const nextStatus = statusSequence[currentIndex + 1];
    order.status = nextStatus;
    
    let comment = "";
    switch (nextStatus) {
        case "Packed":
            comment = "Your items have been packed and are ready for dispatch.";
            break;
        case "Shipped":
            comment = "In transit. Handed over to logistics partner.";
            break;
        case "Out for Delivery":
            comment = "Our delivery partner is bringing your package today.";
            break;
        case "Delivered":
            comment = "Package delivered and signed for.";
            break;
    }
    
    order.statusHistory.push({
        status: nextStatus,
        timestamp: new Date().toISOString(),
        comment
    });
    
    saveJSON(ORDERS_FILE, orders);
    res.json({ success: true, order });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});