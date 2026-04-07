import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

/**
 * PORTFOLIO MANAGEMENT
 */

// Create designer portfolio
export const createPortfolio = async (portfolioData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const portfolioRef = doc(collection(db, "portfolios"));
    const portfolio = {
      designerId: auth.currentUser.uid,
      title: portfolioData.title || "",
      description: portfolioData.description || "",
      specialty: portfolioData.specialty || "General Fashion Design", // Kente, Contemporary, Wedding, Casual, etc.
      bio: portfolioData.bio || "",
      yearsExperience: portfolioData.yearsExperience || 0,
      rating: 0,
      reviewCount: 0,
      hourlyRate: portfolioData.hourlyRate || 50,
      responseTime: portfolioData.responseTime || "24 hours", // Expected response time
      location: portfolioData.location || "Ghana",
      phone: portfolioData.phone || "",
      socialLinks: portfolioData.socialLinks || {
        instagram: "",
        facebook: "",
        whatsapp: "",
      },
      images: portfolioData.images || [], // Array of image URLs
      certifications: portfolioData.certifications || [],
      languages: portfolioData.languages || ["English"],
      availability: portfolioData.availability || "available", // available, busy, on-break
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(portfolioRef, portfolio);

    return {
      success: true,
      portfolioId: portfolioRef.id,
      portfolio,
    };
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer portfolio
export const getPortfolio = async (designerId) => {
  try {
    const q = query(
      collection(db, "portfolios"),
      where("designerId", "==", designerId)
    );
    const result = await getDocs(q);

    if (result.empty) {
      return {
        success: false,
        error: "Portfolio not found",
      };
    }

    const portfolio = result.docs[0];
    return {
      success: true,
      portfolio: {
        portfolioId: portfolio.id,
        ...portfolio.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update designer portfolio
export const updatePortfolio = async (portfolioData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const q = query(
      collection(db, "portfolios"),
      where("designerId", "==", auth.currentUser.uid)
    );
    const result = await getDocs(q);

    if (result.empty) {
      throw new Error("Portfolio not found");
    }

    const portfolioRef = result.docs[0].ref;
    const updateData = {
      ...portfolioData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(portfolioRef, updateData);

    return {
      success: true,
      portfolio: updateData,
    };
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * DESIGN PROJECT MANAGEMENT
 */

// Create design project
export const createDesignProject = async (projectData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const projectRef = doc(collection(db, "designProjects"));
    const project = {
      projectId: projectRef.id,
      designerId: auth.currentUser.uid,
      customerId: projectData.customerId || "", // Customer who placed the order
      orderId: projectData.orderId || "", // Related order ID
      title: projectData.title || "",
      description: projectData.description || "",
      category: projectData.category || "custom", // custom, modification, reproduction
      budget: projectData.budget || 0,
      deadline: projectData.deadline || "", // ISO date string
      status: "pending", // pending, accepted, in_progress, review, completed, cancelled
      specifications: projectData.specifications || {
        color: "",
        fabric: "",
        measurements: {},
        style: "",
        additionalNotes: "",
      },
      images: projectData.images || [], // Customer reference images
      attachments: projectData.attachments || [], // File uploads
      progress: 0, // 0-100 percentage
      createdAt: serverTimestamp(),
      acceptedAt: null,
      startedAt: null,
      completedAt: null,
      updatedAt: serverTimestamp(),
    };

    await setDoc(projectRef, project);

    return {
      success: true,
      projectId: projectRef.id,
      project,
    };
  } catch (error) {
    console.error("Error creating design project:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get design project
export const getDesignProject = async (projectId) => {
  try {
    const projectRef = doc(db, "designProjects", projectId);
    const result = await getDoc(projectRef);

    if (!result.exists()) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    return {
      success: true,
      project: {
        projectId: result.id,
        ...result.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer's projects
export const getDesignerProjects = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    let q = query(
      collection(db, "designProjects"),
      where("designerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    if (filters.status) {
      q = query(
        collection(db, "designProjects"),
        where("designerId", "==", auth.currentUser.uid),
        where("status", "==", filters.status),
        orderBy("createdAt", "desc")
      );
    }

    const result = await getDocs(q);

    const projects = result.docs.map((doc) => ({
      projectId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update design project status
export const updateProjectStatus = async (projectId, status) => {
  try {
    const validStatuses = [
      "pending",
      "accepted",
      "in_progress",
      "review",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const projectRef = doc(db, "designProjects", projectId);
    const update = {
      status,
      updatedAt: serverTimestamp(),
    };

    // Update timestamps based on status
    if (status === "accepted") {
      update.acceptedAt = serverTimestamp();
    } else if (status === "in_progress") {
      update.startedAt = serverTimestamp();
    } else if (status === "completed") {
      update.completedAt = serverTimestamp();
      update.progress = 100;
    }

    await updateDoc(projectRef, update);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update project progress
export const updateProjectProgress = async (projectId, progress) => {
  try {
    if (progress < 0 || progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    const projectRef = doc(db, "designProjects", projectId);
    await updateDoc(projectRef, {
      progress,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating progress:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update project specifications
export const updateProjectSpecifications = async (projectId, specifications) => {
  try {
    const projectRef = doc(db, "designProjects", projectId);
    await updateDoc(projectRef, {
      specifications: {
        ...specifications,
      },
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating specifications:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * WORK-IN-PROGRESS TRACKING
 */

// Create work-in-progress item
export const createWorkItem = async (workData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const workRef = doc(collection(db, "workItems"));
    const workItem = {
      workId: workRef.id,
      designerId: auth.currentUser.uid,
      projectId: workData.projectId || "",
      title: workData.title || "",
      description: workData.description || "",
      stage: workData.stage || "sketching", // sketching, cutting, sewing, fitting, finishing, quality-check
      startDate: workData.startDate || serverTimestamp(),
      dueDate: workData.dueDate || "",
      status: workData.status || "active", // active, paused, completed, blocked
      notes: workData.notes || "",
      estimatedHours: workData.estimatedHours || 0,
      actualHours: workData.actualHours || 0,
      images: workData.images || [], // Progress photos
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(workRef, workItem);

    return {
      success: true,
      workId: workRef.id,
      workItem,
    };
  } catch (error) {
    console.error("Error creating work item:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get work items for project
export const getProjectWorkItems = async (projectId) => {
  try {
    const q = query(
      collection(db, "workItems"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );

    const result = await getDocs(q);
    const items = result.docs.map((doc) => ({
      workId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      items,
    };
  } catch (error) {
    console.error("Error fetching work items:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update work item
export const updateWorkItem = async (workId, updates) => {
  try {
    const workRef = doc(db, "workItems", workId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(workRef, updateData);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating work item:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer's active work items
export const getDesignerWorkItems = async (status = "active") => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    let q = query(
      collection(db, "workItems"),
      where("designerId", "==", auth.currentUser.uid),
      orderBy("dueDate", "asc")
    );

    if (status) {
      q = query(
        collection(db, "workItems"),
        where("designerId", "==", auth.currentUser.uid),
        where("status", "==", status),
        orderBy("dueDate", "asc")
      );
    }

    const result = await getDocs(q);
    const items = result.docs.map((doc) => ({
      workId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      items,
    };
  } catch (error) {
    console.error("Error fetching work items:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * EARNINGS & PAYMENT TRACKING
 */

// Record designer earnings from order
export const recordDesignerEarning = async (earningData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const earningRef = doc(collection(db, "designerEarnings"));
    const earning = {
      earningId: earningRef.id,
      designerId: auth.currentUser.uid,
      orderId: earningData.orderId || "",
      projectId: earningData.projectId || "",
      customerId: earningData.customerId || "",
      amount: earningData.amount || 0,
      commission: earningData.commission || 0, // Platform commission percentage
      netAmount: earningData.amount - (earningData.commission || 0),
      paymentMethod: earningData.paymentMethod || "momo", // momo, bank_transfer, cash
      status: "pending", // pending, processing, paid, failed, refunded
      description: earningData.description || "Design work",
      invoiceNumber: earningData.invoiceNumber || `INV-${Date.now()}`,
      createdAt: serverTimestamp(),
      paidAt: null,
      updatedAt: serverTimestamp(),
    };

    await setDoc(earningRef, earning);

    return {
      success: true,
      earningId: earningRef.id,
      earning,
    };
  } catch (error) {
    console.error("Error recording earning:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer earnings
export const getDesignerEarnings = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    let q = query(
      collection(db, "designerEarnings"),
      where("designerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    if (filters.status) {
      q = query(
        collection(db, "designerEarnings"),
        where("designerId", "==", auth.currentUser.uid),
        where("status", "==", filters.status),
        orderBy("createdAt", "desc")
      );
    }

    const result = await getDocs(q);
    const earnings = result.docs.map((doc) => ({
      earningId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      earnings,
    };
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update earning status
export const updateEarningStatus = async (earningId, status) => {
  try {
    const validStatuses = ["pending", "processing", "paid", "failed", "refunded"];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const earningRef = doc(db, "designerEarnings", earningId);
    const update = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === "paid") {
      update.paidAt = serverTimestamp();
    }

    await updateDoc(earningRef, update);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating earning status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer earnings summary
export const getDesignerEarningsSummary = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const result = await getDocs(
      query(
        collection(db, "designerEarnings"),
        where("designerId", "==", auth.currentUser.uid)
      )
    );

    const earnings = result.docs.map((doc) => doc.data());

    const summary = {
      totalEarnings: earnings.reduce((sum, e) => sum + (e.amount || 0), 0),
      totalCommission: earnings.reduce((sum, e) => sum + (e.commission || 0), 0),
      totalNetEarnings: earnings.reduce((sum, e) => sum + (e.netAmount || 0), 0),
      pendingAmount: earnings
        .filter((e) => e.status === "pending")
        .reduce((sum, e) => sum + (e.netAmount || 0), 0),
      paidAmount: earnings
        .filter((e) => e.status === "paid")
        .reduce((sum, e) => sum + (e.netAmount || 0), 0),
      projectCount: earnings.length,
      lastPayment: earnings
        .filter((e) => e.status === "paid")
        .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))[0] || null,
    };

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create designer payment request
export const createPaymentRequest = async (paymentData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const requestRef = doc(collection(db, "designerPaymentRequests"));
    const paymentRequest = {
      requestId: requestRef.id,
      designerId: auth.currentUser.uid,
      amount: paymentData.amount || 0,
      paymentMethod: paymentData.paymentMethod || "momo", // momo, bank_transfer
      accountDetails: paymentData.accountDetails || {
        mobileNumber: "",
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      reason: paymentData.reason || "Earnings withdrawal",
      status: "pending", // pending, approved, processing, completed, rejected
      approvedAmount: 0,
      processedAmount: 0,
      createdAt: serverTimestamp(),
      approvedAt: null,
      completedAt: null,
      notes: "",
      updatedAt: serverTimestamp(),
    };

    await setDoc(requestRef, paymentRequest);

    return {
      success: true,
      requestId: requestRef.id,
      paymentRequest,
    };
  } catch (error) {
    console.error("Error creating payment request:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer payment requests
export const getDesignerPaymentRequests = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const q = query(
      collection(db, "designerPaymentRequests"),
      where("designerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const result = await getDocs(q);
    const requests = result.docs.map((doc) => ({
      requestId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      requests,
    };
  } catch (error) {
    console.error("Error fetching payment requests:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * MEASUREMENTS/SPECIFICATIONS STORAGE
 */

// Store customer measurements
export const storeCustomerMeasurements = async (measurementData) => {
  try {
    const measurementRef = doc(collection(db, "customerMeasurements"));
    const measurements = {
      measurementId: measurementRef.id,
      customerId: measurementData.customerId || "",
      designerId: measurementData.designerId || auth.currentUser?.uid || "",
      measurements: {
        chest: measurementData.chest || 0,
        waist: measurementData.waist || 0,
        hips: measurementData.hips || 0,
        shoulder: measurementData.shoulder || 0,
        sleeveLength: measurementData.sleeveLength || 0,
        torsoLength: measurementData.torsoLength || 0,
        inseam: measurementData.inseam || 0,
        height: measurementData.height || 0,
        customFields: measurementData.customFields || {}, // For additional measurements
      },
      unit: measurementData.unit || "cm", // cm or inches
      notes: measurementData.notes || "",
      verified: false,
      verifiedBy: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(measurementRef, measurements);

    return {
      success: true,
      measurementId: measurementRef.id,
      measurements,
    };
  } catch (error) {
    console.error("Error storing measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get customer measurements
export const getCustomerMeasurements = async (customerId) => {
  try {
    const q = query(
      collection(db, "customerMeasurements"),
      where("customerId", "==", customerId)
    );

    const result = await getDocs(q);
    const measurementsList = result.docs.map((doc) => ({
      measurementId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      measurements: measurementsList,
    };
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update measurements
export const updateMeasurements = async (measurementId, updates) => {
  try {
    const measurementRef = doc(db, "customerMeasurements", measurementId);
    await updateDoc(measurementRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Designer reusable measurement templates
export const createMeasurementTemplate = async (templateData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const templateRef = doc(collection(db, "measurementTemplates"));
    const template = {
      templateId: templateRef.id,
      designerId: auth.currentUser.uid,
      name: templateData.name || "",
      description: templateData.description || "",
      garmentType: templateData.garmentType || "shirt", // shirt, pants, dress, etc.
      fields: templateData.fields || {}, // Field names and types
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(templateRef, template);

    return {
      success: true,
      templateId: templateRef.id,
      template,
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer's measurement templates
export const getDesignerMeasurementTemplates = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const q = query(
      collection(db, "measurementTemplates"),
      where("designerId", "==", auth.currentUser.uid)
    );

    const result = await getDocs(q);
    const templates = result.docs.map((doc) => ({
      templateId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      templates,
    };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
