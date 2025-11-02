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
  let insulin = 58; // proxy score
  let form = 72;
  let mins = 16;
  let risk = 38; // morbidity risk proxy, lower is better
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // small random walk with gentle improvement
    insulin += Math.random() * 2 - 0.3; // slight uptrend
    form += Math.random() * 2 - 0.2;
    mins += Math.random() * 6 - 0.8;
    risk += Math.random() * 2 - 0.9; // slight downtrend
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

    // Health Level: composite of positive metrics minus risk
    const healthLevel = Math.max(1, Math.min(100, Math.round((insCurr * 0.4 + formCurr * 0.35 + minsCurr * 0.25) - (riskCurr * 0.2))));

    return {
      minsPrev, minsCurr, formPrev, formCurr, insPrev, insCurr, riskPrev, riskCurr, healthLevel,
      minsDelta: pctChange(minsCurr, minsPrev),
      formDelta: pctChange(formCurr, formPrev),
      insDelta: pctChange(insCurr, insPrev),
      riskDelta: pctChange(riskPrev, riskCurr) // risk down is good, we show as reduction
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

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="80" stroke="#3f3f46" strokeWidth="20" fill="none" />
        {segments.map(seg => (
          <path
            key={seg}
            className="transition-all duration-300"
            d={paths[seg]}
            stroke={activeSegment === seg ? '#34d399' : '#52525b'}
            strokeWidth="20"
            fill="none"
          />
        ))}
      </svg>
       <div className="absolute inset-0 flex items-center justify-center">
          {segments.map((seg) => (
             <div key={seg} className={`absolute ${labelPositions[seg]}`}>
                <button
                    onClick={() => onSegmentClick(seg)}
                    className={`font-bold text-lg capitalize transition-colors duration-300 p-2 rounded-lg ${
                        activeSegment === seg ? 'text-emerald-300' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                    {seg}
                </button>
             </div>
          ))}
       </div>
    </div>
  );
};


const Dot: React.FC<{ className?: string }> = ({ className = "" }) => <span className={`inline-block w-2 h-2 rounded-full ${className}`} />;

const CueItem: React.FC<{ icon: React.ElementType; title: string; desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
    <div className="mt-0.5 p-2 rounded-lg bg-neutral-800">
      <Icon className="w-5 h-5 text-emerald-300" />
    </div>
    <div className="text-sm">
      <div className="font-semibold">{title}</div>
      <div className="text-neutral-300 mt-0.5 leading-snug">{desc}</div>
    </div>
  </div>
);

const ActionItem: React.FC<{ title: string; bullets: string[] }> = ({ title, bullets }) => (
  <Card className="bg-neutral-900/70 border-neutral-800">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <ul className="text-sm space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2"><Dot className="bg-emerald-400 mt-2" /><span>{b}</span></li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const RewardPill: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/70 border border-neutral-800">
    <Icon className="w-4 h-4 text-yellow-300" />
    <div className="text-sm"><span className="font-semibold">{label}: </span>{value}</div>
  </div>
);

const ShareCard: React.FC<{ level: number; rate: number }> = ({ level, rate }) => (
  <Card className="bg-gradient-to-br from-emerald-900/40 to-neutral-900 border-neutral-800">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-300" />Health Level</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 120 120" className="w-28 h-28 rotate-[-90deg]">
            <circle cx="60" cy="60" r="52" stroke="#3f3f46" strokeWidth="12" fill="none" />
            <circle cx="60" cy="60" r="52" stroke="#34d399" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${(1 - level / 100) * (2 * Math.PI * 52)}`} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div className="text-2xl font-bold">{level}</div>
            <div className="text-xs text-neutral-300">out of 100</div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-sm">Improvement rate (last 7 vs prior 7)</div>
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-lg"><TrendingUp className="w-5 h-5" />{rate}%</div>
          <div className="text-xs text-neutral-300">Share this card to socials to show steady progress</div>
          <div className="flex gap-2 pt-1">
            <Button size="sm"><Share2 className="w-4 h-4 mr-2" />Share</Button>
            <Button size="sm" variant="outline">Save</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);


const CueContent = ({ remindersOn, setRemindersOn, booked, setBooked }: { remindersOn: boolean; setRemindersOn: (v: boolean) => void; booked: boolean; setBooked: (v: boolean) => void; }) => (
    <div className="space-y-6">
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                <AlarmClock className="w-5 h-5 text-emerald-300" />Smart reminders
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-300">Reminders</span>
                <Switch checked={remindersOn} onCheckedChange={setRemindersOn} />
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 pt-0">
                <CueItem icon={Timer} title="After-meal timer" desc="Prompt a 4 to 6 minute metabolic snack when a meal is logged or CGM confirms a meal window" />
                <CueItem icon={Watch} title="Sit timer" desc="45 minutes seated triggers a stand and move micro-set" />
                <CueItem icon={Moon} title="Low sleep score" desc="Offer gentle mobility mode on wake" />
                <CueItem icon={Zap} title="Streak at risk" desc="Show a nudge only inside a user-selected window" />
            </CardContent>
        </Card>
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-300" />Booked sessions with friends
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-0">
                <div className="flex items-start gap-3">
                <CalendarCheck2 className="w-5 h-5 mt-0.5 text-emerald-300" />
                <div>Squad windows with remote play. Invites flow to Apple or Google Calendar with RSVP</div>
                </div>
                <div className="flex items-start gap-3">
                <Users className="w-5 h-5 mt-0.5 text-emerald-300" />
                <div>Auto matchmaking for 2 to 4 players if a friend no-shows after 60 seconds</div>
                </div>
                <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 mt-0.5 text-emerald-300" />
                <div>Bonus points when two or more complete the session in person</div>
                </div>
                <Button className="w-full mt-2" onClick={() => setBooked(true)}>{booked ? "Booked for 7:00 pm" : "Book a squad window"}</Button>
            </CardContent>
        </Card>
    </div>
);

const ActionContent = () => (
    <div className="grid md:grid-cols-2 gap-6">
        <ActionItem
        title="Micro-workouts that always fit"
        bullets={[
            "2 to 6 minute strength or mobility snacks with one corrective cue",
            "Anti-sit five: hinge, wall slides, calf pumps, thoracic rotations, split squat pulses",
            "Low-impact options for joint pain days"
        ]}
        />
        <ActionItem
        title="Form coaching"
        bullets={[
            "Pose tracking with green ticks for joints in range and one audible cue if off-track",
            "Tempo targets for safe speed and eccentric control"
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
        <Card className="bg-neutral-900/70 border-neutral-800 md:col-span-2">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Headphones className="w-5 h-5 text-emerald-300" />One tap start</CardTitle>
        </CardHeader>
        <CardContent className="text-sm pt-0">
            Cached music and offline guidance. Resume at the exact rep where you paused
        </CardContent>
        </Card>
    </div>
);

const RewardContent = ({ stats }: { stats: ReturnType<typeof useStats>}) => (
    <div className="space-y-6">
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-300" />In-game economy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
            <div className="flex flex-wrap gap-3">
                <RewardPill icon={Coins} label="Fitty Points" value="+120 today" />
                <RewardPill icon={Sparkles} label="Soft Coins" value="1,560" />
                <RewardPill icon={Gift} label="Rare Tokens" value="2" />
                <RewardPill icon={Wallet} label="HealthCoins" value="$18.00 this month" />
            </div>
            <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2"><Dot className="bg-yellow-300 mt-2" />Earn more for sessions inside booked windows and for post-meal timing verified by CGM</li>
                <li className="flex items-start gap-2"><Dot className="bg-yellow-300 mt-2" />Weekly skill trials and events drop Rare Tokens that you can use for premium cosmetics or a streak freeze</li>
                <li className="flex items-start gap-2"><Dot className="bg-yellow-300 mt-2" />Real-world perks include monthly raffle entries, partner discounts, and campus privileges</li>
            </ul>
            <div className="flex gap-2 pt-2">
                <Button className="bg-yellow-600 hover:bg-yellow-500">Open loot box</Button>
                <Button variant="outline">Customize character</Button>
            </div>
            </CardContent>
        </Card>
        <ShareCard level={stats.healthLevel} rate={stats.insDelta} />
    </div>
);

const ReinforceContent = () => (
    <div className="space-y-6">
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-300" />Progress graphs that matter</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-0">
            <div className="h-52">
                <div className="text-xs mb-2 text-neutral-300">Minutes moved per day</div>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="day" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: "0.5rem" }} />
                    <Bar dataKey="minutes" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="h-52">
                <div className="text-xs mb-2 text-neutral-300">Form score and insulin sensitivity proxy</div>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="day" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Tooltip contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: "0.5rem" }} />
                    <Line dataKey="form" stroke="#93c5fd" strokeWidth={2} dot={false} name="Form" />
                    <Line dataKey="insulin" stroke="#34d399" strokeWidth={2} dot={false} name="Insulin proxy" />
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="h-52 xl:col-span-2">
                <div className="text-xs mb-2 text-neutral-300">Morbidity compression proxy (lower is better)</div>
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                    <defs>
                    <linearGradient id="risk" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="day" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a3a3a3" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: "0.5rem" }} />
                    <Area dataKey="risk" stroke="#ef4444" fill="url(#risk)" name="Risk" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </CardContent>
        </Card>
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-emerald-300" />Social and streaks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-0">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-300" /><span>Team streak</span></div>
                <div className="font-semibold">7 days</div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-300" /><span>Grace day</span></div>
                <div className="font-semibold">1 available</div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2"><Gift className="w-4 h-4 text-pink-300" /><span>Streak freeze</span></div>
                <div className="font-semibold">1 token</div>
            </div>
            <div className="pt-1 text-xs text-neutral-300">Share highlight reels to social media with one tap. Leaderboards match by ability band for fair play</div>
            </CardContent>
        </Card>
        <Card className="bg-neutral-900/70 border-neutral-800">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-300" />Chatbox friend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 w-fit max-w-md">Coach: Short bursts improve insulin sensitivity within the same day. Try a 5 minute snack after lunch</div>
                <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-800 w-fit ml-auto">You: Book me for 1 pm daily</div>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 w-fit max-w-md">Coach: Booked. You will get a gentle reminder five minutes before 1 pm</div>
                </div>
                <div className="space-y-2 text-sm">
                <div className="font-semibold mb-1">Personalized tips</div>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2"><Dot className="bg-emerald-400 mt-2" />Based on onboarding, mobility-first days are recommended after poor sleep</li>
                    <li className="flex items-start gap-2"><Dot className="bg-emerald-400 mt-2" />Pain diary suggests low-impact options twice a week</li>
                    <li className="flex items-start gap-2"><Dot className="bg-emerald-400 mt-2" />Two friends are free at 7 pm tonight, squad window available</li>
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
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Fitty Behavior Loops</h1>
            <p className="text-neutral-300 mt-1">Cue, Action, Reward, Reinforce brought to life for the web</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>Health Level {stats.healthLevel}</Badge>
            <Badge variant="outline">Improvement {stats.insDelta}%</Badge>
          </div>
        </header>

        <main className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 flex justify-center items-start py-8 lg:sticky lg:top-8">
                    <HabitLoop activeSegment={activeSegment} onSegmentClick={setActiveSegment} />
                </div>
                <div className="lg:col-span-3">
                    <div key={activeSegment} className="animate-fade-in">
                        {contentMap[activeSegment]}
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="pt-10 text-xs text-neutral-400 text-center">Prototype for product visualization. Charts use sample data. Integrations for CGM, HRV, and calendars are represented as stubs</footer>
      </div>
    </div>
  );
}
