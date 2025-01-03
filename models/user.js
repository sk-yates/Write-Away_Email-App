const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "teacher", "student"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the admin user who created this account
            required: function () {
                return this.role !== "admin"; // Not required for admin users
            },
        },
        assignedTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the teacher for student users
            required: function () {
                return this.role === "student"; // Only required for students
            },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword; // Prevent password exposure
    },
});

module.exports = mongoose.model("User", userSchema);