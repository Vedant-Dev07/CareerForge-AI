import Panel from "@/components/ui/panel";
import Gauge from "@/components/ui/gauge";
import ScoreBar from "@/components/ui/score-bar";

export default function ReadinessPanel() {
  return (
    <Panel className="rounded-2xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.2em] text-cyan font-mono">PLACEMENT READINESS</div>
          <h2 className="mt-2 text-xl font-black text-ink">Momentum snapshot</h2>
        </div>
        <div className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          On track
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <Gauge value={78} />
        </div>
        <div className="flex-1 w-full space-y-4">
          <ScoreBar label="Career fit" value={92} accent="#2563EB" />
          <ScoreBar label="Resume" value={84} />
          <ScoreBar label="Skills" value={76} accent="#16A34A" />
          <ScoreBar label="Interview" value={71} />
        </div>
      </div>
    </Panel>
  );
}
