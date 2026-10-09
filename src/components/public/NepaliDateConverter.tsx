import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ArrowRightLeft,
  Clock,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sun,
  Compass,
  Info,
} from 'lucide-react';
import {
  NEPALI_MONTHS,
  GREGORIAN_MONTHS,
  WEEKDAYS,
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  MIN_AD_YEAR,
  MAX_AD_YEAR,
  getNepalCurrentDate,
  getLiveTodayNepal,
  getDaysInBsMonth,
  getDaysInAdMonth,
  convertAdToBs,
  convertBsToAd,
  toDevanagariNumerals,
  ConvertedBsDate,
  ConvertedAdDate,
} from '../../lib/nepaliDate';

type ConversionMode = 'AD_TO_BS' | 'BS_TO_AD';

// Nepali Seasons (Ritu) mapping
const RITU_MAP: Record<number, { nameEn: string; nameNp: string; desc: string }> = {
  0: { nameEn: 'Basanta (Spring)', nameNp: 'वसन्त ऋतु', desc: 'Flowering & New Year' },
  1: { nameEn: 'Basanta (Spring)', nameNp: 'वसन्त ऋतु', desc: 'Flowering & New Year' },
  2: { nameEn: 'Grishma (Summer)', nameNp: 'ग्रीष्म ऋतु', desc: 'Warmth & Early Monsoons' },
  3: { nameEn: 'Grishma (Summer)', nameNp: 'ग्रीष्म ऋतु', desc: 'Paddy Sowing & Greenery' },
  4: { nameEn: 'Barsha (Monsoon)', nameNp: 'वर्षा ऋतु', desc: 'Lush Rains & Festivals' },
  5: { nameEn: 'Barsha (Monsoon)', nameNp: 'वर्षा ऋतु', desc: 'Autumn Clearness & Dashain' },
  6: { nameEn: 'Sharad (Autumn)', nameNp: 'शरद ऋतु', desc: 'Tihar, Chhath & Festive Skies' },
  7: { nameEn: 'Sharad (Autumn)', nameNp: 'शरद ऋतु', desc: 'Harvest & Crisp Horizons' },
  8: { nameEn: 'Hemanta (Pre-winter)', nameNp: 'हेमन्त ऋतु', desc: 'Cool Breeze & Clear Himalayan Views' },
  9: { nameEn: 'Hemanta (Pre-winter)', nameNp: 'हेमन्त ऋतु', desc: 'Maghe Sankranti & Winter' },
  10: { nameEn: 'Shishir (Winter)', nameNp: 'शिशिर ऋतु', desc: 'Chilly Days & Shivaratri' },
  11: { nameEn: 'Shishir (Late Winter)', nameNp: 'शिशिर ऋतु', desc: 'Holi Colors & Spring Prelude' },
};

