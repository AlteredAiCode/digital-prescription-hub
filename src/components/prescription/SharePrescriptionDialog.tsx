import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Mail, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generatePrescriptionPdf } from "@/lib/generatePdf";
import type { MedicineEntry } from "./MedicineRow";

interface PrescriptionData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientPhone: string;
  bp: string;
  pulse: string;
  spo2: string;
  diagnosis: string;
  prescribedTests: string;
  nextAppointment: string;
  medicines: MedicineEntry[];
}

interface SharePrescriptionDialogProps {
  prescriptionData: PrescriptionData;
}

const SharePrescriptionDialog = ({ prescriptionData }: SharePrescriptionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(prescriptionData.patientPhone || "");
  const [sharing, setSharing] = useState(false);

  const generatePdf = async () => {
    return generatePrescriptionPdf(prescriptionData);
  };

  const shareViaEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    setSharing(true);
    try {
      const pdf = await generatePdf();
      const blob = pdf.output("blob");

      // Create mailto with prescription summary, and download PDF for attachment
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prescription_${prescriptionData.patientName || "Patient"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      // Open mailto
      const subject = encodeURIComponent(`Prescription for ${prescriptionData.patientName}`);
      const body = encodeURIComponent(
        `Dear ${prescriptionData.patientName},\n\nPlease find your prescription attached.\n\nDiagnosis: ${prescriptionData.diagnosis || "N/A"}\n\nRegards,\nDoctor`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");

      toast.success("PDF downloaded! Please attach it to the email.");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setSharing(false);
    }
  };

  const shareViaWhatsApp = async () => {
    if (!whatsappNumber.trim()) {
      toast.error("Please enter a WhatsApp number");
      return;
    }
    setSharing(true);
    try {
      const pdf = await generatePdf();
      const blob = pdf.output("blob");

      // Download PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prescription_${prescriptionData.patientName || "Patient"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      // Build prescription summary text
      const validMeds = prescriptionData.medicines.filter(m => m.name.trim());
      const medsText = validMeds.map((m, i) =>
        `${i + 1}. ${m.type} ${m.name} (${m.dosageMorning}-${m.dosageAfternoon}-${m.dosageNight}) ${m.timingFreqDuration} Qty:${m.quantity}`
      ).join("\n");

      const message = encodeURIComponent(
        `*Prescription*\n\nPatient: ${prescriptionData.patientName}\nAge: ${prescriptionData.patientAge || "N/A"} | Gender: ${prescriptionData.patientGender || "N/A"}\nDiagnosis: ${prescriptionData.diagnosis || "N/A"}\n\n*Medicines:*\n${medsText}\n\n${prescriptionData.prescribedTests ? `Tests: ${prescriptionData.prescribedTests}\n` : ""}${prescriptionData.nextAppointment ? `Next Appointment: ${prescriptionData.nextAppointment}` : ""}\n\n_PDF downloaded separately. Please share it along with this message._`
      );

      const phone = whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${message}`, "_blank");

      toast.success("PDF downloaded! Share it in the WhatsApp chat.");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading">Share Prescription</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Email Section */}
          <div className="space-y-2 p-4 rounded-lg border border-border bg-accent/20">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Send via Email
            </Label>
            <Input
              type="email"
              placeholder="patient@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
            />
            <Button
              onClick={shareViaEmail}
              disabled={sharing}
              size="sm"
              className="w-full"
            >
              {sharing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
              Download PDF & Open Email
            </Button>
          </div>

          {/* WhatsApp Section */}
          <div className="space-y-2 p-4 rounded-lg border border-border bg-accent/20">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              Send via WhatsApp
            </Label>
            <Input
              type="tel"
              placeholder="Phone number (e.g., 9897844811)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="h-9 text-sm"
            />
            <Button
              onClick={shareViaWhatsApp}
              disabled={sharing}
              size="sm"
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50"
            >
              {sharing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />}
              Download PDF & Open WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePrescriptionDialog;
