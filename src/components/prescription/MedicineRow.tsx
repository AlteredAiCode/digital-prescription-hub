import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTimingPresets, setShowTimingPresets] = useState(false);
  const suggestionRef = useRef<HTMLTableCellElement>(null);
  const timingRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (timingRef.current && !timingRef.current.contains(e.target as Node)) {
        setShowTimingPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchMedicines = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const { data } = await supabase
      .from("medicines")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(8);
    if (data && data.length > 0) {
      setSuggestions(data);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectMedicine = (med: any) => {
    onChange(medicine.id, "name", med.name);
    onChange(medicine.id, "type", med.type);
    onChange(medicine.id, "composition", med.composition || "");
    setShowSuggestions(false);
  };

  const presets = TIMING_PRESETS[language];

  return (
    <tr className="border-b border-border hover:bg-accent/30 transition-colors group">
      <td className="p-2 text-center text-xs text-muted-foreground font-mono w-8">
        {index + 1}
      </td>
      <td className="p-2 relative" ref={suggestionRef}>
        <div className="flex gap-1 items-center">
          <select
            value={medicine.type}
            onChange={(e) => onChange(medicine.id, "type", e.target.value)}
            className="h-7 w-20 rounded border border-input bg-background px-1 text-xs focus:ring-1 focus:ring-ring"
          >
            {MEDICINE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Input
            value={medicine.name}
            onChange={(e) => {
              onChange(medicine.id, "name", e.target.value);
              searchMedicines(e.target.value);
            }}
            onFocus={() => medicine.name.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Medicine name"
            className="h-7 text-xs font-medium flex-1"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 w-full bg-card border border-border rounded-md shadow-lg mt-1 max-h-48 overflow-auto">
            {suggestions.map((s) => (
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
      </td>
      <td className="p-2">
        <div className="flex gap-0.5 items-center justify-center">
          <Input
            type="number"
            min={0}
            value={medicine.dosageMorning}
            onChange={(e) => onChange(medicine.id, "dosageMorning", parseInt(e.target.value) || 0)}
            className="h-7 w-10 text-xs text-center p-0"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            min={0}
            value={medicine.dosageAfternoon}
            onChange={(e) => onChange(medicine.id, "dosageAfternoon", parseInt(e.target.value) || 0)}
            className="h-7 w-10 text-xs text-center p-0"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            min={0}
            value={medicine.dosageNight}
            onChange={(e) => onChange(medicine.id, "dosageNight", parseInt(e.target.value) || 0)}
            className="h-7 w-10 text-xs text-center p-0"
          />
        </div>
      </td>
      <td className="p-2 relative" ref={timingRef}>
        <Input
          value={medicine.timingFreqDuration}
          onChange={(e) => onChange(medicine.id, "timingFreqDuration", e.target.value)}
          onFocus={() => setShowTimingPresets(true)}
          placeholder={language === "hi" ? "खाने से पहले - रोज़ - 60 दिन" : "Before food - Daily - 60 days"}
          className="h-7 text-xs"
        />
        {showTimingPresets && (
          <div className="absolute z-50 top-full left-0 w-full bg-card border border-border rounded-md shadow-lg mt-1 max-h-48 overflow-auto">
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
      </td>
      <td className="p-2">
        <Input
          type="number"
          min={0}
          value={medicine.quantity}
          onChange={(e) => onChange(medicine.id, "quantity", parseInt(e.target.value) || 0)}
          className="h-7 w-16 text-xs text-center"
        />
      </td>
      <td className="p-2 w-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(medicine.id)}
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </Button>
      </td>
    </tr>
  );
};

export default MedicineRow;
