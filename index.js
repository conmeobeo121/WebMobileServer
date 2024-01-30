const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/authRoutes');
const productRouter = require('./Routes/productRoutes');
const adminRouter = require('./Routes/adminRoutes');
const checkoutRouter = require('./Routes/checkoutRouter');
const userRouter = require('./Routes/userRouter');

const app = express();
require('dotenv').config();

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// auth : reguster - login - loginwithtoken - xong 2 buoc - login duoi quyen user (customer)
app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRouter);

app.use('/api/products', productRouter);

app.use('/api/checkout', checkoutRouter);

app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

mongoose.connect(URI, {})
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch(err => console.log(err));

