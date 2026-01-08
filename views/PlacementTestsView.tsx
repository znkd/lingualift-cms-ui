import React, { useState, useRef } from 'react';
import { PlacementQuestion, QuestionType } from '../types';
import { ICONS, MOCK_QUESTIONS } from '../constants';

// Structured specification data mirroring the server response
const SPEC_DATA = {
  "file_format": {
    "encoding": "UTF-8-SIG (UTF-8 with BOM)",
    "extension": ".csv",
    "delimiter": ",",
    "has_header": true
  },
  "columns": {
    "target_word": {
      "required": true,
      "description": "目标单词",
      "format": "英文字母，可包含连字符(-)和单引号(')",
      "examples": ["apple", "beautiful", "computer", "mother-in-law", "don't"],
      "max_length": 100
    },
    "cefr_level": {
      "required": true,
      "description": "CEFR语言级别",
      "format": "大写字母+数字",
      "valid_values": ["A1", "A2", "B1", "B2", "C1", "C2"],
      "examples": ["A1", "A2", "B1", "B2", "C1", "C2"]
    },
    "correct_meaning": {
      "required": true,
      "description": "正确释义",
      "format": "中文释义",
      "examples": ["苹果", "美丽的", "电脑"],
      "max_length": 500
    },
    "distractors": {
      "required": true,
      "description": "干扰项（错误选项）",
      "format": "JSON数组格式，包含3个字符串",
      "examples": ["[\"梨子\", \"香蕉\", \"橙子\"]", "[\"丑陋的\", \"普通的\", \"平常的\"]"],
      "validation": {
        "type": "array",
        "min_items": 3,
        "max_items": 3,
        "item_type": "string",
        "unique": true,
        "cannot_contain_correct_meaning": true
      }
    }
  },
  "validation_rules": {
    "total_columns": 4,
    "required_fields": ["target_word", "cefr_level", "correct_meaning", "distractors"],
    "cefr_levels": ["A1", "A2", "B1", "B2", "C1", "C2"],
    "word_format": "只允许英文字母、连字符(-)和单引号(')",
    "distractor_count": "必须包含3个干扰项",
    "unique_distractors": "干扰项不能重复",
    "no_correct_in_distractors": "干扰项不能包含正确答案"
  },
  "example_rows": [
    {
      "target_word": "apple",
      "cefr_level": "A1",
      "correct_meaning": "苹果",
      "distractors": "[\"梨子\", \"香蕉\", \"橙子\"]"
    },
    {
      "target_word": "beautiful",
      "cefr_level": "B2",
      "correct_meaning": "美丽的",
      "distractors": "[\"丑陋的\", \"普通的\", \"平常的\"]"
    },
    {
      "target_word": "computer",
      "cefr_level": "A2",
      "correct_meaning": "电脑",
      "distractors": "[\"手机\", \"平板\", \"电视\"]"
    }
  ],
  "common_errors": [
    {
      "error": "列数不足",
      "description": "CSV文件必须包含4列数据",
      "solution": "确保每行都有target_word,cefr_level,correct_meaning,distractors"
    },
    {
      "error": "无效的CEFR级别",
      "description": "使用了无效的CEFR级别",
      "solution": "使用有效的级别: A1, A2, B1, B2, C1, C2"
    },
    {
      "error": "干扰项格式错误",
      "description": "干扰项不是有效的JSON数组",
      "solution": "确保干扰项格式为: [\"选项1\", \"选项2\", \"选项3\"]"
    },
    {
      "error": "干扰项数量错误",
      "description": "干扰项数量不是3个",
      "solution": "确保干扰项数组包含恰好3个选项"
    }
  ]
};

