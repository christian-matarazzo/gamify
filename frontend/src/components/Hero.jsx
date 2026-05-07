import { Link } from "react-router-dom";
import "../styles/Hero.css";


export default function Hero({ game }) {
  return (
    <section className="hero">
      <img
        src="/img/hero.webp"
        alt="Hero"
        className="hero_img"
      />
      <div className="hero_overlay d-flex align-items-center">
        <div className="hero_content px-4 px-md-5">
          <p className="hero_eyebrow">Preorder</p>
          <h1 className="hero_title">
            The Blood of <br className="mobile-br" />Dawnwalker
          </h1>
          <p className="hero_subtitle">
            You play as Coen, human by day and vampire by night, fighting to save your family in a story shaped by your actions and the secrets you uncover.
          </p>
          <Link to="/games/the-blood-of-dawnwalker">
            <button className="hero_cta btn">
              <span>Discover now!</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}