export const NepaliDateConverter: React.FC = () => {
  // 1. Live Current Date state in Nepal Timezone (Asia/Kathmandu)
  const [liveToday, setLiveToday] = useState(() => getLiveTodayNepal());
  const [liveTimeString, setLiveTimeString] = useState('');

  // Auto-refresh live date/time every 10 seconds to catch calendar rollover
  useEffect(() => {
    const updateTime = () => {
      setLiveToday(getLiveTodayNepal());
      try {
        const timeFmt = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kathmandu',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setLiveTimeString(timeFmt.format(new Date()));
      } catch {
        setLiveTimeString(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Conversion Mode: AD to BS or BS to AD
  const [mode, setMode] = useState<ConversionMode>('AD_TO_BS');

  // Input states for AD mode
  const [adYear, setAdYear] = useState(() => liveToday.ad.year);
  const [adMonth, setAdMonth] = useState(() => liveToday.ad.month);
  const [adDay, setAdDay] = useState(() => liveToday.ad.day);

  // Input states for BS mode
  const [bsYear, setBsYear] = useState(() => liveToday.bs.year);
  const [bsMonth, setBsMonth] = useState(() => liveToday.bs.month);
  const [bsDay, setBsDay] = useState(() => liveToday.bs.day);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Available days dynamically calculated based on current year/month selections
  const maxDaysInAd = useMemo(() => getDaysInAdMonth(adYear, adMonth), [adYear, adMonth]);
  const maxDaysInBs = useMemo(() => getDaysInBsMonth(bsYear, bsMonth), [bsYear, bsMonth]);

  // Ensure day selection stays within valid bounds when month/year changes
  useEffect(() => {
    if (adDay > maxDaysInAd) {
      setAdDay(maxDaysInAd);
    }
  }, [maxDaysInAd, adDay]);

  useEffect(() => {
    if (bsDay > maxDaysInBs) {
      setBsDay(maxDaysInBs);
    }
  }, [maxDaysInBs, bsDay]);

  // Conversion Results (computed reactively)
  const conversionResult = useMemo(() => {
    if (mode === 'AD_TO_BS') {
      const validDay = Math.min(Math.max(1, adDay), maxDaysInAd);
      const bs = convertAdToBs(adYear, adMonth, validDay);
      const adMonthMeta = GREGORIAN_MONTHS[adMonth] || GREGORIAN_MONTHS[0];
      const weekdayMeta = WEEKDAYS[bs.dayOfWeek] || WEEKDAYS[0];

      return {
        mode: 'AD_TO_BS' as const,
        source: {
          calendar: 'Gregorian (A.D.)',
          formattedEn: `${adMonthMeta.nameEn} ${validDay}, ${adYear}`,
          weekdayEn: weekdayMeta.nameEn,
          weekdayNp: weekdayMeta.nameNp,
          year: adYear,
          month: adMonth,
          day: validDay,
        },
        targetBs: bs,
        ritu: RITU_MAP[bs.bsMonth] || RITU_MAP[0],
      };
    } else {
      const validDay = Math.min(Math.max(1, bsDay), maxDaysInBs);
      const ad = convertBsToAd(bsYear, bsMonth, validDay);
      const bsMonthMeta = NEPALI_MONTHS[bsMonth] || NEPALI_MONTHS[0];
      const weekdayMeta = WEEKDAYS[ad.dayOfWeek] || WEEKDAYS[0];

      return {
        mode: 'BS_TO_AD' as const,
        source: {
          calendar: 'Bikram Sambat (B.S.)',
          formattedEn: `${bsYear} ${bsMonthMeta.nameEn} ${validDay}`,
          formattedNp: `${toDevanagariNumerals(bsYear)} ${bsMonthMeta.nameNp} ${toDevanagariNumerals(validDay)}`,
          weekdayEn: weekdayMeta.nameEn,
          weekdayNp: weekdayMeta.nameNp,
          year: bsYear,
          month: bsMonth,
          day: validDay,
        },
        targetAd: ad,
        targetBs: ad.bsEquivalent,
        ritu: RITU_MAP[bsMonth] || RITU_MAP[0],
      };
    }
  }, [mode, adYear, adMonth, adDay, bsYear, bsMonth, bsDay, maxDaysInAd, maxDaysInBs]);

  // Jump to today's date in Nepal
  const handleJumpToToday = () => {
    const today = getLiveTodayNepal();
    setLiveToday(today);
    setAdYear(today.ad.year);
    setAdMonth(today.ad.month);
    setAdDay(today.ad.day);
    setBsYear(today.bs.year);
    setBsMonth(today.bs.month);
    setBsDay(today.bs.day);
  };

  // Swap direction and synchronize current equivalent
  const handleSwapMode = () => {
    if (mode === 'AD_TO_BS') {
      // Swapping to BS -> AD: use current calculated BS date as the new BS input
      if (conversionResult.targetBs) {
        setBsYear(conversionResult.targetBs.bsYear);
        setBsMonth(conversionResult.targetBs.bsMonth);
        setBsDay(conversionResult.targetBs.bsDay);
      }
      setMode('BS_TO_AD');
    } else {
      // Swapping to AD -> BS: use current calculated AD date as the new AD input
      if (conversionResult.targetAd) {
        setAdYear(conversionResult.targetAd.adYear);
        setAdMonth(conversionResult.targetAd.adMonth);
        setAdDay(conversionResult.targetAd.adDay);
      }
      setMode('AD_TO_BS');
    }
  };

  // Step day +/- 1
  const handleStepDay = (delta: number) => {
    if (mode === 'AD_TO_BS') {
      const curDate = new Date(adYear, adMonth, adDay);
      curDate.setDate(curDate.getDate() + delta);
      setAdYear(curDate.getFullYear());
      setAdMonth(curDate.getMonth());
      setAdDay(curDate.getDate());
    } else {
      let nextDay = bsDay + delta;
      let nextMonth = bsMonth;
      let nextYear = bsYear;

      if (nextDay > maxDaysInBs) {
        nextMonth += 1;
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear += 1;
        }
        nextDay = 1;
      } else if (nextDay < 1) {
        nextMonth -= 1;
        if (nextMonth < 0) {
          nextMonth = 11;
          nextYear -= 1;
        }
        nextDay = getDaysInBsMonth(nextYear, nextMonth);
      }

      setBsYear(Math.min(Math.max(MIN_BS_YEAR, nextYear), MAX_BS_YEAR));
      setBsMonth(nextMonth);
      setBsDay(nextDay);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pre-generate Year dropdown options
  const bsYearsList = useMemo(() => {
    const years: number[] = [];
    for (let y = MAX_BS_YEAR; y >= MIN_BS_YEAR; y--) {
      years.push(y);
    }
    return years;
  }, []);

  const adYearsList = useMemo(() => {
    const years: number[] = [];
    for (let y = MAX_AD_YEAR; y >= MIN_AD_YEAR; y--) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs space-y-8 text-left transition-colors">
      {/* 1. Header & Live Nepal Timezone Banner */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Nepal Standard Calendar (Asia/Kathmandu • UTC+05:45)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Nepali Date Converter
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Production-grade, bi-directional Bikram Sambat (B.S.) ↔ Gregorian (A.D.) calendar conversion.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>
          </div>
        </div>

        {/* Live Current Date Display (Requirement 1: Exact dynamic date matching user brief) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 sm:p-8 shadow-lg shadow-blue-900/15">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Current Date
                </span>
                {liveTimeString && (
                  <span className="text-xs font-mono text-blue-100 flex items-center gap-1 opacity-90">
                    <Clock className="w-3 h-3" />
                    {liveTimeString} NPT
                  </span>
                )}
              </div>

              {/* Today's B.S. Date & Weekday */}
              <div className="pt-1">
                <p className="text-xs uppercase font-semibold text-blue-200 tracking-wider">Today (Bikram Sambat)</p>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {liveToday.bs.year} {liveToday.bs.monthNameEn} {liveToday.bs.day}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-blue-100 flex items-center gap-2">
                  <span>{liveToday.bs.weekdayNameEn}</span>
                  <span className="text-blue-300">•</span>
                  <span className="font-serif font-bold text-amber-200">
                    {toDevanagariNumerals(liveToday.bs.year)} {liveToday.bs.monthNameNp} {toDevanagariNumerals(liveToday.bs.day)}, {liveToday.bs.weekdayNameNp}
                  </span>
                </p>
              </div>
            </div>

            {/* Today's A.D. Date & Weekday */}
            <div className="md:text-right border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-8 space-y-1">
              <p className="text-xs uppercase font-semibold text-blue-200 tracking-wider">Gregorian (A.D.)</p>
              <h4 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {liveToday.ad.monthName} {liveToday.ad.day}, {liveToday.ad.year}
              </h4>
              <p className="text-sm font-medium text-blue-100">{liveToday.ad.weekdayName}</p>
              <div className="pt-2 text-[11px] text-blue-200/90 font-medium">
                Official Nepal Time • Kathmandu (UTC+05:45)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONVERTER CONTROLS & INTERFACE */}
      <div className="space-y-6">
        {/* Mode Selector Tabs & Direction Swap */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setMode('AD_TO_BS')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'AD_TO_BS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gregorian (A.D.) → Bikram Sambat (B.S.)
            </button>
            <button
              type="button"
              onClick={() => setMode('BS_TO_AD')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'BS_TO_AD'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bikram Sambat (B.S.) → Gregorian (A.D.)
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 px-1">
            <button
              type="button"
              onClick={handleSwapMode}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs active:scale-95"
              title="Swap conversion direction"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>Swap Direction</span>
            </button>
          </div>
        </div>

        {/* Input Form Controls */}
        <div className="bg-slate-50/80 dark:bg-[#121212]/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>
                {mode === 'AD_TO_BS'
                  ? 'Select Gregorian (A.D.) Date to Convert'
                  : 'Select Bikram Sambat (B.S.) Date to Convert'}
              </span>
            </label>

            {/* Day step buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStepDay(-1)}
                className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStepDay(1)}
                className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          {mode === 'AD_TO_BS' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* AD Year */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Year (A.D.)
                </span>
                <select
                  value={adYear}
                  onChange={(e) => setAdYear(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {adYearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* AD Month */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Month
                </span>
                <select
                  value={adMonth}
                  onChange={(e) => setAdMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {GREGORIAN_MONTHS.map((m) => (
                    <option key={m.index} value={m.index}>
                      {m.index + 1} - {m.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* AD Day */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Day
                  </span>
                  <span className="text-[10px] text-slate-400">Max: {maxDaysInAd} days</span>
                </div>
                <select
                  value={adDay}
                  onChange={(e) => setAdDay(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {Array.from({ length: maxDaysInAd }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* BS Year */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Year (B.S.)
                </span>
                <select
                  value={bsYear}
                  onChange={(e) => setBsYear(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {bsYearsList.map((y) => (
                    <option key={y} value={y}>
                      {y} ({toDevanagariNumerals(y)})
                    </option>
                  ))}
                </select>
              </div>

              {/* BS Month */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nepali Month
                </span>
                <select
                  value={bsMonth}
                  onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.index} value={m.index}>
                      {m.index + 1} - {m.nameEn} ({m.nameNp})
                    </option>
                  ))}
                </select>
              </div>

              {/* BS Day */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Gatey / Day
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Max: {maxDaysInBs} days ({toDevanagariNumerals(maxDaysInBs)})
                  </span>
                </div>
                <select
                  value={bsDay}
                  onChange={(e) => setBsDay(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                >
                  {Array.from({ length: maxDaysInBs }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d} ({toDevanagariNumerals(d)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 3. CONVERSION RESULT CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Conversion Result
            </span>
            <div className="text-xs text-blue-600 dark:text-sky-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calculated Accurately</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Bikram Sambat Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-[#1c2333] dark:to-[#171a26] border border-blue-100 dark:border-blue-900/40 relative overflow-hidden space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-sky-300 text-[11px] font-black uppercase tracking-wider">
                  Bikram Sambat (B.S.)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      conversionResult.targetBs?.formattedEn || '',
                      'bs-en'
                    )
                  }
                  className="p-1.5 rounded-lg hover:bg-blue-200/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Copy B.S. Date"
                >
                  {copiedKey === 'bs-en' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {conversionResult.targetBs?.formattedEn}
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-sky-400 font-serif mt-1">
                  {conversionResult.targetBs?.formattedNp}
                </p>
              </div>

              <div className="pt-2 border-t border-blue-200/60 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Weekday / Baar
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {conversionResult.targetBs?.weekdayEn} ({conversionResult.targetBs?.weekdayNp})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Nepali Season (Ritu)
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {conversionResult.ritu.nameEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Gregorian (A.D.) Result Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 relative overflow-hidden space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider">
                  Gregorian (A.D.)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      mode === 'AD_TO_BS'
                        ? `${conversionResult.source.formattedEn}, ${conversionResult.source.weekdayEn}`
                        : conversionResult.targetAd?.formattedEn || '';
                    handleCopyText(text, 'ad-en');
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Copy A.D. Date"
                >
                  {copiedKey === 'ad-en' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {mode === 'AD_TO_BS'
                    ? `${conversionResult.source.formattedEn}`
                    : `${conversionResult.targetAd?.monthEn} ${conversionResult.targetAd?.adDay}, ${conversionResult.targetAd?.adYear}`}
                </p>
                <p className="text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  {mode === 'AD_TO_BS'
                    ? conversionResult.source.weekdayEn
                    : conversionResult.targetAd?.weekdayEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    ISO Date
                  </span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {mode === 'AD_TO_BS'
                      ? `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`
                      : conversionResult.targetAd?.dateString}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Timezone
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Nepal Time (UTC+05:45)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Cultural & Calendar Quick Reference Table */}
        <div className="border border-slate-200 dark:border-white/10 rounded-2xl p-5 bg-slate-50/50 dark:bg-white/[0.02] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Info className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>Nepali Months Quick Guide (नेपाली महिनाहरू)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {NEPALI_MONTHS.map((m) => (
              <div
                key={m.index}
                className="p-2.5 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200/80 dark:border-white/10 text-center"
              >
                <span className="text-[10px] text-blue-600 dark:text-sky-400 font-bold block">
                  {m.index + 1}. {m.nameEn}
                </span>
                <span className="text-sm font-serif font-bold text-slate-900 dark:text-white block mt-0.5">
                  {m.nameNp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
