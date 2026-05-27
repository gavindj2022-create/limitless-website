import CheckIcon from "./icons/CheckIcon";

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

export default function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  featured = false,
  badge,
}: PricingCardProps) {
  return (
    <div className={`pricing-card${featured ? " featured" : ""}`}>
      {badge && <span className="pricing-badge">{badge}</span>}
      <span className="pricing-tier">{tier}</span>
      <div className="pricing-price">
        <span className="pricing-amount">{price}</span>
        <span className="pricing-period">{period}</span>
      </div>
      <p className="pricing-desc">{description}</p>
      <div className="pricing-divider" />
      <div className="pricing-features">
        {features.map((feature, i) => (
          <div className="pricing-feature" key={i}>
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <a
        href="#"
        className={`btn ${featured ? "btn-primary" : "btn-ghost"}`}
      >
        {cta}
      </a>
    </div>
  );
}
