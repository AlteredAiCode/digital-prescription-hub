import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, FileText } from "lucide-react";
import SharePrescriptionDialog from "@/components/prescription/SharePrescriptionDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PrescriptionHeader from "@/components/prescription/PrescriptionHeader";
import PatientDetails from "@/components/prescription/PatientDetails";
import MedicineRow, { MedicineEntry } from "@/components/prescription/MedicineRow";
import PrescriptionFooter from "@/components/prescription/PrescriptionFooter";

const createEmptyMedicine = (): MedicineEntry => ({
  id: crypto.randomUUID(),
  name: "",
  type: "TAB",
  composition: "",
  dosageMorning: 1,
  dosageAfternoon: 0,
  dosageNight: 0,
  timingFreqDuration: "",
  quantity: 60,
});

const Index = () => {
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [chiefComplaints, setChiefComplaints] = useState("");
  const [examination, setExamination] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescribedTests, setPrescribedTests] = useState("");
  const [nextAppointment, setNextAppointment] = useState("");
  const [medicines, setMedicines] = useState<MedicineEntry[]>([createEmptyMedicine()]);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("hi");

  const addMedicine = () => setMedicines((prev) => [...prev, createEmptyMedicine()]);

  const removeMedicine = (id: string) =>
    setMedicines((prev) => prev.filter((m) => m.id !== id));

  const updateMedicine = useCallback(
    (id: string, field: keyof MedicineEntry, value: string | number) => {
      setMedicines((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const savePrescription = async () => {
    if (!patientName.trim()) {
      toast.error("Patient name is required");
      return;
    }
    if (medicines.every((m) => !m.name.trim())) {
      toast.error("Add at least one medicine");
      return;
    }

    setSaving(true);
    try {
      // Save prescription
      const { data: prescription, error: prescError } = await supabase
        .from("prescriptions")
        .insert({
          patient_name: patientName,
          patient_age: patientAge ? parseInt(patientAge) : null,
          patient_gender: patientGender || null,
          patient_phone: patientPhone || null,
          chief_complaints: chiefComplaints || null,
          examination: examination || null,
          allergies: allergies || null,
          diagnosis: diagnosis || null,
          prescribed_tests: prescribedTests || null,
          next_appointment: nextAppointment || null,
        })
        .select("id")
        .single();

      if (prescError) throw prescError;

      // Filter valid medicines
      const validMedicines = medicines.filter((m) => m.name.trim());

      // Auto-add new medicines to the DB
      for (const med of validMedicines) {
        const { data: existing } = await supabase
          .from("medicines")
          .select("id")
          .eq("name", med.name)
          .eq("type", med.type as any)
          .maybeSingle();

        if (!existing) {
          await supabase.from("medicines").insert({
            name: med.name,
            type: med.type as any,
            composition: med.composition || null,
          });
        }
      }

      // Save prescription medicines
      const { error: medError } = await supabase
        .from("prescription_medicines")
        .insert(
          validMedicines.map((m) => ({
            prescription_id: prescription.id,
            medicine_name: m.name,
            medicine_type: m.type as any,
            composition: m.composition || null,
            dosage_morning: m.dosageMorning,
            dosage_afternoon: m.dosageAfternoon,
            dosage_night: m.dosageNight,
            timing_freq_duration: m.timingFreqDuration || null,
            quantity: m.quantity || null,
          }))
        );

      if (medError) throw medError;

      toast.success("Prescription saved successfully!");
      // Reset form
      setPatientName("");
      setPatientAge("");
      setPatientGender("");
      setPatientPhone("");
      setBp("");
      setPulse("");
      setSpo2("");
      setDiagnosis("");
      setPrescribedTests("");
      setNextAppointment("");
      setMedicines([createEmptyMedicine()]);
    } catch (err: any) {
      toast.error(err.message || "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-2 md:p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
          <PrescriptionHeader />

          <PatientDetails
            patientName={patientName} setPatientName={setPatientName}
            patientAge={patientAge} setPatientAge={setPatientAge}
            patientGender={patientGender} setPatientGender={setPatientGender}
            patientPhone={patientPhone} setPatientPhone={setPatientPhone}
            bp={bp} setBp={setBp}
            pulse={pulse} setPulse={setPulse}
            spo2={spo2} setSpo2={setSpo2}
            diagnosis={diagnosis} setDiagnosis={setDiagnosis}
          />

          {/* Language Toggle & Medicine Table */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Medicines</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="h-7 rounded border border-input bg-background px-2 text-xs focus:ring-1 focus:ring-ring"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-2 text-xs font-semibold text-muted-foreground w-8">#</th>
                  <th className="p-2 text-xs font-semibold text-muted-foreground">Medicine</th>
                  <th className="p-2 text-xs font-semibold text-muted-foreground text-center w-36">
                    Dosage
                  </th>
                  <th className="p-2 text-xs font-semibold text-muted-foreground">
                    Timing - Freq. - Duration
                  </th>
                  <th className="p-2 text-xs font-semibold text-muted-foreground w-20 text-center">Qty</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, i) => (
                  <MedicineRow
                    key={med.id}
                    index={i}
                    medicine={med}
                    onChange={updateMedicine}
                    onRemove={removeMedicine}
                    language={language}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMedicine}
            className="mt-3 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Medicine
          </Button>

          <PrescriptionFooter
            prescribedTests={prescribedTests}
            setPrescribedTests={setPrescribedTests}
            nextAppointment={nextAppointment}
            setNextAppointment={setNextAppointment}
          />

          {/* Save Button */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            <Button
              onClick={savePrescription}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Prescription"}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print
            </Button>
            <SharePrescriptionDialog
              prescriptionData={{
                patientName,
                patientAge,
                patientGender,
                patientPhone,
                bp,
                pulse,
                spo2,
                diagnosis,
                prescribedTests,
                nextAppointment,
                medicines,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
