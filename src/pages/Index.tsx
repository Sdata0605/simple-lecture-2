import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Check, ChevronRight, Clock3, Facebook, Instagram, Languages, Mail, MessageCircle, Play, Search, ShieldCheck, Sparkles, Star, Trophy, Users, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEO";
import { generateOrganizationSchema, generateWebsiteSchema, generateHomepageFAQSchema } from "@/lib/seo/structuredData";
import { useHomepageData } from "@/hooks/useHomepageData";

// Eager above-the-fold (ships in main route chunk → no Suspense waterfall before paint)
import { SmartHeader } from "@/components/SmartHeader";
import heroStudents from "@/assets/hero-students.jpg";

const SEO_TITLE = "Online Classes for NEET, JEE & Board Exams | SimpleLecture";
const SEO_DESCRIPTION = "India's AI-powered online learning platform. Live classes, recorded video lectures, mock tests & 24/7 AI doubt solver for NEET, JEE, CBSE Class 11-12, SSLC & PUC. Join 1,00,000+ students from ₹1000 + GST per course for 1-year access.";
const SEO_KEYWORDS = "online classes, online lectures, online coaching, online learning platform India, NEET online coaching, JEE Main online classes, JEE Advanced preparation, CBSE Class 12 online classes, CBSE Class 11 online classes, physics online classes, chemistry online lectures, maths online tuition, biology online classes, science test series, mock test series, AI tutor for students, live classes, recorded lectures, video lectures, board exam preparation, JEE Main 2026, NEET 2026, SSLC, PUC, doubt solving app";

