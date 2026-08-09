import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";

export default function Profile() {
  return (
    <>
      <DashboardHeader title="Profile" subtitle="Personal information, education, skills and career interests." />

      <div className="space-y-5">
        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">EDUCATION</div>
          <p className="text-sm text-muted leading-relaxed">
            Complete onboarding to add your college, degree, year, and academic details.
          </p>
        </Panel>

        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">SKILLS</div>
          <p className="text-sm text-muted leading-relaxed">
            Add your skills to see your strengths and gaps reflected here.
          </p>
        </Panel>

        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">CAREER GOAL</div>
          <p className="text-sm text-muted leading-relaxed">
            Set a target role and career interests to personalize recommendations.
          </p>
        </Panel>

        <Button icon={false}>Edit profile</Button>
      </div>
    </>
  );
}
