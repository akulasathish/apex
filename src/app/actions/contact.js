"use server";

import { db } from "../../lib/gcp";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(prevState, formData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const course = formData.get("course")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Simple validation
    if (!name || !phone || !course) {
      return {
        success: false,
        error: "Name, Phone Number, and Course selection are required.",
      };
    }

    // Generate unique ID
    const leadId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    // Prepare new lead object
    const newLead = {
      id: leadId,
      name,
      email: email || "N/A",
      phone,
      course,
      message: message || "No message provided.",
      status: "unread", // unread, contacted, archived
      createdAt: new Date().toISOString(),
    };

    // Save directly to Google Cloud Firestore database
    await db.collection("leads").doc(leadId).set(newLead);
    
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Server error submitting enquiry to Firestore:", error);
    return {
      success: false,
      error: "Could not submit enquiry. Please try again or contact us directly.",
    };
  }
}

export async function getLeads() {
  try {
    const snapshot = await db.collection("leads").orderBy("createdAt", "desc").get();
    const leads = [];
    snapshot.forEach((doc) => {
      leads.push(doc.data());
    });
    return leads;
  } catch (error) {
    console.error("Error getting leads from Firestore:", error);
    return [];
  }
}

export async function updateLeadStatus(id, newStatus) {
  try {
    await db.collection("leads").doc(id).update({
      status: newStatus
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status in Firestore:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id) {
  try {
    await db.collection("leads").doc(id).delete();
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead in Firestore:", error);
    return { success: false, error: error.message };
  }
}
