import Panel from "@/components/ui/panel";
import Gauge from "@/components/ui/gauge";
import ScoreBar from "@/components/ui/score-bar";

export default function ReadinessPanel() {
  return (
    <Panel className="p-6 rounded-2xl">
      <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-cyan font-mono mb-4">
        <span>PLACEMENT READINESS</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <Gauge value={78} />
        </div>
        <div className="flex-1 w-full space-y-4">
          <ScoreBar label="Career fit" value={92} accent="#4FD1C5" />
          <ScoreBar label="Resume" value={84} />
          <ScoreBar label="Skills" value={76} accent="#4FD1C5" />
          <ScoreBar label="Interview" value={71} />
        </div>
      </div>
    </Panel>
  );
}
