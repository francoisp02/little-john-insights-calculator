import React, { useState, useRef, useEffect } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  description?: string;
  formatValue?: (value: number) => string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  description,
  formatValue
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(formatValue ? formatValue(value) : value.toString());
  }, [value, formatValue]);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateSliderValue(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
    setInputValue(e.target.value);
    
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(formatValue ? formatValue(value) : value.toString());
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <label className="text-body font-medium text-foreground">
            {label}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`w-24 py-1 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold ${unit ? 'pl-2 pr-6 text-right' : 'px-2 text-right'}`}
            />
            {unit && <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-caption text-muted-foreground font-bold">{unit}</span>}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={sliderRef}
          className="slider-container cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <div
            className="slider-track"
            style={{ width: `${percentage}%` }}
          />
          <div
            className={`slider-thumb ${isDragging ? 'scale-110' : ''}`}
            style={{ left: `calc(${percentage}% - 12px)` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-caption text-muted-foreground">
          <span>{formatValue ? formatValue(min) : min} {unit}</span>
          <span>{formatValue ? formatValue(max) : max} {unit}</span>
        </div>
      </div>
    </div>
  );
};