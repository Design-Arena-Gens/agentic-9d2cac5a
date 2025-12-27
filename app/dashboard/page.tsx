'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DailyReport } from '@/lib/types';

export default function DashboardPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.status === 401) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setReports(data.reports);
      if (data.reports.length > 0) {
        setSelectedReport(data.reports[0]);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-report', { method: 'POST' });
      const data = await response.json();
      await fetchReports();
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  const exportToPDF = () => {
    if (!selectedReport) return;

    const content = document.getElementById('report-content');
    if (content) {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Chess Progress Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={generateNewReport}
                disabled={generating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate New Report'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Report List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports History</h2>
              <div className="space-y-2">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport?.id === report.id
                        ? 'bg-indigo-100 text-indigo-900 font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {new Date(report.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.overview.totalPuzzles} puzzles
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Report Details */}
          <div className="lg:col-span-3">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow" id="report-content">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Daily Progress Report
                      </h2>
                      <p className="text-gray-600">
                        {new Date(selectedReport.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={exportToPDF}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors print:hidden"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Overview Section */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Total Sessions</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {selectedReport.overview.totalSessions}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Total Puzzles</div>
                        <div className="text-2xl font-bold text-green-900">
                          {selectedReport.overview.totalPuzzles}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Active Students</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {selectedReport.overview.totalStudents}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-600 font-medium">New Books</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          {selectedReport.overview.newBooks}
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-600 font-medium">Avg Accuracy</div>
                        <div className="text-2xl font-bold text-indigo-900">
                          {selectedReport.overview.averageAccuracy.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Leaderboard Changes */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard Changes</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Change
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Points Change
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedReport.leaderboardChanges.map((change) => (
                            <tr key={change.studentId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {change.studentName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                #{change.currentRank}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {change.rankChange > 0 ? (
                                  <span className="text-green-600 font-medium">
                                    ↑ {change.rankChange}
                                  </span>
                                ) : change.rankChange < 0 ? (
                                  <span className="text-red-600 font-medium">
                                    ↓ {Math.abs(change.rankChange)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                +{change.pointsChange} pts
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Student Progress Details */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Progress Details</h3>
                    <div className="space-y-6">
                      {selectedReport.studentProgress.map((student) => (
                        <div key={student.studentId} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{student.studentName}</h4>
                              <p className="text-sm text-gray-600">
                                {student.sessionsCompleted} session(s) • {student.totalTimeSpent} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Points Earned</div>
                              <div className="text-2xl font-bold text-indigo-600">{student.pointsEarned}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="text-xs text-gray-600">Puzzles Attempted</div>
                              <div className="text-xl font-bold text-gray-900">{student.puzzlesAttempted}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded">
                              <div className="text-xs text-green-600">Correct</div>
                              <div className="text-xl font-bold text-green-900">{student.puzzlesCorrect}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded">
                              <div className="text-xs text-red-600">Incorrect</div>
                              <div className="text-xl font-bold text-red-900">{student.puzzlesIncorrect}</div>
                            </div>
                          </div>

                          {student.topicBreakdown.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Topic Breakdown</h5>
                              <div className="space-y-2">
                                {student.topicBreakdown.map((topic) => (
                                  <div key={topic.topic} className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{topic.topic}</span>
                                        <span className="text-gray-600">
                                          {topic.correct}/{topic.attempted} ({topic.accuracy.toFixed(0)}%)
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-indigo-600 h-2 rounded-full"
                                          style={{ width: `${topic.accuracy}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* New Books Section */}
                  {selectedReport.newBooks.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">New Books Added</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedReport.newBooks.map((book) => (
                          <div key={book.id} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900">{book.title}</h4>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Added: {new Date(book.addedAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">No reports available. Generate a new report to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          nav {
            display: none;
          }
          .print\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
