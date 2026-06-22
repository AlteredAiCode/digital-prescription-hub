import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface MedicineEntry {
  id: string;
  name: string;
  type: string;
  composition: string;
  dosageMorning: number;
  dosageAfternoon: number;
  dosageNight: number;
  timingFreqDuration: string;
  quantity: number;
}

interface MedicineRowProps {
  index: number;
  medicine: MedicineEntry;
  onChange: (id: string, field: keyof MedicineEntry, value: string | number) => void;
  onRemove: (id: string) => void;
  language: "en" | "hi";
}

const MEDICINE_TYPES = ["TAB", "CAP", "SYR", "INJ", "OINT", "DROP", "OTHER"];

const DUMMY_MEDICINES = [
  { id: "dummy-1", name: "Amlodipine", type: "TAB", composition: "Amlodipine 5mg" },
  { id: "dummy-2", name: "Amaryl", type: "TAB", composition: "Glimepiride 1mg" },
  { id: "dummy-3", name: "Amoxicillin", type: "CAP", composition: "Amoxicillin 500mg" },
  { id: "dummy-4", name: "Amitriptyline", type: "TAB", composition: "Amitriptyline 10mg" },
  { id: "dummy-5", name: "Metformin", type: "TAB", composition: "Metformin 500mg" },
  { id: "dummy-6", name: "Glimepiride", type: "TAB", composition: "Glimepiride 2mg" },
  { id: "dummy-7", name: "Thyroxine", type: "TAB", composition: "Levothyroxine 50mcg" },
  { id: "dummy-8", name: "Telmisartan", type: "TAB", composition: "Telmisartan 40mg" },
  { id: "dummy-9", name: "Atorvastatin", type: "TAB", composition: "Atorvastatin 10mg" },
  { id: "dummy-10", name: "Pantoprazole", type: "TAB", composition: "Pantoprazole 40mg" },
  { id: "dummy-11", name: "Vitamin D3", type: "CAP", composition: "Cholecalciferol 60000 IU" },
  { id: "dummy-12", name: "Calcium", type: "TAB", composition: "Calcium + Vitamin D3" },
];