const Index = () => {
  const navigate = useNavigate();
  const { data: homepageData, isLoading, isError, error, refetch } = useHomepageData();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // One-shot intent flag: if the user clicked the logo to come home, skip the dashboard redirect.
      if (typeof window !== 'undefined' && sessionStorage.getItem('slStayHome') === '1') {
        sessionStorage.removeItem('slStayHome');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) return;
      const { data: isAdmin } = await supabase
        .from('user_roles').select('role')
        .eq('user_id', session.user.id).eq('role', 'admin').maybeSingle();
      if (cancelled || isAdmin) return;
      const { data: enr } = await supabase
        .from('enrollments').select('id')
        .eq('student_id', session.user.id).eq('is_active', true).limit(1).maybeSingle();
      if (!cancelled && enr) navigate('/dashboard', { replace: true });
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateHomepageFAQSchema()
    ]
  }), []);

  return (
    <>
      <SEOHead
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        keywords={SEO_KEYWORDS}
        canonicalUrl="https://simplelecture.com"
        structuredData={structuredData}
        preloadImage={heroStudents}
      />
      <div className="home-refresh min-h-screen bg-background">
        <SmartHeader />
        <main>
          <section className="relative overflow-hidden border-b border-[#d5e7f3] bg-[#f4fbff]">
            <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#cfeeff] blur-[90px]" />
            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#dcecff] blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 opacity-[.28] [background-image:radial-gradient(#b7d8ea_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="container relative mx-auto flex min-h-[760px] flex-col items-center gap-12 px-4 py-14 lg:px-8 lg:py-20">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b9dceb] bg-white px-4 py-2 text-sm font-semibold text-[#0d5f9d] shadow-sm">
                  <Sparkles className="h-4 w-4 text-[#079a9d]" /> Your smarter way to study
                </div>
                <h1 className="text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#0d3568] sm:text-6xl lg:text-7xl">
                  Understand more. Stress less.<br /><span className="text-[#079a9d]">Score better.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Clear video lessons, live guidance and an AI tutor for every doubt—built for SSLC, PUC, NEET and JEE students.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button onClick={() => navigate('/programs')} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#1555b6] px-7 font-bold text-white shadow-[0_14px_36px_rgba(21,85,182,.22)] transition hover:-translate-y-0.5 hover:bg-[#0d438f]">
                    Find my course <ArrowRight className="h-5 w-5" />
                  </button>
                  <button onClick={() => navigate('/course/Class-10/preview')} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 font-bold text-[#0d3568] transition hover:border-[#079a9d] hover:text-[#079a9d]">
                    <Play className="h-5 w-5 fill-current" /> Watch a free lesson
                  </button>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 1-year access</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 3 languages</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Start from ₹1,000</span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-5xl">
                <div className="overflow-hidden rounded-[2rem] border-[7px] border-white bg-white shadow-[0_30px_80px_rgba(16,35,63,.2)]">
                  <img src={heroStudents} alt="Students learning together" className="h-[300px] w-full object-cover sm:h-[390px]" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-[#0d3568]/95 p-4 text-white shadow-xl backdrop-blur sm:bottom-8 sm:left-auto sm:right-8 sm:w-[430px] sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#079a9d]"><BrainCircuit className="h-6 w-6" /></div>
                      <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-widest text-[#82d8e6]">AI study coach</p><p className="mt-1 font-bold">“Explain this in a simpler way”</p></div>
                      <div className="ml-auto hidden h-9 items-center rounded-full bg-white/10 px-3 text-xs font-semibold sm:flex">Online</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-5 top-8 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
                  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100"><Trophy className="h-5 w-5 text-amber-600" /></div><div><p className="text-xs text-slate-500">Students learning</p><p className="font-black text-[#0d3568]">1,00,000+</p></div></div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#079a9d]">Start in seconds</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#0d3568] sm:text-4xl">What are you preparing for?</h2><p className="mt-3 text-slate-600">Choose your goal and get a focused learning path.</p></div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['SSLC / Class 10', 'Board confidence, chapter by chapter', BookOpen, '/course/Class-10', 'bg-[#e5f7fa] text-[#087f85]'],
                  ['PUC / Class 12', 'Concepts, revision and exam practice', Star, '/programs', 'bg-[#eaf2ff] text-[#1555b6]'],
                  ['NEET', 'Biology, Physics & Chemistry mastery', BrainCircuit, '/programs', 'bg-[#e8f7ef] text-[#218455]'],
                  ['JEE', 'Build speed and problem-solving skill', Trophy, '/programs', 'bg-[#f5edff] text-[#7440a5]'],
                ].map(([title, copy, Icon, href, tone]) => (
                  <button key={title as string} onClick={() => navigate(href as string)} className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-[0_8px_24px_rgba(13,53,104,.06)] transition hover:-translate-y-1 hover:border-[#079a9d]/50 hover:shadow-[0_16px_36px_rgba(13,53,104,.12)]">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon className="h-6 w-6" /></div>
                    <h3 className="mt-5 text-xl font-black text-[#0d3568]">{title as string}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{copy as string}</p><span className="mt-5 flex items-center gap-2 text-sm font-bold text-[#079a9d]">Explore courses <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </button>
                ))}
              </div>
              <div className="mt-8 grid gap-4 rounded-3xl bg-[#0d3568] p-6 text-white shadow-[0_18px_50px_rgba(13,53,104,.18)] sm:grid-cols-3 sm:p-8">
                <div className="flex items-center gap-3"><Clock3 className="h-6 w-6 text-[#50c4d2]" /><div><p className="font-bold">Learn at your pace</p><p className="text-sm text-slate-300">Replay every lesson</p></div></div>
                <div className="flex items-center gap-3"><BrainCircuit className="h-6 w-6 text-[#50c4d2]" /><div><p className="font-bold">Ask doubts anytime</p><p className="text-sm text-slate-300">AI support, 24/7</p></div></div>
                <div className="flex items-center gap-3"><Search className="h-6 w-6 text-[#50c4d2]" /><div><p className="font-bold">Practice what matters</p><p className="text-sm text-slate-300">Tests made for your goal</p></div></div>
              </div>
            </div>
          </section>
          <section className="bg-[#f4fbff] py-20 sm:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#079a9d]">Popular right now</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#0d3568] sm:text-5xl">Courses students love</h2><p className="mt-3 max-w-xl text-slate-600">Practical learning paths built around your syllabus and exam goals.</p></div>
                <button onClick={() => navigate('/programs')} className="flex items-center gap-2 font-bold text-[#0d3568] hover:text-[#079a9d]">Browse all courses <ArrowRight className="h-5 w-5" /></button>
              </div>

              {isLoading && !homepageData && <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="h-80 animate-pulse rounded-3xl bg-white" />)}</div>}
              {isError && !homepageData && <div className="mt-10 rounded-3xl border border-red-200 bg-white p-8 text-center"><p className="text-slate-600">{error instanceof Error ? error.message : 'Courses are unavailable right now.'}</p><button onClick={() => refetch()} className="mt-4 rounded-xl bg-[#0d3568] px-5 py-3 font-bold text-white">Try again</button></div>}
              {homepageData && (
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {homepageData.courses.slice(0, 6).map((course, index) => {
                    const thumbs = course.course_thumbnails;
                    const thumbnail = Array.isArray(thumbs) ? thumbs[0]?.storage_url : thumbs?.storage_url;
                    return (
                      <button key={course.id} onClick={() => navigate(`/programs/${course.slug}`)} className="group overflow-hidden rounded-3xl border border-[#d5e7f3] bg-white text-left shadow-[0_10px_30px_rgba(13,53,104,.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(13,53,104,.13)]">
                        <div className="relative h-48 overflow-hidden bg-[#eaf2ff]">
                          {thumbnail ? <img src={thumbnail} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><BookOpen className="h-12 w-12 text-[#0d3568]/30" /></div>}
                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#0d3568] shadow">{index < 2 ? 'BESTSELLER' : 'POPULAR'}</span>
                        </div>
                        <div className="p-6"><h3 className="line-clamp-2 text-xl font-black text-[#0d3568]">{course.name}</h3><p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{course.short_description || 'Complete lessons, smart practice and guided revision.'}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-xs text-slate-500">Full course access</p><p className="text-lg font-black text-[#0d3568]">{course.price_inr ? `₹${course.price_inr.toLocaleString('en-IN')}` : 'Explore now'}</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e5f7fa] text-[#079a9d]"><ChevronRight className="h-5 w-5" /></span></div></div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden bg-[#0d3568] py-20 text-white sm:py-28">
            <div className="container mx-auto grid items-center gap-14 px-4 lg:grid-cols-2 lg:px-8">
              <div className="relative mx-auto w-full max-w-xl rounded-[2rem] bg-[#1555b6] p-5 shadow-2xl">
                <div className="rounded-2xl bg-white p-5 text-[#0d3568]"><div className="flex items-center gap-3 border-b border-slate-100 pb-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5f7fa]"><BrainCircuit className="h-6 w-6 text-[#079a9d]" /></div><div><p className="font-black">SimpleLecture AI Tutor</p><p className="text-xs text-emerald-600">● Ready to help</p></div></div><div className="mt-5 rounded-2xl bg-[#f5f7fa] p-4 text-sm leading-6">Why does acceleration change when velocity changes direction?</div><div className="ml-8 mt-3 rounded-2xl bg-[#e5f7fa] p-4 text-sm leading-6">Acceleration measures any change in velocity—including direction. Think of a car turning at constant speed...</div><div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400"><MessageCircle className="h-4 w-4" /> Ask your next doubt...</div></div>
                <div className="absolute -right-5 -top-5 grid h-20 w-20 place-items-center rounded-3xl bg-[#079a9d] shadow-xl"><Sparkles className="h-9 w-9" /></div>
              </div>
              <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#50c4d2]">Your personal learning partner</p><h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Stuck on a concept?<br />Just ask.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Get patient, step-by-step explanations whenever you need them—in the language you understand best.</p><div className="mt-8 space-y-5">{[[Languages,'English, Hindi & Kannada'],[Clock3,'Available any time, day or night'],[BrainCircuit,'Explains until the concept clicks']].map(([Icon,label]) => <div key={label as string} className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><Icon className="h-5 w-5 text-[#50c4d2]" /></span><span className="font-bold">{label as string}</span></div>)}</div><button onClick={() => navigate('/ai-tutorial')} className="mt-9 inline-flex h-13 items-center gap-2 rounded-xl bg-[#079a9d] px-6 py-4 font-black text-white hover:bg-[#08777c]">See how AI learning works <ArrowRight className="h-5 w-5" /></button></div>
            </div>
          </section>

          <section className="bg-white py-20 sm:py-24">
            <div className="container mx-auto px-4 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-[#079a9d]">Made for real progress</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#0d3568] sm:text-5xl">Everything works together</h2></div><div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">{[[Play,'Learn','Clear video lessons that simplify difficult concepts.'],[MessageCircle,'Ask','Get doubts answered without waiting for the next class.'],[BookOpen,'Practice','Use chapter tests and exam-focused question sets.'],[Trophy,'Improve','Track weak areas and turn them into strengths.']].map(([Icon,title,copy],i) => <div key={title as string} className="bg-white p-8"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${i % 2 ? 'bg-[#eaf2ff] text-[#1555b6]' : 'bg-[#e5f7fa] text-[#079a9d]'}`}><Icon className="h-6 w-6" /></span><p className="mt-10 text-xs font-black tracking-[.2em] text-slate-400">0{i+1}</p><h3 className="mt-2 text-2xl font-black text-[#0d3568]">{title as string}</h3><p className="mt-3 leading-7 text-slate-600">{copy as string}</p></div>)}</div></div>
          </section>

          <section className="bg-[#f4fbff] py-20 sm:py-24">
            <div className="container mx-auto px-4 lg:px-8"><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[2rem] bg-[#079a9d] p-8 text-white sm:p-10"><Star className="h-9 w-9 fill-current" /><h2 className="mt-8 text-4xl font-black leading-tight">Students feel the difference.</h2><p className="mt-5 text-white/80">Clear explanations, flexible learning and support when it matters.</p><div className="mt-10 flex items-end gap-3"><span className="text-6xl font-black">4.9</span><div className="pb-2"><div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="mt-1 text-xs text-white/70">from student reviews</p></div></div></div><div className="grid gap-5 sm:grid-cols-2">{[['The lessons finally make Physics feel simple. I can pause, revise and ask doubts whenever I get stuck.','Aarav','JEE student'],['I like that the explanations are available in Kannada too. It feels much easier to understand difficult chapters.','Nandini','SSLC student'],['The chapter tests show exactly where I need more practice. My revision is much more focused now.','Rohan','NEET student'],['Everything is in one place—videos, tests, notes and doubt support. It saves me a lot of time.','Meera','PUC student']].map(([quote,name,role]) => <div key={name} className="rounded-3xl border border-[#d5e7f3] bg-white p-6 shadow-sm"><p className="text-lg leading-8 text-[#0d3568]">“{quote}”</p><div className="mt-6 border-t border-slate-100 pt-4"><p className="font-black text-[#0d3568]">{name}</p><p className="text-sm text-slate-500">{role}</p></div></div>)}</div></div></div>
          </section>

          <section className="bg-white py-20 sm:py-24">
            <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#079a9d]">Questions, answered</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#0d3568]">Everything you need to know.</h2><p className="mt-4 leading-7 text-slate-600">Still unsure? Our support team can help you choose the right course.</p><button onClick={() => navigate('/support')} className="mt-7 inline-flex items-center gap-2 font-black text-[#079a9d]">Talk to support <ArrowRight className="h-5 w-5" /></button></div><div className="divide-y divide-slate-200 border-y border-slate-200">{[['Can I watch lessons more than once?','Yes. You can replay your available course lessons throughout your access period.'],['Which languages are supported?','Learning support is available in English, Hindi and Kannada, depending on the course content.'],['Does the course include practice tests?','Yes. Courses include chapter practice, tests and exam-focused revision activities.'],['Can I try a lesson before buying?','Yes. Use the free lesson button above to experience the learning format first.']].map(([q,a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-[#0d3568]">{q}<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e5f7fa] text-[#079a9d] transition group-open:rotate-90"><ChevronRight className="h-4 w-4" /></span></summary><p className="max-w-2xl pt-4 leading-7 text-slate-600">{a}</p></details>)}</div></div>
          </section>

          <section className="bg-[#0d3568] px-4 py-10 text-white"><div className="container mx-auto flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-[#1555b6] p-8 text-center sm:p-12 lg:flex-row lg:text-left"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#82d8e6]">Ready when you are</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Start building exam confidence today.</h2></div><button onClick={() => navigate('/programs')} className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#0d3568]">Explore courses <ArrowRight className="h-5 w-5" /></button></div></section>
        </main>
        <footer className="bg-[#0b192d] py-12 text-slate-300"><div className="container mx-auto px-4 lg:px-8"><div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-4"><div className="md:col-span-2"><p className="text-2xl font-black text-white">SimpleLecture</p><p className="mt-3 max-w-sm leading-7 text-slate-400">Clear lessons, smart practice and personal support for ambitious students.</p><div className="mt-6 flex gap-3">{[Instagram,Youtube,Facebook].map((Icon,i) => <span key={i} className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><Icon className="h-4 w-4" /></span>)}</div></div><div><p className="font-black text-white">Explore</p><div className="mt-4 space-y-3 text-sm"><button onClick={() => navigate('/programs')} className="block hover:text-white">All courses</button><button onClick={() => navigate('/about-us')} className="block hover:text-white">About us</button><button onClick={() => navigate('/blog')} className="block hover:text-white">Learning blog</button></div></div><div><p className="font-black text-white">Need help?</p><div className="mt-4 space-y-3 text-sm"><button onClick={() => navigate('/support')} className="block hover:text-white">Support center</button><span className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@simplelecture.com</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure learning platform</span></div></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-slate-500 sm:flex-row"><p>© {new Date().getFullYear()} SimpleLecture. All rights reserved.</p><p>Privacy · Terms · Refund policy</p></div></div></footer>
      </div>
    </>
  );
};

export default Index;
