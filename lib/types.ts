export interface Student {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  rank: number;
}

export interface PuzzleAttempt {
  id: string;
  studentId: string;
  studentName: string;
  topic: string;
  puzzleId: string;
  correct: boolean;
  timestamp: Date;
  pointsEarned: number;
}

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  puzzlesCompleted: number;
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  category: string;
  addedBy: string;
  addedAt: Date;
}

export interface DailyChange {
  date: Date;
  type: 'puzzle' | 'session' | 'book' | 'leaderboard';
  description: string;
  details: any;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  puzzlesAttempted: number;
  puzzlesCorrect: number;
  puzzlesIncorrect: number;
  topicBreakdown: {
    topic: string;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  }[];
  pointsEarned: number;
  sessionsCompleted: number;
  totalTimeSpent: number;
  rankChange: number;
}

export interface DailyReport {
  id: string;
  date: Date;
  generatedAt: Date;
  overview: {
    totalSessions: number;
    totalPuzzles: number;
    totalStudents: number;
    newBooks: number;
    averageAccuracy: number;
  };
  studentProgress: StudentProgress[];
  newBooks: BookEntry[];
  leaderboardChanges: {
    studentId: string;
    studentName: string;
    previousRank: number;
    currentRank: number;
    rankChange: number;
    pointsChange: number;
  }[];
}
