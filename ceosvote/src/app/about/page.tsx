import AppHeader from "@/components/AppHeader";

const aboutMembers = [
  {
    part: "FE",
    names: "구민교, 이윤서",
  },
  {
    part: "BE",
    names: "최우혁, 황신애",
  },
];

export default function AboutPage() {
  return (
    <div className="app-page">
      <div className="app-container app-page-stack about-page-stack">
        <AppHeader />

        <main className="about-main" aria-labelledby="about-title">
          <section className="about-card" aria-label="ABOUT US">
            <h1 id="about-title" className="about-logo">
              CEOS VOTE
            </h1>

            <div className="about-member-list">
              {aboutMembers.map((member) => (
                <p key={member.part} className="about-member-row">
                  <span className="about-member-part">{member.part}:</span>
                  <span className="about-member-names">{member.names}</span>
                </p>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
