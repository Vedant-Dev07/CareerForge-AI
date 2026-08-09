import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";

export default function Interview() {
  return (
    <>
      <DashboardHeader title="AI mock interview" subtitle="Personalized interview questions will appear after you set up your profile." />

      <Panel className="p-8 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">MOCK INTERVIEW</div>
        <p className="text-base font-bold mb-6">
          Complete your profile to receive a tailored interview question.
        </p>
        <Button icon={false}>Prepare now</Button>
      </Panel>

      <Panel className="p-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-5">EVALUATION</div>
        <p className="text-sm text-muted leading-relaxed">
          Interview results will be available once you complete the mock interview.
        </p>
      </Panel>
    </>
  );
}
