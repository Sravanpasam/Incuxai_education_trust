import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HR_COURSE, type Lesson, type Chapter, type QuizQuestion } from '../../data/hrCourseData';
import { useAuth } from '../context/AuthContext';

const PROGRESS_KEY = 'incuxai_hr_progress';
const WATCH_THRESHOLD = 0.8;

interface LessonProgress {
  completed: boolean;
  watchPercent: number;
  lastPosition: number;
  quizScore?: number;
  notes?: string;
  timestamp: number;
}

interface CourseProgress {
  completedLessons: string[];
  lessonProgress: Record<string, LessonProgress>;
  currentLessonId: string;
  lastAccessed: number;
  totalWatchTime: number;
}

function loadProgress(): CourseProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    completedLessons: [],
    lessonProgress: {},
    currentLessonId: HR_COURSE.chapters[0].lessons[0].id,
    lastAccessed: Date.now(),
    totalWatchTime: 0,
  };
}

function saveProgress(p: CourseProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...p, lastAccessed: Date.now() }));
}

function getAllLessons(): { lesson: Lesson; chapter: Chapter; globalIndex: number }[] {
  const result: { lesson: Lesson; chapter: Chapter; globalIndex: number }[] = [];
  let idx = 0;
  for (const ch of HR_COURSE.chapters) {
    for (const l of ch.lessons) {
      result.push({ lesson: l, chapter: ch, globalIndex: idx++ });
    }
  }
  return result;
}

