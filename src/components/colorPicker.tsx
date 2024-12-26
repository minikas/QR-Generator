import { Input } from "./ui/input";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors: string[];
};

export const ColorPicker = ({
  label,
  value,
  onChange,
  presetColors,
}: ColorPickerProps) => (
  <div>
    <h3 className="font-semibold text-xs opacity-50">{label}</h3>
    <div className="flex gap-2 mt-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-md hover:scale-110 transition-all"
      />
      {presetColors.map((color) => (
        <button
          key={color}
          className="min-w-9 h-9 rounded-md hover:scale-110 transition-all"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  </div>
);
