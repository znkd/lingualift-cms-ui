
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  FileSpreadsheet,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  EyeOff,
  Eye,
  Sparkles
} from 'lucide-react';
import { QuestionType } from './types';

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Lessons: <BookOpen size={20} />,
  PlacementTests: <ClipboardCheck size={20} />,
  Admins: <Users size={20} />,
  Settings: <Settings size={20} />,
  Logout: <LogOut size={20} />,
  Add: <PlusCircle size={20} />,
  Import: <FileSpreadsheet size={20} />,
  Search: <Search size={18} />,
  Actions: <MoreVertical size={18} />,
  Edit: <Edit size={16} />,
  Delete: <Trash2 size={16} />,
  Hide: <EyeOff size={16} />,
  Show: <Eye size={16} />,
  AI: <Sparkles size={18} />
};

export const MOCK_QUESTIONS: any[] = [
  {
    id: 'PQ-1001',
    type: QuestionType.VOCABULARY,
    targetWord: 'achieve',
    cefrLevel: 'B1',
    content: 'Choose the correct meaning for the word "achieve":',
    options: [
      { id: 'a', text: '达成' },
      { id: 'b', text: '失败' },
      { id: 'c', text: '放弃' },
      { id: 'd', text: '尝试' }
    ],
    correctAnswerId: 'a',
    analysis: '"Achieve" means to successfully bring about or reach a desired objective.',
    score: 5,
    status: 'active',
    createdAt: '2024-03-20'
  },
  {
    id: 'PQ-1002',
    type: QuestionType.VOCABULARY,
    targetWord: 'ephemeral',
    cefrLevel: 'C2',
    content: 'Choose the correct meaning for the word "ephemeral":',
    options: [
      { id: 'a', text: '持久的' },
      { id: 'b', text: '短暂的' },
      { id: 'c', text: '永恒的' },
      { id: 'd', text: '永久的' }
    ],
    correctAnswerId: 'b',
    analysis: '"Ephemeral" describes something that lasts for a very short time.',
    score: 10,
    status: 'active',
    createdAt: '2024-03-21'
  },
  {
    id: 'PQ-1003',
    type: QuestionType.VOCABULARY,
    targetWord: 'kitchen',
    cefrLevel: 'A2',
    content: 'Choose the correct meaning for the word "kitchen":',
    options: [
      { id: 'a', text: '卧室' },
      { id: 'b', text: '客厅' },
      { id: 'c', text: '厨房' },
      { id: 'd', text: '浴室' }
    ],
    correctAnswerId: 'c',
    analysis: 'A kitchen is a room where food is prepared and cooked.',
    score: 2,
    status: 'active',
    createdAt: '2024-03-22'
  }
];

export const MOCK_ADMINS: any[] = [
  { id: '1', username: 'admin_eric', role: 'super', status: 'active', lastLogin: '2024-03-22 10:00' },
  { id: '2', username: 'content_manager', role: 'admin', status: 'active', lastLogin: '2024-03-21 14:30' }
];
