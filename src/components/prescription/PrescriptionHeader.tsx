import { Stethoscope } from "lucide-react";

const PrescriptionHeader = () => {
  return (
    <div className="border-b-2 border-primary pb-3 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-heading font-bold text-foreground leading-tight">
              Combined Medical Institute
            </h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Doon ENT Hospital · Dehradun
            </p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-lg md:text-xl font-heading font-bold text-primary leading-tight">
            Dr. Anshika Jain
          </h1>
          <p className="text-xs font-semibold text-foreground">M.D. (Medicine)</p>
          <p className="text-[11px] text-muted-foreground">
            Consultant Physician · Diabetes, Chest, Infectious Disease
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
