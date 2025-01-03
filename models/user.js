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
            ref: "User", // Reference to the teacher for student users
            validate: {
                validator: function (value) {
                    // Check if the field is required and ensure it has a value
                    return this.role !== "student" || !!value;
                },
                message: "A student must be assigned a teacher."
            },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function(next) {
    if (!this.role) {
        this.role = 'student'; // Set default role to 'student' if role isn't provided (optional)
    }
    console.log('Role in pre-save:', this.role); // Log to check the role
    next(); // Proceed with saving the document
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword; // Prevent password exposure
    },
});

// Export the model
module.exports = mongoose.model("User", userSchema);