import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface DateRangePickerProps {
  value: string; // Format: "YYYY-MM-DD ~ YYYY-MM-DD"
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '选择日期范围',
  disabled = false,
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Parse initial value
  useEffect(() => {
    if (value && value.includes('~')) {
      const [start, end] = value.split('~').map(d => d.trim());
      setStartDate(start);
      setEndDate(end);
    }
  }, [value]);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date
  const getToday = (): string => formatDate(new Date());

  // Get date 7 days ago
  const get7DaysAgo = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDate(date);
  };

  // Get date 30 days ago
  const get30DaysAgo = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return formatDate(date);
  };

  // Get this month start date
  const getThisMonthStart = (): string => {
    const date = new Date();
    date.setDate(1);
    return formatDate(date);
  };

  // Get this year start date
  const getThisYearStart = (): string => {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    return formatDate(date);
  };

  // Quick range presets
  const presets = [
    { label: '今天', start: getToday(), end: getToday() },
    { label: '昨天', start: formatDate(new Date(Date.now() - 86400000)), end: formatDate(new Date(Date.now() - 86400000)) },
    { label: '近7天', start: get7DaysAgo(), end: getToday() },
    { label: '近30天', start: get30DaysAgo(), end: getToday() },
    { label: '本月', start: getThisMonthStart(), end: getToday() },
    { label: '今年', start: getThisYearStart(), end: getToday() },
  ];

  // Validate date range
  const validateRange = (start: string, end: string): boolean => {
    if (!start || !end) {
      setError('请选择开始和结束日期');
      return false;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) {
      setError('开始日期不能晚于结束日期');
      return false;
    }

    if (minDate && start < minDate) {
      setError(`开始日期不能早于 ${minDate}`);
      return false;
    }

    if (maxDate && end > maxDate) {
      setError(`结束日期不能晚于 ${maxDate}`);
      return false;
    }

    setError('');
    return true;
  };

  // Apply date range
  const applyRange = () => {
    if (validateRange(startDate, endDate)) {
      onChange(`${startDate} ~ ${endDate}`);
      setIsOpen(false);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setStartDate('');
    setEndDate('');
    setError('');
    onChange('');
    setIsOpen(false);
  };

  // Handle preset click
  const handlePresetClick = (preset: typeof presets[0]) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
    onChange(`${preset.start} ~ ${preset.end}`);
    setIsOpen(false);
  };

  // Handle input change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (endDate && e.target.value > endDate) {
      setEndDate(e.target.value);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (!element.closest('.date-range-picker')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`date-range-picker relative ${className}`}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left transition-all ${
          disabled
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'border-emerald-500 bg-emerald-50 shadow-md'
            : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:outline-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-sm text-slate-600">
            {value || placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in slide-in-from-top duration-200">
          {/* Presets */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Inputs */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={minDate}
                  max={maxDate || endDate || undefined}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
              
              <span className="text-slate-400 font-medium">~</span>
              
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || minDate}
                  max={maxDate}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <X size={12} />
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              清除
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={applyRange}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
