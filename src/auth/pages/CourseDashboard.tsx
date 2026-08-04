import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HR_COURSE, type Lesson, type Chapter, type QuizQuestion } from '../../data/hrCourseData';
import { TrendingUp, Flame, Clock, Award, Play, RotateCcw, SkipForward, Download, Target, BarChart3, Trophy, Star, Zap, Crown, Sparkles, Flag, CalendarDays, Calendar, User, BookOpen, ChevronRight, CheckCircle2, Timer, Brain, Medal, Bookmark } from 'lucide-react';
import { useLmsAuth } from '../../lms/auth/context/LmsAuthContext';
import { useAuth } from '../context/AuthContext';
import ietLogo from '../../../picss/iet logo.png';

const PROGRESS_KEY = 'lms_hr_progress';
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

function getUserStorageKey(baseKey: string, userEmail?: string): string {
  if (!userEmail) return baseKey;
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
  return `${baseKey}_${safeEmail}`;
}

function loadProgress(userEmail?: string): CourseProgress {
  try {
    const key = getUserStorageKey(PROGRESS_KEY, userEmail);
    const raw = localStorage.getItem(key) || localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], lessonProgress: {}, currentLessonId: HR_COURSE.chapters[0].lessons[0].id, lastAccessed: Date.now(), totalWatchTime: 0 };
}

function saveProgress(p: CourseProgress, userEmail?: string) {
  const key = getUserStorageKey(PROGRESS_KEY, userEmail);
  localStorage.setItem(key, JSON.stringify({ ...p, lastAccessed: Date.now() }));
}

function getAllLessons(): { lesson: Lesson; chapter: Chapter; globalIndex: number }[] {
  const result: { lesson: Lesson; chapter: Chapter; globalIndex: number }[] = [];
  let idx = 0;
  for (const ch of HR_COURSE.chapters) { for (const l of ch.lessons) { result.push({ lesson: l, chapter: ch, globalIndex: idx++ }); } }
  return result;
}

