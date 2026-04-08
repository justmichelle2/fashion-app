# Fashion App - Firestore Database Schema Documentation

## Overview
Complete Firestore database schema for the Fashion Tailoring Marketplace platform. Includes all collections, documents, and field structures with data types and relationships.

---

## 1. USERS Collection
Stores user profiles for both customers and designers.

```firestore
users/
├── {userId}/
│   ├── email: string (unique)
│   ├── name: string
│   ├── phone: string
│   ├── role: "customer" | "designer" | "admin"
│   ├── profilePicture: string (URL)
│   ├── bio: string
│   ├── address: string
│   ├── city: string
│   ├── country: string
│   ├── active: boolean
│   ├── verified: boolean (for designers)
│   ├── rating: number (0-5) (for designers)
│   │
│   ├── Designer Fields (if role === "designer"):
│   │   ├── specialty: string (e.g., "Wedding Dresses", "AfroChic")
│   │   ├── hourlyRate: number
│   │   ├── experience: number (years)
│   │   ├── portfolio: array<string> (design image URLs)
│   │   └── verifiedAt: timestamp
│   │
│   ├── Customer Fields (if role === "customer"):
│   │   ├── preferredDesigners: array<string> (designer IDs)
│   │   └── orderHistory: array<string> (order IDs)
│   │
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   ├── deactivatedAt: timestamp (if active === false)
│   └── lastLogin: timestamp
```

### Firestore Security Rules
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

---

## 2. ORDERS Collection
Stores tailoring orders from customers to designers.

```firestore
orders/
├── {orderId}/
│   ├── customerId: string (user ID)
│   ├── designerId: string (user ID)
│   ├── designerName: string (denormalized for query efficiency)
│   ├── status: "pending" | "accepted" | "tailoring" | "completed" | "cancelled"
│   ├── description: string (what customer wants)
│   ├── measurements: {
│   │   chest: number (cm),
│   │   waist: number (cm),
│   │   hips: number (cm),
│   │   length: number (cm),
│   │   sleeves: number (cm),
│   │   notes: string
│   │ }
│   ├── price: number (GHS)
│   ├── deadlineDate: timestamp
│   ├── notes: string (additional instructions)
│   ├── review: {
│   │   rating: number (1-5),
│   │   comment: string,
│   │   createdAt: timestamp
│   │ } (optional, after completion)
│   │
│   ├── Timeline:
│   │   ├── createdAt: timestamp
│   │   ├── acceptedAt: timestamp (when designer accepts)
│   │   ├── startedAt: timestamp (when tailoring begins)
│   │   ├── completedAt: timestamp (when order is done)
│   │   └── cancelledAt: timestamp (if cancelled)
│   │
│   └── updatedAt: timestamp
```

### Queries Requiring Indexes
- `where("customerId", "==", userId) + orderBy("createdAt", "desc")`
- `where("designerId", "==", userId) + orderBy("createdAt", "desc")`
- `where("status", "==", "pending") + orderBy("createdAt", "desc")`

---

## 3. CONVERSATIONS Collection
Stores conversations between users with real-time messaging.

```firestore
conversations/
├── {conversationId}/
│   ├── conversationId: string (format: "userId1_userId2" sorted)
│   ├── participants: {
│   │   {userId1}: {
│   │       name: string,
│   │       id: string
│   │     },
│   │   {userId2}: {
│   │       name: string,
│   │       id: string
│   │     }
│   │ }
│   ├── lastMessage: string (preview)
│   ├── lastMessageTime: timestamp
│   ├── archived: boolean
│   ├── archivedAt: timestamp (if archived)
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   │
│   └── messages/ (subcollection - real-time)
│       ├── {messageId}/
│       │   ├── senderId: string
│       │   ├── senderName: string
│       │   ├── text: string
│       │   ├── attachments: array<{
│       │   │     type: "image" | "file",
│       │   │     url: string,
│       │   │     fileName: string
│       │   │   }>
│       │   ├── read: boolean
│       │   └── createdAt: timestamp
```

---

## 4. PAYMENTS Collection
Stores payment transaction records.

```firestore
payments/
├── {paymentId}/
│   ├── orderId: string (references orders collection)
│   ├── customerId: string
│   ├── designerId: string
│   ├── amount: number (GHS)
│   ├── currency: "GHS"
│   ├── status: "pending" | "completed" | "failed" | "refunded"
│   ├── paymentMethod: "card" | "wallet" | "bank_transfer"
│   ├── transactionRef: string (third-party API reference)
│   ├── cardLast4: string (last 4 digits of card)
│   ├── fee: number (platform fee)
│   ├── notes: string
│   │
│   ├── Timeline:
│   │   ├── createdAt: timestamp
│   │   ├── completedAt: timestamp
│   │   ├── refundedAt: timestamp (if refunded)
│   │   └── updatedAt: timestamp
```

