const mongoose = require('mongoose');

// Define the user schema
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
            ref: "User",    // Reference to the teacher for student users
            required: function () {
                return this.role === "student"; // Only required for students
            },
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to ensure role is set before validation
userSchema.pre('save', function(next) {
    if (!this.role) {
        this.role = 'student'; // Set default role to 'student' if role isn't provided (optional)
    }
    console.log('Role in pre-save:', this.role); // Log to check the role
    next(); // Proceed with saving the document
});

// Prevent exposing hashedPassword when returning the user data
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword; // Prevent password exposure
    },
});

// Export the model
module.exports = mongoose.model("User", userSchema);