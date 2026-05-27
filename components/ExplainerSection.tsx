export default function ExplainerSection() {
  const spokes = [
    { label: "QuickBooks", angle: 0 },
    { label: "Google", angle: 51 },
    { label: "HubSpot", angle: 103 },
    { label: "Square", angle: 154 },
    { label: "Canva", angle: 206 },
    { label: "DocuSign", angle: 257 },
    { label: "PayPal", angle: 309 },
  ];

  const features = [
    {
      title: "Learns Your Business",
      desc: "Olivia adapts to your patterns — your invoice language, your scheduling preferences, your customer follow-up style.",
    },
    {
      title: "Works While You Sleep",
      desc: "24/7 automation. Invoices go out on time. Appointments get confirmed. Reviews get requested. Nothing falls through the cracks.",
    },
    {
      title: "Connects Everything",
      desc: "One hub for all your tools. QuickBooks, Google, Square, HubSpot — Olivia pulls them together so you don't have to switch between apps.",
    },
    {
      title: "You Stay in Control",
      desc: "Approve actions one by one or let Olivia run autonomously. Set your comfort level and adjust anytime. Your business, your rules.",
    },
  ];

  return (
    <div className="explainer-hub">
      <div className="hub-diagram">
        <div className="hub-center">Olivia</div>
        {spokes.map((spoke, i) => {
          const radius = 155;
          const rad = (spoke.angle * Math.PI) / 180;
          const x = 50 + (radius / 210) * 50 * Math.cos(rad);
          const y = 50 + (radius / 210) * 50 * Math.sin(rad);
          return (
            <div
              className="hub-spoke"
              key={i}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {spoke.label}
            </div>
          );
        })}
      </div>
      <div className="explainer-features">
        {features.map((feat, i) => (
          <div className="explainer-feature" key={i}>
            <div className="explainer-feature-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 1v16M1 9h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
