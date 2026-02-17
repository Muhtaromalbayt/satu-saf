export type NodeType = 'story' | 'recite' | 'challenge' | 'action' | 'quiz' | 'checklist' | 'pair_matching';
export type NodeStatus = 'locked' | 'active' | 'completed';

export interface LevelNodeData {
    id: string;
    type: NodeType;
    status: NodeStatus;
    label?: string; // e.g. "1", "Start"
}

export interface Chapter {
    id: string;
    title: string;
    description: string;
    nodes: LevelNodeData[];
    colorTheme?: string;
}

export type SlideType = 'story' | 'quiz' | 'recite' | 'action' | 'checklist' | 'pair_matching';

export interface Slide {
    id: string;
    type: SlideType;
    content: any;
}

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'student' | 'mentor' | 'parent';
    xp: number;
    hearts: number;
    streak_count: number;
    kelas?: string;
    gender?: string;
    last_active_at?: number;
    group_id?: string;
}
