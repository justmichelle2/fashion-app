export interface Designer {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  photo: string;
  bio: string;
  specialties: string[];
  portfolio: string[];
  priceRange: string;
}

export interface Order {
  id: string;
  designerId: string;
  designerName: string;
  style: string;
  date: string;
  status: "Pending" | "Sewing" | "Ready" | "Delivered";
  amount: number;
  image: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface Measurement {
  chest: string;
  waist: string;
  hips: string;
  shoulder: string;
  wrist: string;
  height: string;
  unit: "inches" | "cm";
}

export const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Akosua Mensah",
    location: "Accra, Ghana",
    rating: 4.8,
    reviews: 124,
    photo: "",
    bio: "Specializing in modern African prints with 10+ years experience in custom tailoring.",
    specialties: ["Kente", "Formal Wear", "Traditional"],
    portfolio: [],
    priceRange: "GH₵ 200-500"
  },
  {
    id: "2",
    name: "Kwame Asante",
    location: "Kumasi, Ghana",
    rating: 4.9,
    reviews: 89,
    photo: "",
    bio: "Expert in traditional and contemporary designs. Winner of Ghana Fashion Awards 2024.",
    specialties: ["Ankara", "Suits", "Wedding"],
    portfolio: [],
    priceRange: "GH₵ 300-800"
  },
  {
    id: "3",
    name: "Ama Boateng",
    location: "Tema, Ghana",
    rating: 4.7,
    reviews: 156,
    photo: "",
    bio: "Creating beautiful pieces that blend tradition with modern elegance.",
    specialties: ["Casual Wear", "Dresses", "Accessories"],
    portfolio: [],
    priceRange: "GH₵ 150-400"
  },
  {
    id: "4",
    name: "Kofi Owusu",
    location: "Takoradi, Ghana",
    rating: 4.6,
    reviews: 67,
    photo: "",
    bio: "Tailoring excellence for men's fashion. Precision and style guaranteed.",
    specialties: ["Men's Suits", "Shirts", "Traditional"],
    portfolio: [],
    priceRange: "GH₵ 250-600"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD001",
    designerId: "1",
    designerName: "Akosua Mensah",
    style: "Kente Dress",
    date: "2026-02-28",
    status: "Sewing",
    amount: 350,
    image: ""
  },
  {
    id: "ORD002",
    designerId: "2",
    designerName: "Kwame Asante",
    style: "Custom Suit",
    date: "2026-02-20",
    status: "Ready",
    amount: 650,
    image: ""
  },
  {
    id: "ORD003",
    designerId: "3",
    designerName: "Ama Boateng",
    style: "Ankara Dress",
    date: "2026-03-01",
    status: "Pending",
    amount: 280,
    image: ""
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    userName: "Akosua Mensah",
    userPhoto: "",
    lastMessage: "Your dress will be ready by Friday!",
    timestamp: "2h ago",
    unread: 2
  },
  {
    id: "2",
    userId: "2",
    userName: "Kwame Asante",
    userPhoto: "",
    lastMessage: "I've received your measurements. Let's discuss the fabric.",
    timestamp: "1d ago",
    unread: 0
  },
  {
    id: "3",
    userId: "3",
    userName: "Ama Boateng",
    userPhoto: "",
    lastMessage: "Thank you for your order!",
    timestamp: "3d ago",
    unread: 1
  }
];
