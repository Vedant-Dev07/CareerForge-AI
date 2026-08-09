import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import Button from "@/components/ui/button";

export default function Interview() {
  return (
    <>
      <DashboardHeader title="AI mock interview" subtitle="Role: Data Analyst · Type: Technical · Difficulty: Intermediate" />

      <Panel className="p-8 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">QUESTION 1</div>
        <p className="text-base font-bold mb-6">
          Explain the difference between INNER JOIN and LEFT JOIN.
        </p>
        <textarea
          rows={5}
          className="w-full bg-navy border border-line px-4 py-3 text-sm focus:outline-none focus:border-cyan resize-none mb-4"
          placeholder="Type your answer..."
        />
        <Button icon={false}>Submit answer</Button>
      </Panel>

      <Panel className="p-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-5">ANSWER EVALUATION</div>
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <ScoreBar label="Relevance" value={85} accent="#4FD1C5" />
          <ScoreBar label="Technical accuracy" value={78} />
          <ScoreBar label="Completeness" value={74} accent="#4FD1C5" />
          <ScoreBar label="Communication" value={82} />
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 mb-4">
          <span className="text-sm text-muted">Overall score</span>
          <span className="text-2xl font-black font-mono text-forge">80%</span>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Your explanation is relevant, but include a practical example to
          make the answer stronger.
        </p>
      </Panel>
    </>
  );
}
