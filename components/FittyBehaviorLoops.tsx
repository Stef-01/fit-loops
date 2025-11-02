import React, { useMemo, useState } from "react";
import { Activity, AlarmClock, Moon, Users, CalendarCheck2, Timer, Watch, Headphones, HeartPulse, Zap, Coins, Wallet, Gift, TrendingUp, Share2, ShieldCheck, Trophy, Sparkles, MessageSquare } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// Local UI components
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Switch } from "./ui/Switch";

// Helper to build day labels
const dateLabel = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

function buildSeries(days = 14) {
  const today = new Date();
  const data: any[] = [];
  let insulin = 58;
  let form = 72;
  let mins = 16;
  let risk = 38;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    insulin += Math.random() * 2 - 0.3;
    form += Math.random() * 2 - 0.2;
    mins += Math.random() * 6 - 0.8;
    risk += Math.random() * 2 - 0.9;
    data.push({
      day: dateLabel(d),
      insulin: Math.max(40, Math.min(100, Math.round(insulin))),
      form: Math.max(50, Math.min(100, Math.round(form))),
      minutes: Math.max(5, Math.round(mins)),
      risk: Math.max(10, Math.min(80, Math.round(risk)))
    });
  }
  return data;
}

const series = buildSeries(14);

function pctChange(currAvg: number, prevAvg: number) {
  if (!prevAvg) return 0;
  return Math.round(((currAvg - prevAvg) / prevAvg) * 100);
}

function useStats() {
  return useMemo(() => {
    const first7 = series.slice(0, 7);
    const last7 = series.slice(7);
    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    const minsPrev = avg(first7.map(d => d.minutes));
    const minsCurr = avg(last7.map(d => d.minutes));

    const formPrev = avg(first7.map(d => d.form));
    const formCurr = avg(last7.map(d => d.form));

    const insPrev = avg(first7.map(d => d.insulin));
    const insCurr = avg(last7.map(d => d.insulin));

    const riskPrev = avg(first7.map(d => d.risk));
    const riskCurr = avg(last7.map(d => d.risk));

    const healthLevel = Math.max(1, Math.min(100, Math.round((insCurr * 0.4 + formCurr * 0.35 + minsCurr * 0.25) - (riskCurr * 0.2))));

    return {
      minsPrev, minsCurr, formPrev, formCurr, insPrev, insCurr, riskPrev, riskCurr, healthLevel,
      minsDelta: pctChange(minsCurr, minsPrev),
      formDelta: pctChange(formCurr, formPrev),
      insDelta: pctChange(insCurr, insPrev),
      riskDelta: pctChange(riskPrev, riskCurr)
    };
  }, []);
}

type Segment = 'cue' | 'action' | 'reward' | 'reinforce';