function parseDuration(d: string): number { const parts = d.split(':').map(Number); return (parts[0] || 0) * 60 + (parts[1] || 0); }
function formatTimeLeft(s: number): string { const h = Math.floor(s / 3600); const m = Math.round((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; }
function formatTimestamp(ts: number): string { const diff = Date.now() - ts; const mins = Math.floor(diff / 60000); if (mins < 1) return 'Just now'; if (mins < 60) return `${mins}m ago`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`; const days = Math.floor(hrs / 24); return `${days}d ago`; }

interface UserProfile {
  name: string;
  workEmail: string;
  companyName: string;
  companyPosition: string;
  linkedinUrl: string;
  avatarDataUrl: string;
  bio: string;
}

const PROFILE_KEY = 'lms_user_profile';
const BOOKMARKS_KEY = 'lms_bookmarks';

interface Bookmark {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  courseName: string;
  moduleName: string;
  lessonType: string;
  duration?: string;
  bookmarkedAt: number;
}

function loadBookmarks(userEmail?: string): Bookmark[] {
  try {
    const key = getUserStorageKey(BOOKMARKS_KEY, userEmail);
    const raw = localStorage.getItem(key) || localStorage.getItem(BOOKMARKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveBookmarks(bookmarks: Bookmark[], userEmail?: string) {
  const key = getUserStorageKey(BOOKMARKS_KEY, userEmail);
  localStorage.setItem(key, JSON.stringify(bookmarks));
}

interface LearningSchedule {
  modulesPerDay: number;
  startDate: string;
  reminderTime: string;
  active: boolean;
}

interface ScheduleDay {
  date: string;
  dayLabel: string;
  modules: { chapterId: string; chapterTitle: string; chapterIndex: number }[];
  completed: boolean;
}

const SCHEDULE_KEY = 'lms_learning_schedule';

function loadSchedule(userEmail?: string): LearningSchedule | null {
  try {
    const key = getUserStorageKey(SCHEDULE_KEY, userEmail);
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSchedule(schedule: LearningSchedule | null, userEmail?: string) {
  const key = getUserStorageKey(SCHEDULE_KEY, userEmail);
  if (schedule) {
    localStorage.setItem(key, JSON.stringify(schedule));
  } else {
    localStorage.removeItem(key);
  }
}

function generateSchedulePlan(schedule: LearningSchedule, totalChapters: number, completedLessons: string[]): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  const start = new Date(schedule.startDate);
  let chapterIdx = 0;

  while (chapterIdx < totalChapters) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + days.length);

    const modulesForDay: ScheduleDay['modules'] = [];
    for (let i = 0; i < schedule.modulesPerDay && chapterIdx < totalChapters; i++, chapterIdx++) {
      const ch = HR_COURSE.chapters[chapterIdx];
      modulesForDay.push({ chapterId: ch.id, chapterTitle: ch.title, chapterIndex: chapterIdx });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNoTime = new Date(dayDate);
    dayNoTime.setHours(0, 0, 0, 0);
    const isCompleted = dayNoTime <= today && modulesForDay.every((m) => {
      const ch = HR_COURSE.chapters[m.chapterIndex];
      return ch.lessons.every((l) => completedLessons.includes(l.id));
    });

    days.push({
      date: dayDate.toISOString(),
      dayLabel: `Day ${days.length + 1}`,
      modules: modulesForDay,
      completed: isCompleted,
    });
  }
  return days;
}

export default function CourseDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: lmsLoading, logout: lmsLogout } = useLmsAuth();
  const { logout: mainLogout } = useAuth();
  const [progress, setProgress] = useState<CourseProgress>(() => loadProgress(user?.email));
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => { const m: Record<string, boolean> = {}; HR_COURSE.chapters.forEach((ch) => { m[ch.id] = true; }); return m; });
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
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'course' | 'profile' | 'certificate' | 'bookmarks'>('dashboard');
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'notes' | 'transcript' | 'resources'>('notes');
  const lessonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const saveTimeoutRef = useRef<any>(null);

  const profileKey = user?.email ? getUserStorageKey(PROFILE_KEY, user.email) : null;

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const name = user?.name;
    const email = user?.email;
    try {
      if (profileKey) {
        const raw = localStorage.getItem(profileKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (name && parsed.name !== name) parsed.name = name;
          if (email && (!parsed.workEmail || parsed.workEmail === 'student@incuxai.org')) parsed.workEmail = email;
          return parsed;
        }
      }
    } catch {}
    return {
      name: name || 'Student',
      workEmail: email || 'student@incuxai.org',
      companyName: 'IncuXAI Education Trust',
      companyPosition: 'Senior HR Specialist',
      linkedinUrl: '',
      avatarDataUrl: '',
      bio: '',
    };
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const [toastMsg, setToastMsg] = useState('');
  const [logoutToast, setLogoutToast] = useState(false);

  const [schedule, setSchedule] = useState<LearningSchedule | null>(() => loadSchedule(user?.email));
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<LearningSchedule>({
    modulesPerDay: 1,
    startDate: new Date().toISOString().split('T')[0],
    reminderTime: '09:00',
    active: true,
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => loadBookmarks(user?.email));
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false);
  const [showBookmarkTooltip, setShowBookmarkTooltip] = useState(false);

  useEffect(() => {
    localStorage.removeItem(PROFILE_KEY);
    if (user?.name && user?.email) {
      setUserProfile((prev) => {
        const updated = { ...prev, name: user.name, workEmail: user.email };
        if (profileKey) localStorage.setItem(profileKey, JSON.stringify(updated));
        return updated;
      });
    }
  }, [user?.email, user?.name]);

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(updated));
    }
    setEditModalOpen(false);
    setToastMsg('Profile updated successfully!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setEditForm((prev) => ({ ...prev, avatarDataUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const allLessons = useMemo(() => getAllLessons(), []);
  const totalLessons = allLessons.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const activeLessonData = useMemo(() => allLessons.find((l) => l.lesson.id === activeLessonId) || allLessons[0], [activeLessonId, allLessons]);
  const activeLesson = activeLessonData.lesson;
  const activeChapter = activeLessonData.chapter;
  const activeGlobalIndex = activeLessonData.globalIndex;
  const prevLesson = activeGlobalIndex > 0 ? allLessons[activeGlobalIndex - 1] : null;
  const nextLesson = activeGlobalIndex < totalLessons - 1 ? allLessons[activeGlobalIndex + 1] : null;
  const currentLessonProgress = progress.lessonProgress[activeLessonId];
  const isCurrentCompleted = progress.completedLessons.includes(activeLessonId);
  const totalTimeRemaining = useMemo(() => { let total = 0; allLessons.forEach(({ lesson }) => { if (!progress.completedLessons.includes(lesson.id)) total += parseDuration(lesson.duration); }); return formatTimeLeft(total); }, [allLessons, progress.completedLessons]);

  const saveLessonProgress = useCallback((lessonId: string, updates: Partial<LessonProgress>) => {
    setProgress((prev) => {
      const lp = prev.lessonProgress[lessonId] || { completed: false, watchPercent: 0, lastPosition: 0, timestamp: Date.now() };
      const newLp = { ...lp, ...updates, timestamp: Date.now() };
      const newLessonProgress = { ...prev.lessonProgress, [lessonId]: newLp };
      let newCompleted = [...prev.completedLessons];
      if (newLp.watchPercent >= WATCH_THRESHOLD && !newCompleted.includes(lessonId)) {
        newCompleted.push(lessonId);
      }
      const next = { ...prev, lessonProgress: newLessonProgress, completedLessons: newCompleted, currentLessonId: lessonId };

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(next, user?.email);
      }, 1000);

      return next;
    });
  }, [user?.email]);

  const selectLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId); setQuizAnswers({}); setQuizSubmitted(false); setActiveTab('overview'); setIsEditingNote(false);
    setProgress((prev) => { const next = { ...prev, currentLessonId: lessonId }; saveProgress(next); return next; });
    if (mobileSidebar) setMobileSidebar(false);
    setTimeout(() => { lessonRefs.current[lessonId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  }, [mobileSidebar]);

  const toggleChapter = useCallback((chId: string) => { setExpandedChapters((prev) => ({ ...prev, [chId]: !prev[chId] })); }, []);
  const navigateLesson = useCallback((dir: 'prev' | 'next') => { const target = dir === 'next' ? nextLesson : prevLesson; if (target) selectLesson(target.lesson.id); }, [nextLesson, prevLesson, selectLesson]);

  const toggleComplete = useCallback(() => {
    setProgress((prev) => { const newCompleted = isCurrentCompleted ? prev.completedLessons.filter((id) => id !== activeLessonId) : [...prev.completedLessons, activeLessonId]; const lp = prev.lessonProgress[activeLessonId] || { completed: false, watchPercent: 0, lastPosition: 0, timestamp: Date.now() }; const next = { ...prev, completedLessons: newCompleted, lessonProgress: { ...prev.lessonProgress, [activeLessonId]: { ...lp, completed: !isCurrentCompleted, watchPercent: isCurrentCompleted ? 0 : 100 } } }; saveProgress(next); return next; });
  }, [activeLessonId, isCurrentCompleted]);

  const resetProgress = useCallback(() => { localStorage.removeItem(PROGRESS_KEY); setProgress(loadProgress()); setActiveLessonId(HR_COURSE.chapters[0].lessons[0].id); }, []);

  const handleLogout = useCallback(() => {
    lmsLogout();
    mainLogout();
    setLogoutToast(true);
    setTimeout(() => setLogoutToast(false), 2500);
    window.history.replaceState(null, '', '/');
    navigate('/', { replace: true });
  }, [lmsLogout, mainLogout, navigate]);

  const isLessonBookmarked = useMemo(() => bookmarks.some((b) => b.lessonId === activeLessonId), [bookmarks, activeLessonId]);

  const toggleBookmark = useCallback(() => {
    const userId = user?.email || 'anonymous';
    setBookmarks((prev) => {
      const existing = prev.find((b) => b.lessonId === activeLessonId);
      let next: Bookmark[];
      if (existing) {
        next = prev.filter((b) => b.lessonId !== activeLessonId);
      } else {
        const newBookmark: Bookmark = {
          userId,
          courseId: 'hr-course',
          moduleId: activeChapter.id,
          lessonId: activeLesson.id,
          lessonTitle: activeLesson.title,
          courseName: 'AI for HR Professionals',
          moduleName: activeChapter.title,
          lessonType: activeLesson.type,
          duration: activeLesson.duration,
          bookmarkedAt: Date.now(),
        };
        next = [...prev, newBookmark];
        setBookmarkAnimating(true);
        setTimeout(() => setBookmarkAnimating(false), 600);
      }
      saveBookmarks(next, user?.email);
      return next;
    });
  }, [user?.email, activeLessonId, activeLesson, activeChapter]);

  const removeBookmark = useCallback((lessonId: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.lessonId !== lessonId);
      saveBookmarks(next, user?.email);
      return next;
    });
  }, [user?.email]);

  const schedulePlan = useMemo(() => {
    if (!schedule?.active) return [];
    return generateSchedulePlan(schedule, HR_COURSE.chapters.length, progress.completedLessons);
  }, [schedule, progress.completedLessons]);

  const saveLearningSchedule = useCallback(() => {
    const updated = { ...scheduleForm, active: true };
    setSchedule(updated);
    saveSchedule(updated, user?.email);
    setScheduleModalOpen(false);
    setToastMsg('Learning schedule saved!');
    setTimeout(() => setToastMsg(''), 2500);
  }, [scheduleForm, user?.email]);

  const clearLearningSchedule = useCallback(() => {
    setSchedule(null);
    saveSchedule(null, user?.email);
    setToastMsg('Schedule removed');
    setTimeout(() => setToastMsg(''), 2500);
  }, [user?.email]);

  const submitQuiz = useCallback(() => {
    if (!activeLesson.quizQuestions) return;
    let correct = 0;
    activeLesson.quizQuestions.forEach((q, i) => { if (quizAnswers[i] === q.correctIndex) correct++; });
    const score = Math.round((correct / activeLesson.quizQuestions.length) * 100);
    setQuizSubmitted(true);
    saveLessonProgress(activeLessonId, { quizScore: score });
    if (score >= 70) { setProgress((prev) => { if (!prev.completedLessons.includes(activeLessonId)) { const next = { ...prev, completedLessons: [...prev.completedLessons, activeLessonId] }; saveProgress(next); return next; } return prev; }); }
  }, [activeLesson, quizAnswers, activeLessonId, saveLessonProgress]);

  const getChapterProgress = useCallback((chapter: Chapter) => { const total = chapter.lessons.length; const done = chapter.lessons.filter((l) => progress.completedLessons.includes(l.id)).length; return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 }; }, [progress.completedLessons]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return; if (e.key === 'ArrowRight' || e.key === 'n') navigateLesson('next'); if (e.key === 'ArrowLeft' || e.key === 'p') navigateLesson('prev'); if (e.key === 'f') { const el = document.getElementById('lms-video-container'); if (el) { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.(); } } };
    window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey);
  }, [navigateLesson]);

  const videoProgressPercent = useMemo(() => { const dur = parseDuration(activeLesson.duration); if (!dur) return 0; const pos = currentLessonProgress?.lastPosition || 0; return Math.min(100, Math.round((pos / dur) * 100)); }, [activeLesson.duration, currentLessonProgress]);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const userInitial = (user?.name || user?.email || 'U')[0].toUpperCase();

  const currentStreak = useMemo(() => {
    const dates = new Set(
      Object.values(progress.lessonProgress)
        .filter(lp => lp.watchPercent >= WATCH_THRESHOLD || lp.completed)
        .map(lp => { const d = new Date(lp.timestamp); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; })
    );
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const check = new Date(today); check.setDate(check.getDate() - i);
      const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
      if (dates.has(key)) streak++; else if (i > 0) break;
    }
    return streak;
  }, [progress.lessonProgress]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now); date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toDateString();
      const count = Object.values(progress.lessonProgress)
        .filter(lp => new Date(lp.timestamp).toDateString() === dateStr && (lp.completed || lp.watchPercent >= WATCH_THRESHOLD)).length;
      return { day: days[date.getDay()], count, isToday: i === 6 };
    });
  }, [progress.lessonProgress]);
  const maxWeeklyCount = useMemo(() => Math.max(1, ...weeklyData.map(d => d.count)), [weeklyData]);

  const recentActivity = useMemo(() => {
    return Object.entries(progress.lessonProgress)
      .map(([id, lp]) => ({ id, ...lp }))
      .sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [progress.lessonProgress]);

  const achievements = useMemo(() => {
    const ms = [
      { icon: 'star', title: 'First Step', desc: 'Complete your first lesson', t: 1 },
      { icon: 'flame', title: 'Quarter Way', desc: 'Complete 25% of the course', t: 0.25 },
      { icon: 'zap', title: 'Halfway Hero', desc: 'Complete 50% of the course', t: 0.5 },
      { icon: 'trophy', title: 'Almost There', desc: 'Complete 75% of the course', t: 0.75 },
      { icon: 'crown', title: 'Course Master', desc: 'Complete all modules', t: 1 },
    ];
    return ms.map(m => ({
      ...m, unlocked: completedCount >= Math.ceil(totalLessons * m.t)
    }));
  }, [completedCount, totalLessons]);
  const unlockedCount = useMemo(() => achievements.filter(a => a.unlocked).length, [achievements]);

  const todayGoalTarget = useMemo(() => {
    const rem = totalLessons - completedCount;
    return rem <= 0 ? 0 : Math.min(rem, Math.max(1, Math.ceil(rem * 0.1)));
  }, [totalLessons, completedCount]);
  const todayGoalDone = useMemo(() => {
    const todayStr = new Date().toDateString();
    return Object.values(progress.lessonProgress)
      .filter(lp => new Date(lp.timestamp).toDateString() === todayStr && (lp.completed || lp.watchPercent >= WATCH_THRESHOLD)).length;
  }, [progress.lessonProgress]);
  const todayGoalMessage = useMemo(() => {
    if (todayGoalTarget === 0) return 'Congratulations! Course complete!';
    if (todayGoalDone >= todayGoalTarget) return 'Goal reached! Keep up the great work!';
    const left = todayGoalTarget - todayGoalDone;
    return `${left} more lesson${left !== 1 ? 's' : ''} to hit today's goal`;
  }, [todayGoalTarget, todayGoalDone]);

  const nextMilestone = useMemo(() => {
    for (const m of [25, 50, 75, 100]) {
      if (progressPercent < m) {
        const needed = Math.ceil(totalLessons * m / 100) - completedCount;
        return { percent: m, needed, message: `${needed} lesson${needed !== 1 ? 's' : ''} to reach ${m}%` };
      }
    }
    return null;
  }, [progressPercent, completedCount, totalLessons]);

  const calInfo = useMemo(() => {
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const y = now.getFullYear(), mo = now.getMonth();
    return {
      month: months[mo], year: y, monthNum: mo,
      firstDay: new Date(y, mo, 1).getDay(),
      daysInMonth: new Date(y, mo + 1, 0).getDate(),
      today: now.getDate(),
      accessed: new Set(Object.values(progress.lessonProgress).map(lp => new Date(lp.timestamp).toDateString()))
    };
  }, [progress.lessonProgress]);

  const motivationalMessage = useMemo(() => {
    if (progressPercent >= 100) return "You've mastered the course! Time to apply your knowledge.";
    if (progressPercent >= 75) return "You're in the final stretch. Finish strong!";
    if (progressPercent >= 50) return "You're halfway there! The best is yet to come.";
    if (progressPercent >= 25) return "Great progress! You're building real momentum.";
    if (completedCount >= 1) return "You've started! That's the hardest part. Keep going!";
    return "Welcome to your learning journey. Let's begin!";
  }, [progressPercent, completedCount]);

  const lessonTypeIcon = (type: string, size = 14) => {
    if (type === 'quiz') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    if (type === 'assignment') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
  };

  if (lmsLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f3', color: '#0c1628', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={s.gatePage}>
        <button onClick={() => navigate('/')} style={s.gateBackBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Home
        </button>
        <div style={s.gateCard}>
          <div style={s.gateHeader}>
            <img src={ietLogo} alt="IncuXAI Education Trust" style={{ height: '52px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
            <h1 style={s.gateTitle}>IncuXAI Learning Hub</h1>
            <p style={s.gateSubtitle}>Welcome back! Sign in to continue your course</p>
          </div>
          <div style={s.gateBody}>
            <p style={s.gateMsg}>Sign in to access your courses, track your progress, and earn certificates.</p>
            <button onClick={() => navigate('/sign-in')} style={s.gateBtnPrimary}>Sign In</button>
            <button onClick={() => navigate('/lms/sign-up')} style={s.gateBtnSecondary}>Create Account</button>
            <p style={s.gateFooter}>
              Don't have an account?{' '}
              <button onClick={() => navigate('/lms/sign-up')} style={s.gateLink}>Sign Up</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lms-root">
      <style>{lmsStyles}</style>

      <header className="lms-header">
        <div className="lms-hl">
          <button className="lms-hamburger" onClick={() => setMobileSidebar(!mobileSidebar)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          {currentPage === 'course' && (
            <button className="lms-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </button>
          )}
          <div className="lms-brand-group" onClick={() => setCurrentPage('dashboard')}>
            <img src={ietLogo} alt="IncuXAI Education Trust" style={{ height: '38px', width: 'auto', borderRadius: '6px', objectFit: 'contain' }} />
            <div className="lms-brand-text">
              <span className="lms-brand">IncuXAI</span>
              <span className="lms-brand-sub">Learning Hub</span>
            </div>
          </div>
        </div>

        <nav className="lms-header-nav">
          <button className={`lms-nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>
            <span>Dashboard</span>
          </button>
          <button className={`lms-nav-tab ${currentPage === 'course' ? 'active' : ''}`} onClick={() => setCurrentPage('course')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            <span>Courses</span>
          </button>
          <button className={`lms-nav-tab ${currentPage === 'certificate' ? 'active' : ''}`} onClick={() => setCurrentPage('certificate')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <span>Certificates</span>
          </button>
          <button className={`lms-nav-tab ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </button>
        </nav>

        <div className="lms-hr">
          <div className="lms-progress-wrap" title="Overall Progress">
            <div className="lms-progress-bar"><div className="lms-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
            <span className="lms-progress-text">{progressPercent}%</span>
          </div>

          <div className="lms-avatar" title={userProfile.name} onClick={() => setCurrentPage('profile')}>
            {userProfile.avatarDataUrl ? (
              <img src={userProfile.avatarDataUrl} alt={userProfile.name} className="lms-avatar-img" />
            ) : (
              (userProfile.name?.charAt(0) || 'S').toUpperCase()
            )}
          </div>

          <button className="lms-logout-btn" onClick={handleLogout} title="Sign Out">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {currentPage === 'dashboard' && (
        <div className="lms-page-content">
          <div className="lms-dash">
            {/* Hero Learning Card */}
            <div className="lms-hero-card">
              <div className="lms-hero-content">
                <div className="lms-hero-text">
                  <div className="lms-hero-badge">
                    <BookOpen size={14} />
                    <span>IncuXAI Learning Hub</span>
                  </div>
                  <h1 className="lms-hero-name">Welcome back, {user?.name || 'Student'}</h1>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 22px', lineHeight: 1.6 }}>
                    Track your progress, resume your course, and master HR skills step-by-step.
                  </p>
                  <div className="lms-hero-actions">
                    <button className="lms-hero-resume-btn" onClick={() => setCurrentPage('course')}>
                      <Play size={16} />
                      Resume Current Module
                    </button>
                    <button className="lms-hero-view-btn" onClick={() => setCurrentPage('profile')}>
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="lms-hero-ring-wrap">
                  <div className="lms-hero-ring">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="url(#heroGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progressPercent * 3.267} 326.7`} transform="rotate(-90 60 60)"/>
                      <defs>
                        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B"/>
                          <stop offset="50%" stopColor="#C5A059"/>
                          <stop offset="100%" stopColor="#10B981"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="lms-hero-ring-inner">
                      <span className="lms-hero-pct">{progressPercent}%</span>
                      <span className="lms-hero-pct-label">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lms-quick-actions">
              <button className="lms-qa-card" onClick={() => setCurrentPage('course')}>
                <div className="lms-qa-icon" style={{ background: 'linear-gradient(135deg, #9B7A3E, #7D6334)' }}>
                  <Play size={22} style={{ color: '#ffffff' }} />
                </div>
                <div className="lms-qa-info">
                  <span className="lms-qa-title">Resume Course</span>
                  <span className="lms-qa-sub">Continue where you left off</span>
                </div>
              </button>
              <button className="lms-qa-card" onClick={() => { if (nextLesson) { selectLesson(nextLesson.lesson.id); setCurrentPage('course'); } }}>
                <div className="lms-qa-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <SkipForward size={22} style={{ color: '#ffffff' }} />
                </div>
                <div className="lms-qa-info">
                  <span className="lms-qa-title">Next Chapter</span>
                  <span className="lms-qa-sub">{nextLesson ? nextLesson.lesson.title : 'All done!'}</span>
                </div>
              </button>
              <button className="lms-qa-card" onClick={() => { if (prevLesson) { selectLesson(prevLesson.lesson.id); setCurrentPage('course'); } }}>
                <div className="lms-qa-icon" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
                  <SkipForward size={22} style={{ color: '#ffffff', transform: 'scaleX(-1)' }} />
                </div>
                <div className="lms-qa-info">
                  <span className="lms-qa-title">Previous Chapter</span>
                  <span className="lms-qa-sub">{prevLesson ? prevLesson.lesson.title : 'Start of course'}</span>
                </div>
              </button>
              <button className="lms-qa-card" onClick={() => setCurrentPage('bookmarks')}>
                <div className="lms-qa-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  <Bookmark size={22} style={{ color: '#ffffff' }} />
                </div>
                <div className="lms-qa-info">
                  <span className="lms-qa-title">Saved Modules</span>
                  <span className="lms-qa-sub">{bookmarks.length === 0 ? 'No bookmarks yet' : `${bookmarks.length} bookmarked`}</span>
                </div>
              </button>
            </div>

            {/* Course Overview */}
            <div className="lms-section-card">
              <h3 className="lms-section-title">
                <BookOpen size={18} style={{ color: '#9B7A3E' }} />
                Course Overview
              </h3>
              <div className="lms-overview-header">
                <div>
                  <h4 className="lms-overview-course-name">{HR_COURSE.title}</h4>
                  <p className="lms-overview-course-sub">{HR_COURSE.subtitle}</p>
                </div>
                <div className="lms-overview-stats">
                  <div className="lms-overview-stat">
                    <span className="lms-overview-stat-val">{HR_COURSE.chapters.length}</span>
                    <span className="lms-overview-stat-label">Modules</span>
                  </div>
                  <div className="lms-overview-stat">
                    <span className="lms-overview-stat-val">{totalLessons}</span>
                    <span className="lms-overview-stat-label">Learning Path</span>
                  </div>
                  <div className="lms-overview-stat">
                    <span className="lms-overview-stat-val">{progressPercent}%</span>
                    <span className="lms-overview-stat-label">Complete</span>
                  </div>
                </div>
              </div>
              <div className="lms-overview-modules">
                {HR_COURSE.chapters.map((chapter, ci) => {
                  const cp = getChapterProgress(chapter);
                  return (
                    <div key={chapter.id} className="lms-overview-module" onClick={() => { selectLesson(chapter.lessons[0].id); setCurrentPage('course'); }}>
                      <div className="lms-overview-module-header">
                        <span className="lms-overview-module-num">Module {ci + 1}</span>
                        <span className="lms-overview-module-count">{cp.done}/{cp.total} modules</span>
                      </div>
                      <h5 className="lms-overview-module-title">{chapter.title}</h5>
                      <div className="lms-overview-module-bar">
                        <div className="lms-overview-module-fill" style={{ width: `${cp.percent}%` }} />
                      </div>
                      <span className="lms-overview-module-pct">{cp.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'course' && (
        <div className="lms-body">
          <aside className={`lms-sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileSidebar ? 'mobile-open' : ''}`}>
            <div className="lms-sidebar-header">
              <h2 className="lms-sidebar-title">Learning Path</h2>
              <span className="lms-sidebar-meta">{completedCount}/{totalLessons}</span>
            </div>
            <div className="lms-sidebar-scroll">
              {HR_COURSE.chapters.map((chapter, ci) => {
                const cp = getChapterProgress(chapter);
                const isExpanded = expandedChapters[chapter.id];
                return (
                  <div key={chapter.id} className="lms-chapter">
                    <button className="lms-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                      <div className="lms-chapter-info">
                        <svg className={`lms-chevron ${isExpanded ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        <span className="lms-chapter-num">Module {ci + 1}</span>
                        <span className="lms-chapter-name">{chapter.title}</span>
                      </div>
                      <div className="lms-chapter-meta">
                        <span className="lms-chapter-count">{cp.done}/{cp.total}</span>
                        <div className="lms-chapter-bar"><div className="lms-chapter-bar-fill" style={{ width: `${cp.percent}%` }} /></div>
                      </div>
                    </button>
                    <div className={`lms-chapter-lessons ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      {chapter.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const isDone = progress.completedLessons.includes(lesson.id);
                        const lProgress = progress.lessonProgress[lesson.id];
                        return (
                          <div key={lesson.id} ref={(el) => { lessonRefs.current[lesson.id] = el; }}
                            className={`lms-lesson ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                            onClick={() => selectLesson(lesson.id)}>
                            <div className="lms-lesson-icon">
                              {isDone ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              ) : isActive ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="#D4A72C"/></svg>
                              ) : (
                                lessonTypeIcon(lesson.type)
                              )}
                            </div>
                            <div className="lms-lesson-info">
                              <span className="lms-lesson-title">{lesson.title}</span>
                              <div className="lms-lesson-meta-row">
                                <span className="lms-lesson-duration">{lesson.duration}</span>
                                <span className={`lms-lesson-type ${lesson.type}`}>{lesson.type}</span>
                              </div>
                            </div>
                            {lProgress && lProgress.watchPercent > 0 && !isDone && (
                              <div className="lms-lesson-mini-progress"><div className="lms-lesson-mini-fill" style={{ width: `${Math.min(100, lProgress.watchPercent)}%` }} /></div>
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
              <div className="lms-stat-row"><span className="lms-stat-label">Completed</span><span className="lms-stat-value">{completedCount}/{totalLessons}</span></div>
              <div className="lms-stat-row"><span className="lms-stat-label">Remaining</span><span className="lms-stat-value">{totalLessons - completedCount}</span></div>
              <div className="lms-stat-row"><span className="lms-stat-label">Est. Time Left</span><span className="lms-stat-value">{totalTimeRemaining}</span></div>
            </div>
          </aside>

          {mobileSidebar && <div className="lms-mobile-overlay" onClick={() => setMobileSidebar(false)} />}

          <main className="lms-main">
            <div className="lms-video-section">
              <div className="lms-video-meta">
                <span className="lms-lesson-badge">{activeChapter.title}</span>
                <div className="lms-video-meta-actions">
                  <button className="lms-panel-toggle" onClick={() => setRightPanelOpen(!rightPanelOpen)} title="Toggle panel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                  </button>
                  <button
                    className={`lms-bookmark-btn ${isLessonBookmarked ? 'bookmarked' : ''} ${bookmarkAnimating ? 'bookmark-pop' : ''}`}
                    onClick={toggleBookmark}
                    onMouseEnter={() => setShowBookmarkTooltip(true)}
                    onMouseLeave={() => setShowBookmarkTooltip(false)}
                    aria-label="Bookmark lesson"
                    aria-pressed={isLessonBookmarked}
                    title={isLessonBookmarked ? 'Saved to Bookmarks' : 'Save lesson'}
                  >
                    <Bookmark size={16} fill={isLessonBookmarked ? '#9B7A3E' : 'none'} stroke={isLessonBookmarked ? '#9B7A3E' : 'currentColor'} />
                    {showBookmarkTooltip && (
                      <span className="lms-bookmark-tooltip">{isLessonBookmarked ? 'Saved to Bookmarks' : 'Save lesson'}</span>
                    )}
                  </button>
                  <button className={`lms-done-btn ${isCurrentCompleted ? 'done' : ''}`} onClick={toggleComplete}>
                    {isCurrentCompleted ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Completed</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> Mark Complete</>}
                  </button>
                </div>
              </div>
              <h1 className="lms-video-title">{activeLesson.title}</h1>

              {activeLesson.type === 'video' && (
                <div className="lms-video-container" id="lms-video-container">
                  <div className="lms-video-aspect">
                    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" title={activeLesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen className="lms-video-iframe" />
                  </div>
                  <div className="lms-video-controls">
                    <div className="lms-video-progress-bar"><div className="lms-video-progress-fill" style={{ width: `${videoProgressPercent}%` }} /></div>
                    <div className="lms-controls-row">
                      <div className="lms-controls-left">
                        <button className="lms-ctrl-btn" onClick={() => navigateLesson('prev')} disabled={!prevLesson} title="Previous (P)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <button className="lms-ctrl-btn" onClick={() => navigateLesson('next')} disabled={!nextLesson} title="Next (N)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
                        <span className="lms-time-label">{activeLesson.duration}</span>
                      </div>
                      <div className="lms-controls-right">
                        <div className="lms-speed-wrap">
                          <button className="lms-ctrl-btn speed" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>{playbackSpeed}x</button>
                          {showSpeedMenu && <div className="lms-speed-menu">{speeds.map((sp) => <button key={sp} className={`lms-speed-opt ${playbackSpeed === sp ? 'active' : ''}`} onClick={() => { setPlaybackSpeed(sp); setShowSpeedMenu(false); }}>{sp}x</button>)}</div>}
                        </div>
                        <button className="lms-ctrl-btn" onClick={() => { const el = document.getElementById('lms-video-container'); if (document.fullscreenElement) document.exitFullscreen(); else el?.requestFullscreen?.(); }} title="Fullscreen (F)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeLesson.type === 'quiz' && activeLesson.quizQuestions && (
                <div className="lms-quiz-container">
                  <div className="lms-quiz-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div><h3 className="lms-quiz-title">Knowledge Check</h3><p className="lms-quiz-sub">{activeLesson.quizQuestions.length} questions &middot; {activeLesson.duration}</p></div>
                  </div>
                  {activeLesson.quizQuestions.map((q: QuizQuestion, qi: number) => (
                    <div key={qi} className="lms-quiz-question">
                      <p className="lms-q-text"><span className="lms-q-num">Q{qi + 1}.</span> {q.question}</p>
                      {q.options.map((opt: string, oi: number) => {
                        const isSelected = quizAnswers[qi] === oi; const isCorrect = oi === q.correctIndex;
                        let cls = 'lms-q-option';
                        if (quizSubmitted) { if (isCorrect) cls += ' correct'; else if (isSelected && !isCorrect) cls += ' wrong'; } else if (isSelected) cls += ' selected';
                        return (
                          <button key={oi} className={cls} disabled={quizSubmitted} onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [qi]: oi }))}>
                            <span className="lms-q-letter">{String.fromCharCode(65 + oi)}</span><span>{opt}</span>
                            {quizSubmitted && isCorrect && <svg className="lms-q-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            {quizSubmitted && isSelected && !isCorrect && <svg className="lms-q-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                          </button>
                        );
                      })}
                      {quizSubmitted && <div className="lms-q-explanation"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>{q.explanation}</div>}
                    </div>
                  ))}
                  {!quizSubmitted ? (
                    <button className="lms-quiz-submit" onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < activeLesson.quizQuestions.length}>Submit Answers ({Object.keys(quizAnswers).length}/{activeLesson.quizQuestions.length})</button>
                  ) : (
                    <div className="lms-quiz-result">
                      {(() => { let correct = 0; activeLesson.quizQuestions!.forEach((q, i) => { if (quizAnswers[i] === q.correctIndex) correct++; }); const score = Math.round((correct / activeLesson.quizQuestions!.length) * 100); return (<><div className={`lms-score-circle ${score >= 70 ? 'pass' : 'fail'}`}><span className="lms-score-num">{score}%</span></div><div><p className="lms-score-text">{score >= 70 ? 'Great work! You passed.' : 'Keep learning and try again.'}</p><p className="lms-score-detail">{correct}/{activeLesson.quizQuestions!.length} correct</p></div></>); })()}
                    </div>
                  )}
                </div>
              )}

              {activeLesson.type === 'assignment' && (
                <div className="lms-assignment-container">
                  <div className="lms-assignment-header"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><h3>Assignment</h3></div>
                  <div className="lms-assignment-body">{activeLesson.notes?.split('\n').map((line: string, i: number) => (<p key={i} className={line.startsWith('•') || /^\d+\./.test(line) ? 'lms-a-indent' : line === '' ? 'lms-a-break' : ''}>{line || '\u00A0'}</p>))}</div>
                </div>
              )}

              <p className="lms-video-desc">{activeLesson.description}</p>

              <div className="lms-nav-row">
                {prevLesson ? (<button className="lms-nav-btn prev" onClick={() => navigateLesson('prev')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg><div><span className="lms-nav-label">Previous</span><span className="lms-nav-name">{prevLesson.lesson.title}</span></div></button>) : <div />}
                {nextLesson ? (<button className="lms-nav-btn next" onClick={() => navigateLesson('next')}><div><span className="lms-nav-label">Next</span><span className="lms-nav-name">{nextLesson.lesson.title}</span></div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>) : (<div className="lms-complete-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Course Complete!</div>)}
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
                  <div className="lms-overview-card"><h3>About This Module</h3><p>{activeLesson.description}</p></div>
                  <div className="lms-overview-grid">
                    <div className="lms-ov-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><div><span className="lms-ov-label">Duration</span><span className="lms-ov-val">{activeLesson.duration}</span></div></div>
                    <div className="lms-ov-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><div><span className="lms-ov-label">Last Updated</span><span className="lms-ov-val">{HR_COURSE.lastUpdated}</span></div></div>
                    <div className="lms-ov-item">{lessonTypeIcon(activeLesson.type, 18)}<div><span className="lms-ov-label">Type</span><span className="lms-ov-val" style={{ textTransform: 'capitalize' }}>{activeLesson.type}</span></div></div>
                    <div className="lms-ov-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><div><span className="lms-ov-label">Instructor</span><span className="lms-ov-val">{HR_COURSE.instructor}</span></div></div>
                  </div>
                  <div className="lms-overview-card">
                    <h3>Instructor</h3>
                    <div className="lms-instructor-row"><div className="lms-instructor-avatar">I</div><div><p className="lms-instructor-name">{HR_COURSE.instructor}</p><p className="lms-instructor-role">{HR_COURSE.instructorRole}</p></div></div>
                    <p className="lms-instructor-bio">Dedicated to making AI education accessible and practical for professionals across all industries.</p>
                  </div>
                </div>
              )}
              {activeTab === 'notes' && (
                <div className="lms-notes">
                  <div className="lms-notes-header">
                    <h3>Your Notes</h3>
                    {!isEditingNote ? (<button className="lms-note-edit-btn" onClick={() => { setEditNote(currentLessonProgress?.notes || activeLesson.notes || ''); setIsEditingNote(true); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>) : (<div className="lms-note-actions"><button className="lms-note-save" onClick={() => { saveLessonProgress(activeLessonId, { notes: editNote }); setIsEditingNote(false); }}>Save</button><button className="lms-note-cancel" onClick={() => setIsEditingNote(false)}>Cancel</button></div>)}
                  </div>
                  {isEditingNote ? (<textarea className="lms-note-textarea" value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="Write your notes for this module..." />) : (<div className="lms-note-content">{(currentLessonProgress?.notes || activeLesson.notes) ? ((currentLessonProgress?.notes || activeLesson.notes || '').split('\n').map((line: string, i: number) => <p key={i}>{line || '\u00A0'}</p>)) : <p className="lms-note-empty">No notes yet. Click Edit to add notes.</p>}</div>)}
                </div>
              )}
              {activeTab === 'transcript' && (
                <div className="lms-transcript">
                  {activeLesson.transcript ? (<div className="lms-transcript-content">{activeLesson.transcript.split('. ').reduce((acc: string[], sentence: string, i: number) => { if (i % 3 === 0) acc.push(sentence); else acc[acc.length - 1] += '. ' + sentence; return acc; }, []).map((para: string, i: number) => <p key={i}>{para}{para.endsWith('.') ? '' : '.'}</p>)}</div>) : <p className="lms-note-empty">Transcript not available for this module.</p>}
                </div>
              )}
              {activeTab === 'resources' && (
                <div className="lms-resources">
                  {activeLesson.resources && activeLesson.resources.length > 0 ? (<div className="lms-resources-list">{activeLesson.resources.map((r, i) => (<a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="lms-resource-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg><span>{r.title}</span></a>))}</div>) : <p className="lms-note-empty">No additional resources for this module.</p>}
                </div>
              )}
            </div>
          </main>

          {rightPanelOpen && (
            <aside className="lms-right-panel">
              <div className="lms-rp-header">
                <h3>{rightPanelTab === 'notes' ? 'Notes' : rightPanelTab === 'transcript' ? 'Transcript' : 'Resources'}</h3>
                <button className="lms-rp-close" onClick={() => setRightPanelOpen(false)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="lms-rp-tabs">
                {(['notes', 'transcript', 'resources'] as const).map((t) => <button key={t} className={`lms-rp-tab ${rightPanelTab === t ? 'active' : ''}`} onClick={() => setRightPanelTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
              </div>
              <div className="lms-rp-content">
                {rightPanelTab === 'notes' && (<div className="lms-rp-notes">{(currentLessonProgress?.notes || activeLesson.notes) ? ((currentLessonProgress?.notes || activeLesson.notes || '').split('\n').map((line: string, i: number) => <p key={i}>{line || '\u00A0'}</p>)) : <p className="lms-note-empty">No notes for this module.</p>}</div>)}
                {rightPanelTab === 'transcript' && (<div className="lms-rp-transcript">{activeLesson.transcript ? activeLesson.transcript.split('. ').reduce((acc: string[], s: string, i: number) => { if (i % 3 === 0) acc.push(s); else acc[acc.length - 1] += '. ' + s; return acc; }, []).map((p: string, i: number) => <p key={i}>{p}{p.endsWith('.') ? '' : '.'}</p>) : <p className="lms-note-empty">No transcript available.</p>}</div>)}
                {rightPanelTab === 'resources' && (<div className="lms-rp-resources">{activeLesson.resources && activeLesson.resources.length > 0 ? activeLesson.resources.map((r, i) => <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="lms-resource-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg><span>{r.title}</span></a>) : <p className="lms-note-empty">No resources available.</p>}</div>)}
              </div>
            </aside>
          )}
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="lms-page-content">
          <div className="lms-profile-v2">
            {/* 2-Column Responsive Layout */}
            <div className="lms-profile-layout">
              {/* Left Column: User Identity & Account Controls */}
              <div className="lms-profile-left">
                <div className="lms-profile-user-card">
                  {userProfile.avatarDataUrl ? (
                    <img src={userProfile.avatarDataUrl} alt={userProfile.name} className="lms-profile-avatar-img" />
                  ) : (
                    <div className="lms-profile-avatar-lg">{(userProfile.name?.charAt(0) || 'S').toUpperCase()}</div>
                  )}
                  <div className="lms-profile-user-details">
                    <span className="lms-profile-role-badge">{userProfile.companyPosition}</span>
                    <h1 className="lms-profile-name">{userProfile.name}</h1>
                    <p className="lms-profile-company">{userProfile.companyPosition} &middot; {userProfile.companyName}</p>
                    <p className="lms-profile-email">📧 {userProfile.workEmail}</p>
                    {userProfile.bio && <p className="lms-profile-bio">{userProfile.bio}</p>}
                    {userProfile.linkedinUrl && (
                      <div style={{ margin: '8px 0' }}>
                        <a href={userProfile.linkedinUrl.startsWith('http') ? userProfile.linkedinUrl : `https://${userProfile.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="lms-profile-linkedin-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                          <span>LinkedIn Profile</span>
                        </a>
                      </div>
                    )}
                    <div>
                      <button className="lms-edit-profile-btn" onClick={() => { setEditForm(userProfile); setEditModalOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lms-profile-card lms-danger-zone">
                  <h3>Account Controls</h3>
                  <p>Resetting progress will clear all completed module states and quiz scores.</p>
                  <button className="lms-reset-progress-btn" onClick={() => { if (confirm('Are you sure you want to reset all course progress?')) resetProgress(); }}>
                    Reset All Progress
                  </button>
                </div>
              </div>

              {/* Right Column: Enrolled Course Progress & Achievements */}
              <div className="lms-profile-right">
                <div className="lms-profile-card">
                  <div className="lms-card-head">
                    <h3>Enrolled Course</h3>
                    <span className="lms-badge-green">Active</span>
                  </div>
                  <div className="lms-profile-course">
                    <div className="lms-profile-course-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                    </div>
                    <div>
                      <p className="lms-profile-course-title">{HR_COURSE.title}</p>
                      <p className="lms-profile-course-meta">{HR_COURSE.instructor} &middot; {totalLessons} modules &middot; Updated {HR_COURSE.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="lms-profile-prog-block">
                    <div className="lms-profile-progress-bar"><div className="lms-profile-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
                    <div className="lms-profile-prog-meta">
                      <span>{completedCount} of {totalLessons} completed</span>
                      <span><strong>{progressPercent}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Scheduled Learning Card */}
                <div className="lms-profile-card lms-schedule-card">
                  <div className="lms-card-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} style={{ color: '#9B7A3E' }} />
                      <h3>Scheduled Learning</h3>
                    </div>
                    {schedule?.active ? (
                      <span className="lms-badge-green">Active</span>
                    ) : (
                      <span className="lms-card-sub-tag">Not set</span>
                    )}
                  </div>

                  {schedule?.active && schedulePlan.length > 0 ? (
                    <>
                      <div className="lms-schedule-summary">
                        <div className="lms-schedule-stat">
                          <span className="lms-schedule-stat-val">{schedule.modulesPerDay}</span>
                          <span className="lms-schedule-stat-label">Modules/Day</span>
                        </div>
                        <div className="lms-schedule-stat">
                          <span className="lms-schedule-stat-val">{schedulePlan.length}</span>
                          <span className="lms-schedule-stat-label">Total Days</span>
                        </div>
                        <div className="lms-schedule-stat">
                          <span className="lms-schedule-stat-val">{schedule.reminderTime}</span>
                          <span className="lms-schedule-stat-label">Reminder</span>
                        </div>
                      </div>

                      <div className="lms-schedule-timeline">
                        {schedulePlan.map((day, di) => {
                          const dayDate = new Date(day.date);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const dayNoTime = new Date(dayDate);
                          dayNoTime.setHours(0, 0, 0, 0);
                          const isToday = dayNoTime.getTime() === today.getTime();
                          const isPast = dayNoTime < today;
                          const allDone = day.modules.every((m) => {
                            const ch = HR_COURSE.chapters[m.chapterIndex];
                            return ch.lessons.every((l) => progress.completedLessons.includes(l.id));
                          });

                          return (
                            <div key={di} className={`lms-schedule-day ${isToday ? 'today' : ''} ${allDone ? 'done' : ''} ${isPast && !allDone ? 'missed' : ''}`}>
                              <div className="lms-schedule-day-left">
                                <div className={`lms-schedule-day-dot ${allDone ? 'done' : isToday ? 'current' : isPast ? 'missed' : ''}`}>
                                  {allDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : null}
                                </div>
                                {di < schedulePlan.length - 1 && <div className={`lms-schedule-day-line ${allDone ? 'done' : ''}`} />}
                              </div>
                              <div className="lms-schedule-day-content">
                                <div className="lms-schedule-day-head">
                                  <span className={`lms-schedule-day-label ${isToday ? 'today' : ''}`}>{day.dayLabel}{isToday ? ' (Today)' : ''}</span>
                                  <span className="lms-schedule-day-date">{dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                {day.modules.map((m, mi) => {
                                  const chDone = HR_COURSE.chapters[m.chapterIndex].lessons.every((l) => progress.completedLessons.includes(l.id));
                                  return (
                                    <div key={mi} className="lms-schedule-day-module" onClick={() => { selectLesson(HR_COURSE.chapters[m.chapterIndex].lessons[0].id); setCurrentPage('course'); }}>
                                      <div className={`lms-schedule-module-dot ${chDone ? 'done' : ''}`}>
                                        {chDone ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : <span>{m.chapterIndex + 1}</span>}
                                      </div>
                                      <span className="lms-schedule-module-name">{m.chapterTitle}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="lms-schedule-actions">
                        <button className="lms-schedule-edit-btn" onClick={() => { setScheduleForm(schedule); setScheduleModalOpen(true); }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit Schedule
                        </button>
                        <button className="lms-schedule-clear-btn" onClick={clearLearningSchedule}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="lms-schedule-empty">
                      <div className="lms-schedule-empty-icon">
                        <Calendar size={32} style={{ color: '#9B7A3E' }} />
                      </div>
                      <p className="lms-schedule-empty-text">Set a learning pace and we'll build a day-by-day plan to help you finish the course on time.</p>
                      <button className="lms-schedule-setup-btn" onClick={() => { setScheduleForm({ modulesPerDay: 1, startDate: new Date().toISOString().split('T')[0], reminderTime: '09:00', active: true }); setScheduleModalOpen(true); }}>
                        <Calendar size={16} />
                        Create Schedule
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'certificate' && (
        <div className="lms-page-content">
          <div className="lms-certificate-page">
            {progressPercent >= 100 ? (
              <div className="lms-cert-ready">
                <div className="lms-cert-frame"><div className="lms-cert-border"><div className="lms-cert-inner">
                  <div className="lms-cert-logo">IncuXAI</div><div className="lms-cert-subtitle">Education Trust</div>
                  <div className="lms-cert-heading">Certificate of Completion</div>
                  <div className="lms-cert-text">This is to certify that</div>
                  <div className="lms-cert-name">{user?.name || 'Student'}</div>
                  <div className="lms-cert-text">has successfully completed the course</div>
                  <div className="lms-cert-course">{HR_COURSE.title}</div>
                  <div className="lms-cert-text">with {progressPercent}% completion on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="lms-cert-footer"><div className="lms-cert-sig"><div className="lms-cert-sig-line"></div><div className="lms-cert-sig-name">IncuXAI Education Trust</div></div><div className="lms-cert-badge"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div></div>
                </div></div></div>
                <div className="lms-cert-actions">
                  <button className="lms-cert-action-btn primary" onClick={() => window.print()}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Download PDF</button>
                  <button className="lms-cert-action-btn secondary" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>Share on LinkedIn</button>
                </div>
              </div>
            ) : (
              <div className="lms-cert-locked">
                <div className="lms-cert-lock-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
                <h2>Complete the Course to Earn Your Certificate</h2>
                <p>You are <strong>{progressPercent}%</strong> done. Complete all {totalLessons} modules to unlock your certificate.</p>
                <div className="lms-cert-progress-bar"><div className="lms-cert-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
                <p className="lms-cert-remaining">{totalLessons - completedCount} modules remaining</p>
                <button className="lms-cert-cta" onClick={() => setCurrentPage('course')}>Continue Learning</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', background: '#0c1628', color: '#ffffff', border: '1px solid rgba(155,122,62,0.5)', borderRadius: '99px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 9999, fontWeight: 600, fontSize: '0.88rem' }}>
          {toastMsg}
        </div>
      )}

      {/* Logout Toast Notification */}
      {logoutToast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '99px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 10000, fontWeight: 600, fontSize: '0.88rem', animation: 'fadeIn 0.3s ease' }}>
          \u2705 Logged out successfully.
        </div>
      )}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="lms-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h2 className="lms-modal-title">Edit Profile Details</h2>
              <button className="lms-modal-close" onClick={() => setEditModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="lms-avatar-upload-row">
              <div className="lms-avatar-upload-preview">
                {editForm.avatarDataUrl ? (
                  <img src={editForm.avatarDataUrl} alt="Avatar Preview" />
                ) : (
                  (editForm.name?.charAt(0) || 'S').toUpperCase()
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="lms-file-input-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Photo from Device
                  <input type="file" accept="image/*" className="lms-file-input-hidden" onChange={handleAvatarFileUpload} />
                </label>
                {editForm.avatarDataUrl && (
                  <button type="button" className="lms-remove-avatar-btn" onClick={() => setEditForm(prev => ({ ...prev, avatarDataUrl: '' }))}>
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="lms-form-grid">
              <div className="lms-form-group">
                <label className="lms-form-label">Full Name</label>
                <input type="text" className="lms-form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Full Name" />
              </div>
              <div className="lms-form-group">
                <label className="lms-form-label">Work Email</label>
                <input type="email" className="lms-form-input" value={editForm.workEmail} onChange={(e) => setEditForm({ ...editForm, workEmail: e.target.value })} placeholder="work@company.com" />
              </div>
            </div>

            <div className="lms-form-grid">
              <div className="lms-form-group">
                <label className="lms-form-label">Company Name</label>
                <input type="text" className="lms-form-input" value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} placeholder="Company Name" />
              </div>
              <div className="lms-form-group">
                <label className="lms-form-label">Company Position / Title</label>
                <input type="text" className="lms-form-input" value={editForm.companyPosition} onChange={(e) => setEditForm({ ...editForm, companyPosition: e.target.value })} placeholder="Position / Role" />
              </div>
            </div>

            <div className="lms-form-group">
              <label className="lms-form-label">LinkedIn Profile URL</label>
              <input type="url" className="lms-form-input" value={editForm.linkedinUrl} onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="lms-form-group">
              <label className="lms-form-label">Professional Bio / Summary</label>
              <textarea className="lms-form-input" style={{ minHeight: '80px', resize: 'vertical' }} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Brief professional bio..." />
            </div>

            <div className="lms-modal-footer">
              <button type="button" className="lms-modal-cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button type="button" className="lms-modal-save" onClick={() => handleSaveProfile(editForm)}>Save Profile Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Schedule Modal */}
      {scheduleModalOpen && (
        <div className="lms-modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="lms-modal-header">
              <h2 className="lms-modal-title">
                <Calendar size={20} style={{ color: '#9B7A3E', marginRight: '8px' }} />
                Set Learning Schedule
              </h2>
              <button className="lms-modal-close" onClick={() => setScheduleModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="lms-form-group">
                <label className="lms-form-label">Modules per Day</label>
                <div className="lms-schedule-speed-grid">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      className={`lms-schedule-speed-btn ${scheduleForm.modulesPerDay === num ? 'active' : ''}`}
                      onClick={() => setScheduleForm({ ...scheduleForm, modulesPerDay: num })}
                    >
                      <span className="lms-schedule-speed-num">{num}</span>
                      <span className="lms-schedule-speed-label">
                        {num === 1 ? 'module' : 'modules'}/day
                      </span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '8px 0 0', lineHeight: 1.5 }}>
                  {scheduleForm.modulesPerDay === 1 && `You'll finish the course in ${HR_COURSE.chapters.length} days.`}
                  {scheduleForm.modulesPerDay === 2 && `You'll finish the course in ${Math.ceil(HR_COURSE.chapters.length / 2)} days.`}
                  {scheduleForm.modulesPerDay === 3 && `You'll finish the course in ${Math.ceil(HR_COURSE.chapters.length / 3)} days.`}
                  {scheduleForm.modulesPerDay === 4 && `You'll finish the course in ${Math.ceil(HR_COURSE.chapters.length / 4)} days.`}
                </p>
              </div>

              <div className="lms-form-grid">
                <div className="lms-form-group">
                  <label className="lms-form-label">Start Date</label>
                  <input
                    type="date"
                    className="lms-form-input"
                    value={scheduleForm.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startDate: e.target.value })}
                  />
                </div>
                <div className="lms-form-group">
                  <label className="lms-form-label">Daily Reminder</label>
                  <input
                    type="time"
                    className="lms-form-input"
                    value={scheduleForm.reminderTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, reminderTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="lms-modal-footer">
              <button type="button" className="lms-modal-cancel" onClick={() => setScheduleModalOpen(false)}>Cancel</button>
              <button type="button" className="lms-modal-save" onClick={saveLearningSchedule}>
                <Calendar size={15} style={{ marginRight: '6px' }} />
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Lessons Page */}
      {currentPage === 'bookmarks' && (
        <div className="lms-page-content">
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#0c1628', margin: 0 }}>Saved Modules</h2>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0' }}>{bookmarks.length} bookmarked lesson{bookmarks.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setCurrentPage('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#ffffff', border: '1px solid rgba(12,22,40,0.12)', borderRadius: '99px', color: '#0c1628', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back to Dashboard
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '64px 24px', background: '#ffffff', borderRadius: '18px', border: '1px solid rgba(12,22,40,0.08)', boxShadow: '0 8px 30px rgba(12,22,40,0.04)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(155,122,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bookmark size={28} style={{ color: '#9B7A3E' }} />
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#0c1628', margin: 0 }}>No saved modules yet</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
                  Bookmark modules while learning and they'll appear here.
                </p>
                <button onClick={() => setCurrentPage('course')} style={{ marginTop: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #9B7A3E, #7D6334)', color: '#fff', border: 'none', borderRadius: '99px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(155,122,62,0.3)' }}>
                  Start Learning
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookmarks.map((bm) => (
                  <div key={bm.lessonId} className="lms-bookmark-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid rgba(12,22,40,0.08)', boxShadow: '0 4px 16px rgba(12,22,40,0.03)', transition: 'all 0.2s' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bm.lessonType === 'quiz' ? 'rgba(99,102,241,0.12)' : bm.lessonType === 'assignment' ? 'rgba(236,72,153,0.12)' : 'rgba(155,122,62,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {lessonTypeIcon(bm.lessonType, 20)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem', fontWeight: 700, color: '#0c1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{bm.lessonTitle}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{bm.courseName}</span>
                        <span>&middot;</span>
                        <span>{bm.moduleName}</span>
                        {bm.duration && <><span>&middot;</span><span>{bm.duration}</span></>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => { selectLesson(bm.lessonId); setCurrentPage('course'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'linear-gradient(135deg, #9B7A3E, #7D6334)', color: '#fff', border: 'none', borderRadius: '99px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                      >
                        <Play size={14} />
                        View Lesson
                      </button>
                      <button
                        onClick={() => removeBookmark(bm.lessonId)}
                        title="Remove bookmark"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '10px', color: '#dc2626', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const lmsStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.lms-root{font-family:'Inter',system-ui,-apple-system,sans-serif;background:#f8f7f3;color:#1e293b;height:100vh;display:flex;flex-direction:column;overflow:hidden;-webkit-font-smoothing:antialiased}

/* Full Width Left-to-Right Header (#0c1628 Deep Navy) */
header.lms-header, .lms-header{position:sticky !important;top:0 !important;left:0 !important;right:0 !important;width:100% !important;max-width:100% !important;margin:0 !important;border-radius:0 !important;height:64px !important;min-height:64px !important;display:flex !important;align-items:center !important;justify-content:space-between !important;padding:0 24px !important;background:#0c1628 !important;border:none !important;border-bottom:1px solid rgba(255,255,255,0.08) !important;flex-shrink:0 !important;z-index:1000 !important;gap:20px !important;box-shadow:0 4px 20px rgba(0,0,0,0.25) !important}
.lms-hl{display:flex;align-items:center;gap:12px;min-width:0}
.lms-brand-group{display:flex;align-items:center;gap:10px;padding:4px 8px;border-radius:8px;transition:all 0.2s;cursor:pointer}
.lms-brand-group:hover{background:rgba(255,255,255,0.06)}
.lms-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#9B7A3E 0%,#7D6334 100%);color:#ffffff;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.1rem;flex-shrink:0;box-shadow:0 4px 14px rgba(155,122,62,0.3)}
.lms-brand-text{display:flex;flex-direction:column;line-height:1.15}
.lms-brand{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1.05rem;color:#ffffff;white-space:nowrap;letter-spacing:0.02em}
.lms-brand-sub{font-size:0.65rem;font-weight:600;color:rgba(155,122,62,0.9);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px}

.lms-header-nav{display:flex;align-items:center;gap:6px}
.lms-nav-tab{display:flex;align-items:center;gap:8px;padding:7px 16px;border:none;border-radius:99px;background:transparent;color:rgba(255,255,255,0.85);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s ease;white-space:nowrap}
.lms-nav-tab:hover{color:#ffffff;background:rgba(255,255,255,0.1)}
.lms-nav-tab.active{color:#ffffff;background:linear-gradient(135deg,#9B7A3E,#7D6334);box-shadow:0 4px 12px rgba(155,122,62,0.3)}

.lms-hr{display:flex;align-items:center;gap:14px;flex-shrink:0}
.lms-progress-wrap{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:99px;padding:5px 14px}
.lms-progress-bar{width:70px;height:5px;background:rgba(255,255,255,0.15);border-radius:100px;overflow:hidden}
.lms-progress-fill{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px;transition:width 0.4s}
.lms-progress-text{font-size:0.75rem;font-weight:700;color:#C5A059;min-width:28px;text-align:right}

.lms-notif-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid rgba(255,255,255,0.15);border-radius:99px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);cursor:pointer;transition:all 0.2s;position:relative}
.lms-notif-btn:hover{background:rgba(255,255,255,0.12);color:#ffffff}
.lms-notif-dot{position:absolute;top:8px;right:8px;width:6px;height:6px;border-radius:50%;background:#C5A059;box-shadow:0 0 6px rgba(197,160,89,0.8)}

.lms-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9B7A3E 0%,#0c1628 100%);color:#ffffff;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.2s;border:2px solid #9B7A3E;box-shadow:0 2px 8px rgba(0,0,0,0.3);overflow:hidden}
.lms-avatar:hover{transform:scale(1.05);border-color:#C5A059}
.lms-avatar-img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.lms-profile-avatar-img{width:84px;height:84px;border-radius:24px;object-fit:cover;border:3px solid #9B7A3E;box-shadow:0 6px 20px rgba(155,122,62,0.25);margin-bottom:16px}
.lms-edit-profile-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border:1px solid rgba(155,122,62,0.3);border-radius:99px;background:rgba(155,122,62,0.1);color:#7D6334;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;margin-top:14px}
.lms-edit-profile-btn:hover{background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;box-shadow:0 4px 14px rgba(155,122,62,0.3)}
.lms-profile-company{font-size:0.88rem;font-weight:600;color:#0c1628;margin:2px 0 6px}
.lms-profile-bio{font-size:0.85rem;color:#64748b;line-height:1.6;margin:10px 0;padding:10px 14px;background:#f8f7f3;border-radius:10px;border:1px solid rgba(12,22,40,0.06);text-align:left}
.lms-profile-linkedin-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#0077b5;color:#ffffff;border-radius:8px;font-size:0.78rem;font-weight:700;text-decoration:none;transition:all 0.2s}
.lms-profile-linkedin-btn:hover{background:#005e93;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,119,181,0.3)}

/* Edit Profile Modal */
.lms-modal-overlay{position:fixed;inset:0;background:rgba(10,18,31,0.65);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);animation:fadeIn 0.2s ease}
.lms-modal-card{width:100%;max-width:540px;max-height:90vh;overflow-y:auto;background:#ffffff;border:1px solid rgba(12,22,40,0.1);border-radius:20px;box-shadow:0 20px 60px rgba(12,22,40,0.25);padding:28px}
.lms-modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(12,22,40,0.08)}
.lms-modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:700;color:#0c1628;margin:0}
.lms-modal-close{background:none;border:none;color:#64748b;cursor:pointer;padding:4px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.lms-modal-close:hover{background:rgba(12,22,40,0.08);color:#0c1628}

.lms-avatar-upload-row{display:flex;align-items:center;gap:18px;margin-bottom:20px;padding:16px;background:#f8f7f3;border-radius:14px;border:1px solid rgba(12,22,40,0.06)}
.lms-avatar-upload-preview{width:64px;height:64px;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#9B7A3E,#0c1628);color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;flex-shrink:0;border:2px solid #9B7A3E}
.lms-avatar-upload-preview img{width:100%;height:100%;object-fit:cover}
.lms-file-input-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;border-radius:8px;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(155,122,62,0.25)}
.lms-file-input-btn:hover{background:#B89047}
.lms-file-input-hidden{display:none}
.lms-remove-avatar-btn{padding:8px 14px;background:none;border:1px solid rgba(239,68,68,0.3);color:#EF4444;border-radius:8px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.2s}
.lms-remove-avatar-btn:hover{background:#fee2e2}

.lms-form-group{margin-bottom:16px}
.lms-form-label{display:block;font-size:0.8rem;font-weight:600;color:#1e293b;margin-bottom:6px}
.lms-form-input{width:100%;padding:10px 14px;border:1.5px solid rgba(12,22,40,0.12);border-radius:10px;font-size:0.88rem;font-family:'Inter',sans-serif;color:#0c1628;background:#ffffff;outline:none;transition:all 0.2s}
.lms-form-input:focus{border-color:#9B7A3E;box-shadow:0 0 0 3px rgba(155,122,62,0.15)}
.lms-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}

.lms-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:24px;padding-top:16px;border-top:1px solid rgba(12,22,40,0.08)}
.lms-modal-cancel{padding:10px 20px;border:1px solid rgba(12,22,40,0.15);border-radius:99px;background:#ffffff;color:#64748b;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit}
.lms-modal-save{padding:10px 24px;border:none;border-radius:99px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(155,122,62,0.3)}
.lms-modal-save:hover{background:#B89047}

.lms-logout-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid rgba(255,255,255,0.15);border-radius:10px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);cursor:pointer;transition:all 0.2s}
.lms-logout-btn:hover{background:rgba(239,68,68,0.2);color:#F87171;border-color:rgba(239,68,68,0.4)}

.lms-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;color:rgba(255,255,255,0.85);border-radius:8px;transition:background 0.15s}
.lms-hamburger:hover{background:rgba(255,255,255,0.1);color:#ffffff}
.lms-sidebar-toggle{background:none;border:none;cursor:pointer;padding:6px;color:rgba(255,255,255,0.7);border-radius:8px;transition:all 0.15s}
.lms-sidebar-toggle:hover{background:rgba(255,255,255,0.1);color:#ffffff}

.lms-body{display:flex;flex:1;overflow:hidden;position:relative}

/* Course Sidebar */
.lms-sidebar{width:340px;min-width:340px;background:#ffffff;color:#1e293b;border-right:1px solid rgba(12,22,40,0.08);display:flex;flex-direction:column;transition:width 0.3s cubic-bezier(0.4,0,0.2,1),min-width 0.3s cubic-bezier(0.4,0,0.2,1),opacity 0.2s;overflow:hidden}
.lms-sidebar.closed{width:0;min-width:0;opacity:0;border:none;padding:0}
.lms-sidebar-header{padding:18px 20px;border-bottom:1px solid rgba(12,22,40,0.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background:#f8f7f3}
.lms-sidebar-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:700;color:#0c1628;letter-spacing:-0.01em}
.lms-sidebar-meta{font-size:0.7rem;color:#7D6334;font-weight:700;background:rgba(155,122,62,0.12);padding:4px 10px;border-radius:20px;border:1px solid rgba(155,122,62,0.2)}
.lms-sidebar-scroll{flex:1;overflow-y:auto;overflow-x:hidden}
.lms-sidebar-scroll::-webkit-scrollbar{width:4px}
.lms-sidebar-scroll::-webkit-scrollbar-track{background:transparent}
.lms-sidebar-scroll::-webkit-scrollbar-thumb{background:rgba(155,122,62,0.2);border-radius:100px}
.lms-sidebar-scroll::-webkit-scrollbar-thumb:hover{background:#9B7A3E}
.lms-chapter{border-bottom:1px solid rgba(12,22,40,0.06)}
.lms-chapter-header{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:#f8f7f3;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s;text-align:left}
.lms-chapter-header:hover{background:rgba(155,122,62,0.06)}
.lms-chapter-info{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
.lms-chapter-num{font-size:0.68rem;font-weight:700;color:#9B7A3E;text-transform:uppercase;letter-spacing:0.5px;flex-shrink:0}
.lms-chevron{transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);flex-shrink:0;color:#64748b}
.lms-chevron.open{transform:rotate(90deg);color:#9B7A3E}
.lms-chapter-name{font-size:0.84rem;font-weight:600;color:#0c1628;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lms-chapter-meta{display:flex;align-items:center;gap:10px;flex-shrink:0}
.lms-chapter-count{font-size:0.7rem;color:#64748b;font-weight:600}
.lms-chapter-bar{width:40px;height:4px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden}
.lms-chapter-bar-fill{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px;transition:width 0.4s}
.lms-chapter-lessons{overflow:hidden;transition:max-height 0.35s cubic-bezier(0.4,0,0.2,1)}
.lms-chapter-lessons.collapsed{max-height:0}
.lms-chapter-lessons.expanded{max-height:2000px}
.lms-lesson{display:flex;align-items:flex-start;gap:10px;padding:12px 20px 12px 32px;cursor:pointer;transition:all 0.2s;position:relative;border-left:3px solid transparent;background:#ffffff}
.lms-lesson:hover{background:#f8f7f3}
.lms-lesson.active{background:rgba(155,122,62,0.08);border-left-color:#9B7A3E}
.lms-lesson.active .lms-lesson-title{color:#7D6334;font-weight:700}
.lms-lesson-icon{flex-shrink:0;margin-top:2px;color:#64748b}
.lms-lesson.completed .lms-lesson-icon{color:#059669}
.lms-lesson-info{flex:1;min-width:0}
.lms-lesson-title{font-size:0.8rem;color:#1e293b;line-height:1.4;display:block;transition:color 0.2s}
.lms-lesson-meta-row{display:flex;align-items:center;gap:8px;margin-top:4px}
.lms-lesson-duration{font-size:0.75rem;color:#64748b;font-weight:500}
.lms-lesson-type{font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:2px 7px;border-radius:4px}
.lms-lesson-type.video{background:rgba(155,122,62,0.12);color:#7D6334}
.lms-lesson-type.quiz{background:#FEF3C7;color:#B45309}
.lms-lesson-type.assignment{background:#FCE7F3;color:#BE185D}
.lms-sidebar-footer{padding:16px 20px;border-top:1px solid rgba(12,22,40,0.08);flex-shrink:0;background:#f8f7f3}
.lms-stat-row{display:flex;justify-content:space-between;padding:4px 0}
.lms-stat-label{font-size:0.72rem;color:#64748b;font-weight:500}
.lms-stat-value{font-size:0.72rem;color:#0c1628;font-weight:700}

.lms-mobile-overlay{display:none;position:fixed;inset:0;background:rgba(10,18,31,0.6);z-index:900;backdrop-filter:blur(4px)}

/* Main Content: Canvas Background #f8f7f3 */
.lms-main{flex:1;overflow-y:auto;overflow-x:hidden;padding:0;display:flex;flex-direction:column;background:#f8f7f3;color:#1e293b}
.lms-main::-webkit-scrollbar{width:6px}
.lms-main::-webkit-scrollbar-thumb{background:rgba(155,122,62,0.2);border-radius:100px}
.lms-main::-webkit-scrollbar-thumb:hover{background:#9B7A3E}
.lms-video-section{padding:28px 36px 0}
.lms-video-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.lms-video-meta-actions{display:flex;align-items:center;gap:8px}
.lms-panel-toggle{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid rgba(12,22,40,0.08);border-radius:8px;background:#ffffff;color:#64748b;cursor:pointer;transition:all 0.2s}
.lms-panel-toggle:hover{border-color:#9B7A3E;color:#9B7A3E}
.lms-lesson-badge{font-size:0.72rem;font-weight:700;color:#7D6334;background:rgba(155,122,62,0.12);padding:5px 14px;border-radius:8px;border:1px solid rgba(155,122,62,0.25)}
.lms-done-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:1px solid rgba(12,22,40,0.08);background:#ffffff;font-size:0.8rem;font-weight:600;color:#0c1628;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-done-btn:hover{border-color:#9B7A3E;color:#9B7A3E}
.lms-done-btn.done{background:#d1fae5;border-color:#a7f3d0;color:#047857}
.lms-video-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.55rem;font-weight:700;color:#0c1628;margin-bottom:16px;line-height:1.3;letter-spacing:-0.02em}

/* Main Website Cinema Video Frame (#0c1628 Navy) */
.lms-video-container{border-radius:16px;overflow:hidden;background:#0c1628;box-shadow:0 10px 40px -10px rgba(0,0,0,0.35);margin-bottom:24px;border:1px solid rgba(255,255,255,0.08)}
.lms-video-aspect{position:relative;padding-top:56.25%}
.lms-video-iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.lms-video-controls{background:#0a121f;padding:0}
.lms-video-progress-bar{height:4px;background:rgba(255,255,255,0.15);cursor:pointer;transition:height 0.15s}
.lms-video-progress-bar:hover{height:6px}
.lms-video-progress-fill{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);transition:width 0.3s}
.lms-controls-row{display:flex;align-items:center;justify-content:space-between;padding:8px 16px}
.lms-controls-left,.lms-controls-right{display:flex;align-items:center;gap:6px}
.lms-ctrl-btn{background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:7px;border-radius:7px;transition:all 0.15s;display:flex;align-items:center;justify-content:center}
.lms-ctrl-btn:hover{color:#fff;background:rgba(255,255,255,0.1)}
.lms-ctrl-btn:disabled{opacity:0.3;cursor:not-allowed}
.lms-ctrl-btn.speed{font-size:0.75rem;font-weight:700;padding:5px 10px;color:rgba(255,255,255,0.8)}
.lms-time-label{font-size:0.75rem;color:rgba(255,255,255,0.7);font-weight:500;margin-left:4px}
.lms-speed-wrap{position:relative}
.lms-speed-menu{position:absolute;bottom:100%;right:0;background:#0c1628;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:4px;min-width:70px;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.4)}
.lms-speed-opt{display:block;width:100%;padding:6px 10px;background:none;border:none;color:rgba(255,255,255,0.8);font-size:0.75rem;font-weight:600;cursor:pointer;border-radius:6px;text-align:left;font-family:inherit}
.lms-speed-opt:hover{background:rgba(255,255,255,0.1);color:#fff}
.lms-speed-opt.active{color:#C5A059;background:rgba(155,122,62,0.2)}

/* Main Website Glass Cards (#ffffff with rgba(12,22,40,0.08) border) */
.lms-quiz-container{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:16px;padding:28px;margin-bottom:20px;box-shadow:0 8px 30px rgba(12,22,40,0.05)}
.lms-quiz-header{display:flex;align-items:center;gap:14px;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid rgba(12,22,40,0.06)}
.lms-quiz-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.15rem;font-weight:700;color:#0c1628;margin:0}
.lms-quiz-sub{font-size:0.8rem;color:#64748b;margin:3px 0 0;font-weight:500}
.lms-quiz-question{margin-bottom:28px}
.lms-q-text{font-size:0.95rem;font-weight:600;color:#0c1628;margin-bottom:14px;line-height:1.5}
.lms-q-num{color:#9B7A3E;font-weight:700;margin-right:4px}
.lms-q-option{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;border:1.5px solid rgba(12,22,40,0.08);border-radius:12px;background:#f8f7f3;cursor:pointer;font-size:0.9rem;color:#1e293b;text-align:left;font-family:inherit;transition:all 0.2s;margin-bottom:10px}
.lms-q-option:hover{border-color:#9B7A3E;background:rgba(155,122,62,0.06);color:#0c1628}
.lms-q-option.selected{border-color:#9B7A3E;background:rgba(155,122,62,0.12);color:#7D6334;font-weight:700}
.lms-q-option.correct{border-color:#059669;background:#d1fae5;color:#047857}
.lms-q-option.wrong{border-color:#EF4444;background:#fee2e2;color:#b91c1c}
.lms-q-letter{width:28px;height:28px;border-radius:50%;background:rgba(12,22,40,0.08);display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;flex-shrink:0;color:#64748b}
.lms-q-option.selected .lms-q-letter{background:#9B7A3E;color:#ffffff}
.lms-q-option.correct .lms-q-letter{background:#059669;color:#ffffff}
.lms-q-option.wrong .lms-q-letter{background:#EF4444;color:#ffffff}
.lms-q-explanation{display:flex;align-items:flex-start;gap:10px;margin-top:12px;padding:14px 18px;background:rgba(155,122,62,0.08);border-radius:12px;font-size:0.85rem;color:#7D6334;line-height:1.6;border:1px solid rgba(155,122,62,0.2)}
.lms-quiz-submit{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#9B7A3E 0%,#7D6334 100%);color:#ffffff;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 6px 20px -4px rgba(155,122,62,0.35);margin-top:8px}
.lms-quiz-submit:hover{background:#B89047;transform:translateY(-1px);box-shadow:0 12px 28px -4px rgba(155,122,62,0.45)}
.lms-quiz-submit:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}

.lms-assignment-container{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:16px;padding:28px;margin-bottom:20px;box-shadow:0 8px 30px rgba(12,22,40,0.05)}
.lms-assignment-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid rgba(12,22,40,0.06)}
.lms-assignment-header h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.15rem;font-weight:700;color:#0c1628;margin:0}
.lms-assignment-body{font-size:0.9rem;color:#334155;line-height:1.8}
.lms-video-desc{font-size:0.9rem;color:#334155;line-height:1.8;margin:18px 0;padding:18px 22px;background:#ffffff;border:1px solid rgba(12,22,40,0.08);border-radius:14px;box-shadow:0 2px 10px rgba(12,22,40,0.03)}
.lms-nav-row{display:flex;justify-content:space-between;gap:14px;padding:20px 0;border-top:1px solid rgba(12,22,40,0.08)}
.lms-nav-btn{display:flex;align-items:center;gap:12px;padding:14px 20px;border:1px solid rgba(12,22,40,0.08);border-radius:12px;background:#ffffff;color:#0c1628;cursor:pointer;font-family:inherit;transition:all 0.2s;flex:1;max-width:48%;box-shadow:0 2px 8px rgba(12,22,40,0.03)}
.lms-nav-btn:hover{border-color:#9B7A3E;background:rgba(155,122,62,0.06);transform:translateY(-1px)}
.lms-nav-btn.next{justify-content:flex-end;text-align:right;margin-left:auto}
.lms-nav-btn.prev{margin-right:auto}
.lms-nav-label{display:block;font-size:0.7rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.6px}
.lms-nav-name{display:block;font-size:0.85rem;font-weight:600;color:#0c1628;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.lms-complete-badge{display:flex;align-items:center;gap:10px;font-size:0.95rem;font-weight:700;color:#047857;padding:14px 22px;background:#d1fae5;border:1px solid #a7f3d0;border-radius:12px}

.lms-tabs{display:flex;gap:0;border-bottom:1px solid rgba(12,22,40,0.08);padding:0 36px;background:#ffffff;flex-shrink:0}
.lms-tab{padding:14px 24px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;font-size:0.85rem;font-weight:600;color:#64748b;cursor:pointer;font-family:inherit;transition:all 0.25s;white-space:nowrap}
.lms-tab:hover{color:#0c1628}
.lms-tab.active{color:#9B7A3E;border-bottom-color:#9B7A3E;font-weight:700}
.lms-tab-content{padding:28px 36px 48px;flex:1}

.lms-overview{display:flex;flex-direction:column;gap:20px}
.lms-overview-card{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(12,22,40,0.03)}
.lms-overview-card:hover{border-color:rgba(155,122,62,0.3)}
.lms-overview-card h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#0c1628;margin-bottom:12px}
.lms-overview-card p{font-size:0.9rem;color:#334155;line-height:1.7}
.lms-overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lms-ov-item{display:flex;align-items:center;gap:14px;padding:16px;background:#f8f7f3;border:1px solid rgba(12,22,40,0.06);border-radius:12px}
.lms-ov-label{display:block;font-size:0.7rem;color:#64748b;font-weight:600;text-transform:uppercase}
.lms-ov-val{display:block;font-size:0.85rem;font-weight:700;color:#0c1628;margin-top:2px}
.lms-instructor-row{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.lms-instructor-avatar{width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;flex-shrink:0}
.lms-instructor-name{font-size:0.95rem;font-weight:700;color:#0c1628;margin:0}
.lms-instructor-role{font-size:0.8rem;color:#64748b;margin:3px 0 0}
.lms-instructor-bio{font-size:0.88rem;color:#334155;line-height:1.7}

.lms-notes{display:flex;flex-direction:column;gap:16px}
.lms-notes-header{display:flex;align-items:center;justify-content:space-between}
.lms-notes-header h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#0c1628}
.lms-note-edit-btn{display:flex;align-items:center;gap:7px;padding:7px 16px;border:1px solid rgba(12,22,40,0.12);border-radius:8px;background:#ffffff;font-size:0.8rem;font-weight:600;color:#0c1628;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-note-edit-btn:hover{border-color:#9B7A3E;color:#9B7A3E}
.lms-note-actions{display:flex;gap:10px}
.lms-note-save{padding:8px 18px;border:none;border-radius:8px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;font-size:0.8rem;font-weight:700;cursor:pointer;font-family:inherit}
.lms-note-cancel{padding:8px 18px;border:1px solid rgba(12,22,40,0.12);border-radius:8px;background:#ffffff;color:#64748b;font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit}
.lms-note-textarea{width:100%;min-height:200px;padding:18px;border:1.5px solid rgba(12,22,40,0.12);border-radius:14px;font-size:0.9rem;font-family:'Inter',sans-serif;color:#0c1628;outline:none;line-height:1.7;background:#ffffff}
.lms-note-textarea:focus{border-color:#9B7A3E;box-shadow:0 0 0 3px rgba(155,122,62,0.15)}
.lms-note-content{font-size:0.9rem;color:#1e293b;line-height:1.8;background:#ffffff;border:1px solid rgba(12,22,40,0.08);border-radius:14px;padding:20px}
.lms-note-empty{font-size:0.9rem;color:#64748b;font-style:italic;text-align:center;padding:48px 24px}

.lms-right-panel{width:320px;min-width:320px;background:#ffffff;color:#1e293b;border-left:1px solid rgba(12,22,40,0.08);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.lms-rp-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(12,22,40,0.06);flex-shrink:0}
.lms-rp-header h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:700;color:#0c1628;margin:0}
.lms-rp-close{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;border-radius:8px;background:#f8f7f3;color:#64748b;cursor:pointer;transition:all 0.2s}
.lms-rp-close:hover{background:#fee2e2;color:#dc2626}
.lms-rp-tabs{display:flex;gap:0;border-bottom:1px solid rgba(12,22,40,0.06);padding:0 12px;flex-shrink:0}
.lms-rp-tab{padding:10px 14px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;font-size:0.78rem;font-weight:600;color:#64748b;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-rp-tab.active{color:#9B7A3E;border-bottom-color:#9B7A3E}
.lms-rp-content{flex:1;overflow-y:auto;padding:18px 20px}
.lms-rp-notes,.lms-rp-transcript{font-size:0.86rem;color:#334155;line-height:1.8}

.lms-page-content{flex:1;overflow-y:auto;padding:36px;background:#f8f7f3;color:#1e293b}
.lms-page-content::-webkit-scrollbar{width:6px}
.lms-page-content::-webkit-scrollbar-thumb{background:rgba(155,122,62,0.2);border-radius:100px}

/* Page Layout: Dashboard */
.lms-dash{max-width:1040px;margin:0 auto}
.lms-dash-welcome{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding:36px;background:linear-gradient(135deg,#0c1628 0%,#1e3a5f 100%);color:#ffffff;border:1px solid rgba(255,255,255,0.15);border-radius:20px;box-shadow:0 12px 32px rgba(12,22,40,0.25)}
.lms-dash-welcome-left{max-width:620px}
.lms-dash-pill{display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;color:#C5A059;background:rgba(155,122,62,0.15);padding:5px 14px;border-radius:99px;border:1px solid rgba(155,122,62,0.3);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px}
.lms-dash-welcome-left h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;color:#ffffff;margin:0 0 10px;line-height:1.25}
.lms-dash-name{background:linear-gradient(90deg,#ffffff 60%,#C5A059);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lms-dash-welcome-left p{font-size:0.95rem;color:rgba(255,255,255,0.85);margin:0 0 22px;line-height:1.6}
.lms-dash-welcome-actions{display:flex;align-items:center;gap:12px}
.lms-dash-primary-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border:none;border-radius:99px;background:linear-gradient(135deg,#9B7A3E 0%,#7D6334 100%);color:#ffffff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 6px 20px -4px rgba(155,122,62,0.35)}
.lms-dash-primary-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px -4px rgba(155,122,62,0.45);background:#B89047}
.lms-dash-secondary-btn{display:inline-flex;align-items:center;padding:12px 20px;border:1.5px solid rgba(255,255,255,0.3);border-radius:99px;background:rgba(255,255,255,0.1);color:#ffffff;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.3s ease}
.lms-dash-secondary-btn:hover{background:rgba(255,255,255,0.2);border-color:#ffffff}
.lms-dash-welcome-right{flex-shrink:0}
.lms-dash-stat-ring{position:relative;width:115px;height:115px}
.lms-dash-stat-ring svg{width:100%;height:100%}
.lms-dash-ring-content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.lms-dash-stat-pct{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.35rem;font-weight:800;color:#ffffff;line-height:1}
.lms-dash-ring-sub{font-size:0.7rem;color:#C5A059;font-weight:600;text-transform:uppercase;margin-top:2px}

.lms-dash-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:18px;margin-bottom:36px}
.lms-dash-card{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:16px;padding:22px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 30px rgba(12,22,40,0.04)}
.lms-dash-card:hover{border-color:rgba(155,122,62,0.3);transform:translateY(-2px);box-shadow:0 12px 32px rgba(12,22,40,0.08)}
.lms-dash-continue-card{grid-column:1;background:#ffffff;border:1.5px solid rgba(155,122,62,0.3)}
.lms-dash-continue-card:hover{border-color:#9B7A3E}
.lms-dash-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.lms-dash-card-badge{font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#7D6334;background:rgba(155,122,62,0.12);padding:4px 10px;border-radius:20px}
.lms-dash-continue-card h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#0c1628;margin:0 0 6px;line-height:1.3}
.lms-dash-continue-card p{font-size:0.82rem;color:#64748b;margin:0 0 14px}
.lms-dash-card-bar{height:5px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden;margin-bottom:14px}
.lms-dash-card-bar div{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px;transition:width 0.5s}
.lms-dash-card-footer{display:flex;align-items:center;justify-content:space-between}
.lms-dash-card-cta{font-size:0.82rem;font-weight:700;color:#9B7A3E}
.lms-dash-card-meta{font-size:0.75rem;color:#64748b;font-weight:500}
.lms-dash-card-icon{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.lms-dash-card-icon.icon-amber{background:rgba(155,122,62,0.12);color:#9B7A3E}
.lms-dash-card-icon.icon-indigo{background:rgba(30,58,95,0.12);color:#1e3a5f}
.lms-dash-card-icon.icon-emerald{background:rgba(5,150,105,0.12);color:#059669}
.lms-dash-card-icon.icon-violet{background:rgba(125,99,52,0.12);color:#7D6334}
.lms-dash-card-num{display:block;font-family:'Plus Jakarta Sans',sans-serif;font-size:1.55rem;font-weight:800;color:#0c1628;line-height:1}
.lms-dash-card-label{display:block;font-size:0.72rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-top:6px}

.lms-dash-section{margin-bottom:36px}
.lms-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.lms-section-header h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:700;color:#0c1628;margin:0}
.lms-section-link{background:none;border:none;color:#9B7A3E;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit}
.lms-dash-course-card{display:flex;align-items:center;gap:20px;padding:24px;background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:18px;cursor:pointer;transition:all 0.25s;margin-bottom:20px;box-shadow:0 8px 30px rgba(12,22,40,0.04)}
.lms-dash-course-card:hover{border-color:#9B7A3E;transform:translateY(-2px);box-shadow:0 12px 32px rgba(12,22,40,0.08)}
.lms-dash-course-icon{width:64px;height:64px;border-radius:16px;background:rgba(155,122,62,0.12);color:#9B7A3E;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lms-dash-course-info{flex:1;min-width:0}
.lms-dash-course-info h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#0c1628;margin:0 0 6px}
.lms-dash-course-info p{font-size:0.85rem;color:#64748b;margin:0 0 14px}
.lms-dash-course-bar{height:5px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden}
.lms-dash-course-bar div{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px}
.lms-dash-course-pct-box{display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0}
.lms-dash-course-pct{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.35rem;font-weight:800;color:#9B7A3E}
.lms-dash-course-sub{font-size:0.7rem;color:#64748b;font-weight:600}

.lms-modules-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.lms-module-card{padding:18px;background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:14px;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(12,22,40,0.03)}
.lms-module-card:hover{border-color:#9B7A3E;transform:translateY(-2px);box-shadow:0 8px 24px rgba(12,22,40,0.06)}
.lms-module-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.lms-module-badge{font-size:0.68rem;font-weight:700;color:#7D6334;background:rgba(155,122,62,0.12);padding:3px 8px;border-radius:6px}
.lms-module-stat{font-size:0.72rem;color:#64748b;font-weight:600}
.lms-module-card h4{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:700;color:#0c1628;margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lms-module-card p{font-size:0.75rem;color:#64748b;margin:0 0 12px}
.lms-module-bar{height:4px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden}
.lms-module-bar div{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px}

/* Page Layout: Profile */
.lms-profile-v2{max-width:1040px;margin:0 auto}
.lms-profile-layout{display:grid;grid-template-columns:360px 1fr;gap:24px}
.lms-profile-left,.lms-profile-right{display:flex;flex-direction:column;gap:20px}
.lms-profile-user-card{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:18px;padding:28px;display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 8px 30px rgba(12,22,40,0.04)}
.lms-profile-avatar-lg{width:84px;height:84px;border-radius:24px;background:linear-gradient(135deg,#9B7A3E 0%,#0c1628 100%);color:#ffffff;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:2.2rem;font-weight:800;margin-bottom:16px;box-shadow:0 6px 20px rgba(155,122,62,0.25);border:3px solid #9B7A3E}
.lms-profile-role-badge{display:inline-block;font-size:0.7rem;font-weight:700;color:#047857;background:#d1fae5;padding:4px 12px;border-radius:20px;border:1px solid #a7f3d0;margin-bottom:10px}
.lms-profile-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.4rem;font-weight:700;color:#0c1628;margin:0 0 4px}
.lms-profile-email{font-size:0.85rem;color:#64748b;margin:0 0 12px}
.lms-profile-since{font-size:0.75rem;color:#94a3b8;font-weight:500}

.lms-profile-card{background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:18px;padding:24px;box-shadow:0 8px 30px rgba(12,22,40,0.04)}
.lms-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.lms-card-head h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#0c1628;margin:0}
.lms-badge-green{font-size:0.7rem;font-weight:700;color:#047857;background:#d1fae5;padding:3px 10px;border-radius:20px}
.lms-card-sub-tag{font-size:0.7rem;font-weight:700;color:#64748b;background:#f8f7f3;padding:3px 10px;border-radius:20px}
.lms-profile-course{display:flex;align-items:center;gap:14px;padding:14px;background:#f8f7f3;border-radius:12px;border:1px solid rgba(12,22,40,0.06);margin-bottom:16px}
.lms-profile-course-icon{width:48px;height:48px;border-radius:12px;background:rgba(155,122,62,0.12);color:#9B7A3E;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lms-profile-course-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:700;color:#0c1628;margin:0}
.lms-profile-course-meta{font-size:0.78rem;color:#64748b;margin:3px 0 0}
.lms-profile-prog-block{display:flex;flex-direction:column;gap:8px}
.lms-profile-progress-bar{height:8px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden}
.lms-profile-progress-fill{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px;transition:width 0.5s}
.lms-profile-prog-meta{display:flex;justify-content:space-between;font-size:0.8rem;color:#64748b}

.lms-danger-zone p{font-size:0.82rem;color:#64748b;margin:8px 0 16px;line-height:1.5}
.lms-reset-progress-btn{width:100%;padding:12px;border:1px solid #fca5a5;border-radius:10px;background:#fee2e2;color:#dc2626;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-reset-progress-btn:hover{background:#fca5a5;color:#991b1b}

.lms-profile-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* Schedule Learning */
.lms-schedule-card{overflow:hidden}
.lms-schedule-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;padding:14px;background:#f8f7f3;border-radius:12px;border:1px solid rgba(12,22,40,0.06)}
.lms-schedule-stat{display:flex;flex-direction:column;align-items:center}
.lms-schedule-stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.15rem;font-weight:800;color:#9B7A3E;line-height:1}
.lms-schedule-stat-label{font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-top:3px}
.lms-schedule-timeline{display:flex;flex-direction:column;gap:0;max-height:320px;overflow-y:auto;margin-bottom:16px;padding-right:4px}
.lms-schedule-timeline::-webkit-scrollbar{width:4px}
.lms-schedule-timeline::-webkit-scrollbar-track{background:transparent}
.lms-schedule-timeline::-webkit-scrollbar-thumb{background:rgba(12,22,40,0.1);border-radius:100px}
.lms-schedule-day{display:flex;gap:14px;min-height:40px}
.lms-schedule-day-left{display:flex;flex-direction:column;align-items:center;width:20px;flex-shrink:0}
.lms-schedule-day-dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(12,22,40,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ffffff;z-index:1;transition:all 0.2s}
.lms-schedule-day-dot.done{background:#10B981;border-color:#10B981}
.lms-schedule-day-dot.done svg{color:#ffffff}
.lms-schedule-day-dot.current{background:#9B7A3E;border-color:#9B7A3E;box-shadow:0 0 0 4px rgba(155,122,62,0.2)}
.lms-schedule-day-dot.missed{background:#fee2e2;border-color:#fca5a5}
.lms-schedule-day-line{width:2px;flex:1;min-height:12px;background:rgba(12,22,40,0.08);margin:2px 0}
.lms-schedule-day-line.done{background:#10B981}
.lms-schedule-day-content{flex:1;padding-bottom:14px}
.lms-schedule-day-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.lms-schedule-day-label{font-size:0.78rem;font-weight:700;color:#64748b}
.lms-schedule-day-label.today{color:#9B7A3E;font-weight:800}
.lms-schedule-day-date{font-size:0.72rem;color:#94a3b8}
.lms-schedule-day-module{display:flex;align-items:center;gap:8px;padding:6px 10px;margin:3px 0;border-radius:8px;cursor:pointer;transition:all 0.15s}
.lms-schedule-day-module:hover{background:#f8f7f3}
.lms-schedule-module-dot{width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#64748b;background:rgba(12,22,40,0.05);flex-shrink:0;transition:all 0.2s}
.lms-schedule-module-dot.done{background:#10B981;color:#ffffff}
.lms-schedule-module-dot.done svg{color:#ffffff}
.lms-schedule-module-name{font-size:0.8rem;color:#334155;font-weight:500}
.lms-schedule-day.done .lms-schedule-module-name{color:#64748b}
.lms-schedule-day.missed .lms-schedule-module-name{color:#94a3b8}
.lms-schedule-actions{display:flex;gap:10px}
.lms-schedule-edit-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;border:1px solid rgba(155,122,62,0.25);border-radius:10px;background:#ffffff;color:#9B7A3E;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-schedule-edit-btn:hover{background:#f8f7f3;border-color:rgba(155,122,62,0.4)}
.lms-schedule-clear-btn{display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;border:1px solid rgba(220,38,38,0.15);border-radius:10px;background:#ffffff;color:#dc2626;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-schedule-clear-btn:hover{background:#fef2f2;border-color:rgba(220,38,38,0.3)}
.lms-schedule-empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:28px 20px;text-align:center}
.lms-schedule-empty-icon{width:56px;height:56px;border-radius:16px;background:rgba(155,122,62,0.1);display:flex;align-items:center;justify-content:center}
.lms-schedule-empty-text{font-size:0.84rem;color:#64748b;margin:0;line-height:1.6;max-width:320px}
.lms-schedule-setup-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 24px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;border:none;border-radius:99px;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 16px rgba(155,122,62,0.3);transition:all 0.3s ease;margin-top:4px}
.lms-schedule-setup-btn:hover{box-shadow:0 8px 24px rgba(155,122,62,0.4);transform:translateY(-1px)}
.lms-schedule-speed-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.lms-schedule-speed-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:2px solid rgba(12,22,40,0.08);border-radius:12px;background:#ffffff;cursor:pointer;font-family:inherit;transition:all 0.2s}
.lms-schedule-speed-btn:hover{border-color:rgba(155,122,62,0.3)}
.lms-schedule-speed-btn.active{border-color:#9B7A3E;background:rgba(155,122,62,0.06)}
.lms-schedule-speed-num{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.3rem;font-weight:800;color:#0c1628;line-height:1}
.lms-schedule-speed-btn.active .lms-schedule-speed-num{color:#9B7A3E}
.lms-schedule-speed-label{font-size:0.7rem;color:#64748b;font-weight:500}
.lms-schedule-speed-btn.active .lms-schedule-speed-label{color:#9B7A3E}

/* Certificate View */
.lms-certificate-page{max-width:840px;margin:0 auto}
.lms-cert-ready{display:flex;flex-direction:column;align-items:center;gap:28px}
.lms-cert-frame{width:100%;padding:10px;background:linear-gradient(135deg,#9B7A3E 0%,#7D6334 50%,#9B7A3E 100%);border-radius:18px;box-shadow:0 12px 48px rgba(155,122,62,0.25)}
.lms-cert-border{border:2px solid rgba(255,255,255,0.4);border-radius:12px;padding:4px}
.lms-cert-inner{background:#ffffff;color:#1e293b;border-radius:10px;padding:48px 44px;text-align:center}
.lms-cert-logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.9rem;font-weight:800;color:#9B7A3E;margin-bottom:2px}
.lms-cert-subtitle{font-size:0.75rem;color:#7D6334;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:22px}
.lms-cert-heading{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.45rem;font-weight:700;color:#0c1628;margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid rgba(12,22,40,0.08)}
.lms-cert-text{font-size:0.9rem;color:#475569;margin:10px 0}
.lms-cert-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;color:#9B7A3E;margin:14px 0;padding:10px 0;border-bottom:2px solid rgba(155,122,62,0.2);display:inline-block;letter-spacing:-0.01em}
.lms-cert-course{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.15rem;font-weight:700;color:#0c1628;margin:14px 0}
.lms-cert-footer{display:flex;align-items:flex-end;justify-content:space-between;margin-top:32px;padding-top:20px;border-top:1px solid rgba(12,22,40,0.08)}
.lms-cert-sig{text-align:left}
.lms-cert-sig-line{width:200px;height:1px;background:#cbd5e1;margin-bottom:8px}
.lms-cert-sig-name{font-size:0.78rem;color:#64748b;font-weight:600}
.lms-cert-badge{display:flex;align-items:center;justify-content:center}
.lms-cert-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.lms-cert-action-btn{display:flex;align-items:center;gap:8px;padding:12px 24px;border:none;border-radius:99px;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.3s ease}
.lms-cert-action-btn.primary{background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;box-shadow:0 6px 20px -4px rgba(155,122,62,0.35)}
.lms-cert-action-btn.primary:hover{box-shadow:0 12px 28px -4px rgba(155,122,62,0.45);transform:translateY(-1px);background:#B89047}
.lms-cert-action-btn.secondary{background:rgba(12,22,40,0.06);color:#0c1628;border:1.5px solid rgba(12,22,40,0.15)}
.lms-cert-action-btn.secondary:hover{background:rgba(12,22,40,0.12)}

.lms-cert-locked{display:flex;flex-direction:column;align-items:center;text-align:center;padding:64px 44px;background:#ffffff;color:#1e293b;border:1px solid rgba(12,22,40,0.08);border-radius:20px;gap:18px;box-shadow:0 8px 30px rgba(12,22,40,0.05)}
.lms-cert-lock-icon{margin-bottom:10px;opacity:0.8}
.lms-cert-locked h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.35rem;font-weight:700;color:#0c1628;margin:0}
.lms-cert-locked p{font-size:0.92rem;color:#64748b;line-height:1.7;max-width:440px}
.lms-cert-progress-bar{width:100%;max-width:440px;height:8px;background:rgba(12,22,40,0.08);border-radius:100px;overflow:hidden;margin:10px 0}
.lms-cert-progress-fill{height:100%;background:linear-gradient(90deg,#9B7A3E,#C5A059);border-radius:100px;transition:width 0.5s}
.lms-cert-remaining{font-size:0.82rem;color:#64748b;font-style:italic}
.lms-cert-cta{padding:14px 36px;border:none;border-radius:99px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s ease;box-shadow:0 6px 20px -4px rgba(155,122,62,0.35);margin-top:8px}
.lms-cert-cta:hover{box-shadow:0 12px 28px -4px rgba(155,122,62,0.45);transform:translateY(-1px);background:#B89047}

/* Dashboard Premium Styles */
.lms-hero-card{background:linear-gradient(135deg,#0c1628 0%,#1e3a5f 100%);border-radius:20px;padding:36px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 16px 48px rgba(12,22,40,0.3);position:relative;overflow:hidden}
.lms-hero-card::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(155,122,62,0.12) 0%,transparent 70%);pointer-events:none}
.lms-hero-content{display:flex;align-items:center;justify-content:space-between;gap:32px;position:relative;z-index:1}
.lms-hero-text{flex:1;min-width:0}
.lms-hero-badge{display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;color:#C5A059;background:rgba(155,122,62,0.15);padding:5px 14px;border-radius:99px;border:1px solid rgba(155,122,62,0.3);margin-bottom:16px;text-transform:uppercase;letter-spacing:0.5px}
.lms-hero-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;color:#ffffff;margin:0 0 8px;line-height:1.25;letter-spacing:-0.02em}
.lms-hero-actions{display:flex;align-items:center;gap:12px;margin-top:8px}
.lms-hero-resume-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border:none;border-radius:99px;background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 6px 24px -4px rgba(155,122,62,0.4)}
.lms-hero-resume-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px -4px rgba(155,122,62,0.5);background:#B89047}
.lms-hero-view-btn{display:inline-flex;align-items:center;padding:12px 22px;border:1.5px solid rgba(255,255,255,0.25);border-radius:99px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.9);font-size:0.88rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.3s ease;backdrop-filter:blur(8px)}
.lms-hero-view-btn:hover{background:rgba(255,255,255,0.18);border-color:rgba(255,255,255,0.5);color:#ffffff}
.lms-hero-ring-wrap{flex-shrink:0}
.lms-hero-ring{position:relative;width:140px;height:140px}
.lms-hero-ring svg{width:100%;height:100%}
.lms-hero-ring-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.lms-hero-pct{font-family:'Plus Jakarta Sans',sans-serif;font-size:2rem;font-weight:800;color:#ffffff;line-height:1}
.lms-hero-pct-label{font-size:0.72rem;color:#C5A059;font-weight:600;text-transform:uppercase;margin-top:2px;letter-spacing:0.5px}

.lms-insights-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.lms-insight-card{background:#ffffff;border:1px solid rgba(12,22,40,0.08);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);box-shadow:0 8px 30px rgba(12,22,40,0.04)}
.lms-insight-card:hover{border-color:rgba(155,122,62,0.3);transform:translateY(-2px);box-shadow:0 12px 32px rgba(12,22,40,0.08)}
.lms-insight-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center}
.lms-insight-data{display:flex;flex-direction:column}
.lms-insight-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.4rem;font-weight:800;color:#0c1628;line-height:1}
.lms-insight-label{font-size:0.72rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-top:2px}
.lms-insight-bar{height:4px;background:rgba(12,22,40,0.06);border-radius:100px;overflow:hidden}
.lms-insight-bar div{height:100%;border-radius:100px;transition:width 0.5s}

.lms-quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.lms-qa-card{display:flex;align-items:center;gap:16px;padding:20px 22px;background:#ffffff;border:1px solid rgba(12,22,40,0.08);border-radius:16px;cursor:pointer;font-family:inherit;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);box-shadow:0 8px 30px rgba(12,22,40,0.04);text-align:left}
.lms-qa-card:hover{border-color:rgba(155,122,62,0.3);transform:translateY(-2px);box-shadow:0 12px 32px rgba(12,22,40,0.08)}
.lms-qa-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1)}
.lms-qa-card:hover .lms-qa-icon{transform:scale(1.08)}
.lms-qa-info{display:flex;flex-direction:column;gap:3px}
.lms-qa-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.92rem;color:#0c1628}
.lms-qa-sub{font-size:0.78rem;color:#64748b;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}

.lms-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1.05rem;color:#0c1628;margin:0 0 18px;display:flex;align-items:center;gap:8px}

.lms-overview-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px;padding:18px 20px;background:#f8f7f3;border-radius:14px;border:1px solid rgba(12,22,40,0.06)}
.lms-overview-course-name{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.1rem;color:#0c1628;margin:0 0 4px}
.lms-overview-course-sub{font-size:0.82rem;color:#64748b;margin:0;line-height:1.4}
.lms-overview-stats{display:flex;gap:24px;flex-shrink:0}
.lms-overview-stat{display:flex;flex-direction:column;align-items:center}
.lms-overview-stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:800;color:#9B7A3E;line-height:1}
.lms-overview-stat-label{font-size:0.68rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-top:3px}

.lms-overview-modules{display:flex;flex-direction:column;gap:12px}
.lms-overview-module{padding:16px 18px;border:1px solid rgba(12,22,40,0.06);border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff}
.lms-overview-module:hover{border-color:rgba(155,122,62,0.25);box-shadow:0 4px 16px rgba(12,22,40,0.06);transform:translateY(-1px)}
.lms-overview-module-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.lms-overview-module-num{font-size:0.72rem;font-weight:700;color:#9B7A3E;text-transform:uppercase;letter-spacing:0.3px}
.lms-overview-module-count{font-size:0.72rem;color:#64748b;font-weight:500}
.lms-overview-module-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.88rem;color:#0c1628;margin:0 0 10px}
.lms-overview-module-bar{height:6px;background:rgba(12,22,40,0.06);border-radius:100px;overflow:hidden;margin-bottom:4px}
.lms-overview-module-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#9B7A3E,#C5A059);transition:width 0.5s cubic-bezier(0.4,0,0.2,1)}
.lms-overview-module-pct{font-size:0.72rem;font-weight:600;color:#64748b}

.lms-actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.lms-action-card{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 12px;border:1px solid rgba(12,22,40,0.06);border-radius:14px;background:#f8f7f3;cursor:pointer;font-family:inherit;transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.lms-action-card:hover{border-color:rgba(155,122,62,0.3);transform:translateY(-3px);box-shadow:0 8px 24px rgba(12,22,40,0.08)}
.lms-action-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1)}
.lms-action-card:hover .lms-action-icon{transform:scale(1.1)}
.lms-action-label{font-size:0.78rem;font-weight:600;color:#0c1628}

.lms-timeline{display:flex;flex-direction:column;gap:0}
.lms-timeline-item{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent}
.lms-timeline-item:hover{background:#f8f7f3}
.lms-timeline-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;transition:all 0.2s}
.lms-timeline-dot.completed{background:#10B981;box-shadow:0 0 8px rgba(16,185,129,0.4)}
.lms-timeline-dot.progress{background:#94a3b8;box-shadow:0 0 8px rgba(148,163,184,0.3)}
.lms-timeline-content{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.lms-timeline-title{font-size:0.85rem;font-weight:600;color:#0c1628;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lms-timeline-meta{font-size:0.72rem;color:#64748b;font-weight:500}

.lms-empty-state{display:flex;flex-direction:column;align-items:center;gap:10px;padding:32px 16px;color:#94a3b8}
.lms-empty-state p{font-size:0.85rem;font-weight:500}

.lms-mini-calendar{padding:4px 0}
.lms-cal-header{text-align:center;margin-bottom:14px}
.lms-cal-header span{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.95rem;color:#0c1628}
.lms-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.lms-cal-day-name{text-align:center;font-size:0.68rem;font-weight:700;color:#94a3b8;text-transform:uppercase;padding:6px 0}
.lms-cal-day{text-align:center;padding:8px 4px;font-size:0.78rem;font-weight:500;color:#64748b;border-radius:8px;transition:all 0.2s}
.lms-cal-day.accessed{background:rgba(155,122,62,0.15);color:#7D6334;font-weight:700}
.lms-cal-day.today{background:#9B7A3E;color:#ffffff;font-weight:700;box-shadow:0 2px 8px rgba(155,122,62,0.3)}
.lms-cal-day.empty{background:transparent}

.lms-goal-card{overflow:visible}
.lms-goal-header{display:flex;align-items:center;gap:8px}
.lms-goal-ring-wrap{flex-shrink:0}
.lms-goal-ring{position:relative;width:72px;height:72px}
.lms-goal-ring svg{width:100%;height:100%}
.lms-goal-ring-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:1px}
.lms-goal-done{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#0c1628}
.lms-goal-sep{font-size:0.8rem;color:#94a3b8}
.lms-goal-target{font-size:0.8rem;color:#64748b;font-weight:600}
.lms-goal-message{font-size:0.85rem;color:#64748b;line-height:1.5;margin:0;flex:1}

.lms-weekly-chart{display:flex;align-items:flex-end;gap:8px;height:120px;padding:8px 0}
.lms-weekly-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%}
.lms-weekly-bar-track{flex:1;width:100%;background:rgba(12,22,40,0.04);border-radius:8px;display:flex;align-items:flex-end;overflow:hidden}
.lms-weekly-bar-fill{width:100%;border-radius:8px;transition:height 0.5s cubic-bezier(0.4,0,0.2,1);min-height:4px}
.lms-weekly-day{font-size:0.68rem;font-weight:600;color:#94a3b8}
.lms-weekly-day.today{color:#9B7A3E;font-weight:700}

.lms-achievements-grid{display:flex;gap:12px}
.lms-ach-badge{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;background:rgba(12,22,40,0.04);border:1px solid rgba(12,22,40,0.06);transition:all 0.25s;opacity:0.5}
.lms-ach-badge.unlocked{background:linear-gradient(135deg,rgba(155,122,62,0.12),rgba(155,122,62,0.06));border-color:rgba(155,122,62,0.25);opacity:1}
.lms-ach-badge.unlocked:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(155,122,62,0.15)}
.lms-ach-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(12,22,40,0.08);color:#94a3b8}
.lms-ach-badge.unlocked .lms-ach-icon{background:linear-gradient(135deg,#9B7A3E,#7D6334);color:#ffffff;box-shadow:0 4px 12px rgba(155,122,62,0.3)}
.lms-ach-title{font-size:0.65rem;font-weight:700;color:#64748b;text-align:center;line-height:1.2}
.lms-ach-badge.unlocked .lms-ach-title{color:#0c1628}

.lms-motivation-card{display:flex;align-items:center;gap:16px;padding:20px 24px;background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(99,102,241,0.04));border-color:rgba(245,158,11,0.15)}
.lms-motivation-icon{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.08));display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lms-motivation-text{font-size:0.9rem;color:#334155;line-height:1.6;margin:0;font-weight:500}

.lms-milestone-card{padding:20px 24px}
.lms-milestone-progress{margin:12px 0 10px}
.lms-milestone-bar{height:8px;background:rgba(12,22,40,0.06);border-radius:100px;overflow:hidden}
.lms-milestone-labels{display:flex;justify-content:space-between;margin-top:8px}
.lms-milestone-labels span{font-size:0.72rem;font-weight:700;color:#64748b}
.lms-milestone-text{font-size:0.82rem;color:#64748b;margin:0;line-height:1.5}

/* Bookmark Button Styles */
.lms-bookmark-btn{position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid rgba(12,22,40,0.08);border-radius:8px;background:#ffffff;color:#64748b;cursor:pointer;transition:all 0.2s}
.lms-bookmark-btn:hover{border-color:#9B7A3E;color:#9B7A3E}
.lms-bookmark-btn.bookmarked{background:rgba(155,122,62,0.08);border-color:rgba(155,122,62,0.3);color:#9B7A3E}
.lms-bookmark-btn.bookmark-pop{animation:bookmarkPop 0.6s cubic-bezier(0.16,1,0.3,1)}
@keyframes bookmarkPop{0%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(0.95)}100%{transform:scale(1)}}
.lms-bookmark-tooltip{position:absolute;bottom:-32px;left:50%;transform:translateX(-50%);padding:4px 10px;background:#0c1628;color:#ffffff;font-size:0.7rem;font-weight:600;border-radius:6px;white-space:nowrap;pointer-events:none;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,0.2)}
.lms-bookmark-tooltip::before{content:'';position:absolute;top:-4px;left:50%;transform:translateX(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid #0c1628}
.lms-bookmark-card:hover{border-color:rgba(155,122,62,0.25);transform:translateY(-1px);box-shadow:0 8px 24px rgba(12,22,40,0.06)}

/* Media Queries */
@media(max-width:1200px){
  .lms-dash-grid{grid-template-columns:1fr 1fr}
  .lms-dash-continue-card{grid-column:1 / -1}
  .lms-modules-grid{grid-template-columns:1fr 1fr}
  .lms-profile-layout{grid-template-columns:1fr}
  .lms-right-panel{width:280px;min-width:280px}
  .lms-insights-grid{grid-template-columns:1fr 1fr}
  .lms-dash-two-col{grid-template-columns:1fr}
}
@media(max-width:1024px){
  .lms-header-nav{gap:2px}
  .lms-nav-tab span{display:none}
  .lms-nav-tab{padding:7px 10px}
  .lms-progress-wrap{width:100px}
  .lms-video-section{padding:24px 24px 0}
  .lms-tab-content{padding:24px 24px 36px}
  .lms-tabs{padding:0 24px}
  .lms-page-content{padding:32px 24px}
  .lms-right-panel{display:none}
}
@media(max-width:768px){
  .lms-hamburger{display:flex}
  .lms-sidebar-toggle{display:none}
  .lms-sidebar{position:fixed;top:64px;left:0;bottom:0;z-index:950;width:300px;min-width:300px;transform:translateX(-100%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1)}
  .lms-sidebar.mobile-open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,0.3)}
  .lms-sidebar.closed{width:300px;min-width:300px;opacity:0;transform:translateX(-100%)}
  .lms-mobile-overlay{display:block}
  .lms-video-section{padding:20px 18px 0}
  .lms-tab-content{padding:20px 18px 28px}
  .lms-tabs{padding:0 18px;overflow-x:auto}
  .lms-page-content{padding:24px 18px}
  .lms-dash-welcome{flex-direction:column;text-align:center;gap:20px}
  .lms-dash-grid{grid-template-columns:1fr}
  .lms-dash-course-card{flex-direction:column;text-align:center}
  .lms-modules-grid{grid-template-columns:1fr}
  .lms-profile-stats-grid{grid-template-columns:1fr 1fr}
  .lms-insights-grid{grid-template-columns:1fr}
  .lms-actions-grid{grid-template-columns:repeat(2,1fr)}
  .lms-hero-card{padding:24px}
  .lms-quick-actions{grid-template-columns:repeat(2,1fr)}
  .lms-overview-header{flex-direction:column;text-align:center}
  .lms-overview-stats{justify-content:center}
  .lms-schedule-speed-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
  .lms-header{padding:0 12px;height:64px}
  .lms-brand-icon{width:32px;height:32px;font-size:0.95rem}
  .lms-brand-sub{display:none}
  .lms-brand-group{padding:4px 4px}
  .lms-video-section{padding:16px 14px 0}
  .lms-page-content{padding:20px 14px}
  .lms-profile-stats-grid{grid-template-columns:1fr}
  .lms-actions-grid{grid-template-columns:1fr}
  .lms-quick-actions{grid-template-columns:1fr}
  .lms-achievements-grid{flex-wrap:wrap}
}
`;

const s: Record<string, React.CSSProperties> = {
  gatePage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f7f3',
    padding: '1rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  gateBackBtn: {
    position: 'fixed',
    top: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    background: '#ffffff',
    border: '1px solid rgba(12, 22, 40, 0.12)',
    borderRadius: '99px',
    color: '#0c1628',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(12,22,40,0.05)',
    zIndex: 10,
  },
  gateCard: {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid rgba(12, 22, 40, 0.08)',
    boxShadow: '0 12px 40px rgba(12, 22, 40, 0.08)',
    overflow: 'hidden',
  },
  gateHeader: {
    background: 'linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)',
    padding: '2.5rem 2rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  gateTitle: { margin: 0, color: '#ffffff', fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  gateSubtitle: { margin: '8px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' },
  gateBody: { padding: '1.8rem 2rem 2rem' },
  gateMsg: { margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center' },
  gateBtnPrimary: {
    width: '100%',
    marginTop: '1.5rem',
    padding: '13px',
    background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '99px',
    fontSize: '0.95rem',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 6px 20px -4px rgba(155, 122, 62, 0.35)',
  },
  gateBtnSecondary: {
    width: '100%',
    marginTop: '0.8rem',
    padding: '13px',
    background: '#ffffff',
    color: '#9B7A3E',
    border: '1.5px solid rgba(155, 122, 62, 0.4)',
    borderRadius: '99px',
    fontSize: '0.95rem',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  },
  gateFooter: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.2rem' },
  gateLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'Inter, sans-serif',
    color: '#9B7A3E',
    fontWeight: 600,
    fontSize: '0.85rem',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};