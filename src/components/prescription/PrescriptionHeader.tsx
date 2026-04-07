const PrescriptionHeader = () => {
  return (
    <div className="border-b-2 border-primary pb-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-body font-semibold text-muted-foreground tracking-wide uppercase">
            Combined Medical Institute
          </h2>
          <p className="text-xs text-muted-foreground">Doon ENT Hospital</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-heading font-bold text-primary">
            Dr. Anshika Jain
          </h1>
          <p className="text-sm font-semibold text-foreground">M.D. (Medicine)</p>
          <p className="text-xs text-muted-foreground">Consultant Physician</p>
          <p className="text-xs text-muted-foreground">
            Specialist in Infectious Disease, Diabetes, Chest
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
