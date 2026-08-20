import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Clock3, Languages, Lightbulb, MessageCircle, Play, RotateCcw, Send, Sparkles, Target, Trophy } from "lucide-react";
import { SEOHead } from "@/components/SEO";
import { SmartHeader } from "@/components/SmartHeader";

const prompts = ["Explain this in a simpler way", "Give me a real-life example", "Quiz me on this concept"];
const steps = [
  { icon: Play, title: "Watch a clear lesson", copy: "Short explanations help you focus on one idea at a time." },
  { icon: MessageCircle, title: "Ask whenever you're stuck", copy: "Your AI tutor uses the lesson context to answer the exact doubt." },
  { icon: Target, title: "Practice the right questions", copy: "Smart practice focuses your time on concepts that need attention." },
  { icon: Trophy, title: "See real progress", copy: "Track completed lessons, stronger topics and your next best action." },
];

const AITutorial = () => {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [asked, setAsked] = useState(true);
  const askDemo = (prompt: string) => {
    setSelectedPrompt(prompt); setAsked(false);
    window.setTimeout(() => setAsked(true), 350);
  };

  return <>
    <SEOHead title="How AI Learning Works | SimpleLecture" description="See how SimpleLecture combines clear lessons, instant AI doubt support and focused practice." />
    <div className="min-h-screen bg-[#fffaf1]">
      <SmartHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[#eadfd1] px-4 py-16 sm:py-24">
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#ffdfcf] blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#dcecff] blur-3xl" />
          <div className="container relative mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4c9b5] bg-white px-4 py-2 text-sm font-black text-[#a63f1f] shadow-sm"><Sparkles className="h-4 w-4" /> AI learning, made simple</div>
            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-.045em] text-[#10233f] sm:text-6xl lg:text-7xl">A tutor that learns<br /><span className="text-[#eb5e3d]">how you learn.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">SimpleLecture connects every video, doubt, question and result—so your next study session always starts in the right place.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10233f] px-7 py-4 font-black text-white shadow-xl">Try the interactive demo <ArrowRight className="h-5 w-5" /></button><button onClick={() => navigate('/programs')} className="rounded-2xl border border-slate-300 bg-white px-7 py-4 font-black text-[#10233f]">Explore courses</button></div>
          </div>
        </section>

        <section id="demo" className="bg-white px-4 py-20 sm:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-10 text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-[#eb5e3d]">Try it yourself</p><h2 className="mt-3 text-3xl font-black text-[#10233f] sm:text-5xl">One lesson. A hundred ways to understand it.</h2></div>
            <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f8fa] shadow-[0_28px_70px_rgba(16,35,63,.14)] lg:grid-cols-[1.05fr_.95fr]">
              <div className="border-b border-slate-200 bg-[#10233f] p-5 lg:border-b-0 lg:border-r lg:p-7">
                <div className="flex items-center justify-between text-white"><div><p className="text-xs font-black uppercase tracking-widest text-[#ff9b7f]">Physics · Motion</p><p className="mt-1 font-black">Why velocity can change at constant speed</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs">04:18</span></div>
                <div className="relative mt-5 grid aspect-video place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#19365d] to-[#0b192d]"><div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" /><div className="relative text-center text-white"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eb5e3d] shadow-2xl"><Play className="ml-1 h-8 w-8 fill-current" /></div><p className="mt-5 text-lg font-black">Direction changes velocity</p><p className="mt-1 text-sm text-slate-300">even when speed stays the same</p></div></div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[42%] rounded-full bg-[#eb5e3d]" /></div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>04:18</span><span>10:02</span></div>
              </div>
              <div className="flex min-h-[510px] flex-col bg-white p-5 sm:p-7">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0e9]"><BrainCircuit className="h-6 w-6 text-[#eb5e3d]" /></div><div><p className="font-black text-[#10233f]">Ask AI about this lesson</p><p className="text-xs font-bold text-emerald-600">● Lesson context is on</p></div></div>
                <div className="flex-1 space-y-4 overflow-hidden py-5"><div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#10233f] p-4 text-sm leading-6 text-white">{selectedPrompt}</div><div className={`max-w-[92%] rounded-2xl rounded-bl-md bg-[#fff0e9] p-4 text-sm leading-6 text-[#10233f] transition-all duration-300 ${asked ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-60'}`}><p>Imagine a car moving around a circular track at the same speed. The speedometer does not change, but the car keeps turning.</p><p className="mt-3">Because <strong>velocity includes direction</strong>, every turn changes velocity. That change creates acceleration toward the circle's centre.</p><div className="mt-4 flex items-center gap-2 rounded-xl bg-white/70 p-3 font-bold"><Lightbulb className="h-4 w-4 text-[#eb5e3d]" /> Speed = how fast. Velocity = speed + direction.</div></div></div>
                <div className="flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => askDemo(prompt)} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${selectedPrompt === prompt ? 'border-[#eb5e3d] bg-[#fff0e9] text-[#a63f1f]' : 'border-slate-200 bg-white text-slate-600 hover:border-[#eb5e3d]'}`}>{prompt}</button>)}</div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f7f8fa] p-2 pl-4 text-sm text-slate-400"><span className="flex-1">Ask another doubt...</span><button onClick={() => askDemo(selectedPrompt)} className="grid h-10 w-10 place-items-center rounded-lg bg-[#eb5e3d] text-white"><Send className="h-4 w-4" /></button></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf1] px-4 py-20 sm:py-24"><div className="container mx-auto max-w-6xl"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-[#eb5e3d]">A complete learning loop</p><h2 className="mt-3 text-3xl font-black text-[#10233f] sm:text-5xl">From “I don't get it” to “I can do it.”</h2></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(({icon: Icon,title,copy},index) => <div key={title} className="relative rounded-3xl border border-[#eadfd1] bg-white p-7 shadow-sm"><span className="absolute right-6 top-6 text-sm font-black text-slate-300">0{index+1}</span><span className={`grid h-12 w-12 place-items-center rounded-2xl ${index % 2 ? 'bg-[#eaf2ff] text-[#245da8]' : 'bg-[#fff0e9] text-[#eb5e3d]'}`}><Icon className="h-6 w-6" /></span><h3 className="mt-8 text-xl font-black text-[#10233f]">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></div>)}</div></div></section>

        <section className="bg-[#10233f] px-4 py-20 text-white sm:py-24"><div className="container mx-auto grid max-w-6xl gap-12 lg:grid-cols-2"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#ff9b7f]">Built around you</p><h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">The more you learn,<br />the smarter it gets.</h2><p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">Your activity helps SimpleLecture recommend the right next lesson, revision topic or practice set.</p></div><div className="grid gap-4 sm:grid-cols-2">{[[Clock3,'Your pace','Resume exactly where you stopped.'],[Languages,'Your language','Learn in the language that feels natural.'],[BookOpen,'Your syllabus','Stay focused on what your exam requires.'],[RotateCcw,'Your weak areas','Return to concepts before they become gaps.']].map(([Icon,title,copy]) => <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon className="h-6 w-6 text-[#ff9b7f]" /><h3 className="mt-5 font-black">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{copy as string}</p></div>)}</div></div></section>

        <section className="bg-white px-4 py-20 sm:py-24"><div className="container mx-auto max-w-5xl rounded-[2rem] bg-[#fff0e9] p-8 text-center sm:p-14"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eb5e3d] text-white"><Sparkles className="h-7 w-7" /></div><h2 className="mt-6 text-3xl font-black text-[#10233f] sm:text-5xl">Ready to learn differently?</h2><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">Choose your goal and experience lessons that adapt to the way you understand best.</p><button onClick={() => navigate('/programs')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#10233f] px-7 py-4 font-black text-white">Find my course <ArrowRight className="h-5 w-5" /></button></div></section>
      </main>
      <footer className="bg-[#0b192d] py-8 text-center text-sm text-slate-400">© {new Date().getFullYear()} SimpleLecture · Clear learning for ambitious students.</footer>
    </div>
  </>;
};

export default AITutorial;