const PlacementTestsView: React.FC = () => {
  const [questions, setQuestions] = useState<PlacementQuestion[]>(MOCK_QUESTIONS);
  const [showSpec, setShowSpec] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const headers = "target_word,cefr_level,correct_meaning,distractors";
    const example1 = 'apple,A1,"苹果","[""梨子"", ""香蕉"", ""橙子""]"';
    const example2 = 'beautiful,B2,"美丽的","[""丑陋的"", ""普通的"", ""平常的""]"';
    const csvContent = "\uFEFF" + headers + "\n" + example1 + "\n" + example2;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "questions_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete ALL vocabulary records from the current view?')) {
      setQuestions([]);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const rows = parseCSV(text);
        const dataRows = rows.slice(1).filter(row => row.length >= 4);
        
        const newQuestions: PlacementQuestion[] = dataRows.map((row, index) => {
          const [targetWord, cefrLevel, correctMeaning, distractorsJson] = row;
          
          let distractors: string[] = [];
          try {
            const cleanJson = distractorsJson.replace(/""/g, '"');
            distractors = JSON.parse(cleanJson);
          } catch (err) {
            console.error("Failed to parse distractors JSON:", distractorsJson);
          }

          const options = [
            { id: 'a', text: correctMeaning },
            ...distractors.map((d, i) => ({ id: String.fromCharCode(98 + i), text: d }))
          ].slice(0, 4);

          return {
            id: `CSV-${Date.now()}-${index}`,
            type: QuestionType.VOCABULARY,
            targetWord: targetWord,
            cefrLevel: cefrLevel,
            content: `Choose the correct meaning for the word "${targetWord}":`,
            options,
            correctAnswerId: 'a',
            analysis: '',
            score: 5,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
          };
        });

        setQuestions(prev => [...newQuestions, ...prev]);
        alert(`Successfully imported ${newQuestions.length} words.`);
      } catch (err) {
        console.error("Import error:", err);
        alert("Failed to parse CSV file. Please ensure it follows the correct format.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    const rows = text.split(/\r?\n/);
    for (const row of rows) {
      if (!row.trim()) continue;
      const fields: string[] = [];
      let currentField = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            currentField += '"';
            i++;
          } else inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(currentField);
          currentField = '';
        } else currentField += char;
      }
      fields.push(currentField);
      lines.push(fields.map(f => f.trim().replace(/^"(.*)"$/, '$1')));
    }
    return lines;
  };

  const getLevelColor = (level: string) => {
    const cleanLevel = level.toUpperCase();
    if (cleanLevel.includes('A')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (cleanLevel.includes('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (cleanLevel.includes('C')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Placement Assets</h2>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Section 2.1: Vocabulary & Grading Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSpec(!showSpec)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold shadow-sm active:scale-95 border ${showSpec ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            {ICONS.Dashboard}
            Format Specification
          </button>
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-sm active:scale-95"
          >
            {ICONS.Add}
            Download Template
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={handleImportClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white border border-indigo-600 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 active:scale-95"
          >
            {ICONS.Import}
            Import CSV (Batch)
          </button>
          <button 
            onClick={handleDeleteAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all font-bold shadow-sm active:scale-95"
          >
            {ICONS.Delete}
            Clear All Data
          </button>
        </div>
      </div>

      {/* Requirement: CSV Format Specification UI Block - Dynamically Rendered */}
      {showSpec && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              CSV Format Specification Guide
            </h3>
            <button onClick={() => setShowSpec(false)} className="text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">Close Guide ×</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* File Format & Metadata */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">File Configuration</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SPEC_DATA.file_format).map(([key, val]) => (
                    <div key={key} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{key.replace('_', ' ')}</p>
                      <p className="text-xs font-bold text-slate-200 mt-1">{String(val)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Validation Rules</h4>
                <div className="space-y-2">
                  {Object.entries(SPEC_DATA.validation_rules).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-[11px]">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                      <span className="font-bold text-slate-400 uppercase w-32 shrink-0">{key.replace('_', ' ')}</span>
                      <span className="text-slate-200">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Errors & Troubleshooting */}
            <div className="bg-indigo-500/5 rounded-3xl border border-indigo-500/10 p-8">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Common Ingestion Errors</h4>
              <div className="space-y-6">
                {SPEC_DATA.common_errors.map((err, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      <span className="text-sm font-black text-slate-200">{err.error}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-xs text-slate-500">{err.description}</p>
                      <p className="text-xs text-indigo-400 font-bold italic">Solution: {err.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columns Section */}
          <div className="mt-12">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Column Structure Detail</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Added explicit typing for colVal to avoid union property access errors */}
              {Object.entries(SPEC_DATA.columns).map(([colKey, colVal]: [string, any]) => (
                <div key={colKey} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:border-indigo-500/50 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{colKey}</span>
                    {colVal.required && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Required</span>
                    )}
                  </div>
                  <h5 className="text-sm font-black text-white mb-2">{colVal.description}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{colVal.format}</p>
                  
                  {/* Property exists on some members of the union, cast to any fixes access */}
                  {colVal.max_length && (
                    <div className="mb-4">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Limit:</span>
                      <span className="text-[10px] text-slate-300 ml-2">{colVal.max_length} chars</span>
                    </div>
                  )}

                  {/* Property exists on some members of the union, cast to any fixes access */}
                  {colVal.valid_values && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {colVal.valid_values.map((v: string) => (
                        <span key={v} className="bg-indigo-500/20 text-indigo-300 text-[8px] font-bold px-1.5 py-0.5 rounded">{v}</span>
                      ))}
                    </div>
                  )}

                  {/* Property exists on some members of the union, cast to any fixes access */}
                  {colVal.validation && (
                    <div className="space-y-1 mt-4 pt-4 border-t border-white/5">
                      <p className="text-[8px] font-black text-indigo-500 uppercase mb-2">JSON Constraints</p>
                      <div className="text-[9px] text-slate-500 font-bold space-y-1">
                        <p>• MIN: {colVal.validation.min_items}</p>
                        <p>• MAX: {colVal.validation.max_items}</p>
                        <p>• UNIQUE ITEMS ONLY</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Example Rows Section */}
          <div className="mt-12 p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">Data Sample Rows (CSV Snippet)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-indigo-400 font-black uppercase tracking-widest border-b border-white/10">
                    <th className="pb-4 pr-4">target_word</th>
                    <th className="pb-4 pr-4">cefr_level</th>
                    <th className="pb-4 pr-4">correct_meaning</th>
                    <th className="pb-4 pr-4">distractors (JSON)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {SPEC_DATA.example_rows.map((row, i) => (
                    <tr key={i} className="text-slate-300 font-mono">
                      <td className="py-4 pr-4">{row.target_word}</td>
                      <td className="py-4 pr-4">{row.cefr_level}</td>
                      <td className="py-4 pr-4">{row.correct_meaning}</td>
                      <td className="py-4 pr-4 text-indigo-300/70 truncate max-w-[200px]">{row.distractors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Word</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Level</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Meanings (Correct & Distractors)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-indigo-50/30 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{q.targetWord}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{q.id}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase ${getLevelColor(q.cefrLevel)}`}>
                    {q.cefrLevel}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                      <span className="font-bold text-slate-900">{q.options.find(o => o.id === q.correctAnswerId)?.text}</span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Correct</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-4">
                      {q.options.filter(o => o.id !== q.correctAnswerId).map((dist, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">D{idx + 1}:</span>
                          <span className="text-xs font-medium text-slate-500">{dist.text || '---'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6 border border-dashed border-slate-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">Database is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementTestsView;