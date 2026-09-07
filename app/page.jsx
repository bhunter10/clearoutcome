import { BetaOptInForm } from "../components/BetaOptInForm";

export default function HomePage() {
  return (
    <>
      <header className="site-header" aria-label="ClearOutcome home">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand-mark" href="/" aria-label="ClearOutcome">
            <img src="/clearoutcome-wordmark.png" alt="ClearOutcome" />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <h1 id="home-title">C.L.E.A.R. First - Leverage Follows</h1>
            <p className="tagline">The Divorce Negotiation Preparation System</p>
          </div>

          <BetaOptInForm />
        </section>

        <section className="contact-band" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title">ClearOutcome LLC</h2>
          </div>
          <address>
            <a href="mailto:team@clearoutcome.com">team@clearoutcome.com</a>
            <a href="tel:+18018022222">801-802-2222</a>
            <span>1145 S. 800 E., Orem, UT 84097</span>
          </address>
        </section>
      </main>

      <Footer />
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <strong>ClearOutcome is an educational and self-help platform, not a law firm.</strong>{" "}
        Using this site, its tools, or its materials does not create an attorney-client
        relationship and is not legal, tax, or financial advice. Content currently
        reflects Utah law, which differs by state and changes over time - consult a
        licensed attorney, tax, or financial professional in your jurisdiction before
        acting. No specific outcome is guaranteed or implied.
      </p>
      <p className="footer-links">
        <span>&copy; 2026 ClearOutcome LLC</span>
        <a href="#full-disclaimer">Full Disclaimer</a>
        <a href="#terms">Terms</a>
        <a href="#privacy">Privacy</a>
      </p>
    </footer>
  );
}