---

## 5. DESIGNS Collection
Portfolio of designer work and available design templates.

```firestore
designs/
├── {designId}/
│   ├── designerId: string (user ID)
│   ├── title: string
│   ├── description: string
│   ├── category: string (e.g., "Wedding", "Casual", "Traditional")
│   ├── images: array<string> (Cloud Storage URLs)
│   ├── tags: array<string> (for search/filtering)
│   ├── price: number (starting price)
│   ├── rating: number (average rating)
│   ├── reviews: number (count of reviews)
│   ├── featured: boolean
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

---

## 6. REVIEWS Collection
Stores reviews and ratings for designers.

```firestore
reviews/
├── {reviewId}/
│   ├── designerId: string
│   ├── customerId: string
│   ├── orderId: string (references orders)
│   ├── rating: number (1-5)
│   ├── comment: string
│   ├── anonymous: boolean
│   ├── verified: boolean (from completed order)
│   ├── helpful: number (upvote count)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

---

## 7. NOTIFICATIONS Collection
Stores notification events for users.

```firestore
notifications/
├── {userId}/
│   └── events/ (subcollection)
│       ├── {notificationId}/
│       │   ├── type: "order_accepted" | "order_completed" | "message" | "review" | "payment"
│       │   ├── title: string
│       │   ├── body: string
│       │   ├── data: { orderId?, conversationId?, reviewId?, etc. }
│       │   ├── read: boolean
│       │   ├── createdAt: timestamp
│       │   └── expiresAt: timestamp (auto-delete old notifications)
```

---

## 8. ANALYTICS Collection (Optional)
Aggregated data for admin dashboard insights.

```firestore
analytics/
├── monthly_stats/ (document indexed by month)
├── {monthKey}/
│   ├── month: string (e.g., "2026-04")
│   ├── totalOrders: number
│   ├── totalRevenue: number
│   ├── newUsers: number
│   ├── activeDesigners: number
│   ├── avgOrderValue: number
│   └── topCategories: array<{ name, count }>
```

---

## CLOUD STORAGE Structure

Firebase Cloud Storage folder organization for file uploads:

```
/
├── profiles/
│   └── {userId}/
│       └── profile_picture.jpg
├── designs/
│   └── {designerId}/
│       ├── {timestamp}_design.jpg
│       ├── {timestamp}_design.jpg
│       └── ...
├── measurements/
│   └── {userId}/
│       └── {orderId}/
│           ├── {timestamp}_measurement.jpg
│           └── {timestamp}_measurement.jpg
└── chat/
    └── {conversationId}/
        └── {timestamp}_attachment.jpg
```

---

## Data Relationships & Denormalization

### Why Some Fields Are Denormalized

1. **orders.designerName** - Copied from users.name
   - Allows filtering/sorting without cross-collection joins
   - Prevents query failures if designer account is deleted

2. **orders.status** - Maintained on orders + indexed heavily
   - Enables fast dashboard queries
   - Improves pagination and filtering

3. **users.rating** - Calculated from reviews
   - Denormalized for fast loading on profile pages
   - Recalculated after each new review

### Query Optimization Strategy

| Use Case | Solution |
|----------|----------|
| Get all orders for a user | Index: `customerId, createdAt` |
| Get pending orders | Index: `status, createdAt` |
| Get designer's performance | Aggregate in adminService |
| Real-time chat | Subcollection with onSnapshot |
| Search designers | Array field + search library |

---

## Migration Notes

### To Add New Fields:
1. Update schema documentation
2. Add field to create/update functions
3. Use merge strategy to avoid overwriting data

### Deprecated Fields:
- Keep old fields for data compatibility
- Mark as unused in migrations
- Remove after 3-month deprecation period

---

## Firestore Constraints

- **Document Size Limit**: 1 MB per document
- **Collection Size**: Unlimited documents
- **Nested Subcollections**: Max 100 (usually fine)
- **Write Rate**: 1 write per second per document
- **Read Rate**: Unlimited

---

## Security Rules Template

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Orders readable by customer or designer
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.customerId 
                     || request.auth.uid == resource.data.designerId;
      allow create: if request.auth.uid == request.resource.data.customerId;
      allow update: if request.auth.uid == resource.data.customerId 
                       || request.auth.uid == resource.data.designerId;
    }

    // Conversations readable/writable by participants
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participants.keys();
      match /messages/{messageId} {
        allow create: if request.auth.uid == request.resource.data.senderId;
        allow read: if request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants.keys();
      }
    }

    // Payments only for involved users or admins
    match /payments/{paymentId} {
      allow read: if request.auth.uid == resource.data.customerId 
                     || request.auth.uid == resource.data.designerId;
    }

    // Admin collection access
    match /admin/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