function parseDuration(d: string): number {
  const parts = d.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function formatTimeLeft(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.round((totalSec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function CourseDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<CourseProgress>(loadProgress);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    HR_COURSE.chapters.forEach((ch) => { map[ch.id] = true; });
    return map;
  });
  const [activeLessonId, setActiveLessonId] = useState(progress.currentLessonId);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'transcript' | 'resources'>('overview');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [editNote, setEditNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [currentPage, setCurrentPage] = useState<'course' | 'profile' | 'certificate'>('course');

  const lessonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allLessons = useMemo(() => getAllLessons(), []);
  const totalLessons = allLessons.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const activeLessonData = useMemo(() => {
    return allLessons.find((l) => l.lesson.id === activeLessonId) || allLessons[0];
  }, [activeLessonId, allLessons]);

  const activeLesson = activeLessonData.lesson;
  const activeChapter = activeLessonData.chapter;
  const activeGlobalIndex = activeLessonData.globalIndex;

  const prevLesson = activeGlobalIndex > 0 ? allLessons[activeGlobalIndex - 1] : null;
  const nextLesson = activeGlobalIndex < totalLessons - 1 ? allLessons[activeGlobalIndex + 1] : null;

  const currentLessonProgress = progress.lessonProgress[activeLessonId];
  const isCurrentCompleted = progress.completedLessons.includes(activeLessonId);

  const totalTimeRemaining = useMemo(() => {
    let total = 0;
    allLessons.forEach(({ lesson }) => {
      if (!progress.completedLessons.includes(lesson.id)) {
        total += parseDuration(lesson.duration);
      }
    });
    return formatTimeLeft(total);
  }, [allLessons, progress.completedLessons]);

  const saveLessonProgress = useCallback((lessonId: string, updates: Partial<LessonProgress>) => {
    setProgress((prev) => {
      const lp = prev.lessonProgress[lessonId] || { completed: false, watchPercent: 0, lastPosition: 0, timestamp: Date.now() };
      const newLp = { ...lp, ...updates, timestamp: Date.now() };
      const newLessonProgress = { ...prev.lessonProgress, [lessonId]: newLp };
      let newCompleted = [...prev.completedLessons];
      if (newLp.watchPercent >= WATCH_THRESHOLD && !newCompleted.includes(lessonId)) {
        newCompleted.push(lessonId);
      }
      const next = {
        ...prev,
        lessonProgress: newLessonProgress,
        completedLessons: newCompleted,
        currentLessonId: lessonId,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const selectLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab('overview');
    setIsEditingNote(false);
    setProgress((prev) => {
      const next = { ...prev, currentLessonId: lessonId };
      saveProgress(next);
      return next;
    });
    if (mobileSidebar) setMobileSidebar(false);
    setTimeout(() => {
      lessonRefs.current[lessonId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, [mobileSidebar]);

  const toggleChapter = useCallback((chId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chId]: !prev[chId] }));
  }, []);

  const navigateLesson = useCallback((dir: 'prev' | 'next') => {
    const target = dir === 'next' ? nextLesson : prevLesson;
    if (target) selectLesson(target.lesson.id);
  }, [nextLesson, prevLesson, selectLesson]);

  const toggleComplete = useCallback(() => {
    setProgress((prev) => {
      const newCompleted = isCurrentCompleted
        ? prev.completedLessons.filter((id) => id !== activeLessonId)
        : [...prev.completedLessons, activeLessonId];
      const lp = prev.lessonProgress[activeLessonId] || { completed: false, watchPercent: 0, lastPosition: 0, timestamp: Date.now() };
      const next = {
        ...prev,
        completedLessons: newCompleted,
        lessonProgress: { ...prev.lessonProgress, [activeLessonId]: { ...lp, completed: !isCurrentCompleted, watchPercent: isCurrentCompleted ? 0 : 100 } },
      };
      saveProgress(next);
      return next;
    });
  }, [activeLessonId, isCurrentCompleted]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    setProgress(loadProgress());
    setActiveLessonId(HR_COURSE.chapters[0].lessons[0].id);
  }, []);

  const submitQuiz = useCallback(() => {
    if (!activeLesson.quizQuestions) return;
    let correct = 0;
    activeLesson.quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / activeLesson.quizQuestions.length) * 100);
    setQuizSubmitted(true);
    saveLessonProgress(activeLessonId, { quizScore: score });
    if (score >= 70) {
      setProgress((prev) => {
        if (!prev.completedLessons.includes(activeLessonId)) {
          const next = { ...prev, completedLessons: [...prev.completedLessons, activeLessonId] };
          saveProgress(next);
          return next;
        }
        return prev;
      });
    }
  }, [activeLesson, quizAnswers, activeLessonId, saveLessonProgress]);

  const getChapterProgress = useCallback((chapter: Chapter) => {
    const total = chapter.lessons.length;
    const done = chapter.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [progress.completedLessons]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'n') navigateLesson('next');
      if (e.key === 'ArrowLeft' || e.key === 'p') navigateLesson('prev');
      if (e.key === 'f') {
        const el = document.getElementById('lms-video-container');
        if (el) {
          if (document.fullscreenElement) document.exitFullscreen();
          else el.requestFullscreen?.();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigateLesson]);

  const videoProgressPercent = useMemo(() => {
    const dur = parseDuration(activeLesson.duration);
    if (!dur) return 0;
    const pos = currentLessonProgress?.lastPosition || 0;
    return Math.min(100, Math.round((pos / dur) * 100));
  }, [activeLesson.duration, currentLessonProgress]);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const lessonTypeIcon = (type: string, size = 14) => {
    if (type === 'quiz') return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    );
    if (type === 'assignment') return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    );
  };

  return (
    <div className="lms-root">
      <style>{lmsStyles}</style>

      <header className="lms-header">
        <div className="lms-header-left">
          <button className="lms-hamburger" onClick={() => setMobileSidebar(!mobileSidebar)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button className="lms-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </button>
          <div className="lms-brand-group" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="lms-brand-icon">I</div>
            <div className="lms-brand-text">
              <span className="lms-brand">IncuXAI</span>
              <span className="lms-brand-sub">Learning Hub</span>
            </div>
          </div>
        </div>
        <nav className="lms-header-nav">
          <button className={`lms-nav-tab ${currentPage === 'course' ? 'active' : ''}`} onClick={() => setCurrentPage('course')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            <span>Course</span>
          </button>
          <button className={`lms-nav-tab ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </button>
          <button className={`lms-nav-tab ${currentPage === 'certificate' ? 'active' : ''}`} onClick={() => setCurrentPage('certificate')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <span>Certificate</span>
          </button>
        </nav>
        <div className="lms-header-right">
          <div className="lms-progress-wrap">
            <div className="lms-progress-bar">
              <div className="lms-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="lms-progress-text">{progressPercent}%</span>
          </div>

        </div>
      </header>

      {currentPage === 'course' && (
      <div className="lms-body">
        <aside className={`lms-sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileSidebar ? 'mobile-open' : ''}`}>
          <div className="lms-sidebar-header">
            <h2 className="lms-sidebar-title">Course Content</h2>
            <span className="lms-sidebar-meta">{completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="lms-sidebar-scroll">
            {HR_COURSE.chapters.map((chapter) => {
              const cp = getChapterProgress(chapter);
              const isExpanded = expandedChapters[chapter.id];
              return (
                <div key={chapter.id} className="lms-chapter">
                  <button className="lms-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                    <div className="lms-chapter-info">
                      <svg className={`lms-chevron ${isExpanded ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      <span className="lms-chapter-name">{chapter.title}</span>
                    </div>
                    <div className="lms-chapter-meta">
                      <span className="lms-chapter-count">{cp.done}/{cp.total}</span>
                      <div className="lms-chapter-bar">
                        <div className="lms-chapter-bar-fill" style={{ width: `${cp.percent}%` }} />
                      </div>
                    </div>
                  </button>
                  <div className={`lms-chapter-lessons ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {chapter.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isDone = progress.completedLessons.includes(lesson.id);
                      const lProgress = progress.lessonProgress[lesson.id];
                      return (
                        <div
                          key={lesson.id}
                          ref={(el) => { lessonRefs.current[lesson.id] = el; }}
                          className={`lms-lesson ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => selectLesson(lesson.id)}
                        >
                          <div className="lms-lesson-icon">
                            {isDone ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : lessonTypeIcon(lesson.type)}
                          </div>
                          <div className="lms-lesson-info">
                            <span className="lms-lesson-title">{lesson.title}</span>
                            <div className="lms-lesson-meta-row">
                              <span className="lms-lesson-duration">{lesson.duration}</span>
                              <span className={`lms-lesson-type ${lesson.type}`}>{lesson.type}</span>
                            </div>
                          </div>
                          {lProgress && lProgress.watchPercent > 0 && !isDone && (
                            <div className="lms-lesson-mini-progress">
                              <div className="lms-lesson-mini-fill" style={{ width: `${Math.min(100, lProgress.watchPercent)}%` }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lms-sidebar-footer">
            <div className="lms-stat-row">
              <span className="lms-stat-label">Completed</span>
              <span className="lms-stat-value">{completedCount}/{totalLessons}</span>
            </div>
            <div className="lms-stat-row">
              <span className="lms-stat-label">Remaining</span>
              <span className="lms-stat-value">{totalLessons - completedCount}</span>
            </div>
            <div className="lms-stat-row">
              <span className="lms-stat-label">Est. Time Left</span>
              <span className="lms-stat-value">{totalTimeRemaining}</span>
            </div>
          </div>
        </aside>

        {mobileSidebar && <div className="lms-mobile-overlay" onClick={() => setMobileSidebar(false)} />}

        <main className="lms-main">
          <div className="lms-video-section">
            <div className="lms-video-meta">
              <span className="lms-lesson-badge">{activeChapter.title}</span>
              <button className={`lms-done-btn ${isCurrentCompleted ? 'done' : ''}`} onClick={toggleComplete}>
                {isCurrentCompleted ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Completed</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> Mark Complete</>
                )}
              </button>
            </div>
            <h1 className="lms-video-title">{activeLesson.title}</h1>

            {activeLesson.type === 'video' && (
              <div className="lms-video-container" id="lms-video-container">
                <div className="lms-video-aspect">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="lms-video-iframe"
                  />
                </div>
                <div className="lms-video-controls">
                  <div className="lms-video-progress-bar">
                    <div className="lms-video-progress-fill" style={{ width: `${videoProgressPercent}%` }} />
                  </div>
                  <div className="lms-controls-row">
                    <div className="lms-controls-left">
                      <button className="lms-ctrl-btn" onClick={() => navigateLesson('prev')} disabled={!prevLesson} title="Previous (P)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button className="lms-ctrl-btn" onClick={() => navigateLesson('next')} disabled={!nextLesson} title="Next (N)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                      <span className="lms-time-label">{activeLesson.duration}</span>
                    </div>
                    <div className="lms-controls-right">
                      <div className="lms-speed-wrap">
                        <button className="lms-ctrl-btn speed" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                          {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                          <div className="lms-speed-menu">
                            {speeds.map((sp) => (
                              <button key={sp} className={`lms-speed-opt ${playbackSpeed === sp ? 'active' : ''}`}
                                onClick={() => { setPlaybackSpeed(sp); setShowSpeedMenu(false); }}>
                                {sp}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="lms-ctrl-btn" onClick={() => {
                        const el = document.getElementById('lms-video-container');
                        if (document.fullscreenElement) document.exitFullscreen();
                        else el?.requestFullscreen?.();
                      }} title="Fullscreen (F)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeLesson.type === 'quiz' && activeLesson.quizQuestions && (
              <div className="lms-quiz-container">
                <div className="lms-quiz-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div>
                    <h3 className="lms-quiz-title">Knowledge Check</h3>
                    <p className="lms-quiz-sub">{activeLesson.quizQuestions.length} questions &middot; {activeLesson.duration}</p>
                  </div>
                </div>
                {activeLesson.quizQuestions.map((q: QuizQuestion, qi: number) => (
                  <div key={qi} className="lms-quiz-question">
                    <p className="lms-q-text"><span className="lms-q-num">Q{qi + 1}.</span> {q.question}</p>
                    {q.options.map((opt: string, oi: number) => {
                      const isSelected = quizAnswers[qi] === oi;
                      const isCorrect = oi === q.correctIndex;
                      let cls = 'lms-q-option';
                      if (quizSubmitted) {
                        if (isCorrect) cls += ' correct';
                        else if (isSelected && !isCorrect) cls += ' wrong';
                      } else if (isSelected) cls += ' selected';
                      return (
                        <button key={oi} className={cls} disabled={quizSubmitted}
                          onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [qi]: oi }))}>
                          <span className="lms-q-letter">{String.fromCharCode(65 + oi)}</span>
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <svg className="lms-q-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          {quizSubmitted && isSelected && !isCorrect && <svg className="lms-q-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                        </button>
                      );
                    })}
                    {quizSubmitted && (
                      <div className="lms-q-explanation">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
                {!quizSubmitted ? (
                  <button className="lms-quiz-submit" onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < activeLesson.quizQuestions.length}>
                    Submit Answers ({Object.keys(quizAnswers).length}/{activeLesson.quizQuestions.length})
                  </button>
                ) : (
                  <div className="lms-quiz-result">
                    {(() => {
                      let correct = 0;
                      activeLesson.quizQuestions!.forEach((q, i) => { if (quizAnswers[i] === q.correctIndex) correct++; });
                      const score = Math.round((correct / activeLesson.quizQuestions!.length) * 100);
                      return (
                        <>
                          <div className={`lms-score-circle ${score >= 70 ? 'pass' : 'fail'}`}>
                            <span className="lms-score-num">{score}%</span>
                          </div>
                          <div>
                            <p className="lms-score-text">{score >= 70 ? 'Great work! You passed.' : 'Keep learning and try again.'}</p>
                            <p className="lms-score-detail">{correct}/{activeLesson.quizQuestions!.length} correct</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {activeLesson.type === 'assignment' && (
              <div className="lms-assignment-container">
                <div className="lms-assignment-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <h3>Assignment</h3>
                </div>
                <div className="lms-assignment-body">
                  {activeLesson.notes?.split('\n').map((line: string, i: number) => (
                    <p key={i} className={line.startsWith('•') || /^\d+\./.test(line) ? 'lms-a-indent' : line === '' ? 'lms-a-break' : ''}>
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <p className="lms-video-desc">{activeLesson.description}</p>

            <div className="lms-nav-row">
              {prevLesson ? (
                <button className="lms-nav-btn prev" onClick={() => navigateLesson('prev')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  <div><span className="lms-nav-label">Previous</span><span className="lms-nav-name">{prevLesson.lesson.title}</span></div>
                </button>
              ) : <div />}
              {nextLesson ? (
                <button className="lms-nav-btn next" onClick={() => navigateLesson('next')}>
                  <div><span className="lms-nav-label">Next</span><span className="lms-nav-name">{nextLesson.lesson.title}</span></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ) : (
                <div className="lms-complete-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Course Complete!
                </div>
              )}
            </div>
          </div>

          <div className="lms-tabs">
            {(['overview', 'notes', 'transcript', 'resources'] as const).map((tab) => (
              <button key={tab} className={`lms-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="lms-tab-content">
            {activeTab === 'overview' && (
              <div className="lms-overview">
                <div className="lms-overview-card">
                  <h3>About This Lesson</h3>
                  <p>{activeLesson.description}</p>
                </div>
                <div className="lms-overview-grid">
                  <div className="lms-ov-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div><span className="lms-ov-label">Duration</span><span className="lms-ov-val">{activeLesson.duration}</span></div>
                  </div>
                  <div className="lms-ov-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <div><span className="lms-ov-label">Last Updated</span><span className="lms-ov-val">{HR_COURSE.lastUpdated}</span></div>
                  </div>
                  <div className="lms-ov-item">
                    {lessonTypeIcon(activeLesson.type, 18)}
                    <div><span className="lms-ov-label">Type</span><span className="lms-ov-val" style={{ textTransform: 'capitalize' }}>{activeLesson.type}</span></div>
                  </div>
                  <div className="lms-ov-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <div><span className="lms-ov-label">Instructor</span><span className="lms-ov-val">{HR_COURSE.instructor}</span></div>
                  </div>
                </div>
                <div className="lms-overview-card">
                  <h3>Instructor</h3>
                  <div className="lms-instructor-row">
                    <div className="lms-instructor-avatar">I</div>
                    <div>
                      <p className="lms-instructor-name">{HR_COURSE.instructor}</p>
                      <p className="lms-instructor-role">{HR_COURSE.instructorRole}</p>
                    </div>
                  </div>
                  <p className="lms-instructor-bio">Dedicated to making AI education accessible and practical for professionals across all industries.</p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="lms-notes">
                <div className="lms-notes-header">
                  <h3>Your Notes</h3>
                  {!isEditingNote ? (
                    <button className="lms-note-edit-btn" onClick={() => {
                      setEditNote(currentLessonProgress?.notes || activeLesson.notes || '');
                      setIsEditingNote(true);
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                  ) : (
                    <div className="lms-note-actions">
                      <button className="lms-note-save" onClick={() => {
                        saveLessonProgress(activeLessonId, { notes: editNote });
                        setIsEditingNote(false);
                      }}>Save</button>
                      <button className="lms-note-cancel" onClick={() => setIsEditingNote(false)}>Cancel</button>
                    </div>
                  )}
                </div>
                {isEditingNote ? (
                  <textarea className="lms-note-textarea" value={editNote} onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Write your notes for this lesson..." />
                ) : (
                  <div className="lms-note-content">
                    {(currentLessonProgress?.notes || activeLesson.notes) ? (
                      (currentLessonProgress?.notes || activeLesson.notes || '').split('\n').map((line: string, i: number) => (
                        <p key={i}>{line || '\u00A0'}</p>
                      ))
                    ) : (
                      <p className="lms-note-empty">No notes yet. Click Edit to add notes.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="lms-transcript">
                {activeLesson.transcript ? (
                  <div className="lms-transcript-content">
                    {activeLesson.transcript.split('. ').reduce((acc: string[], sentence: string, i: number) => {
                      if (i % 3 === 0) acc.push(sentence);
                      else acc[acc.length - 1] += '. ' + sentence;
                      return acc;
                    }, []).map((para: string, i: number) => (
                      <p key={i}>{para}{para.endsWith('.') ? '' : '.'}</p>
                    ))}
                  </div>
                ) : (
                  <p className="lms-note-empty">Transcript not available for this lesson.</p>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="lms-resources">
                {activeLesson.resources && activeLesson.resources.length > 0 ? (
                  <div className="lms-resources-list">
                    {activeLesson.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="lms-resource-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                        <span>{r.title}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="lms-note-empty">No additional resources for this lesson.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      )}

      {currentPage === 'profile' && (
        <div className="lms-page-content">
          <div className="lms-profile">
            <div className="lms-profile-header">
              <div className="lms-profile-avatar">{(user?.name || user?.email || 'U')[0].toUpperCase()}</div>
              <div>
                <h1 className="lms-profile-name">{user?.name || 'Student'}</h1>
                <p className="lms-profile-email">{user?.email}</p>
              </div>
            </div>
            <div className="lms-profile-stats">
              <div className="lms-stat-card">
                <div className="lms-stat-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div className="lms-stat-card-info">
                  <span className="lms-stat-card-num">{completedCount}</span>
                  <span className="lms-stat-card-label">Completed</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="lms-stat-card-icon lms-stat-card-icon gold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="lms-stat-card-info">
                  <span className="lms-stat-card-num">{totalTimeRemaining}</span>
                  <span className="lms-stat-card-label">Time Left</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="lms-stat-card-icon lms-stat-card-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div className="lms-stat-card-info">
                  <span className="lms-stat-card-num">{progressPercent}%</span>
                  <span className="lms-stat-card-label">Progress</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="lms-stat-card-icon lms-stat-card-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div className="lms-stat-card-info">
                  <span className="lms-stat-card-num">{progressPercent >= 100 ? 'Ready' : 'Locked'}</span>
                  <span className="lms-stat-card-label">Certificate</span>
                </div>
              </div>
            </div>
            <div className="lms-profile-card">
              <h3>Course Progress</h3>
              <div className="lms-profile-progress-bar">
                <div className="lms-profile-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="lms-profile-progress-text">{completedCount} of {totalLessons} lessons completed</p>
            </div>
            <div className="lms-profile-card">
              <h3>Enrolled Course</h3>
              <div className="lms-profile-course">
                <div className="lms-profile-course-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f3d91" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                </div>
                <div>
                  <p className="lms-profile-course-title">{HR_COURSE.title}</p>
                  <p className="lms-profile-course-meta">{HR_COURSE.instructor} &middot; {totalLessons} lessons &middot; Updated {HR_COURSE.lastUpdated}</p>
                </div>
              </div>
            </div>
            <button className="lms-reset-progress-btn" onClick={() => { if (confirm('Are you sure you want to reset all progress?')) resetProgress(); }}>
              Reset All Progress
            </button>
          </div>
        </div>
      )}

      {currentPage === 'certificate' && (
        <div className="lms-page-content">
          <div className="lms-certificate-page">
            {progressPercent >= 100 ? (
              <div className="lms-cert-ready">
                <div className="lms-cert-frame">
                  <div className="lms-cert-border">
                    <div className="lms-cert-inner">
                      <div className="lms-cert-logo">IncuXAI</div>
                      <div className="lms-cert-subtitle">Education Trust</div>
                      <div className="lms-cert-heading">Certificate of Completion</div>
                      <div className="lms-cert-text">This is to certify that</div>
                      <div className="lms-cert-name">{user?.name || 'Student'}</div>
                      <div className="lms-cert-text">has successfully completed the course</div>
                      <div className="lms-cert-course">{HR_COURSE.title}</div>
                      <div className="lms-cert-text">with {progressPercent}% completion on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div className="lms-cert-footer">
                        <div className="lms-cert-sig">
                          <div className="lms-cert-sig-line"></div>
                          <div className="lms-cert-sig-name">IncuXAI Education Trust</div>
                        </div>
                        <div className="lms-cert-badge">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="lms-cert-print" onClick={() => window.print()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  Print Certificate
                </button>
              </div>
            ) : (
              <div className="lms-cert-locked">
                <div className="lms-cert-lock-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <h2>Complete the Course to Earn Your Certificate</h2>
                <p>You are <strong>{progressPercent}%</strong> done. Complete all {totalLessons} lessons to unlock your certificate.</p>
                <div className="lms-cert-progress-bar">
                  <div className="lms-cert-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="lms-cert-remaining">{totalLessons - completedCount} lessons remaining</p>
                <button className="lms-cert-cta" onClick={() => setCurrentPage('course')}>Continue Learning</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const lmsStyles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.lms-root{font-family:'Inter',system-ui,sans-serif;background:#f0f2f5;color:#1e293b;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.lms-header{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:60px;background:linear-gradient(135deg,#0a1628 0%,#0d1b2a 40%,#0f3d91 100%);flex-shrink:0;z-index:100;gap:16px;box-shadow:0 2px 20px rgba(0,0,0,0.3)}
.lms-header-left{display:flex;align-items:center;gap:12px;min-width:0}
.lms-brand-group{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:12px;transition:all 0.2s;cursor:pointer}
.lms-brand-group:hover{background:rgba(255,255,255,0.1)}
.lms-brand-icon{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#C5A059,#d4af37);color:#0d1b2a;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:1.15rem;flex-shrink:0;box-shadow:0 2px 12px rgba(197,160,89,0.4)}
.lms-brand-text{display:flex;flex-direction:column;line-height:1}
.lms-brand{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.05rem;color:#fff;white-space:nowrap;letter-spacing:-0.02em}
.lms-brand-sub{font-size:0.6rem;font-weight:600;color:rgba(197,160,89,0.9);text-transform:uppercase;letter-spacing:0.1em;margin-top:3px}
.lms-header-nav{display:flex;align-items:center;gap:3px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:4px}
.lms-nav-tab{display:flex;align-items:center;gap:7px;padding:8px 20px;border:none;border-radius:9px;background:transparent;color:rgba(255,255,255,0.5);font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap;position:relative}
.lms-nav-tab:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.07)}
.lms-nav-tab.active{color:#fff;background:rgba(197,160,89,0.18);box-shadow:0 0 0 1px rgba(197,160,89,0.35),0 2px 8px rgba(197,160,89,0.15)}
.lms-header-right{display:flex;align-items:center;gap:14px;flex-shrink:0}
.lms-progress-wrap{display:flex;align-items:center;gap:10px;width:150px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:6px 12px}
.lms-progress-bar{flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:100px;overflow:hidden}
.lms-progress-fill{height:100%;background:linear-gradient(90deg,#C5A059,#d4af37);border-radius:100px;transition:width 0.4s ease;box-shadow:0 0 6px rgba(197,160,89,0.4)}
.lms-progress-text{font-size:0.75rem;font-weight:700;color:rgba(255,255,255,0.85);white-space:nowrap;min-width:28px;text-align:right}

.lms-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;color:rgba(255,255,255,0.7);border-radius:8px;transition:background 0.15s}
.lms-hamburger:hover{background:rgba(255,255,255,0.1)}
.lms-sidebar-toggle{background:none;border:none;cursor:pointer;padding:7px;color:rgba(255,255,255,0.5);border-radius:8px;transition:all 0.15s}
.lms-sidebar-toggle:hover{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.8)}
.lms-body{display:flex;flex:1;overflow:hidden;position:relative}
.lms-sidebar{width:340px;min-width:340px;background:#fff;border-right:1px solid #e5e7eb;display:flex;flex-direction:column;transition:width 0.25s ease,min-width 0.25s ease,opacity 0.2s;overflow:hidden;box-shadow:2px 0 12px rgba(0,0,0,0.04)}
.lms-sidebar.closed{width:0;min-width:0;opacity:0;border:none;padding:0}
.lms-sidebar-header{padding:20px 22px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background:linear-gradient(180deg,#f8faff 0%,#fff 100%)}
.lms-sidebar-title{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#0f172a;letter-spacing:-0.01em}
.lms-sidebar-meta{font-size:0.72rem;color:#64748b;font-weight:600;background:#f1f5f9;padding:4px 12px;border-radius:20px}
.lms-sidebar-scroll{flex:1;overflow-y:auto;overflow-x:hidden}
.lms-sidebar-scroll::-webkit-scrollbar{width:4px}
.lms-sidebar-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:100px}
.lms-chapter{border-bottom:1px solid #f1f5f9}
.lms-chapter-header{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:none;border:none;cursor:pointer;font-family:inherit;transition:all 0.15s;text-align:left}
.lms-chapter-header:hover{background:#f8fafc}
.lms-chapter-info{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.lms-chevron{transition:transform 0.25s ease;flex-shrink:0;color:#94a3b8}
.lms-chevron.open{transform:rotate(90deg);color:#0f3d91}
.lms-chapter-name{font-size:0.84rem;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lms-chapter-meta{display:flex;align-items:center;gap:10px;flex-shrink:0}
.lms-chapter-count{font-size:0.7rem;color:#64748b;font-weight:600}
.lms-chapter-bar{width:44px;height:4px;background:#e2e8f0;border-radius:100px;overflow:hidden}
.lms-chapter-bar-fill{height:100%;background:linear-gradient(90deg,#C5A059,#d4af37);border-radius:100px;transition:width 0.3s}
.lms-chapter-lessons{overflow:hidden;transition:max-height 0.3s ease}
.lms-chapter-lessons.collapsed{max-height:0}
.lms-chapter-lessons.expanded{max-height:2000px}
.lms-lesson{display:flex;align-items:flex-start;gap:10px;padding:11px 20px 11px 38px;cursor:pointer;transition:all 0.15s;position:relative;border-left:3px solid transparent}
.lms-lesson:hover{background:#f8fafc}
.lms-lesson.active{background:linear-gradient(90deg,#eff6ff,#f0f7ff);border-left-color:#0f3d91}
.lms-lesson.active .lms-lesson-title{color:#0f3d91;font-weight:700}
.lms-lesson.completed .lms-lesson-icon{opacity:0.6}
.lms-lesson-icon{flex-shrink:0;margin-top:2px;color:#94a3b8}
.lms-lesson-info{flex:1;min-width:0}
.lms-lesson-title{font-size:0.8rem;color:#334155;line-height:1.4;display:block;transition:color 0.15s}
.lms-lesson-meta-row{display:flex;align-items:center;gap:8px;margin-top:4px}
.lms-lesson-duration{font-size:0.7rem;color:#94a3b8;font-weight:500}
.lms-lesson-type{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:2px 7px;border-radius:4px}
.lms-lesson-type.video{background:#eff6ff;color:#2563eb}
.lms-lesson-type.quiz{background:#fef3c7;color:#92400e}
.lms-lesson-type.assignment{background:#fce7f3;color:#9d174d}
.lms-lesson-mini-progress{position:absolute;bottom:0;left:3px;right:0;height:2px;background:#e2e8f0}
.lms-lesson-mini-fill{height:100%;background:linear-gradient(90deg,#0f3d91,#0e7490);border-radius:0 100px 100px 0;transition:width 0.3s}
.lms-sidebar-footer{padding:16px 20px;border-top:1px solid #f1f5f9;flex-shrink:0;background:linear-gradient(180deg,#fff 0%,#fafbfc 100%)}
.lms-stat-row{display:flex;justify-content:space-between;padding:4px 0}
.lms-stat-label{font-size:0.72rem;color:#94a3b8;font-weight:500}
.lms-stat-value{font-size:0.72rem;color:#1e293b;font-weight:700}
.lms-mobile-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:90;backdrop-filter:blur(2px)}
.lms-main{flex:1;overflow-y:auto;overflow-x:hidden;padding:0;display:flex;flex-direction:column;background:#f0f2f5}
.lms-main::-webkit-scrollbar{width:6px}
.lms-main::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:100px}
.lms-video-section{padding:28px 36px 0}
.lms-video-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.lms-lesson-badge{font-size:0.72rem;font-weight:700;color:#0f3d91;background:#eff6ff;padding:5px 14px;border-radius:6px;border:1px solid #dbeafe}
.lms-done-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:0.8rem;font-weight:600;color:#475569;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.lms-done-btn:hover{border-color:#C5A059;color:#C5A059;box-shadow:0 2px 8px rgba(197,160,89,0.15)}
.lms-done-btn.done{background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#C5A059;color:#92400e;box-shadow:0 2px 8px rgba(197,160,89,0.2)}
.lms-video-title{font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:700;color:#0f172a;margin-bottom:18px;line-height:1.3;letter-spacing:-0.02em}
.lms-video-container{border-radius:14px;overflow:hidden;background:#000;box-shadow:0 8px 32px rgba(0,0,0,0.18);margin-bottom:14px;border:1px solid rgba(0,0,0,0.08)}
.lms-video-aspect{position:relative;padding-top:56.25%}
.lms-video-iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.lms-video-controls{background:#1a1f2e;padding:0}
.lms-video-progress-bar{height:4px;background:#2d3348;cursor:pointer}
.lms-video-progress-fill{height:100%;background:linear-gradient(90deg,#C5A059,#d4af37);transition:width 0.3s;box-shadow:0 0 8px rgba(197,160,89,0.3)}
.lms-controls-row{display:flex;align-items:center;justify-content:space-between;padding:8px 14px}
.lms-controls-left,.lms-controls-right{display:flex;align-items:center;gap:6px}
.lms-ctrl-btn{background:none;border:none;color:#94a3b8;cursor:pointer;padding:7px;border-radius:7px;transition:all 0.15s;display:flex;align-items:center;justify-content:center}
.lms-ctrl-btn:hover{color:#fff;background:rgba(255,255,255,0.1)}
.lms-ctrl-btn:disabled{opacity:0.3;cursor:not-allowed}
.lms-ctrl-btn.speed{font-size:0.75rem;font-weight:700;padding:5px 10px;color:#e2e8f0}
.lms-time-label{font-size:0.75rem;color:#94a3b8;font-weight:500;margin-left:4px}
.lms-speed-wrap{position:relative}
.lms-speed-menu{position:absolute;bottom:100%;right:0;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:4px;min-width:60px;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.3)}
.lms-speed-opt{display:block;width:100%;padding:6px 10px;background:none;border:none;color:#94a3b8;font-size:0.75rem;font-weight:600;cursor:pointer;border-radius:4px;text-align:left;font-family:inherit}
.lms-speed-opt:hover{background:rgba(255,255,255,0.1);color:#fff}
.lms-speed-opt.active{color:#fff;background:rgba(197,160,89,0.3)}
.lms-quiz-container{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:28px;margin-bottom:18px;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
.lms-quiz-header{display:flex;align-items:center;gap:14px;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid #f1f5f9}
.lms-quiz-title{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:700;color:#0f172a;margin:0}
.lms-quiz-sub{font-size:0.8rem;color:#94a3b8;margin:3px 0 0;font-weight:500}
.lms-quiz-question{margin-bottom:28px}
.lms-q-text{font-size:0.95rem;font-weight:600;color:#1e293b;margin-bottom:12px;line-height:1.5}
.lms-q-num{color:#0f3d91;font-weight:700;margin-right:4px}
.lms-q-option{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;border:2px solid #e5e7eb;border-radius:12px;background:#fafbfc;cursor:pointer;font-size:0.9rem;color:#475569;text-align:left;font-family:inherit;transition:all 0.2s;margin-bottom:10px}
.lms-q-option:hover{border-color:#C5A059;background:#fffdf5;box-shadow:0 2px 8px rgba(197,160,89,0.1)}
.lms-q-option.selected{border-color:#0f3d91;background:#eff6ff;color:#0f3d91;font-weight:600;box-shadow:0 2px 8px rgba(15,61,145,0.1)}
.lms-q-option.correct{border-color:#16a34a;background:#f0fdf4;color:#166534}
.lms-q-option.wrong{border-color:#dc2626;background:#fef2f2;color:#991b1b}
.lms-q-option:disabled{cursor:default}
.lms-q-letter{width:28px;height:28px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;flex-shrink:0;color:#475569}
.lms-q-option.selected .lms-q-letter{background:#0f3d91;color:#fff}
.lms-q-option.correct .lms-q-letter{background:#16a34a;color:#fff}
.lms-q-option.wrong .lms-q-letter{background:#dc2626;color:#fff}
.lms-q-check{margin-left:auto;flex-shrink:0}
.lms-q-explanation{display:flex;align-items:flex-start;gap:10px;margin-top:10px;padding:12px 16px;background:#eff6ff;border-radius:10px;font-size:0.84rem;color:#475569;line-height:1.6;border:1px solid #dbeafe}
.lms-quiz-submit{width:100%;padding:16px;border:none;border-radius:12px;background:linear-gradient(135deg,#0f3d91 0%,#0e7490 100%);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,61,145,0.25);margin-top:8px}
.lms-quiz-submit:hover{opacity:0.92;box-shadow:0 6px 24px rgba(15,61,145,0.35);transform:translateY(-1px)}
.lms-quiz-submit:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}
.lms-quiz-result{display:flex;align-items:center;gap:18px;padding:20px;background:#f8fafc;border-radius:12px;margin-top:18px;border:1px solid #e5e7eb}
.lms-score-circle{width:68px;height:68px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid;flex-shrink:0}
.lms-score-circle.pass{border-color:#16a34a;background:#f0fdf4;box-shadow:0 2px 12px rgba(22,163,74,0.15)}
.lms-score-circle.fail{border-color:#dc2626;background:#fef2f2;box-shadow:0 2px 12px rgba(220,38,38,0.15)}
.lms-score-num{font-size:1.15rem;font-weight:800;color:#0f172a}
.lms-score-text{font-size:0.92rem;font-weight:600;color:#1e293b;margin:0}
.lms-score-detail{font-size:0.82rem;color:#94a3b8;margin:3px 0 0}
.lms-assignment-container{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:28px;margin-bottom:18px;box-shadow:0 2px 8px rgba(0,0,0,0.03)}
.lms-assignment-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:18px;border-bottom:2px solid #f1f5f9}
.lms-assignment-header h3{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:700;color:#0f172a;margin:0}
.lms-assignment-body{font-size:0.9rem;color:#475569;line-height:1.8}
.lms-a-indent{padding-left:24px}
.lms-a-break{margin:10px 0}
.lms-video-desc{font-size:0.92rem;color:#64748b;line-height:1.8;margin:18px 0;padding:16px 20px;background:#fff;border:1px solid #e5e7eb;border-radius:12px}
.lms-nav-row{display:flex;justify-content:space-between;gap:14px;padding:20px 0;border-top:1px solid #f1f5f9}
.lms-nav-btn{display:flex;align-items:center;gap:12px;padding:14px 22px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;cursor:pointer;font-family:inherit;transition:all 0.2s;flex:1;max-width:48%;box-shadow:0 1px 4px rgba(0,0,0,0.04)}
.lms-nav-btn:hover{border-color:#0f3d91;background:#f8fafc;box-shadow:0 4px 16px rgba(15,61,145,0.08);transform:translateY(-1px)}
.lms-nav-btn.next{justify-content:flex-end;text-align:right;margin-left:auto}
.lms-nav-btn.prev{margin-right:auto}
.lms-nav-label{display:block;font-size:0.7rem;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.6px}
.lms-nav-name{display:block;font-size:0.84rem;font-weight:600;color:#1e293b;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.lms-complete-badge{display:flex;align-items:center;gap:10px;font-size:0.95rem;font-weight:700;color:#16a34a;padding:12px 20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px}
.lms-tabs{display:flex;gap:0;border-bottom:2px solid #e5e7eb;padding:0 36px;background:#fff;flex-shrink:0}
.lms-tab{padding:16px 22px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;font-size:0.84rem;font-weight:600;color:#94a3b8;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap}
.lms-tab:hover{color:#475569}
.lms-tab.active{color:#0f3d91;border-bottom-color:#C5A059}
.lms-tab-content{padding:28px 36px 48px;flex:1}
.lms-overview{display:flex;flex-direction:column;gap:22px}
.lms-overview-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.03);transition:box-shadow 0.2s}
.lms-overview-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.06)}
.lms-overview-card h3{font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;color:#0f172a;margin-bottom:12px}
.lms-overview-card p{font-size:0.9rem;color:#64748b;line-height:1.7}
.lms-overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lms-ov-item{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;transition:box-shadow 0.15s}
.lms-ov-item:hover{box-shadow:0 2px 8px rgba(0,0,0,0.04)}
.lms-ov-label{display:block;font-size:0.7rem;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.3px}
.lms-ov-val{display:block;font-size:0.84rem;font-weight:600;color:#1e293b;margin-top:2px}
.lms-instructor-row{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.lms-instructor-avatar{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#0f3d91,#0e7490);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.15rem;font-weight:700;flex-shrink:0;box-shadow:0 2px 8px rgba(15,61,145,0.2)}
.lms-instructor-name{font-size:0.92rem;font-weight:700;color:#0f172a;margin:0}
.lms-instructor-role{font-size:0.8rem;color:#94a3b8;margin:3px 0 0;font-weight:500}
.lms-instructor-bio{font-size:0.88rem;color:#64748b;line-height:1.7}
.lms-notes{display:flex;flex-direction:column;gap:18px}
.lms-notes-header{display:flex;align-items:center;justify-content:space-between}
.lms-notes-header h3{font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;color:#0f172a}
.lms-note-edit-btn{display:flex;align-items:center;gap:7px;padding:7px 16px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;font-size:0.8rem;font-weight:600;color:#475569;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-note-edit-btn:hover{border-color:#C5A059;color:#C5A059;box-shadow:0 2px 8px rgba(197,160,89,0.12)}
.lms-note-actions{display:flex;gap:10px}
.lms-note-save{padding:8px 16px;border:none;border-radius:9px;background:linear-gradient(135deg,#0f3d91,#0e7490);color:#fff;font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;box-shadow:0 2px 8px rgba(15,61,145,0.2)}
.lms-note-save:hover{box-shadow:0 4px 12px rgba(15,61,145,0.3)}
.lms-note-cancel{padding:8px 16px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;color:#64748b;font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s}
.lms-note-cancel:hover{border-color:#cbd5e1}
.lms-note-textarea{width:100%;min-height:200px;padding:18px;border:2px solid #e5e7eb;border-radius:12px;font-size:0.9rem;font-family:'Inter',sans-serif;color:#1e293b;resize:vertical;outline:none;line-height:1.7;background:#fafbfc}
.lms-note-textarea:focus{border-color:#0f3d91;box-shadow:0 0 0 4px rgba(15,61,145,0.08);background:#fff}
.lms-note-content{font-size:0.9rem;color:#475569;line-height:1.8;background:#fafbfc;border:1px solid #e5e7eb;border-radius:12px;padding:22px}
.lms-note-content p{margin-bottom:6px}
.lms-note-empty{font-size:0.9rem;color:#94a3b8;font-style:italic;text-align:center;padding:48px 24px}
.lms-transcript-content{font-size:0.9rem;color:#475569;line-height:1.9;background:#fafbfc;border:1px solid #e5e7eb;border-radius:12px;padding:22px}
.lms-transcript-content p{margin-bottom:10px}
.lms-resources-list{display:flex;flex-direction:column;gap:10px}
.lms-resource-item{display:flex;align-items:center;gap:12px;padding:16px 20px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-decoration:none;color:#1e293b;font-size:0.9rem;font-weight:600;transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.03)}
.lms-resource-item:hover{border-color:#C5A059;background:#fffdf5;box-shadow:0 4px 12px rgba(197,160,89,0.12);transform:translateY(-1px)}
.lms-page-content{flex:1;overflow-y:auto;padding:36px;background:#f0f2f5}
.lms-page-content::-webkit-scrollbar{width:6px}
.lms-page-content::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:100px}
.lms-profile{max-width:760px;margin:0 auto}
.lms-profile-header{display:flex;align-items:center;gap:24px;margin-bottom:36px;padding:32px;background:linear-gradient(135deg,#0a1628 0%,#0d1b2a 40%,#0f3d91 100%);border-radius:18px;color:#fff;box-shadow:0 8px 32px rgba(15,61,145,0.2)}
.lms-profile-avatar{width:72px;height:72px;border-radius:18px;background:linear-gradient(135deg,#C5A059,#d4af37);color:#0d1b2a;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:800;flex-shrink:0;box-shadow:0 4px 16px rgba(197,160,89,0.35)}
.lms-profile-name{font-family:'Space Grotesk',sans-serif;font-size:1.7rem;font-weight:700;margin:0;color:#fff;letter-spacing:-0.02em}
.lms-profile-email{font-size:0.9rem;color:rgba(255,255,255,0.6);margin:6px 0 0}
.lms-profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:32px}
.lms-stat-card{display:flex;align-items:center;gap:16px;padding:22px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.03)}
.lms-stat-card:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);transform:translateY(-2px)}
.lms-stat-card-icon{width:52px;height:52px;border-radius:14px;background:#eff6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lms-stat-card-icon.gold{background:linear-gradient(135deg,#fef3c7,#fde68a)}
.lms-stat-card-icon.green{background:linear-gradient(135deg,#f0fdf4,#bbf7d0)}
.lms-stat-card-icon.purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe)}
.lms-stat-card-num{display:block;font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:#0f172a}
.lms-stat-card-label{display:block;font-size:0.75rem;color:#94a3b8;font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:0.3px}
.lms-profile-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;margin-bottom:22px;box-shadow:0 2px 8px rgba(0,0,0,0.03);transition:box-shadow 0.2s}
.lms-profile-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.06)}
.lms-profile-card h3{font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;color:#0f172a;margin-bottom:18px}
.lms-profile-progress-bar{height:10px;background:#e2e8f0;border-radius:100px;overflow:hidden;margin-bottom:10px}
.lms-profile-progress-fill{height:100%;background:linear-gradient(90deg,#0f3d91 0%,#C5A059 100%);border-radius:100px;transition:width 0.4s}
.lms-profile-progress-text{font-size:0.84rem;color:#64748b;font-weight:500}
.lms-profile-course{display:flex;align-items:center;gap:18px;padding:18px;background:#f8fafc;border-radius:12px;border:1px solid #f1f5f9}
.lms-profile-course-icon{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#eff6ff,#dbeafe);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lms-profile-course-title{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;color:#0f172a;margin:0}
.lms-profile-course-meta{font-size:0.8rem;color:#94a3b8;margin:5px 0 0;font-weight:500}
.lms-reset-progress-btn{width:100%;padding:14px;border:1px solid #fecaca;border-radius:12px;background:#fff;color:#dc2626;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-reset-progress-btn:hover{background:#fef2f2;border-color:#dc2626;box-shadow:0 2px 8px rgba(220,38,38,0.1)}
.lms-certificate-page{max-width:820px;margin:0 auto}
.lms-cert-ready{display:flex;flex-direction:column;align-items:center;gap:28px}
.lms-cert-frame{width:100%;padding:10px;background:linear-gradient(135deg,#C5A059 0%,#d4af37 50%,#C5A059 100%);border-radius:14px;box-shadow:0 12px 48px rgba(197,160,89,0.3)}
.lms-cert-border{border:2px solid rgba(255,255,255,0.4);border-radius:10px;padding:4px}
.lms-cert-inner{background:#fff;border-radius:8px;padding:52px 48px;text-align:center}
.lms-cert-logo{font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:800;color:#0f3d91;margin-bottom:2px}
.lms-cert-subtitle{font-size:0.78rem;color:#C5A059;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:24px}
.lms-cert-heading{font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:700;color:#0d1b2a;margin-bottom:24px;padding-bottom:18px;border-bottom:2px solid #f1f5f9}
.lms-cert-text{font-size:0.9rem;color:#64748b;margin:10px 0}
.lms-cert-name{font-family:'Space Grotesk',sans-serif;font-size:1.7rem;font-weight:700;color:#0f3d91;margin:14px 0;padding:10px 0;border-bottom:3px solid #C5A059;display:inline-block;letter-spacing:-0.01em}
.lms-cert-course{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:700;color:#1e293b;margin:14px 0}
.lms-cert-footer{display:flex;align-items:flex-end;justify-content:space-between;margin-top:36px;padding-top:24px;border-top:1px solid #f1f5f9}
.lms-cert-sig{text-align:left}
.lms-cert-sig-line{width:200px;height:1px;background:#1e293b;margin-bottom:8px}
.lms-cert-sig-name{font-size:0.78rem;color:#64748b;font-weight:600}
.lms-cert-badge{display:flex;align-items:center;justify-content:center}
.lms-cert-print{display:flex;align-items:center;gap:10px;padding:14px 32px;border:none;border-radius:12px;background:linear-gradient(135deg,#0f3d91 0%,#0e7490 100%);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,61,145,0.25)}
.lms-cert-print:hover{opacity:0.92;box-shadow:0 6px 24px rgba(15,61,145,0.35);transform:translateY(-1px)}
.lms-cert-locked{display:flex;flex-direction:column;align-items:center;text-align:center;padding:72px 48px;background:#fff;border:1px solid #e5e7eb;border-radius:18px;gap:18px;box-shadow:0 4px 16px rgba(0,0,0,0.04)}
.lms-cert-lock-icon{margin-bottom:10px;opacity:0.7}
.lms-cert-locked h2{font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:#0f172a;margin:0}
.lms-cert-locked p{font-size:0.92rem;color:#64748b;line-height:1.7;max-width:420px}
.lms-cert-progress-bar{width:100%;max-width:420px;height:10px;background:#e2e8f0;border-radius:100px;overflow:hidden;margin:10px 0}
.lms-cert-progress-fill{height:100%;background:linear-gradient(90deg,#C5A059,#d4af37);border-radius:100px;transition:width 0.4s;box-shadow:0 0 8px rgba(197,160,89,0.3)}
.lms-cert-remaining{font-size:0.84rem;color:#94a3b8;font-style:italic}
.lms-cert-cta{padding:14px 36px;border:none;border-radius:12px;background:linear-gradient(135deg,#0f3d91 0%,#0e7490 100%);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,61,145,0.25);margin-top:8px}
.lms-cert-cta:hover{opacity:0.92;box-shadow:0 6px 24px rgba(15,61,145,0.35);transform:translateY(-1px)}
@media(max-width:1024px){.lms-header-nav{gap:1px}.lms-nav-tab span{display:none}.lms-nav-tab{padding:8px 14px}.lms-progress-wrap{width:110px}.lms-video-section{padding:24px 28px 0}.lms-tab-content{padding:24px 28px 36px}.lms-tabs{padding:0 28px}.lms-profile-stats{grid-template-columns:repeat(2,1fr)}.lms-video-title{font-size:1.4rem}}
@media(max-width:768px){.lms-hamburger{display:flex}.lms-sidebar-toggle{display:none}.lms-sidebar{position:fixed;top:60px;left:0;bottom:0;z-index:95;width:300px;min-width:300px;transform:translateX(-100%);transition:transform 0.25s ease;box-shadow:none}.lms-sidebar.mobile-open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,0.15)}.lms-sidebar.closed{width:300px;min-width:300px;opacity:0;transform:translateX(-100%)}.lms-mobile-overlay{display:block}.lms-video-section{padding:20px 20px 0}.lms-tab-content{padding:20px 20px 28px}.lms-tabs{padding:0 20px;overflow-x:auto}.lms-video-title{font-size:1.2rem}.lms-overview-grid{grid-template-columns:1fr}.lms-nav-btn{padding:12px 16px}.lms-nav-name{max-width:130px;font-size:0.78rem}.lms-page-content{padding:24px 20px}.lms-profile-stats{grid-template-columns:1fr 1fr}.lms-profile-header{flex-direction:column;text-align:center;padding:28px 24px}.lms-video-desc{padding:14px 16px;margin:14px 0}}
@media(max-width:480px){.lms-header{padding:0 14px;height:54px}.lms-brand-icon{width:32px;height:32px;font-size:0.95rem}.lms-brand-sub{display:none}.lms-video-section{padding:16px 14px 0}.lms-tab-content{padding:16px 14px 24px}.lms-tabs{padding:0 14px}.lms-video-title{font-size:1.1rem}.lms-quiz-container,.lms-overview-card,.lms-assignment-container{padding:18px}.lms-nav-row{flex-direction:column}.lms-nav-btn{max-width:100%}.lms-profile-stats{grid-template-columns:1fr}.lms-cert-inner{padding:32px 24px}.lms-cert-heading{font-size:1.2rem}.lms-cert-name{font-size:1.3rem}.lms-page-content{padding:20px 14px}.lms-overview-card{padding:18px}.lms-q-option{padding:12px 14px}}
`;
