import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PatientDetailsProps {
  patientName: string;
  setPatientName: (v: string) => void;
  patientAge: string;
  setPatientAge: (v: string) => void;
  patientGender: string;
  setPatientGender: (v: string) => void;
  patientPhone: string;
  setPatientPhone: (v: string) => void;
  diagnosis: string;
  setDiagnosis: (v: string) => void;
  chiefComplaints: string;
  setChiefComplaints: (v: string) => void;
  examination: string;
  setExamination: (v: string) => void;
  allergies: string;
  setAllergies: (v: string) => void;
}

const PatientDetails = (props: PatientDetailsProps) => {
  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-5">
          <Label className="text-xs text-muted-foreground">Patient Name</Label>
          <Input
            value={props.patientName}
            onChange={(e) => props.setPatientName(e.target.value)}
            placeholder="Patient Name"
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Label className="text-xs text-muted-foreground">Age</Label>
          <Input
            value={props.patientAge}
            onChange={(e) => props.setPatientAge(e.target.value)}
            placeholder="Age"
            className="h-8 text-sm"
            type="number"
          />
        </div>
        <div className="col-span-8 md:col-span-2">
          <Label className="text-xs text-muted-foreground">Gender</Label>
          <select
            value={props.patientGender}
            onChange={(e) => props.setPatientGender(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-span-12 md:col-span-3">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            value={props.patientPhone}
            onChange={(e) => props.setPatientPhone(e.target.value)}
            placeholder="Phone"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6">
          <Label className="text-xs text-muted-foreground font-semibold">
            Chief Complaints
          </Label>
          <Textarea
            value={props.chiefComplaints}
            onChange={(e) => props.setChiefComplaints(e.target.value)}
            placeholder="e.g. Fever x 3 days, headache, body ache"
            className="text-sm mt-1 min-h-[60px] resize-y"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Label className="text-xs text-muted-foreground font-semibold">
            Examination / Vitals
          </Label>
          <Textarea
            value={props.examination}
            onChange={(e) => props.setExamination(e.target.value)}
            placeholder="e.g. BP 120/80, Pulse 78, SpO2 98%, Temp 99°F"
            className="text-sm mt-1 min-h-[60px] resize-y"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-semibold">
          Diagnosis
        </Label>
        <Textarea
          value={props.diagnosis}
          onChange={(e) => props.setDiagnosis(e.target.value)}
          placeholder="e.g. DIABETES MELLITUS TYPE 2, HYPOTHYROIDISM, HYPERTENSION"
          className="text-sm mt-1 min-h-[60px] font-medium uppercase resize-y w-full"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-semibold">
          Known Allergies
        </Label>
        <Input
          value={props.allergies}
          onChange={(e) => props.setAllergies(e.target.value)}
          placeholder="e.g. Penicillin, Sulfa drugs — or NKDA"
          className="h-8 text-sm mt-1"
        />
      </div>
    </div>
  );
};

export default PatientDetails;
