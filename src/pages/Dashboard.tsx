import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEO';
import { ArrowRight, LifeBuoy, MessagesSquare, Sparkles, Star, Flame, GraduationCap, Target, CalendarDays, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { StudentIDCard } from '@/components/dashboard/StudentIDCard';
import UpcomingClasses from '@/components/dashboard/UpcomingClasses';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { EnrolledCoursesSection } from '@/components/dashboard/EnrolledCoursesSection';
import { StudyPlanThreeDayStrip } from '@/components/dashboard/StudyPlanThreeDayStrip';
import { Footer } from '@/components/Footer';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useEffect } from 'react';
import { useEnrolledCoursesWithCategories } from '@/hooks/useEnrolledCoursesWithCategories';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useIsChecker } from '@/hooks/useIsChecker';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDPT } from '@/hooks/useDPT';
import { format } from 'date-fns';

const SSLC_COURSE_ID = '4c10bc8e-acbc-4b76-b7f5-54376c030cb0';

const SSLCPromoCard = () => (
  <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-900/20 border-amber-300 dark:border-amber-700 shadow-md">
    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
    <div className="relative flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
        <Sparkles className="h-6 w-6 text-amber-700 dark:text-amber-300" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground">🔥 SSLC Model Question Papers</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Up to <span className="font-bold text-amber-700 dark:text-amber-400">80% chances</span> to get questions from our Model Question Papers! Don't miss this opportunity.
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full px-2 py-0.5">Predicted</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full px-2 py-0.5">Important</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full px-2 py-0.5">PYQ</span>
        </div>
        <Button asChild size="sm" className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
          <Link to={`/learning/${SSLC_COURSE_ID}?tab=pyqs`}>
            <Star className="h-4 w-4 mr-1" />
            Explore SSLC Program
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  </Card>
);

const StatChip = ({ icon: Icon, value, label, tint }: { icon: LucideIcon; value: string; label: string; tint: string }) => (
  <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur px-4 py-2.5 border border-white/15">
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${tint} text-white shadow-md`}>
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[10px] text-white/70 mt-0.5">{label}</p>
    </div>
  </div>
);

const DashboardHero = () => {
  const { data: profile } = useUserProfile();
  const { streak: dppStreak, averageScore } = useDPT();
  const { data: enrolledCourses } = useEnrolledCoursesWithCategories();

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const today = format(new Date(), 'EEEE, MMMM d');
  const enrolledCount = enrolledCourses?.length ?? 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-violet-700 text-white p-6 md:p-8 shadow-xl shadow-primary/10">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute top-10 right-1/3 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
            <CalendarDays className="h-3.5 w-3.5" />
            {today}
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="mt-2 text-white/80 max-w-md">
            Your learning journey continues — pick up right where you left off.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatChip icon={GraduationCap} value={String(enrolledCount)} label="Enrolled" tint="from-sky-400 to-blue-600" />
          <StatChip icon={Flame} value={`${dppStreak}`} label="Day streak" tint="from-orange-400 to-red-500" />
          <StatChip icon={Target} value={`${averageScore}%`} label="DPP average" tint="from-emerald-400 to-teal-600" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { isChecker, isLoading: checkerLoading } = useIsChecker();
  const isMobile = useIsMobile();
  const { data: enrolledCourses } = useEnrolledCoursesWithCategories();

  const isEnrolledInSSLC = (enrolledCourses || []).some((c) => c.id === SSLC_COURSE_ID);


  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Redirect checker users to /my-courses
  useEffect(() => {
    if (!checkerLoading && isChecker) {
      navigate('/my-courses', { replace: true });
    }
  }, [isChecker, checkerLoading, navigate]);

  // Show skeleton while checking auth or checker role
  if (isLoading || checkerLoading) {
    return <DashboardSkeleton />;
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return <DashboardSkeleton />;
  }

  // Don't render if checker (will redirect)
  if (isChecker) {
    return <DashboardSkeleton />;
  }

  if (isMobile) {
    return (
      <>
        <SEOHead title="My Dashboard | SimpleLecture" description="Your learning dashboard" />
        <MobileLayout title="Dashboard">
          <div className="space-y-4">
            <StudentIDCard />
            {!isEnrolledInSSLC && <SSLCPromoCard />}
            <StudyPlanThreeDayStrip />
            <EnrolledCoursesSection />
            <UpcomingClasses />
            <div className="grid grid-cols-1 gap-3">
              <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/20 dark:from-primary/30 dark:to-primary/20 border-primary/30 dark:border-primary hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <LifeBuoy className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">Having a problem?</h3>
                    <p className="text-sm text-muted-foreground">Get quick support for any issues.</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/support">Support</Link>
                  </Button>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/20 dark:from-primary/30 dark:to-primary/20 border-primary/30 dark:border-primary hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <MessagesSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">Got a question?</h3>
                    <p className="text-sm text-muted-foreground">Ask & learn from the community.</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/forum">Forum</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </MobileLayout>
      </>
    );
  }

  return (
    <>
      <SEOHead title="My Dashboard | SimpleLecture" description="Your learning dashboard" />
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <DashboardHero />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StudyPlanThreeDayStrip />
            </div>
            <UpcomingClasses />
          </div>

          <StudentIDCard />

          {!isEnrolledInSSLC && <SSLCPromoCard />}

          <EnrolledCoursesSection />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group relative overflow-hidden p-6 border-border/60 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/my-courses')}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">My Courses</h3>
                <p className="text-sm text-muted-foreground">Review your enrolled programs and continue learning.</p>
                <Button variant="ghost" size="sm">
                  Go to courses <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </Card>
            <Card className="group relative overflow-hidden p-6 border-border/60 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/support')}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl group-hover:bg-sky-400/20 transition-all" />
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg">
                  <LifeBuoy className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Having a problem?</h3>
                <p className="text-sm text-muted-foreground">We're here to help! Get quick support for account, payment, or technical issues.</p>
                <Button variant="ghost" size="sm">
                  Support <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </Card>
            <Card className="group relative overflow-hidden p-6 border-border/60 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/forum')}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl group-hover:bg-emerald-400/20 transition-all" />
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
                  <MessagesSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Got a question?</h3>
                <p className="text-sm text-muted-foreground">Join the discussion! Ask questions, share ideas, and learn from the community.</p>
                <Button variant="ghost" size="sm">
                  Forum <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
