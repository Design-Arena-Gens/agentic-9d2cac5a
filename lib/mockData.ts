import { Student, PuzzleAttempt, Session, BookEntry, DailyReport, StudentProgress } from './types';

// Mock data store (in production, this would be a database)
export class DataStore {
  private static students: Student[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', totalPoints: 850, rank: 1 },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', totalPoints: 720, rank: 2 },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', totalPoints: 680, rank: 3 },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', totalPoints: 590, rank: 4 },
    { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', totalPoints: 540, rank: 5 },
  ];

  private static puzzleAttempts: PuzzleAttempt[] = [];
  private static sessions: Session[] = [];
  private static books: BookEntry[] = [];
  private static previousDayData: any = null;

  static initializeMockData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Generate puzzle attempts for today
    const topics = ['Opening Theory', 'Endgames', 'Tactics', 'Strategy', 'Checkmates'];

    this.students.forEach(student => {
      const puzzleCount = Math.floor(Math.random() * 50) + 50;

      for (let i = 0; i < puzzleCount; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const correct = Math.random() > 0.3;

        this.puzzleAttempts.push({
          id: `puzzle-${student.id}-${i}`,
          studentId: student.id,
          studentName: student.name,
          topic,
          puzzleId: `puzzle-${Math.floor(Math.random() * 1000)}`,
          correct,
          timestamp: new Date(today.getTime() - Math.random() * 24 * 60 * 60 * 1000),
          pointsEarned: correct ? Math.floor(Math.random() * 10) + 5 : 0,
        });
      }

      // Generate sessions for today
      const sessionCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < sessionCount; i++) {
        const startTime = new Date(today.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        const duration = Math.floor(Math.random() * 60) + 30;
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        this.sessions.push({
          id: `session-${student.id}-${i}`,
          studentId: student.id,
          studentName: student.name,
          startTime,
          endTime,
          duration,
          puzzlesCompleted: Math.floor(Math.random() * 30) + 10,
        });
      }
    });

    // Generate some new books added today
    const bookTitles = [
      'My System by Aron Nimzowitsch',
      'Bobby Fischer Teaches Chess',
      'Chess Tactics for Champions',
      'Endgame Strategy by Shereshevsky',
    ];

    bookTitles.forEach((title, index) => {
      if (Math.random() > 0.5) {
        this.books.push({
          id: `book-${index}`,
          title,
          author: 'Various Authors',
          category: 'Chess Education',
          addedBy: 'Admin',
          addedAt: new Date(today.getTime() - Math.random() * 24 * 60 * 60 * 1000),
        });
      }
    });

    // Store previous day rankings
    this.previousDayData = {
      rankings: this.students.map((s, idx) => ({
        studentId: s.id,
        rank: idx + 1,
        points: s.totalPoints - Math.floor(Math.random() * 100),
      })),
    };
  }

  static getStudents(): Student[] {
    return this.students;
  }

  static getTodaysPuzzleAttempts(): PuzzleAttempt[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.puzzleAttempts.filter(p => p.timestamp >= today);
  }

  static getTodaysSessions(): Session[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.sessions.filter(s => s.startTime >= today);
  }

  static getTodaysBooks(): BookEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.books.filter(b => b.addedAt >= today);
  }

  static generateDailyReport(): DailyReport {
    if (this.puzzleAttempts.length === 0) {
      this.initializeMockData();
    }

    const todayPuzzles = this.getTodaysPuzzleAttempts();
    const todaySessions = this.getTodaysSessions();
    const todayBooks = this.getTodaysBooks();

    const studentProgress: StudentProgress[] = this.students.map(student => {
      const studentPuzzles = todayPuzzles.filter(p => p.studentId === student.id);
      const studentSessions = todaySessions.filter(s => s.studentId === student.id);

      const correct = studentPuzzles.filter(p => p.correct).length;
      const incorrect = studentPuzzles.filter(p => !p.correct).length;

      // Topic breakdown
      const topicMap = new Map<string, { attempted: number; correct: number }>();
      studentPuzzles.forEach(puzzle => {
        const existing = topicMap.get(puzzle.topic) || { attempted: 0, correct: 0 };
        topicMap.set(puzzle.topic, {
          attempted: existing.attempted + 1,
          correct: existing.correct + (puzzle.correct ? 1 : 0),
        });
      });

      const topicBreakdown = Array.from(topicMap.entries()).map(([topic, stats]) => ({
        topic,
        attempted: stats.attempted,
        correct: stats.correct,
        incorrect: stats.attempted - stats.correct,
        accuracy: stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0,
      }));

      const pointsEarned = studentPuzzles.reduce((sum, p) => sum + p.pointsEarned, 0);
      const totalTimeSpent = studentSessions.reduce((sum, s) => sum + s.duration, 0);

      const previousRank = this.previousDayData?.rankings.find((r: any) => r.studentId === student.id)?.rank || student.rank;
      const rankChange = previousRank - student.rank;

      return {
        studentId: student.id,
        studentName: student.name,
        puzzlesAttempted: studentPuzzles.length,
        puzzlesCorrect: correct,
        puzzlesIncorrect: incorrect,
        topicBreakdown,
        pointsEarned,
        sessionsCompleted: studentSessions.length,
        totalTimeSpent,
        rankChange,
      };
    });

    const totalCorrect = todayPuzzles.filter(p => p.correct).length;
    const averageAccuracy = todayPuzzles.length > 0 ? (totalCorrect / todayPuzzles.length) * 100 : 0;

    const leaderboardChanges = this.students.map(student => {
      const previousData = this.previousDayData?.rankings.find((r: any) => r.studentId === student.id);
      return {
        studentId: student.id,
        studentName: student.name,
        previousRank: previousData?.rank || student.rank,
        currentRank: student.rank,
        rankChange: (previousData?.rank || student.rank) - student.rank,
        pointsChange: student.totalPoints - (previousData?.points || student.totalPoints),
      };
    }).sort((a, b) => b.rankChange - a.rankChange);

    return {
      id: `report-${Date.now()}`,
      date: new Date(),
      generatedAt: new Date(),
      overview: {
        totalSessions: todaySessions.length,
        totalPuzzles: todayPuzzles.length,
        totalStudents: this.students.length,
        newBooks: todayBooks.length,
        averageAccuracy,
      },
      studentProgress,
      newBooks: todayBooks,
      leaderboardChanges,
    };
  }

  static getAllReports(): DailyReport[] {
    // For demo, generate reports for the last 7 days
    const reports: DailyReport[] = [];
    const baseReport = this.generateDailyReport();

    for (let i = 0; i < 7; i++) {
      const reportDate = new Date();
      reportDate.setDate(reportDate.getDate() - i);
      reportDate.setHours(8, 0, 0, 0);

      reports.push({
        ...baseReport,
        id: `report-${reportDate.getTime()}`,
        date: reportDate,
        generatedAt: reportDate,
      });
    }

    return reports.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

// Initialize data on module load
DataStore.initializeMockData();
