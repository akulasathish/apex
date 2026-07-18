"use server";

import { sql } from "@vercel/postgres";
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

    // Save directly to Vercel Postgres
    await sql`
      INSERT INTO leads (id, name, email, phone, course, message, status, created_at)
      VALUES (
        ${leadId},
        ${name},
        ${email || "N/A"},
        ${phone},
        ${course},
        ${message || "No message provided."},
        'unread',
        ${new Date().toISOString()}
      )
    `;
    
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Server error submitting enquiry to Vercel Postgres:", error);
    return {
      success: false,
      error: "Could not submit enquiry. Please try again or contact us directly.",
    };
  }
}

export async function getLeads() {
  try {
    const { rows } = await sql`
      SELECT * FROM leads ORDER BY created_at DESC
    `;

    return rows.map(lead => ({
      ...lead,
      createdAt: lead.created_at
    }));
  } catch (error) {
    console.error("Error getting leads from Vercel Postgres:", error);
    return [];
  }
}

export async function updateLeadStatus(id, newStatus) {
  try {
    await sql`
      UPDATE leads
      SET status = ${newStatus}
      WHERE id = ${id}
    `;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status in Vercel Postgres:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id) {
  try {
    await sql`
      DELETE FROM leads
      WHERE id = ${id}
    `;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead in Vercel Postgres:", error);
    return { success: false, error: error.message };
  }
}
