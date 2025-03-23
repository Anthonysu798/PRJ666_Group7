export const WORKOUT_IMAGES = {
    // Strength Training Images
    strength: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
        "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"
    ],

    // Cardio Images
    cardio: [
        "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e",
        "https://images.unsplash.com/photo-1486218119243-13883505764c"
    ],

    // HIIT Images
    hiit: [
        "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3",
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a",
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a"
    ],

    // Endurance Images
    endurance: [
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5"
    ],

    // Flexibility Images
    flexibility: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b",
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
        "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539"
    ],

    // CrossFit Images
    crossfit: [
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5",
        "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408",
        "https://images.unsplash.com/photo-1526401485004-46910ecc8e51",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2"
    ],

    // Default/Fallback Images
    default: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
    ]
};

// Helper function to get random image for a category
export const getRandomWorkoutImage = (category = 'default') => {
    const images = WORKOUT_IMAGES[category.toLowerCase()] || WORKOUT_IMAGES.default;
    return images[Math.floor(Math.random() * images.length)];
}; 