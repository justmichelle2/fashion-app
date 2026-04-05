/**
 * User Data Models and Structure
 * Documentation of Firestore collection schemas
 */

/**
 * USERS Collection - Main user profile data
 * Path: users/{uid}
 *
 * Schema:
 * {
 *   name: string,                  // User's full name
 *   email: string,                 // Email address (from Firebase Auth)
 *   phone: string,                 // Phone number
 *   role: "Customer" | "Designer", // User account type
 *   address: string,               // Street address
 *   city: string,                  // City
 *   country: string,               // Country
 *   createdAt: Timestamp,          // Account creation timestamp
 *   updatedAt: Timestamp,          // Last profile update timestamp
 *   profileImage: string,          // URL to profile image in Firebase Storage (optional)
 *   bio: string,                   // User bio/description (optional)
 *   verified: boolean,             // Email verification status
 * }
 */

/**
 * MEASUREMENTS Collection - Customer body measurements
 * Path: measurements/{uid}
 * Subcollection of users
 *
 * Schema:
 * {
 *   busting: number,               // Chest measurement in cm
 *   waist: number,                 // Waist measurement in cm
 *   hips: number,                  // Hip measurement in cm
 *   neckSize: number,              // Neck measurement in cm
 *   shoulderWidth: number,         // Shoulder width in cm
 *   armLength: number,             // Arm length in cm
 *   wristSize: number,             // Wrist measurement in cm
 *   sleevLength: number,           // Sleeve length in cm
 *   chestLength: number,           // Chest to hemline in cm
 *   totalLength: number,           // Total body height in cm
 *   notes: string,                 // Additional measurement notes
 *   uploadedAt: Timestamp,         // When measurements were added
 *   updatedAt: Timestamp,          // Last update
 * }
 */

/**
 * DESIGNER_PROFILES Collection - Extended designer-specific data
 * Path: designer_profiles/{uid}
 * (Separate from users for scalability)
 *
 * Schema:
 * {
 *   userId: string,                // Reference to users/{uid}
 *   specialization: string,        // e.g., "Traditional", "Modern", "Wedding"
 *   yearsExperience: number,       // Years in the industry
 *   rating: number,                // Average rating (0-5)
 *   reviewCount: number,           // Number of reviews
 *   portfolio: {
 *     designs: [
 *       {
 *         id: string,
 *         title: string,
 *         description: string,
 *         image: string,           // Firebase Storage URL
 *         category: string,
 *         uploadedAt: Timestamp
 *       }
 *     ]
 *   },
 *   availability: boolean,         // Currently taking new orders
 *   hourlyRate: number,            // Pricing per hour
 *   minPrice: number,              // Minimum project price
 *   completedOrders: number,       // Total completed tailoring orders
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 */

/**
 * ORDERS Collection - Customer tailoring orders
 * Path: orders/{orderId}
 *
 * Schema:
 * {
 *   customerId: string,            // Reference to users/{uid}
 *   designerId: string,            // Reference to users/{uid}
 *   designerName: string,          // Designer's name (denormalized)
 *   status: "pending|accepted|tailoring|completed|cancelled",
 *   description: string,           // Order details/requirements
 *   images: [string],              // Firebase Storage URLs of reference images
 *   measurements: {
 *     busting: number,
 *     waist: number,
 *     hips: number,
 *     // ... other measurements as needed
 *   },
 *   price: number,                 // Quoted/agreed price
 *   deadlineDate: Timestamp,       // Expected completion date
 *   reviewSent: boolean,           // Whether customer reviewed the work
 *   review: {
 *     rating: number,              // 1-5 stars
 *     comment: string,
 *     createdAt: Timestamp
 *   },
 *   createdAt: Timestamp,
 *   acceptedAt: Timestamp,
 *   completedAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 */

/**
 * REVIEWS Collection - Ratings and reviews
 * Path: reviews/{reviewId}
 *
 * Schema:
 * {
 *   designerId: string,            // Reference to users/{uid}
 *   customerId: string,            // Reference to users/{uid}
 *   orderId: string,               // Reference to orders/{orderId}
 *   rating: number,                // 1-5 stars
 *   comment: string,               // Review text
 *   images: [string],              // Completed work images
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 */

/**
 * MESSAGES Collection - Chat messages
 * Path: messages/{conversationId}/{messageId}
 *
 * Schema:
 * {
 *   senderId: string,              // Reference to users/{uid}
 *   receiverId: string,            // Reference to users/{uid}
 *   message: string,               // Message content
 *   image: string,                 // Optional image in message
 *   read: boolean,                 // Message read status
 *   createdAt: Timestamp,
 * }
 */
