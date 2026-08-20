import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEO';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Home,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Play,
  Flame,
  GraduationCap,
  Target,
  CheckCircle2,
  Sparkles,
  Clock,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { useEnrolledCoursesWithCategories } from '@/hooks/useEnrolledCoursesWithCategories';
import { useIsChecker } from '@/hooks/useIsChecker';
import { useCheckerAllCourses } from '@/hooks/useCheckerAllCourses';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNav } from '@/components/mobile/BottomNav';
import { mcLog, getNavType, installBFCacheProbes } from '@/lib/debug/myCoursesLogger';
import type { EnrolledCourse } from '@/hooks/useEnrolledCoursesWithCategories';

interface CategoryTab {
  id: string;
  name: string;
  icon: string | null;
  count: number;
}

const MyCourses = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isChecker, isLoading: checkerLoading } = useIsChecker();
  const { data: enrolledCourses, isLoading: enrolledLoading } = useEnrolledCoursesWithCategories();
  const { data: allCourses, isLoading: allCoursesLoading } = useCheckerAllCourses(isChecker);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const coursesData = isChecker ? allCourses : enrolledCourses;
  const isLoading = (checkerLoading || (isChecker ? allCoursesLoading : enrolledLoading)) && !coursesData;

  const renderCount = useRef(0);
  renderCount.current += 1;
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    installBFCacheProbes();
    mountedAt.current = performance.now();
    mcLog('MyCourses', 'mount', {
      navType: getNavType(),
      referrer: document.referrer || null,
      isMobile,
      url: location.pathname,
    });
    return () => {
      mcLog('MyCourses', 'unmount', {
        elapsedMs: Math.round(performance.now() - mountedAt.current),
        renderCount: renderCount.current,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  mcLog('MyCourses', 'render', {
    n: renderCount.current,
    isLoading,
    coursesCount: coursesData?.length ?? null,
    isChecker,
  });

  const enrolledCategories = useMemo(() => {
    if (!coursesData) return [];
    const categoryMap = new Map<string, CategoryTab>();
    for (const course of coursesData) {
      if (course.parentCategoryId && !categoryMap.has(course.parentCategoryId)) {
        categoryMap.set(course.parentCategoryId, {
          id: course.parentCategoryId,
          name: course.parentCategoryName || 'Unknown',
          icon: course.parentCategoryIcon,
          count: 0,
        });
      }
      if (course.parentCategoryId && categoryMap.has(course.parentCategoryId)) {
        categoryMap.get(course.parentCategoryId)!.count += 1;
      }
    }
    return Array.from(categoryMap.values());
  }, [coursesData]);

  const filteredCourses = useMemo(() => {
    if (!coursesData) return [];
    if (selectedCategory === 'all') return coursesData;
    return coursesData.filter(c => c.parentCategoryId === selectedCategory);
  }, [coursesData, selectedCategory]);

  const stats = useMemo(() => {
    if (!coursesData) return { total: 0, inProgress: 0, completed: 0, overall: 0 };
    const total = coursesData.length;
    const completed = coursesData.filter(c => c.progress >= 100).length;
    const inProgress = coursesData.filter(c => c.progress > 0 && c.progress < 100).length;
    const overall = total > 0 ? Math.round(coursesData.reduce((s, c) => s + c.progress, 0) / total) : 0;
    return { total, inProgress, completed, overall };
  }, [coursesData]);

  const spotlightCourse = useMemo(() => {
    if (!coursesData) return null;
    const inProgress = coursesData
      .filter(c => c.progress > 0 && c.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    return inProgress[0] || null;
  }, [coursesData]);

  const handleCourseClick = (course: { id: string }) => {
    navigate(`/learning/${course.id}`);
  };

  const pct = Math.min(100, Math.max(0, stats.overall));

  const StatCard = ({ icon: Icon, label, value, tint }: { icon: LucideIcon; label: string; value: number; tint: string }) => (
    <div className="relative overflow-hidden rounded-2xl border bg-background/80 backdrop-blur p-4">
      <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full blur-2xl opacity-30 ${tint}`} />
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </div>
    </div>
  );

  const ProgressRing = ({ value, size = 56, stroke = 5 }: { value: number; size?: number; stroke?: number }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke="currentColor"
            className="text-primary transition-all duration-700"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {value}%
        </div>
      </div>
    );
  };

  const CourseCard = ({ course }: { course: EnrolledCourse }) => {
    const progress = Math.min(100, Math.max(0, course.progress || 0));
    return (
      <Card
        className="group relative h-full overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
        onClick={() => handleCourseClick(course)}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <Badge
            className="absolute top-3 left-3 bg-background/80 backdrop-blur text-foreground border-border/50"
          >
            {course.parentCategoryName || 'Program'}
          </Badge>
          <Badge
            className={`absolute top-3 right-3 ${
              progress >= 100 ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'
            }`}
          >
            {progress >= 100 ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" /> Done
              </>
            ) : progress > 0 ? (
              `${progress}%`
            ) : (
              'New'
            )}
          </Badge>
          {progress > 0 && progress < 100 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-base leading-snug line-clamp-2">{course.name}</h3>
            {progress > 0 && (
              <div className="shrink-0 text-primary">
                <ProgressRing value={progress} size={44} stroke={4} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
            {course.duration_months && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.duration_months}mo
              </span>
            )}
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {course.parentCategoryName || 'Program'}
            </span>
          </div>
          <div className="mt-4">
            {progress > 0 ? (
              <>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-medium text-foreground">{progress >= 100 ? 'Completed' : 'In progress'}</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-muted" />
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground">Ready to start — jump right in</div>
            )}
          </div>
          <Button className="w-full mt-4" size="sm" variant={progress > 0 ? 'default' : 'outline'}>
            {isChecker ? 'Review Content' : progress >= 100 ? 'Revisit' : progress > 0 ? 'Continue' : 'Start'}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isMobile) {
    return (
      <>
        <SEOHead title="My Courses | SimpleLecture" description="View and continue your enrolled courses" />
        <div className="min-h-screen bg-background pb-24">
          {/* Mobile Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-600 text-primary-foreground px-5 pt-12 pb-6">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute top-16 -left-8 h-28 w-28 rounded-full bg-indigo-300/20 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="flex-shrink-0 p-1" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold leading-tight">My Courses</h1>
                <p className="text-primary-foreground/80 text-sm mt-0.5">
                  {isLoading ? 'Loading...' : `${stats.total} enrolled`}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-sm font-semibold">
                <Flame className="h-4 w-4" />
                {stats.overall}%
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 px-4 -mt-4 relative z-10">
            <div className="rounded-2xl bg-background border shadow-sm p-3 text-center">
              <p className="text-xl font-bold">{stats.inProgress}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">In progress</p>
            </div>
            <div className="rounded-2xl bg-background border shadow-sm p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">{stats.completed}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Completed</p>
            </div>
            <div className="rounded-2xl bg-background border shadow-sm p-3 text-center">
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total</p>
            </div>
          </div>

          {/* Continue learning spotlight */}
          {!isLoading && spotlightCourse && (
            <div
              className="relative mx-4 mt-4 overflow-hidden rounded-3xl text-white cursor-pointer shadow-lg"
              onClick={() => handleCourseClick(spotlightCourse)}
            >
              {spotlightCourse.thumbnail_url ? (
                <img src={spotlightCourse.thumbnail_url} alt={spotlightCourse.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <div className="relative p-4 pt-16">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
                  <Play className="h-3 w-3" /> Continue learning
                </span>
                <h3 className="mt-2 font-bold leading-snug line-clamp-2">{spotlightCourse.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/70">Progress</span>
                      <span className="font-semibold">{Math.min(100, spotlightCourse.progress || 0)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, spotlightCourse.progress || 0)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Category Pills */}
          <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                    : 'bg-background text-muted-foreground border border-border'
                }`}
              >
                All
                <span className="ml-1.5 text-xs opacity-70">{stats.total}</span>
              </button>
              {enrolledCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : 'bg-background text-muted-foreground border border-border'
                  }`}
                >
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 grid grid-cols-2 gap-3">
            {isLoading && (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-28 w-full" />
                  <div className="p-2.5 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-7 w-full rounded-md" />
                  </div>
                </Card>
              ))
            )}

            {!isLoading && filteredCourses.length === 0 && (
              <div className="text-center py-16 px-4 col-span-2">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-1">No courses found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCategory === 'all' ? "You haven't enrolled yet" : "No courses in this category"}
                </p>
                <Button onClick={() => navigate('/programs')} size="sm">Browse Programs</Button>
              </div>
            )}

            {!isLoading && filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                <div className="relative h-28 overflow-hidden bg-muted">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary/40" />
                    </div>
                  )}
                  {course.parentCategoryName && (
                    <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 bg-background/80 backdrop-blur">
                      {course.parentCategoryName}
                    </Badge>
                  )}
                  {course.progress > 0 && (
                    <Badge className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 ${course.progress >= 100 ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                      {course.progress >= 100 ? 'Done' : `${Math.min(100, course.progress)}%`}
                    </Badge>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/30">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.min(100, course.progress || 0)}%` }}
                    />
                  </div>
                </div>
                <CardContent className="p-2.5">
                  <h3 className="font-semibold text-xs line-clamp-2 mb-2">{course.name}</h3>
                  <Button size="sm" className="w-full h-7 text-xs" variant="default">
                    {isChecker ? 'Review' : course.progress >= 100 ? 'Revisit' : course.progress > 0 ? 'Continue' : 'Start'}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <SEOHead title="My Courses | SimpleLecture" description="View and continue your enrolled courses" />
      {!isChecker && <DashboardHeader />}

      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        {!isChecker && (
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">My Courses</span>
              </div>
            </div>
          </div>
        )}

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-indigo-500/10 to-transparent" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-72 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative container mx-auto px-4 pt-12 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {isLoading ? 'Loading your learning journey...' : 'Your personalized learning journey'}
                </div>
                <h1 className="mt-4 text-4xl xl:text-5xl font-bold tracking-tight">
                  My <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Courses</span>
                </h1>
                <p className="mt-3 text-muted-foreground text-lg">
                  {isLoading
                    ? 'Loading your courses...'
                    : `You're enrolled in ${stats.total} program${stats.total !== 1 ? 's' : ''}. Keep the momentum going!`}
                </p>
              </div>

              <div className="flex items-center gap-5 rounded-3xl border bg-background/80 backdrop-blur p-5 shadow-lg">
                <div className="text-primary">
                  <ProgressRing value={pct} size={84} stroke={7} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Overall progress</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.completed} of {stats.total} completed
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-amber-500">
                    <Flame className="h-4 w-4" />
                    <span className="text-xs font-medium text-foreground">Keep going!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <StatCard icon={GraduationCap} label="Enrolled programs" value={stats.total} tint="from-primary to-indigo-600" />
              <StatCard icon={Target} label="In progress" value={stats.inProgress} tint="from-amber-500 to-orange-600" />
              <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} tint="from-emerald-500 to-teal-600" />
            </div>
          </div>
        </div>

        {/* Continue Learning Spotlight */}
        {!isLoading && spotlightCourse && (
          <div className="container mx-auto px-4 pt-6">
            <div
              className="group relative overflow-hidden rounded-3xl text-white shadow-xl cursor-pointer"
              onClick={() => handleCourseClick(spotlightCourse)}
            >
              {spotlightCourse.thumbnail_url ? (
                <img src={spotlightCourse.thumbnail_url} alt={spotlightCourse.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-700 to-violet-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, spotlightCourse.progress || 0)}%` }}
                />
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 p-8">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                    <Play className="h-3.5 w-3.5" /> Continue learning
                  </span>
                  <h3 className="mt-3 text-2xl font-bold leading-snug max-w-xl">{spotlightCourse.name}</h3>
                  <p className="mt-2 text-white/70 text-sm max-w-lg">
                    {spotlightCourse.short_description || `${Math.min(100, spotlightCourse.progress || 0)}% complete — resume where you left off`}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                      <Play className="h-4 w-4 mr-1.5" />
                      Resume
                    </Button>
                    <span className="text-sm font-semibold text-white/90">
                      {Math.min(100, spotlightCourse.progress || 0)}% complete
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur border border-white/30">
                    <Play className="h-8 w-8 ml-1 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Your Programs</h2>
            <span className="text-sm text-muted-foreground">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'program' : 'programs'}
            </span>
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-muted/50 p-1.5 rounded-2xl">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl shadow-sm"
              >
                All Programs
                {stats.total > 0 && <span className="ml-2 text-xs opacity-70">{stats.total}</span>}
              </TabsTrigger>
              {enrolledCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl shadow-sm"
                >
                  {category.icon && <span className="mr-1.5">{category.icon}</span>}
                  {category.name}
                  <span className="ml-2 text-xs opacity-70">{category.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="container mx-auto px-4 pb-16">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredCourses.length === 0 && (
            <Card className="p-12 text-center border-dashed">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-5 max-w-sm mx-auto">
                {selectedCategory === 'all'
                  ? "You haven't enrolled in any programs yet. Explore our catalog to get started!"
                  : "No programs found in this category."
                }
              </p>
              <Button onClick={() => navigate('/programs')}>
                Browse Programs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          )}

          {!isLoading && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyCourses;
