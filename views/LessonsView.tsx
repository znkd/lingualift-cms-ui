import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';
import { Lesson } from '../types';

const LessonsView: React.FC = () => {
  // Mock initial database state mirroring the SQLAlchemy Lesson model
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      storage_key: '550e8400-e29b-41d4-a716-446655440000',
      source_id: 'LSN-A1-001',
      title: 'Greetings & Basic Phrases',
      topic: 'Introduction to standard English greetings and social etiquette.',
      cefr_level: 'A1',
      thumbnail_url: 'https://images.unsplash.com/photo-1523240715630-39130799480a?w=100&h=100&fit=crop',
      is_active: true,
      media_path: '550e8400-e29b-41d4-a716-446655440000/intro_lesson.mp4',
      duration: 245,
      is_synced: true,
      target_words: ['Hello', 'Welcome', 'Please', 'Thank you'],
      script: [{ speaker: 'Narrator', text: 'Welcome to your first lesson.' }],
      word_analysis: { 'Hello': 'Common greeting' },
      quiz: { questions: 5 },
      created_at: '2024-03-20 09:00',
      updated_at: '2024-03-20 09:00'
    },
    {
      id: 2,
      storage_key: '7c9e6639-6150-4822-8250-93437532308e',
      source_id: 'LSN-B2-042',
      title: 'Business Negotiation',
      topic: 'Advanced strategies for corporate communication and deals.',
      cefr_level: 'B2',
      thumbnail_url: '',
      is_active: true,
      media_path: '7c9e6639-6150-4822-8250-93437532308e/business_v1.mp4',
      duration: 720,
      is_synced: false,
      target_words: ['Leverage', 'Synergy', 'Bottom-line', 'Stakeholder'],
      script: [],
      word_analysis: {},
      quiz: {},
      created_at: '2024-03-22 14:30',
      updated_at: '2024-03-22 14:30'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    const l = level.toUpperCase();
    if (l.startsWith('A')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (l.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (l.startsWith('C')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.zip')) {
      if (file) alert('Only ZIP packages are supported.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        
        setTimeout(() => {
          const newLesson: Lesson = {
            id: lessons.length + 1,
            storage_key: crypto.randomUUID(),
            source_id: `AUTO-${Math.floor(Math.random() * 10000)}`,
            title: file.name.replace('.zip', '').split('_').join(' '),
            topic: 'Newly ingested learning content package.',
            cefr_level: ['A1', 'A2', 'B1', 'B2', 'C1'][Math.floor(Math.random() * 5)],
            thumbnail_url: '',
            is_active: true,
            media_path: `${crypto.randomUUID()}/main_video.mp4`,
            duration: Math.floor(Math.random() * 500) + 120,
            is_synced: false,
            target_words: ['Vocabulary', 'Placeholder', 'Content'],
            script: null,
            word_analysis: null,
            quiz: null,
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString()
          };

          setLessons(prev => [newLesson, ...prev]);
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 600);
      } else {
        setUploadProgress(progress);
      }
    }, 250);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Content Repository</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-1">Section 3.0: Core Lesson Data & Asset Management</p>
      </div>

      {/* Upload Section - Restored Drag & Select Style */}
      {!isUploading ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative bg-white border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-[0.99] shadow-sm shadow-slate-100"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".zip"
            onChange={handleUpload}
          />
          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-white group-hover:shadow-xl transition-all mb-6">
            {ICONS.Import}
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Drop ZIP package here</h4>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Or click to browse files (Max 100MB)
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 p-12 rounded-[2.5rem] text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-[1.5rem] flex items-center justify-center animate-bounce shadow-lg shadow-indigo-500/40">
                {ICONS.Import}
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight">Ingesting Media Assets</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Processing folder hierarchy & metadata...</p>
              </div>
            </div>
            <span className="text-4xl font-black text-indigo-400">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Repository Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-900">Registered Lessons</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repository Volume</p>
            <p className="text-sm font-black text-indigo-600">{lessons.length} ACTIVE ENTRIES</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source ID & Title</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CEFR Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Vocabulary</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Media & Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-indigo-50/10 transition-all group">
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {lesson.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                        UUID: {lesson.storage_key.split('-')[0]}... / {lesson.source_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black border uppercase shadow-sm ${getLevelColor(lesson.cefr_level)}`}>
                      {lesson.cefr_level}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {lesson.target_words && Array.isArray(lesson.target_words) ? (
                        lesson.target_words.slice(0, 3).map((word, idx) => (
                          <span key={idx} className="bg-white text-slate-600 text-[10px] font-black px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                            {word}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-300 text-[10px] italic">Empty</span>
                      )}
                      {lesson.target_words && lesson.target_words.length > 3 && (
                        <span className="text-[10px] font-black text-indigo-500 flex items-center ml-1">
                          +{lesson.target_words.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[180px] flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                        {lesson.media_path.split('/').pop()}
                      </span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {formatDuration(lesson.duration)}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${lesson.is_synced ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {lesson.is_synced ? 'Synced' : 'Local'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {lessons.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                {ICONS.Lessons}
              </div>
              <h4 className="text-2xl font-black text-slate-900">Repository is Empty</h4>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Upload a content package to begin management</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonsView;