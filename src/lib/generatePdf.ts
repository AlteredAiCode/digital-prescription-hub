import jsPDF from "jspdf";

interface MedicineEntry {
  name: string;
  type: string;
  composition: string;
  dosageMorning: number;
  dosageAfternoon: number;
  dosageNight: number;
  timingFreqDuration: string;
  quantity: number;
}

interface PrescriptionData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientPhone: string;
  diagnosis: string;
  prescribedTests: string;
  nextAppointment: string;
  medicines: MedicineEntry[];
}

export function generatePrescriptionPdf(data: PrescriptionData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // Header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Combined Medical Institute", margin, y);
  doc.setFontSize(8);
  doc.text("Doon ENT Hospital", margin, y + 4);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Dr. Anshika Jain", pageWidth - margin, y, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("M.D. (Medicine) — Consultant Physician", pageWidth - margin, y + 5, { align: "right" });
  doc.setFontSize(8);
  doc.text("Specialist in Infectious Disease, Diabetes, Chest", pageWidth - margin, y + 9, { align: "right" });

  y += 16;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Date
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - margin, y, { align: "right" });

  // Patient details
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Patient: ${data.patientName}`, margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const details: string[] = [];
  if (data.patientAge) details.push(`Age: ${data.patientAge}`);
  if (data.patientGender) details.push(`Gender: ${data.patientGender}`);
  if (data.patientPhone) details.push(`Phone: ${data.patientPhone}`);
  if (details.length) {
    doc.text(details.join("  |  "), margin, y);
    y += 5;
  }

  if (data.chiefComplaints) {
    doc.setFont("helvetica", "bold");
    doc.text("Complaints: ", margin, y);
    doc.setFont("helvetica", "normal");
    const cX = margin + doc.getTextWidth("Complaints: ");
    const lines = doc.splitTextToSize(data.chiefComplaints, pageWidth - margin * 2 - 30);
    doc.text(lines, cX, y);
    y += 5 + (lines.length - 1) * 4;
  }
  if (data.examination) {
    doc.setFont("helvetica", "bold");
    doc.text("Examination: ", margin, y);
    doc.setFont("helvetica", "normal");
    const eX = margin + doc.getTextWidth("Examination: ");
    const lines = doc.splitTextToSize(data.examination, pageWidth - margin * 2 - 30);
    doc.text(lines, eX, y);
    y += 5 + (lines.length - 1) * 4;
  }
  if (data.allergies) {
    doc.setFont("helvetica", "bold");
    doc.text("Allergies: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(data.allergies, margin + doc.getTextWidth("Allergies: "), y);
    y += 5;
  }

  if (data.diagnosis) {
    doc.setFont("helvetica", "bold");
    doc.text(`Diagnosis: `, margin, y);
    const diagX = margin + doc.getTextWidth("Diagnosis: ");
    doc.setFont("helvetica", "normal");
    doc.text(data.diagnosis, diagX, y);
    y += 5;
  }

  y += 3;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Medicines table header
  const validMedicines = data.medicines.filter(m => m.name.trim());
  if (validMedicines.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Medicines", margin, y);
    y += 6;

    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y - 3.5, pageWidth - margin * 2, 6, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("#", margin + 2, y);
    doc.text("Medicine", margin + 10, y);
    doc.text("Dosage", margin + 85, y);
    doc.text("Timing/Freq/Duration", margin + 110, y);
    doc.text("Qty", pageWidth - margin - 5, y, { align: "right" });
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    validMedicines.forEach((med, i) => {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${i + 1}`, margin + 2, y);
      doc.setFont("helvetica", "bold");
      doc.text(`${med.type}. ${med.name}`, margin + 10, y);
      doc.setFont("helvetica", "normal");
      if (med.composition) {
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text(med.composition, margin + 10, y + 3.5);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
      }
      doc.text(`${med.dosageMorning}-${med.dosageAfternoon}-${med.dosageNight}`, margin + 85, y);

      // Handle timing text wrapping
      const timingText = med.timingFreqDuration || "";
      const maxTimingWidth = pageWidth - margin - 20 - (margin + 110);
      const timingLines = doc.splitTextToSize(timingText, maxTimingWidth);
      doc.text(timingLines, margin + 110, y);

      doc.text(`${med.quantity}`, pageWidth - margin - 5, y, { align: "right" });

      y += med.composition ? 8 : 5;
      const lineExtra = (timingLines.length - 1) * 3;
      y += lineExtra;
    });
  }

  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Tests
  if (data.prescribedTests) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Tests:", margin, y);
    doc.setFont("helvetica", "normal");
    const testX = margin + doc.getTextWidth("Prescribed Tests: ");
    doc.text(data.prescribedTests, testX, y);
    y += 5;
  }

  // Next appointment
  if (data.nextAppointment) {
    doc.setFont("helvetica", "bold");
    doc.text("Next Appointment:", margin, y);
    doc.setFont("helvetica", "normal");
    const apptX = margin + doc.getTextWidth("Next Appointment: ");
    doc.text(data.nextAppointment, apptX, y);
    y += 5;
  }

  // Footer
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("Morning: 10.30 am to 2.00 pm — C.M.I.-54, Haridwar Road, Dehradun (U.K)", margin, y);
  y += 3;
  doc.text("Evening: 05.00 pm to 7.00 pm — DOON ENT HOSPITAL-56, Haridwar Road, Dehradun (U.K)", margin, y);
  y += 3;
  doc.text("For Appointment Call/Whatsapp: 9897844811", margin, y);

  return doc;
}
