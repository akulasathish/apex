"use server";

import { supabase } from "../../lib/supabase";
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

    // Save directly to Supabase
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          id: leadId,
          name,
          email: email || "N/A",
          phone,
          course,
          message: message || "No message provided.",
          status: "unread", // unread, contacted, archived
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Server error submitting enquiry to Supabase:", error);
    return {
      success: false,
      error: "Could not submit enquiry. Please try again or contact us directly.",
    };
  }
}

export async function getLeads() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(lead => ({
      ...lead,
      createdAt: lead.created_at
    }));
  } catch (error) {
    console.error("Error getting leads from Supabase:", error);
    return [];
  }
}

export async function updateLeadStatus(id, newStatus) {
  try {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status in Supabase:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id) {
  try {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead in Supabase:", error);
    return { success: false, error: error.message };
  }
}
