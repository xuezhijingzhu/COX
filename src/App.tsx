/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Info, Activity, Moon, Sun, Printer, FileText, ChevronDown, ChevronUp, Beaker, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONFIG = {
  cutoffs: { age: 67, afp: 14.62, ca19_9: 20.75, sma: 164.7, smd: 34.93, lsr: 1.1956 },
  points: { age: 2, transfusion: 1, afp: 1, ca19_9: 2, sma: 3, smd: 1, lsr: 1 },
  riskGroups: {
    low: { min: 0, max: 5, label: 'Low risk', description: 'Patient is categorized in the low-risk group based on clinical parameters.', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    high: { min: 6, max: 11, label: 'High risk', description: 'Patient is categorized in the high-risk group based on clinical parameters.', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' }
  }
};

type FormData = { age: string; transfusion: 'No' | 'Yes' | ''; afp: string; ca19_9: string; sma: string; smd: string; lsr: string; };
const initialData: FormData = { age: '', transfusion: '', afp: '', ca19_9: '', sma: '', smd: '', lsr: '' };
const demoData: FormData = { age: '68', transfusion: 'Yes', afp: '15.0', ca19_9: '21.0', sma: '150.0', smd: '30.0', lsr: '1.2' };

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [result, setResult] = useState<{ score: number; riskGroup: typeof CONFIG.riskGroups.low; details: Array<{variable: string; points: number; reason: string}> } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isLangEn, setIsLangEn] = useState(true);

  useEffect(() => {
    isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleCalculate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (formData[key] === '') { newErrors[key] = 'Required'; isValid = false; }
    });
    if (!isValid) return setErrors(newErrors);
    setErrors({});

    const vals = {
      age: parseFloat(formData.age), afp: parseFloat(formData.afp), ca19_9: parseFloat(formData.ca19_9),
      sma: parseFloat(formData.sma), smd: parseFloat(formData.smd), lsr: parseFloat(formData.lsr)
    };

    let score = 0; const details = [];
    if (vals.age >= CONFIG.cutoffs.age) { score += CONFIG.points.age; details.push({ variable: 'Age', points: CONFIG.points.age, reason: `>= ${CONFIG.cutoffs.age}` }); } else details.push({ variable: 'Age', points: 0, reason: `< ${CONFIG.cutoffs.age}` });
    if (formData.transfusion === 'Yes') { score += CONFIG.points.transfusion; details.push({ variable: 'Transfusion', points: CONFIG.points.transfusion, reason: 'Yes' }); } else details.push({ variable: 'Transfusion', points: 0, reason: 'No' });
    if (vals.afp >= CONFIG.cutoffs.afp) { score += CONFIG.points.afp; details.push({ variable: 'AFP', points: CONFIG.points.afp, reason: `>= ${CONFIG.cutoffs.afp}` }); } else details.push({ variable: 'AFP', points: 0, reason: `< ${CONFIG.cutoffs.afp}` });
    if (vals.ca19_9 >= CONFIG.cutoffs.ca19_9) { score += CONFIG.points.ca19_9; details.push({ variable: 'CA 19-9', points: CONFIG.points.ca19_9, reason: `>= ${CONFIG.cutoffs.ca19_9}` }); } else details.push({ variable: 'CA 19-9', points: 0, reason: `< ${CONFIG.cutoffs.ca19_9}` });
    if (vals.sma < CONFIG.cutoffs.sma) { score += CONFIG.points.sma; details.push({ variable: 'SMA', points: CONFIG.points.sma, reason: `< ${CONFIG.cutoffs.sma}` }); } else details.push({ variable: 'SMA', points: 0, reason: `>= ${CONFIG.cutoffs.sma}` });
    if (vals.smd < CONFIG.cutoffs.smd) { score += CONFIG.points.smd; details.push({ variable: 'SMD', points: CONFIG.points.smd, reason: `< ${CONFIG.cutoffs.smd}` }); } else details.push({ variable: 'SMD', points: 0, reason: `>= ${CONFIG.cutoffs.smd}` });
    if (vals.lsr >= CONFIG.cutoffs.lsr) { score += CONFIG.points.lsr; details.push({ variable: 'LSR', points: CONFIG.points.lsr, reason: `>= ${CONFIG.cutoffs.lsr}` }); } else details.push({ variable: 'LSR', points: 0, reason: `< ${CONFIG.cutoffs.lsr}` });

    const riskGroup = score >= CONFIG.riskGroups.high.min ? CONFIG.riskGroups.high : CONFIG.riskGroups.low;
    setResult({ score, riskGroup, details });
    setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
  };

  const wrapInput = (field: keyof FormData, label: string, unit?: string) => (
    <div className="flex flex-col gap-1.5 pt-2 relative">
      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.05em] dark:text-slate-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number" step="any" value={formData[field]}
          onChange={(e) => {
            setFormData({ ...formData, [field]: e.target.value });
            if (errors[field]) setErrors({ ...errors, [field]: undefined });
          }}
          className={`w-full px-3 py-2.5 bg-transparent border rounded-md text-[15px] focus:outline-none transition-colors dark:text-white
            ${errors[field] ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500'}`}
          placeholder="..."
        />
        {unit && <span className="absolute right-3 text-[12px] text-slate-500 pointer-events-none">{unit}</span>}
      </div>
      {errors[field] && <p className="absolute -bottom-4 left-0 text-[10px] text-rose-500 font-medium">{isLangEn ? 'Required' : '必填'}</p>}
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 flex flex-col overflow-x-hidden lg:overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <header className="px-6 lg:px-10 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 shadow-sm print:shadow-none">
        <div>
          <h1 className="font-serif text-[24px] italic text-teal-600 dark:text-teal-500">
            {isLangEn ? 'Simplified Cox Risk Stratification ' : '简化项 Cox 风险分层 '}
            <span className="font-sans font-light text-[16px] text-slate-500 dark:text-slate-400 not-italic block md:inline md:ml-2">
               {isLangEn ? 'Clinical Prediction Tool v1.0' : '临床预测工具 v1.0'}
            </span>
          </h1>
        </div>
        
        {/* Actions Menu */}
        <div className="flex items-center gap-2 print:hidden shrink-0">
          <button onClick={() => setIsLangEn(!isLangEn)} className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-slate-500 hover:text-teal-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors whitespace-nowrap">
            {isLangEn ? 'EN | ZH' : '中 | EN'}
          </button>
          <button onClick={() => { setFormData(demoData); setErrors({}); }} className="p-1.5 text-slate-500 hover:text-teal-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors" title={isLangEn ? 'Load Demo' : '加载示例'}>
            <Beaker className="w-4 h-4" />
          </button>
          <button onClick={() => window.print()} className="p-1.5 text-slate-500 hover:text-teal-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors" title={isLangEn ? 'Print Result' : '打印'}>
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={() => setIsDark(!isDark)} className="p-1.5 text-slate-500 hover:text-teal-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors" title={isLangEn ? 'Toggle Dark Mode' : '日夜主题'}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-[2px] bg-slate-200 dark:bg-slate-800 lg:overflow-hidden print:block print:h-auto print:overflow-visible">
        
        {/* Form Panel */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-10 lg:p-10 lg:overflow-y-auto print:p-0 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 mb-8">
            {wrapInput('age', isLangEn ? 'Age' : '年龄', isLangEn ? 'years' : '岁')}
            
            <div className="flex flex-col gap-1.5 pt-2 relative">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.05em] dark:text-slate-400">
                {isLangEn ? 'Intraoperative Transfusion' : '术中输血'}
              </label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center py-2.5 border rounded-md cursor-pointer text-[14px] transition-all
                  ${formData.transfusion === 'No' ? 'bg-teal-600 text-white border-teal-600 dark:border-teal-500 dark:bg-teal-500' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="transfusion" value="No" className="hidden" checked={formData.transfusion === 'No'} onChange={() => { setFormData({...formData, transfusion: 'No'}); setErrors({...errors, transfusion: undefined}); }} />
                  {isLangEn ? 'No' : '否'}
                </label>
                <label className={`flex-1 flex items-center justify-center py-2.5 border rounded-md cursor-pointer text-[14px] transition-all
                  ${formData.transfusion === 'Yes' ? 'bg-teal-600 text-white border-teal-600 dark:border-teal-500 dark:bg-teal-500' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="transfusion" value="Yes" className="hidden" checked={formData.transfusion === 'Yes'} onChange={() => { setFormData({...formData, transfusion: 'Yes'}); setErrors({...errors, transfusion: undefined}); }} />
                  {isLangEn ? 'Yes' : '是'}
                </label>
              </div>
              {errors.transfusion && <p className="absolute -bottom-4 left-0 text-[10px] text-rose-500 font-medium">{isLangEn ? 'Required' : '必填'}</p>}
            </div>

            {wrapInput('afp', 'AFP', 'ng/mL')}
            {wrapInput('ca19_9', 'CA 19-9', 'U/mL')}
            {wrapInput('sma', isLangEn ? 'Skeletal Muscle Area (SMA)' : '骨骼肌面积 (SMA)', 'cm²')}
            {wrapInput('smd', isLangEn ? 'Skeletal Muscle Density (SMD)' : '骨骼肌密度 (SMD)', 'HU')}
            {wrapInput('lsr', isLangEn ? 'Liver-to-Spleen Ratio (LSR)' : '肝脾比 (LSR)', 'Ratio')}
          </div>

          <div className="flex gap-3 pt-4 print:hidden mt-auto">
            <button onClick={handleCalculate} className="px-6 py-3 rounded-md font-semibold text-[14px] bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 transition focus:outline-none">
              {isLangEn ? 'Calculate Risk Score' : '计算得分'}
            </button>
            <button onClick={() => { setFormData(initialData); setResult(null); setErrors({}); }} className="px-6 py-3 rounded-md font-semibold text-[14px] bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition focus:outline-none">
              {isLangEn ? 'Reset' : '重置'}
            </button>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <p className="mt-4 text-[13px] text-rose-600 dark:text-rose-400 font-medium print:hidden flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {isLangEn ? 'Please complete all required fields.' : '请填写完整所有必填项。'}
            </p>
          )}

          {/* Model Scoring Rules reference */}
          <div className="mt-10 border-t border-dashed border-slate-200 dark:border-slate-700 pt-5 print:hidden">
            <button onClick={() => setShowRules(!showRules)} className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 hover:text-teal-600 transition-colors focus:outline-none mb-3">
              <FileText className="w-4 h-4" /> {isLangEn ? 'Model Scoring Rules' : '评分标准参考'}
              {showRules ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {showRules && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-2 space-y-1">
                    <p><strong>Rules:</strong> Age &ge; 67 (2 pts), Transfusion: Yes (1 pt), AFP &ge; {CONFIG.cutoffs.afp} (1 pt), CA 19-9 &ge; {CONFIG.cutoffs.ca19_9} (2 pts), SMA &lt; {CONFIG.cutoffs.sma} (3 pts), SMD &lt; {CONFIG.cutoffs.smd} (1 pt), LSR &ge; {CONFIG.cutoffs.lsr} (1 pt).</p>
                    <p><strong>Thresholds:</strong> Low Risk (0-5), High Risk (6-11).</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results Panel */}
        <section id="result-section" className="bg-teal-50/50 dark:bg-slate-900 overflow-y-auto flex flex-col justify-center items-center text-center p-8 md:p-10 print:mt-10 print:border-none print:p-0">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm flex flex-col items-center">
                
                <div className="w-[160px] h-[160px] shrink-0 rounded-full bg-white dark:bg-slate-950 mb-7 flex flex-col justify-center items-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border-4 border-teal-600 dark:border-teal-500 print:border-slate-300">
                  <span className="text-[56px] font-extrabold text-teal-600 dark:text-teal-400 leading-none print:text-black">{result.score}</span>
                  <span className="text-[12px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 mt-2">{isLangEn ? 'Total Points' : '总分'}</span>
                </div>
                
                <div className={`px-6 py-2 rounded-full font-bold text-[18px] mb-4 uppercase ${result.riskGroup.color} print:bg-white print:text-black print:border print:border-slate-300`}>
                  {isLangEn ? result.riskGroup.label : (result.riskGroup.label === 'Low risk' ? '低风险' : '高风险')}
                </div>
                
                <p className="text-[14px] text-slate-500 dark:text-slate-400">
                  {isLangEn ? result.riskGroup.description : (result.riskGroup.label === 'Low risk' ? '根据当前评分系统，患者属于低风险组。' : '根据当前评分系统，患者属于高风险组。')}
                </p>

                <div className="text-left mt-8 bg-white/50 dark:bg-slate-950/50 rounded-xl p-5 w-full border border-teal-100/50 dark:border-white/5 print:border-slate-300">
                  <div className="flex flex-col">
                    {result.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between text-[13px] py-1.5 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0 print:border-slate-200">
                        <span className="text-slate-600 dark:text-slate-300 print:text-black">{detail.variable} Points</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 print:text-black">{detail.points > 0 ? detail.points : '0'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm flex flex-col items-center opacity-40 grayscale pointer-events-none select-none print:hidden">
                <div className="w-[160px] h-[160px] rounded-full bg-white dark:bg-slate-900 mb-7 flex flex-col justify-center items-center shadow border-4 border-slate-300 dark:border-slate-700">
                  <span className="text-[56px] font-extrabold text-slate-400 leading-none">-</span>
                  <span className="text-[12px] uppercase tracking-[0.1em] text-slate-400 mt-2">{isLangEn ? 'Total Points' : '总分'}</span>
                </div>
                <p className="text-[14px] text-slate-500 max-w-xs mx-auto">
                   {isLangEn ? 'Enter patient parameters and calculate to see risk stratification.' : '输入患者参数计算查看风险。'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="shrink-0 py-3 px-6 lg:px-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-center flex flex-col md:flex-row justify-between items-center z-10 print:hidden">
        <div className="flex items-center justify-center gap-1.5 mb-1 md:mb-0"><Info className="w-3 h-3"/> Disclaimer: This tool is for research and educational use only and should not replace clinical judgment.</div>
        <div>Version 1.0.2 • Built for Clinical Research</div>
      </footer>
    </div>
  );
}
