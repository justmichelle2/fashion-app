# Emma Bee Clothing - Mobile App

A Ghana-based platform connecting customers with custom fashion designers and tailors.

## Features

### Customer Features
- **Upload Body Measurements**: Store chest, waist, hips, shoulder, wrist, and height measurements
- **Browse Designers**: View designer profiles with ratings, locations, and specialties
- **Book Tailoring Services**: Select styles, dates, and add special requirements
- **In-App Chat**: Message designers directly with image sharing support
- **Order Tracking**: Track order status (Pending → Sewing → Ready → Delivered)
- **Payments**: Secure payments via Paystack (card) or MTN Mobile Money
- **Profile Management**: View order history, saved measurements, and favorite designers

### Designer Features
- **Designer Dashboard**: Manage incoming and active orders
- **Portfolio Management**: Upload and showcase design work
- **Order Management**: Accept/reject orders and update status
- **Earnings Overview**: Track weekly and monthly earnings
- **Chat with Customers**: Direct messaging for design consultations

### Admin Features
- **Admin Dashboard**: Platform overview with key metrics
- **Designer Approvals**: Review and approve new designer applications
- **Transaction Monitoring**: View and manage all platform transactions
- **VIP Management**: Manage VIP designer status and benefits
- **Platform Settings**: Configure commission rates and platform settings

## Branding

### Logo
Stylized friendly bee with:
- Body/wings formed by coiled measuring tape
- Needle as stinger
- Flowing thread for wings/antennae/stripes
- Minimalist vector design

### Colors
- **Primary Gold**: #EAB308 (CTAs, accents, bee theme)
- **Secondary Teal**: #006D5B (headers, success states)
- **Accent Orange**: #F97316 (notifications, gradients)
- **Background Cream**: #FDFDFD
- **Text Dark**: #111827
- **Text Medium**: #4B5563
- **Success**: #10B981
- **Error**: #EF4444

### Typography
- Inter/SF Pro for clean, professional look
- Headings: 20-32px, bold
- Body: 14-16px, regular

## Navigation

### Bottom Tab Bar (Main Navigation)
- **Home**: Featured styles, quick actions, browse categories
- **Designers**: Browse and filter designer list
- **Orders**: Track active and completed orders
- **Chat**: Message inbox and conversations
- **Profile**: Account settings, measurements, order history

### Routes
- `/` - Splash screen
- `/login` - Sign in
- `/signup` - Create account
- `/home` - Customer home screen
- `/designers` - Designer listing
- `/designer/:id` - Designer profile details
- `/measurements` - Upload/edit measurements
- `/book/:designerId` - Book tailoring service
- `/payment` - Payment processing
- `/orders` - Order tracking
- `/chat` - Chat inbox
- `/chat/:id` - Conversation view
- `/profile` - Customer profile
- `/designer-dashboard` - Designer dashboard
- `/admin` - Admin dashboard

## Design Principles

1. **Mobile-First**: Optimized for iPhone 14/15 Pro portrait (393x852px)
2. **Medium Fidelity**: Clean wireframes with realistic spacing and states
3. **Premium & Fun**: Professional yet approachable, bee-inspired theme
4. **Accessible**: High contrast colors, clear typography
5. **Ghanaian Context**: Local payment methods (MTN MoMo), Ghana cedis (GH₵), local imagery

## Technical Stack

- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Motion/React** for animations

## Mock Data

The app currently uses mock data for:
- Designer profiles and portfolios
- Order tracking and status
- Chat messages and conversations
- User measurements and preferences
- Transaction history
