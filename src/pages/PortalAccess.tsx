import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Building2, CalendarDays,
  CheckCircle2, ClipboardList, Eye, EyeOff, GraduationCap, HelpCircle,
  LayoutDashboard, LockKeyhole, Mail, Menu, Settings, ShieldCheck, Sparkles,
  UserCog, Users, X,
} from "lucide-react";
import logo from "@/assets/website-logo.png";

type PortalRole = "faculty" | "administrative";

const roleCopy = {
  faculty: {
    eyebrow: "Academic workspace",
    title: "Faculty Portal",
    description: "Manage teaching, learning resources, assessments and student progress from one focused workspace.",
    accent: "from-blue-600 to-indigo-700",
    light: "bg-blue-50 text-blue-700",
    icon: GraduationCap,
    idLabel: "Faculty ID or email",
    placeholder: "e.g. FAC-1042",
  },
  administrative: {
    eyebrow: "Institutional workspace",
    title: "Administrative Portal",
    description: "Secure access for operations, governance, reporting and institution-wide configuration.",
    accent: "from-slate-800 to-slate-950",
    light: "bg-slate-100 text-slate-800",
    icon: ShieldCheck,
    idLabel: "Administrator ID or email",
    placeholder: "e.g. ADM-2048",
  },
};

const portalNav = {
  faculty: [
    ["Overview", LayoutDashboard], ["My classes", Users], ["Course content", BookOpen],
    ["Assessments", ClipboardList], ["Schedule", CalendarDays], ["Settings", Settings],
  ],
  administrative: [
    ["Overview", LayoutDashboard], ["User management", UserCog], ["Academics", Building2],
    ["Reports", BarChart3], ["Operations", ClipboardList], ["System settings", Settings],
  ],
} as const;

export function PortalChooser() {
  const portals = [
    { title: "Student Login", text: "Continue learning, access courses, tests, notes and your personal dashboard.", icon: BookOpen, href: "/student-login?tab=login", badge: "Learner access", color: "from-orange-500 to-rose-500", rank: "01" },
    { title: "Faculty Login", text: "Manage classes, learning content, assessments and student performance.", icon: GraduationCap, href: "/portal/faculty", badge: "Academic access", color: "from-blue-600 to-indigo-700", rank: "02" },
    { title: "Administrative Login", text: "Oversee people, academics, operations, reports and platform settings.", icon: ShieldCheck, href: "/portal/administrative", badge: "Authorized access", color: "from-slate-700 to-slate-950", rank: "03" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,.16),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(37,99,235,.12),transparent_36%)]" />
      <header className="relative border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center"><img src={logo} alt="Simple Lecture" className="h-9 w-auto" /></Link>
          <div className="flex items-center gap-2 text-sm text-slate-500"><LockKeyhole className="h-4 w-4" /> Secure portal access</div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Simple Lecture Digital Campus</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Choose your access portal</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">One connected campus, purpose-built for every role. Select your portal to continue.</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {portals.map(({ title, text, icon: Icon, href, badge, color, rank }) => (
            <Link key={title} to={href} className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_-28px_rgba(15,23,42,.3)] transition duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_28px_70px_-30px_rgba(15,23,42,.38)]">
              <div className="absolute right-5 top-3 text-7xl font-black text-slate-50 transition group-hover:text-slate-100">{rank}</div>
              <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}><Icon className="h-7 w-7" /></div>
              <div className="relative mt-8 text-xs font-bold uppercase tracking-[.16em] text-slate-400">{badge}</div>
              <h2 className="relative mt-2 text-2xl font-extrabold">{title}</h2>
              <p className="relative mt-3 min-h-[72px] leading-6 text-slate-600">{text}</p>
              <div className="relative mt-7 flex items-center justify-between border-t border-slate-100 pt-5 font-bold text-slate-900">Enter portal <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></span></div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 text-sm text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Protected by secure, role-based access</span>
          <Link to="/support" className="flex items-center gap-2 font-semibold text-slate-700 hover:text-orange-600"><HelpCircle className="h-4 w-4" /> Need help signing in?</Link>
        </div>
      </section>
    </main>
  );
}