const HabitLoop = ({ activeSegment, onSegmentClick }: { activeSegment: Segment, onSegmentClick: (segment: Segment) => void }) => {
  const segments: Segment[] = ['cue', 'action', 'reward', 'reinforce'];
  const paths: Record<Segment, string> = {
    cue: "M100 20 A80 80 0 0 1 180 100",
    action: "M180 100 A80 80 0 0 1 100 180",
    reward: "M100 180 A80 80 0 0 1 20 100",
    reinforce: "M20 100 A80 80 0 0 1 100 20",
  };
  const labelPositions: Record<Segment, string> = {
      cue: 'top-1/2 -translate-y-1/2 right-0 translate-x-1/2 mr-4',
      action: 'bottom-0 -translate-x-1/2 left-1/2 translate-y-1/2 mb-4',
      reward: 'top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 ml-4',
      reinforce: 'top-0 -translate-x-1/2 left-1/2 -translate-y-1/2 mt-4',
  }

  const segmentColors: Record<Segment, { inactive: string; active: string; glow: string }> = {
    cue: { inactive: '#52525b', active: 'url(#gradient-cue)', glow: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' },
    action: { inactive: '#52525b', active: 'url(#gradient-action)', glow: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' },
    reward: { inactive: '#52525b', active: 'url(#gradient-reward)', glow: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))' },
    reinforce: { inactive: '#52525b', active: 'url(#gradient-reinforce)', glow: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))' },
  };

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="gradient-cue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="gradient-action" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="gradient-reward" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="gradient-reinforce" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" stroke="#27272a" strokeWidth="20" fill="none" />
        {segments.map(seg => (
          <path
            key={seg}
            className="transition-all duration-500 cursor-pointer"
            d={paths[seg]}
            stroke={activeSegment === seg ? segmentColors[seg].active : segmentColors[seg].inactive}
            strokeWidth="20"
            fill="none"
            style={{
              filter: activeSegment === seg ? segmentColors[seg].glow : 'none',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={() => onSegmentClick(seg)}
          />
        ))}
      </svg>
       <div className="absolute inset-0 flex items-center justify-center">
          {segments.map((seg) => (
             <div key={seg} className={`absolute ${labelPositions[seg]}`}>
                <button
                    onClick={() => onSegmentClick(seg)}
                    className={`font-semibold text-base capitalize transition-all duration-300 px-4 py-2 rounded-xl ${
                        activeSegment === seg
                          ? 'text-white bg-white/10 backdrop-blur-sm shadow-lg scale-105'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 hover:scale-105'
                    }`}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {seg}
                </button>
             </div>
          ))}
       </div>
    </div>
  );
};

const Dot: React.FC<{ className?: string }> = ({ className = "" }) => <span className={`inline-block w-1.5 h-1.5 rounded-full ${className}`} />;

const CueItem: React.FC<{ icon: React.ElementType; title: string; desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10">
    <div className="mt-0.5 p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
      <Icon className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
    </div>
    <div className="text-sm flex-1">
      <div className="font-semibold text-white/90">{title}</div>
      <div className="text-white/60 mt-1 leading-relaxed">{desc}</div>
    </div>
  </div>
);

const ActionItem: React.FC<{ title: string; bullets: string[] }> = ({ title, bullets }) => (
  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <ul className="text-sm space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Dot className="bg-emerald-400 mt-2 shadow-sm shadow-emerald-400/50" />
            <span className="text-white/70 leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const RewardPill: React.FC<{ icon: React.ElementType; label: string; value: string; gradient: string }> = ({ icon: Icon, label, value, gradient }) => (
  <div className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r ${gradient} backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300 shadow-lg`}>
    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
    <div className="text-sm font-medium text-white">
      <span className="opacity-80">{label}:</span> <span className="font-semibold">{value}</span>
    </div>
  </div>
);

const ShareCard: React.FC<{ level: number; rate: number }> = ({ level, rate }) => (
  <Card className="bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10 backdrop-blur-md border-white/10 hover:shadow-2xl transition-all duration-500">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
          <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
        </div>
        <span className="font-semibold">Health Level</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-32 h-32 rotate-[-90deg]">
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="60" cy="60" r="52" stroke="#27272a" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="url(#progress-gradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${(1 - level / 100) * (2 * Math.PI * 52)}`}
              filter="url(#glow)"
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-3xl font-bold text-white">{level}</div>
              <div className="text-xs text-white/50 font-medium">of 100</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="text-sm text-white/60 font-medium">Improvement rate</div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
            </div>
            <span className="text-emerald-400 font-bold text-2xl">+{rate}%</span>
          </div>
          <div className="text-xs text-white/50 leading-relaxed">Last 7 vs prior 7 days</div>
          <div className="flex gap-2.5 pt-2">
            <Button size="sm" className="shadow-lg shadow-emerald-500/20">
              <Share2 className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Share
            </Button>
            <Button size="sm" variant="outline">Save</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CueContent = ({ remindersOn, setRemindersOn, booked, setBooked }: { remindersOn: boolean; setRemindersOn: (v: boolean) => void; booked: boolean; setBooked: (v: boolean) => void; }) => (
    <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <AlarmClock className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold">Smart reminders</span>
                </CardTitle>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 font-medium">Reminders</span>
                  <Switch checked={remindersOn} onCheckedChange={setRemindersOn} />
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 pt-0">
                <CueItem icon={Timer} title="After-meal timer" desc="Prompt a 4 to 6 minute metabolic snack when a meal is logged" />
                <CueItem icon={Watch} title="Sit timer" desc="45 minutes seated triggers a stand and move micro-set" />
                <CueItem icon={Moon} title="Low sleep score" desc="Offer gentle mobility mode on wake" />
                <CueItem icon={Zap} title="Streak at risk" desc="Show a nudge only inside a user-selected window" />
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Users className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold">Squad sessions</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-0">
                <div className="flex items-start gap-3 text-white/70">
                  <CalendarCheck2 className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
                  <div className="leading-relaxed">Squad windows with remote play. Invites flow to Apple or Google Calendar</div>
                </div>
                <div className="flex items-start gap-3 text-white/70">
                  <Users className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
                  <div className="leading-relaxed">Auto matchmaking for 2 to 4 players if a friend no-shows</div>
                </div>
                <div className="flex items-start gap-3 text-white/70">
                  <Trophy className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" strokeWidth={2.5} />
                  <div className="leading-relaxed">Bonus points when two or more complete in person</div>
                </div>
                <Button className="w-full mt-3 shadow-lg shadow-blue-500/20" onClick={() => setBooked(true)}>
                  {booked ? "Booked for 7:00 pm" : "Book a squad window"}
                </Button>
            </CardContent>
        </Card>
    </div>
);

const ActionContent = () => (
    <div className="grid md:grid-cols-2 gap-6">
        <ActionItem
          title="Micro-workouts that fit"
          bullets={[
            "2 to 6 minute strength or mobility snacks",
            "Anti-sit five: hinge, wall slides, calf pumps, thoracic rotations, split squat pulses",
            "Low-impact options for joint pain days"
          ]}
        />
        <ActionItem
          title="Form coaching"
          bullets={[
            "Pose tracking with green ticks for joints in range",
            "Tempo targets for safe speed and control"
          ]}
        />
        <ActionItem
          title="Breath and reset"
          bullets={["60 to 120 seconds of paced breathing before movement when stressed"]}
        />
        <ActionItem
          title="Social play"
          bullets={["Ghost race against your last session or a friend", "Co-op quests where reps combine to open a team chest"]}
        />
        <Card className="bg-white/5 backdrop-blur-md border-white/10 md:col-span-2 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Headphones className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
              </div>
              <span className="font-semibold">One tap start</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70 pt-0 leading-relaxed">
            Cached music and offline guidance. Resume at the exact rep where you paused
          </CardContent>
        </Card>
    </div>
);

const RewardContent = ({ stats }: { stats: ReturnType<typeof useStats>}) => (
    <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                  <Activity className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
                </div>
                <span className="font-semibold">In-game economy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="flex flex-wrap gap-3">
                <RewardPill icon={Coins} label="Fitty Points" value="+120 today" gradient="from-emerald-500/20 to-emerald-600/20" />
                <RewardPill icon={Sparkles} label="Soft Coins" value="1,560" gradient="from-blue-500/20 to-blue-600/20" />
                <RewardPill icon={Gift} label="Rare Tokens" value="2" gradient="from-purple-500/20 to-purple-600/20" />
                <RewardPill icon={Wallet} label="HealthCoins" value="$18.00" gradient="from-pink-500/20 to-pink-600/20" />
              </div>
              <ul className="text-sm space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <Dot className="bg-yellow-400 mt-2 shadow-sm shadow-yellow-400/50" />
                  <span className="text-white/70 leading-relaxed">Earn more for sessions inside booked windows and post-meal timing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Dot className="bg-yellow-400 mt-2 shadow-sm shadow-yellow-400/50" />
                  <span className="text-white/70 leading-relaxed">Weekly events drop Rare Tokens for premium cosmetics or streak freeze</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Dot className="bg-yellow-400 mt-2 shadow-sm shadow-yellow-400/50" />
                  <span className="text-white/70 leading-relaxed">Real-world perks include raffle entries, partner discounts, and campus privileges</span>
                </li>
              </ul>
              <div className="flex gap-2.5 pt-2">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/30">
                  Open loot box
                </Button>
                <Button variant="outline">Customize character</Button>
              </div>
            </CardContent>
        </Card>
        <ShareCard level={stats.healthLevel} rate={stats.insDelta} />
    </div>
);

const ReinforceContent = () => (
    <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                </div>
                <span className="font-semibold">Progress analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-0">
              <div className="h-52">
                <div className="text-xs mb-3 text-white/50 font-medium">Minutes moved per day</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series}>
                    <defs>
                      <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)"
                      }}
                    />
                    <Bar dataKey="minutes" fill="url(#bar-gradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-52">
                <div className="text-xs mb-3 text-white/50 font-medium">Form score and insulin sensitivity</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <defs>
                      <linearGradient id="line-form" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                      <linearGradient id="line-insulin" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <Legend wrapperStyle={{fontSize: "11px", color: "#a1a1aa"}}/>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)"
                      }}
                    />
                    <Line dataKey="form" stroke="url(#line-form)" strokeWidth={3} dot={false} name="Form" />
                    <Line dataKey="insulin" stroke="url(#line-insulin)" strokeWidth={3} dot={false} name="Insulin proxy" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-52 xl:col-span-2">
                <div className="text-xs mb-3 text-white/50 font-medium">Morbidity compression (lower is better)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="risk-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)"
                      }}
                    />
                    <Area dataKey="risk" stroke="#ef4444" strokeWidth={2} fill="url(#risk-gradient)" name="Risk" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Trophy className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                </div>
                <span className="font-semibold">Streaks & social</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-0">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-yellow-400" strokeWidth={2.5} />
                  <span className="text-white/80">Team streak</span>
                </div>
                <div className="font-semibold text-white">7 days</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-white/80">Grace day</span>
                </div>
                <div className="font-semibold text-white">1 available</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-pink-400" strokeWidth={2.5} />
                  <span className="text-white/80">Streak freeze</span>
                </div>
                <div className="font-semibold text-white">1 token</div>
              </div>
              <div className="pt-2 text-xs text-white/50 leading-relaxed">Share highlight reels with one tap. Leaderboards match by ability for fair play</div>
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <MessageSquare className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                </div>
                <span className="font-semibold">AI coach chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 w-fit max-w-md">
                    <span className="text-white/70 text-sm leading-relaxed">Short bursts improve insulin sensitivity within the same day. Try a 5 minute snack after lunch</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-emerald-500/30 w-fit ml-auto">
                    <span className="text-white/90 text-sm font-medium">Book me for 1 pm daily</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 w-fit max-w-md">
                    <span className="text-white/70 text-sm leading-relaxed">Booked. You'll get a gentle reminder five minutes before 1 pm</span>
                  </div>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="font-semibold mb-2 text-white/90">Personalized insights</div>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <Dot className="bg-emerald-400 mt-2 shadow-sm shadow-emerald-400/50" />
                      <span className="text-white/70 leading-relaxed">Mobility-first days after poor sleep</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Dot className="bg-emerald-400 mt-2 shadow-sm shadow-emerald-400/50" />
                      <span className="text-white/70 leading-relaxed">Low-impact twice a week based on pain diary</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Dot className="bg-emerald-400 mt-2 shadow-sm shadow-emerald-400/50" />
                      <span className="text-white/70 leading-relaxed">Two friends free at 7 pm tonight</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
        </Card>
    </div>
);

