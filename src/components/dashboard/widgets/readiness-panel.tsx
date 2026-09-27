import Panel from "@/components/ui/panel";
import Gauge from "@/components/ui/gauge";
import ScoreBar from "@/components/ui/score-bar";

type ReadinessPanelProps = {
  readiness: {
    overallScore: number;
    metrics: {
      career: { score: number };
      skills: { score: number };
      resume: { score: number };
      aptitude: { score: number };
      interview: { score: number };
      learning: { score: number };
    };
  } | null;
};

export default function ReadinessPanel({ readiness }: ReadinessPanelProps) {
  const metrics = readiness?.metrics;
  return (
    <Panel className="rounded-2xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.2em] text-cyan font-mono">PLACEMENT READINESS</div>
          <h2 className="mt-2 text-xl font-black text-ink">Momentum snapshot</h2>
        </div>
        <div className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
          Persisted metrics
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <Gauge value={readiness?.overallScore ?? 0} />
        </div>
        <div className="flex-1 w-full space-y-4">
          <ScoreBar label="Career match" value={metrics?.career.score ?? 0} accent="#2563EB" />
          <ScoreBar label="Technical skills" value={metrics?.skills.score ?? 0} accent="#16A34A" />
          <ScoreBar label="Resume" value={metrics?.resume.score ?? 0} />
          <ScoreBar label="Aptitude" value={metrics?.aptitude.score ?? 0} accent="#2563EB" />
          <ScoreBar label="Interview" value={metrics?.interview.score ?? 0} accent="#F59E0B" />
          <ScoreBar label="Learning progress" value={metrics?.learning.score ?? 0} accent="#4F46E5" />
        </div>
      </div>
    </Panel>
  );
}