const mergeMedicines = (dbMedicines: any[]) => {
  const seen = new Set<string>();
  return [...DUMMY_MEDICINES, ...dbMedicines].filter((med) => {
    const key = `${med.type}-${med.name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const TIMING_PRESETS = {
  en: [
    "Before food - Daily - 30 days",
    "After food - Daily - 30 days",
    "Before food - Daily - 60 days",
    "After food - Daily - 60 days",
    "Before food - Twice daily - 30 days",
    "After food - Twice daily - 30 days",
    "Empty stomach - Daily - 30 days",
    "At bedtime - Daily - 30 days",
    "SOS (as needed)",
  ],
  hi: [
    "खाने से पहले - रोज़ - 30 दिन",
    "खाने के बाद - रोज़ - 30 दिन",
    "खाने से पहले - रोज़ - 60 दिन",
    "खाने के बाद - रोज़ - 60 दिन",
    "खाने से पहले - दिन में दो बार - 30 दिन",
    "खाने के बाद - दिन में दो बार - 30 दिन",
    "खाली पेट - रोज़ - 30 दिन",
    "सोने से पहले - रोज़ - 30 दिन",
    "ज़रूरत पड़ने पर (SOS)",
  ],
};

const MedicineRow = ({ index, medicine, onChange, onRemove, language }: MedicineRowProps) => {
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTimingPresets, setShowTimingPresets] = useState(false);
  const [suggestionRect, setSuggestionRect] = useState({ left: 0, top: 0, width: 0 });
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const timingWrapRef = useRef<HTMLDivElement>(null);

  // Preload all medicines once so typing filters locally — no flicker, no layout shift.
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .order("name", { ascending: true })
        .limit(200);
      setAllMedicines(error ? DUMMY_MEDICINES : mergeMedicines(data ?? []));
    })();
  }, []);

  const updateSuggestionPosition = () => {
    const rect = nameWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSuggestionRect({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };

  const openSuggestions = () => {
    updateSuggestionPosition();
    setShowSuggestions(true);
  };

  useEffect(() => {
    if (!showSuggestions) return;
    updateSuggestionPosition();
    window.addEventListener("resize", updateSuggestionPosition);
    window.addEventListener("scroll", updateSuggestionPosition, true);
    return () => {
      window.removeEventListener("resize", updateSuggestionPosition);
      window.removeEventListener("scroll", updateSuggestionPosition, true);
    };
  }, [showSuggestions, medicine.name]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nameWrapRef.current && !nameWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (timingWrapRef.current && !timingWrapRef.current.contains(e.target as Node)) {
        setShowTimingPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = medicine.name.trim().toLowerCase();
  const filtered = (query.length === 0
    ? allMedicines
    : allMedicines.filter((m) =>
        [m.name, m.type, m.composition]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      )
  ).slice(0, 25);

  const selectMedicine = (med: any) => {
    onChange(medicine.id, "name", med.name);
    onChange(medicine.id, "type", med.type);
    onChange(medicine.id, "composition", med.composition || "");
    setShowSuggestions(false);
  };

  const presets = TIMING_PRESETS[language];

  return (
    <tr className="border-b border-border hover:bg-accent/30 transition-colors group align-top">
      <td className="p-2 text-center text-xs text-muted-foreground font-mono w-8 align-top">
        {index + 1}
      </td>
      <td className="p-2 align-top">
        <div className="flex gap-1 items-start">
          <select
            value={medicine.type}
            onChange={(e) => onChange(medicine.id, "type", e.target.value)}
            className="h-8 w-20 rounded border border-input bg-background px-1 text-xs focus:ring-1 focus:ring-ring"
          >
            {MEDICINE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="relative flex-1" ref={nameWrapRef}>
            <Input
              value={medicine.name}
              onChange={(e) => {
                onChange(medicine.id, "name", e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Select or type medicine…"
              className="h-8 text-xs font-medium pr-7 w-full"
              autoComplete="off"
            />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowSuggestions((s) => !s);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showSuggestions && filtered.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg mt-1 max-h-56 overflow-auto">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectMedicine(s)}
                    className="w-full text-left px-3 py-2 hover:bg-accent text-xs border-b border-border last:border-0"
                  >
                    <span className="font-medium">{s.type}. {s.name}</span>
                    {s.composition && (
                      <span className="block text-muted-foreground text-[10px]">{s.composition}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <Input
              value={medicine.composition}
              onChange={(e) => onChange(medicine.id, "composition", e.target.value)}
              placeholder="Composition"
              className="h-6 text-[10px] text-muted-foreground mt-1 border-dashed"
            />
          </div>
        </div>
      </td>
      <td className="p-2 align-top">
        <div className="flex gap-0.5 items-center justify-center pt-1">
          <Input
            type="number"
            min={0}
            value={medicine.dosageMorning}
            onChange={(e) => onChange(medicine.id, "dosageMorning", parseInt(e.target.value) || 0)}
            className="h-8 w-10 text-xs text-center p-0"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            min={0}
            value={medicine.dosageAfternoon}
            onChange={(e) => onChange(medicine.id, "dosageAfternoon", parseInt(e.target.value) || 0)}
            className="h-8 w-10 text-xs text-center p-0"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            min={0}
            value={medicine.dosageNight}
            onChange={(e) => onChange(medicine.id, "dosageNight", parseInt(e.target.value) || 0)}
            className="h-8 w-10 text-xs text-center p-0"
          />
        </div>
      </td>
      <td className="p-2 align-top">
        <div className="relative" ref={timingWrapRef}>
          <Input
            value={medicine.timingFreqDuration}
            onChange={(e) => onChange(medicine.id, "timingFreqDuration", e.target.value)}
            onFocus={() => setShowTimingPresets(true)}
            placeholder={language === "hi" ? "खाने से पहले - रोज़ - 60 दिन" : "Before food - Daily - 60 days"}
            className="h-8 text-xs"
            autoComplete="off"
          />
          {showTimingPresets && (
            <div className="absolute z-50 top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg mt-1 max-h-56 overflow-auto">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(medicine.id, "timingFreqDuration", preset);
                    setShowTimingPresets(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-accent text-xs border-b border-border last:border-0"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="p-2 align-top">
        <Input
          type="number"
          min={0}
          value={medicine.quantity}
          onChange={(e) => onChange(medicine.id, "quantity", parseInt(e.target.value) || 0)}
          className="h-8 w-16 text-xs text-center"
        />
      </td>
      <td className="p-2 w-8 align-top">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(medicine.id)}
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </Button>
      </td>
    </tr>
  );
};

export default MedicineRow;
