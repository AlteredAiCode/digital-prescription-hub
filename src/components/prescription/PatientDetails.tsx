import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientDetailsProps {
  patientName: string;
  setPatientName: (v: string) => void;
  patientAge: string;
  setPatientAge: (v: string) => void;
  patientGender: string;
  setPatientGender: (v: string) => void;
  patientPhone: string;
  setPatientPhone: (v: string) => void;
  bp: string;
  setBp: (v: string) => void;
  pulse: string;
  setPulse: (v: string) => void;
  spo2: string;
  setSpo2: (v: string) => void;
  diagnosis: string;
  setDiagnosis: (v: string) => void;
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
      <div className="grid grid-cols-12 gap-3 items-end">
        <Label className="col-span-12 md:col-span-2 text-xs text-muted-foreground md:pb-2">Diagnosis</Label>
        <Input
          value={props.diagnosis}
          onChange={(e) => props.setDiagnosis(e.target.value)}
          placeholder="e.g. DIABETES MELLITUS TYPE 2, HYPOTHYROIDISM"
          className="col-span-12 md:col-span-10 h-8 text-sm font-medium uppercase"
        />
      </div>
    </div>
  );
};

export default PatientDetails;
