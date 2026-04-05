<<<<<<< Updated upstream
export const mockDesigners = [
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
    priceRange: "GH₵ 200-500",
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
    priceRange: "GH₵ 300-800",
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
    priceRange: "GH₵ 150-400",
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
    priceRange: "GH₵ 250-600",
  },
];

export const mockOrders = [
  {
    id: "ORD001",
    designerId: "1",
    designerName: "Akosua Mensah",
    style: "Kente Dress",
    date: "2026-02-28",
    status: "Sewing",
    amount: 350,
    image: "",
  },
  {
    id: "ORD002",
    designerId: "2",
    designerName: "Kwame Asante",
    style: "Custom Suit",
    date: "2026-02-20",
    status: "Ready",
    amount: 650,
    image: "",
  },
  {
    id: "ORD003",
    designerId: "3",
    designerName: "Ama Boateng",
    style: "Ankara Dress",
    date: "2026-03-01",
    status: "Pending",
    amount: 280,
    image: "",
  },
];

export const mockMessages = [
  {
    id: "1",
    userId: "1",
    userName: "Akosua Mensah",
    userPhoto: "",
    lastMessage: "Your dress will be ready by Friday!",
    timestamp: "2h ago",
    unread: 2,
  },
  {
    id: "2",
    userId: "2",
    userName: "Kwame Asante",
    userPhoto: "",
    lastMessage: "I've received your measurements. Let's discuss the fabric.",
    timestamp: "1d ago",
    unread: 0,
  },
  {
    id: "3",
    userId: "3",
    userName: "Ama Boateng",
    userPhoto: "",
    lastMessage: "Thank you for your order!",
    timestamp: "3d ago",
    unread: 1,
  },
];
=======
const DESIGNER_STORAGE_KEY = "drssed_designers";
const CURRENT_DESIGNER_KEY = "drssed_current_designer_id";

const now = Date.now();

const defaultDesigners = [
	{
		id: "des-001",
		name: "Ama Mensah",
		email: "ama@drssed.com",
		password: "designer123",
		specialty: "Bridal & Eveningwear",
		location: "Accra",
		bio: "I create modern silhouettes with hand-finished African detailing.",
		rating: 4.9,
		portfolio: [
			{
				id: "pf-ama-1",
				title: "Kente Bridal Gown",
				category: "Bridal",
				imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
				addedAt: now - 1000 * 60 * 60 * 24 * 10,
			},
			{
				id: "pf-ama-2",
				title: "Cocktail Ankara Dress",
				category: "Occasion",
				imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
				addedAt: now - 1000 * 60 * 60 * 24 * 4,
			},
		],
		measurements: [
			{
				id: "m-ama-1",
				clientName: "Nana Serwaa",
				garmentType: "Fitted Dress",
				chest: "36",
				waist: "29",
				hips: "41",
				inseam: "30",
				notes: "Prefers breathable lining and hidden zipper.",
				updatedAt: now - 1000 * 60 * 60 * 24 * 3,
			},
		],
		projects: [
			{
				id: "pr-ama-1",
				title: "Wedding Reception Outfit",
				clientName: "Akua Boateng",
				status: "in_progress",
				dueDate: "2026-04-22",
				amount: 850,
				paid: true,
				description: "Two-piece reception set with matching headpiece.",
				updatedAt: now - 1000 * 60 * 60 * 22,
			},
			{
				id: "pr-ama-2",
				title: "Corporate Kaftan Set",
				clientName: "Mabel Osei",
				status: "pending",
				dueDate: "2026-04-30",
				amount: 420,
				paid: false,
				description: "Three kaftans in premium silk blend.",
				updatedAt: now - 1000 * 60 * 60 * 36,
			},
			{
				id: "pr-ama-3",
				title: "Birthday Corset Dress",
				clientName: "Abena Kusi",
				status: "completed",
				dueDate: "2026-03-20",
				amount: 500,
				paid: true,
				description: "Structured corset with detachable sleeves.",
				updatedAt: now - 1000 * 60 * 60 * 24 * 16,
			},
		],
	},
	{
		id: "des-002",
		name: "Kojo Owusu",
		email: "kojo@drssed.com",
		password: "designer123",
		specialty: "Menswear Tailoring",
		location: "Kumasi",
		bio: "Sharp tailoring for modern professionals and events.",
		rating: 4.7,
		portfolio: [
			{
				id: "pf-kojo-1",
				title: "Linen Suit Collection",
				category: "Menswear",
				imageUrl: "https://images.unsplash.com/photo-1593032465171-8bd0afeb5346?w=900",
				addedAt: now - 1000 * 60 * 60 * 24 * 7,
			},
		],
		measurements: [],
		projects: [
			{
				id: "pr-kojo-1",
				title: "Groom Party Suits",
				clientName: "Kwame Adjei",
				status: "in_progress",
				dueDate: "2026-04-18",
				amount: 1200,
				paid: false,
				description: "4 coordinated suits with custom embroidery.",
				updatedAt: now - 1000 * 60 * 60 * 18,
			},
		],
	},
];

function readStorage(key) {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(key);
}