export function StaffLogin() {
  const { role: rawRole } = useParams();
  const navigate = useNavigate();
  const role: PortalRole = rawRole === "administrative" ? "administrative" : "faculty";
  const copy = roleCopy[role];
  const Icon = copy.icon;
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); navigate(`/portal/${role}/workspace`); };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_.92fr]">
      <section className={`relative hidden overflow-hidden bg-gradient-to-br ${copy.accent} p-12 text-white lg:flex lg:flex-col lg:justify-between`}>
        <div className="absolute -right-20 top-24 h-80 w-80 rounded-full border border-white/10" /><div className="absolute -right-2 top-44 h-52 w-52 rounded-full border border-white/10" />
        <Link to="/" className="relative"><img src={logo} alt="Simple Lecture" className="h-10 w-auto brightness-0 invert" /></Link>
        <div className="relative max-w-xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20"><Icon className="h-8 w-8" /></div>
          <p className="text-sm font-bold uppercase tracking-[.22em] text-white/60">{copy.eyebrow}</p>
          <h1 className="mt-3 text-5xl font-black leading-tight">Your work shapes every learning journey.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">{copy.description}</p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-white/60"><ShieldCheck className="h-5 w-5" /> Restricted to verified Simple Lecture personnel</div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_100%_0%,rgba(249,115,22,.08),transparent_30%)] px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/auth" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> All login options</Link>
          <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${copy.light} lg:hidden`}><Icon className="h-6 w-6" /></div>
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-orange-600">{copy.eyebrow}</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{copy.title}</h2>
          <p className="mt-3 text-slate-500">Enter your institutional credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{copy.idLabel}</span><div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required placeholder={copy.placeholder} className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" /></div></label>
            <label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold text-slate-700">Password</span><button type="button" className="text-xs font-bold text-blue-600">Forgot password?</button></div><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required type={showPassword ? "text" : "password"} placeholder="Enter your password" className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
            <label className="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /> Keep me signed in on this device</label>
            <button className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${copy.accent} font-extrabold text-white shadow-lg transition hover:-translate-y-0.5`}>Sign in to {copy.title} <ArrowRight className="h-4 w-4" /></button>
          </form>
          <p className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800"><strong>UI preview:</strong> Authentication for this portal will be connected by your administrator. The button opens a preview workspace.</p>
        </div>
      </section>
    </main>
  );
}

export function StaffWorkspace() {
  const { role: rawRole } = useParams();
  const role: PortalRole = rawRole === "administrative" ? "administrative" : "faculty";
  const copy = roleCopy[role];
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = portalNav[role];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${mobileOpen ? "fixed inset-0 z-50 flex" : "hidden"} bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col`}>
        <div className="flex h-full w-[280px] flex-col bg-slate-950 p-5">
          <div className="flex items-center justify-between"><img src={logo} alt="Simple Lecture" className="h-8 w-auto brightness-0 invert" /><button onClick={() => setMobileOpen(false)} className="lg:hidden"><X /></button></div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs font-bold uppercase tracking-wider text-white/40">Signed in as</div><div className="mt-1 font-bold">{copy.title}</div></div>
          <nav className="mt-7 space-y-1">{items.map(([label, Icon]) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active === label ? "bg-white text-slate-950" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-5 w-5" />{label}</button>)}</nav>
          <Link to="/auth" className="mt-auto flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" /> Exit preview</Link>
        </div>
        <button className="flex-1 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      </aside>
      <section className="min-w-0">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg border p-2 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{copy.title}</p><h1 className="text-xl font-extrabold">{active}</h1></div></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">SL</div></header>
        <div className="p-5 lg:p-8">
          <div className={`relative overflow-hidden rounded-[28px] bg-gradient-to-r ${copy.accent} p-7 text-white lg:p-10`}><div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" /><p className="text-sm font-bold text-white/60">{active}</p><h2 className="mt-2 max-w-xl text-3xl font-black lg:text-4xl">Welcome to your {role === "faculty" ? "teaching" : "institutional"} workspace.</h2><p className="mt-3 max-w-xl text-white/70">This is a polished UI preview. Select any section from the menu to explore the portal hierarchy.</p></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{["Active items", "Pending review", "This week", "Completion"].map((label, i) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black">{[24, 7, 12, "86%"][i]}</p><p className="mt-2 text-xs font-semibold text-emerald-600">Preview information</p></div>)}</div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-extrabold">Recent activity</h3><div className="mt-5 space-y-4">{["Portal workspace created", `${active} module selected`, "Role permissions ready for configuration"].map((text, i) => <div key={text} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></span><div><p className="font-bold">{text}</p><p className="text-xs text-slate-400">UI demonstration · {i + 1} hour ago</p></div></div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-extrabold">Quick actions</h3><div className="mt-5 grid gap-3">{items.slice(1, 5).map(([label, Icon]) => <button key={label} onClick={() => setActive(label)} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left font-bold hover:border-slate-400"><span className="flex items-center gap-3"><Icon className="h-5 w-5 text-slate-500" />{label}</span><ArrowRight className="h-4 w-4 text-slate-400" /></button>)}</div></div></div>
        </div>
      </section>
    </main>
  );
}

