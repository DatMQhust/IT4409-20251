const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Kết nối MongoDB với username là MSSV, password là MSSV, dbname là it4409
mongoose
 .connect(process.env.MONGO_URI)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.error("MongoDB Error:", err));
// TODO: Tạo Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên không được để trống'],
        minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    age: {
        type: Number,
        required: [true, 'Tuổi không được để trống'],
        min: [0, 'Tuổi phải >= 0']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email không được để trống'],
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    address: {
        type: String
    }
});
const User = mongoose.model("User", UserSchema);

// TODO: Implement API endpoints
app.get("/api/users", async (req, res) => { 
    try {
        // Lấy query params
        const page = parseInt(req.query.page) || 1;
        if(page < 0) {
            return res.status(400).json({ error: "Số trang phải là số nguyên dương" });
        }
        const limit = parseInt(req.query.limit) || 5;
        if (limit < 0 || limit > 100) {
            return res.status(400).json({ error: "Giới hạn phải là số nguyên dương và <= 100" });
        }
        const search = req.query.search || "";
        // Tạo query filter cho search
        const filter = search
        ? {
            $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } }
            ]
        }
        : {};
        // Tính skip
        const skip = (page - 1) * limit;
        // Query database
        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(limit),
            User.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(total / limit);
        // Trả về response
        res.json({
            page,
            limit,
            total,
            totalPages,
            data: users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/users", async (req, res) => {
    try {
        const { name, age, email, address } = req.body;
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email đã tồn tại" });
        }
        // Tạo user mới
        const newUser = await User.create({ name, age, email, address });
        res.status(201).json({
            message: "Tạo người dùng thành công",
            data: newUser
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.put("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, email, address } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (age !== undefined) updateData.age = age;
        if (email) updateData.email = email;
        if (address) updateData.address = address;
        // Kiểm tra email có bị trùng không
        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: id } });
            if (existingEmail) {
                return res.status(400).json({ error: "Email đã tồn tại" });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "Không tìm thấy người dùng" });
        }
        res.json({
            message: "Cập nhật người dùng thành công",
            data: updatedUser
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "Không tìm thấy người dùng" });
        }
        res.json({ message: "Xóa người dùng thành công" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});