export default function FittyBehaviorLoops() {
  const stats = useStats();
  const [remindersOn, setRemindersOn] = useState(true);
  const [booked, setBooked] = useState(false);
  const [activeSegment, setActiveSegment] = useState<Segment>('cue');

  const contentMap = {
      cue: <CueContent {...{ remindersOn, setRemindersOn, booked, setBooked }} />,
      action: <ActionContent />,
      reward: <RewardContent stats={stats} />,
      reinforce: <ReinforceContent />,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Fitty Behavior Loops
            </h1>
            <p className="text-white/50 text-sm font-medium">Cue, Action, Reward, Reinforce brought to life</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>Health Level {stats.healthLevel}</Badge>
            <Badge variant="outline">+{stats.insDelta}% improvement</Badge>
          </div>
        </header>

        <main className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                <div className="lg:col-span-2 flex justify-center items-start py-10 lg:sticky lg:top-8">
                    <HabitLoop activeSegment={activeSegment} onSegmentClick={setActiveSegment} />
                </div>
                <div className="lg:col-span-3">
                    <div key={activeSegment} className="animate-fade-in">
                        {contentMap[activeSegment]}
                    </div>
                </div>
            </div>
        </main>

        <footer className="pt-12 text-xs text-white/40 text-center font-medium">
          Prototype for product visualization. Charts use sample data. Integrations for CGM, HRV, and calendars are represented as stubs
        </footer>
      </div>
    </div>
  );
}
