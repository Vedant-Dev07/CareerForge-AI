import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const recommendations = [
  { role: "Software Engineer", fit: "92%", proof: "Strong match with your coding and problem-solving profile." },
  { role: "Frontend Developer", fit: "87%", proof: "Aligned with your UI, product, and design interests." },
  { role: "Data Analyst", fit: "81%", proof: "Great fit if you strengthen SQL and visualization skills." },
];

export default function Career() {
  return (
    <>
      <DashboardHeader title="Career recommendations" subtitle="Your profile is now shaping a tailored placement path." />

      <Panel className="p-6 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-3">AI MATCHING</div>
        <p className="text-sm text-muted leading-relaxed">
          The dashboard has identified the best-fitting roles for your background, interests, and current readiness level.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((item) => (
          <Panel key={item.role} className="p-5 rounded-2xl">
            <div className="text-xs tracking-widest text-cyan font-mono mb-2">{item.fit} FIT</div>
            <div className="font-bold mb-2">{item.role}</div>
            <p className="text-sm text-muted leading-relaxed">{item.proof}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
