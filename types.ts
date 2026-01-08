export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  LISTENING = 'listening',
  READING = 'reading',
  VOCABULARY = 'vocabulary'
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface PlacementQuestion {
  id: string;
  type: QuestionType;
  targetWord: string;
  cefrLevel: string;
  content: string;
  options: QuestionOption[];
  correctAnswerId: string;
  analysis: string;
  score: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  status: 'active' | 'hidden';
  createdAt: string;
}

export interface Lesson {
  id: number;
  storage_key: string;
  source_id: string;
  title: string;
  topic: string;
  cefr_level: string;
  thumbnail_url: string;
  is_active: boolean;
  media_path: string;
  duration: number; // in seconds
  is_synced: boolean;
  target_words: any; // JSON
  script: any; // JSON
  word_analysis: any; // JSON
  quiz: any; // JSON
  created_at: string;
  updated_at: string;
}

export interface LessonImportHistory {
  id: string;
  filename: string;
  timestamp: string;
  status: 'success' | 'failed' | 'processing';
  successCount: number;
  failCount: number;
  type: 'ZIP' | 'CSV';
  errorMessage?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'super' | 'admin';
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface Statistics {
  totalQuestions: number;
  activeQuestions: number;
  totalAdmins: number;
}