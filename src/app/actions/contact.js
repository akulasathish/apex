"use server";

import fs from "fs/promises";
import path from "path";

const LEADS_FILE_PATH = path.join(process.cwd(), "src/data/leads.json");

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

    // Prepare new lead object
    const newLead = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      email: email || "N/A",
      phone,
      course,
      message: message || "No message provided.",
      status: "unread", // unread, contacted, archived
      createdAt: new Date().toISOString(),
    };

    // Read existing leads or initialize empty array
    let leads = [];
    try {
      const dirPath = path.dirname(LEADS_FILE_PATH);
      await fs.mkdir(dirPath, { recursive: true });

      const fileExists = await fs.access(LEADS_FILE_PATH).then(() => true).catch(() => false);
      if (fileExists) {
        const fileContent = await fs.readFile(LEADS_FILE_PATH, "utf8");
        leads = JSON.parse(fileContent);
      }
    } catch (e) {
      console.error("Error checking or reading leads file:", e);
      leads = [];
    }

    // Append new lead
    leads.unshift(newLead);

    // Write back to file
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf8");

    return {
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Server error submitting enquiry:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again or contact us directly.",
    };
  }
}

export async function getLeads() {
  try {
    const fileExists = await fs.access(LEADS_FILE_PATH).then(() => true).catch(() => false);
    if (!fileExists) {
      return [];
    }
    const fileContent = await fs.readFile(LEADS_FILE_PATH, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error getting leads:", error);
    return [];
  }
}

export async function updateLeadStatus(id, newStatus) {
  try {
    const fileExists = await fs.access(LEADS_FILE_PATH).then(() => true).catch(() => false);
    if (!fileExists) return { success: false, error: "Leads database not found." };

    const fileContent = await fs.readFile(LEADS_FILE_PATH, "utf8");
    let leads = JSON.parse(fileContent);

    const leadIndex = leads.findIndex((l) => l.id === id);
    if (leadIndex === -1) return { success: false, error: "Lead not found." };

    leads[leadIndex].status = newStatus;

    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id) {
  try {
    const fileExists = await fs.access(LEADS_FILE_PATH).then(() => true).catch(() => false);
    if (!fileExists) return { success: false, error: "Leads database not found." };

    const fileContent = await fs.readFile(LEADS_FILE_PATH, "utf8");
    let leads = JSON.parse(fileContent);

    leads = leads.filter((l) => l.id !== id);

    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: error.message };
  }
}
