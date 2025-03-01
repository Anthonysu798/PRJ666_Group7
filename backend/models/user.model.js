import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Using bcryptjs to hash passwords

// Define the user schema and the timestamps for the createdAt and updatedAt fields
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Only require password if googleId is not present
        required: function() {
            return !this.googleId;
        }
    },
    name: { // This will be used like Welcome, Anthony! in the Dashboard
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg", // Replace with your default avatar URL
    },
    googleId: {
        type: String, // To store the Google user ID
        unique: true, // Ensures that each user has a unique Google ID
        sparse: true, // Allows null values while enforcing uniqueness
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ["basic-user", "standard-user", "premium-user", "admin"],
        default: "basic-user",
    },
    subscription: {
        plan: {
            type: String,
            enum: ["basic", "standard", "premium"],
            default: "basic"
        },
        status: {
            type: String,
            enum: ["active", "inactive", "incomplete", "incomplete_expired", "past_due", "canceled", "unpaid", "trialing"],
            default: "inactive"
        },
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        currentPeriodEnd: Date,
        canceledAt: Date
    },
    
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // User profile information fields
    fullName: { type: String, default: null},
    height: { type: Number, default: null},
    weight: { type: Number, default: null},
    contactNumber: { type: String, default: null},
    location: { type: String, default: null},
    trainingExperience: { type: String, default: null},
    allergies: { type: [String], default: []},
    proteinPreference: { type: [String], default: []},

    // User progress fields
    calories: { type: Number, default: 0},
    protein: { type: Number, default: 0},
    water: { type: Number, default: 0},
    workoutsCompleted: { type: Number, default: 0},
    streak: { type: Number, default: 0},
    points: { type: Number, default: 0},
    restDays: { type: Number, default: 0},
    lastWorkoutTime: {
        type: String,
        default: null
    },
    lastWorkoutDate: {
        type: String,
        default: null
    },
    // Weekly workout Date
    weeklyWorkouts: {
        type: [{ 
            workoutType: String, 
            duration: Number 
        }],
        default: []
    }
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Export the user model
export const User = mongoose.model("User", userSchema);
