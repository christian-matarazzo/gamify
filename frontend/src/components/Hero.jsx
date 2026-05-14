import { Link } from "react-router-dom";
import "../styles/Hero.css";

const slides = [
  {
    img: "/img/hero.webp",
    alt: "The Blood of Dawnwalker",
    eyebrow: "Preorder",
    title: <>The Blood of <br className="mobile-br" />Dawnwalker</>,
    subtitle: "You play as Coen, human by day and vampire by night, fighting to save your family in a story shaped by your actions and the secrets you uncover.",
    link: "/games/the-blood-of-dawnwalker",
    cta: "Preorder now!",
  },
  {
    img: "/img/hero2.webp",
    alt: "Secondo gioco",
    eyebrow: "Trending",
    title: <>Call of Duty <br className="mobile-br" />Black Ops 7</>,
    subtitle: "The year is 2035 and the world is on the brink of chaos, ravaged by violent conflict and psychological warfare. David Mason leads an elite JSOC team on a covert mission to the sprawling Mediterranean city of Avalon. While there, they discover a sophisticated plot that won’t just plunge the world into chaos, it will pull them into their own haunting pasts.",
    link: "/games/call-of-duty-black-ops-7",
    cta: "Buy now!",
  },
  {
    img: "/img/hero3.jpg",
    alt: "Forza Horizon 6",
    eyebrow: "Coming soon",
    title: <>Forza Horizon<br className="mobile-br" /></>,
    subtitle: "Forza Horizon 6 is about to mark PC's biggest release of 2026 thus far, with the sixth iteration of the Forza Horizon series taking players to open-world Japan later this month.",
    link: "/games/forza-horizon-6",
    cta: "Preorder now!",
  },
];

export default function Hero() {
  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="5000"
    >

      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={i} className={`carousel-item${i === 0 ? " active" : ""}`}>
            <section className="hero">
              <img
                src={slide.img}
                alt={slide.alt}
                className="hero_img"
              />
              <div className="hero_overlay d-flex align-items-center">
                <div className="hero_content px-4 px-md-5">
                  <p className="hero_eyebrow">{slide.eyebrow}</p>
                  <h1 className="hero_title">{slide.title}</h1>
                  <p className="hero_subtitle">{slide.subtitle}</p>
                  <Link to={slide.link}>
                    <button className="hero_cta btn">
                      <span>{slide.cta}</span>
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}