import Nav from "@/components/Nav";
import BuildQuiz from "@/components/BuildQuiz";

export const metadata = {
  title: "Build Your AI - Limitless",
  description:
    "Answer a few quick questions about your business and see exactly what AI we'd build for you.",
};

export default function BuildPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section build-section">
          <div className="wrap">
            <BuildQuiz />
          </div>
        </section>
      </main>
    </>
  );
}