function writeStorage(key, value) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key, value);
}

function uid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function ensureDesignerSeeded() {
	const existing = readStorage(DESIGNER_STORAGE_KEY);
	if (!existing) {
		writeStorage(DESIGNER_STORAGE_KEY, JSON.stringify(defaultDesigners));
	}
}

export function loadDesigners() {
	ensureDesignerSeeded();
	const raw = readStorage(DESIGNER_STORAGE_KEY);
	if (!raw) return [...defaultDesigners];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [...defaultDesigners];
	} catch {
		return [...defaultDesigners];
	}
}

export function saveDesigners(designers) {
	writeStorage(DESIGNER_STORAGE_KEY, JSON.stringify(designers));
}

export function getCurrentDesignerId() {
	return readStorage(CURRENT_DESIGNER_KEY);
}

export function setCurrentDesignerId(designerId) {
	writeStorage(CURRENT_DESIGNER_KEY, designerId);
}

export function getDesignerById(designerId) {
	return loadDesigners().find((designer) => designer.id === designerId) ?? null;
}

export function getCurrentDesigner() {
	const currentId = getCurrentDesignerId();
	if (!currentId) return null;
	return getDesignerById(currentId);
}

export function createDesignerAccount(profile) {
	const designers = loadDesigners();
	const email = profile.email.trim().toLowerCase();
	const alreadyExists = designers.some(
		(designer) => designer.email.toLowerCase() === email
	);

	if (alreadyExists) {
		return { ok: false, error: "An account with this email already exists." };
	}

	const newDesigner = {
		id: uid("des"),
		name: profile.name.trim(),
		email,
		password: profile.password,
		specialty: profile.specialty.trim(),
		location: profile.location.trim(),
		bio: profile.bio.trim(),
		rating: 4.6,
		portfolio: [],
		measurements: [],
		projects: [],
	};

	const updated = [newDesigner, ...designers];
	saveDesigners(updated);
	setCurrentDesignerId(newDesigner.id);
	return { ok: true, designer: newDesigner };
}

export function authenticateDesigner(email, password) {
	const designers = loadDesigners();
	const designer = designers.find(
		(entry) => entry.email.toLowerCase() === email.trim().toLowerCase()
	);

	if (!designer || designer.password !== password) {
		return { ok: false, error: "Invalid email or password." };
	}

	setCurrentDesignerId(designer.id);
	return { ok: true, designer };
}

export function updateDesigner(designerId, updater) {
	const designers = loadDesigners();
	const updated = designers.map((designer) => {
		if (designer.id !== designerId) return designer;
		return updater(designer);
	});
	saveDesigners(updated);
	return updated.find((designer) => designer.id === designerId) ?? null;
}

export function addPortfolioItem(designerId, item) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		portfolio: [
			{
				id: uid("pf"),
				title: item.title.trim(),
				category: item.category.trim(),
				imageUrl: item.imageUrl.trim(),
				addedAt: Date.now(),
			},
			...designer.portfolio,
		],
	}));
}

export function removePortfolioItem(designerId, portfolioId) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		portfolio: designer.portfolio.filter((item) => item.id !== portfolioId),
	}));
}

export function addMeasurement(designerId, measurement) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		measurements: [
			{
				id: uid("m"),
				clientName: measurement.clientName.trim(),
				garmentType: measurement.garmentType.trim(),
				chest: measurement.chest.trim(),
				waist: measurement.waist.trim(),
				hips: measurement.hips.trim(),
				inseam: measurement.inseam.trim(),
				notes: measurement.notes.trim(),
				updatedAt: Date.now(),
			},
			...designer.measurements,
		],
	}));
}

export function addProject(designerId, project) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		projects: [
			{
				id: uid("pr"),
				title: project.title.trim(),
				clientName: project.clientName.trim(),
				status: project.status,
				dueDate: project.dueDate,
				amount: Number(project.amount) || 0,
				paid: Boolean(project.paid),
				description: project.description.trim(),
				updatedAt: Date.now(),
			},
			...designer.projects,
		],
	}));
}

export function updateProjectStatus(designerId, projectId, status) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		projects: designer.projects.map((project) =>
			project.id === projectId
				? {
						...project,
						status,
						updatedAt: Date.now(),
					}
				: project
		),
	}));
}

export function toggleProjectPayment(designerId, projectId) {
	return updateDesigner(designerId, (designer) => ({
		...designer,
		projects: designer.projects.map((project) =>
			project.id === projectId
				? {
						...project,
						paid: !project.paid,
						updatedAt: Date.now(),
					}
				: project
		),
	}));
}

export function getEarningsSummary(designer) {
	const paid = designer.projects
		.filter((project) => project.paid)
		.reduce((acc, project) => acc + (project.amount || 0), 0);

	const pending = designer.projects
		.filter((project) => !project.paid)
		.reduce((acc, project) => acc + (project.amount || 0), 0);

	return {
		paid,
		pending,
		total: paid + pending,
	};
}

export function formatCurrency(value) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 2,
	}).format(value || 0);
}
>>>>>>> Stashed changes
