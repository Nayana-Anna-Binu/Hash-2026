import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Countdown from '../components/Countdown.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useFetchEvents from '../hooks/useFetchEvents.js';

const highlights = [
  { title: 'Make the impossible, possible.', text: 'A 24-hour build challenge for teams who would rather make the future than wait for it.', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Code Sprint · Oct 12' },
  { title: 'Ideas deserve a real arena.', text: 'Build a bot, bring your nerve, and meet us where robotics gets loud.', image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'RoboWars · Oct 12' },
  { title: 'Three days. One electric finish.', text: 'Join a campus full of builders, dreamers, and people who ask what if.', image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'TechFest Live · Oct 14' }
];

export default function Home() {
  const { events, loading, error, retry } = useFetchEvents();
  const [activeSlide, setActiveSlide] = useState(0);
  const featured = events.find(event => event.id === 'code-sprint');

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> 12—14 OCTOBER 2026 · CALICUT, INDIA</div>
          <h1>Curiosity<br />looks good <span>on you.</span></h1>
          <p className="hero-lede">Three days of ideas in motion. Build something wild, learn something new, find your people.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/events">Explore events <ArrowRight size={17} /></Link>
            <Link className="text-link" to="/register">Get your pass <ArrowUpRight size={16} /></Link>
          </div>
          <div className="hero-proof"><span className="proof-avatars"><i>H</i><i>✦</i><i>+</i></span><span><strong>1,200+</strong> curious minds, one campus</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" style={{ backgroundImage: `url("${highlights[activeSlide].image}")` }} />
          <div className="hero-image-shade" />
          <div className="hero-image-caption"><span><Sparkles size={15} /> FEATURED MOMENT</span><strong>{highlights[activeSlide].label}</strong></div>
          <div className="hero-slide-controls" aria-label="Featured events carousel">
            {highlights.map((slide, index) => <button key={slide.title} type="button" className={activeSlide === index ? 'slide-dot active' : 'slide-dot'} aria-label={`Show slide ${index + 1}`} onClick={() => setActiveSlide(index)} />)}
            <button type="button" className="slide-next" aria-label="Next featured event" onClick={() => setActiveSlide(index => (index + 1) % highlights.length)}><ArrowRight size={17} /></button>
          </div>
        </div>
        <div className="hero-index">01 <span>/</span> 03</div>
      </section>

      <section className="countdown-section">
        <div className="container countdown-inner">
          <div><span className="eyebrow">THE COUNTDOWN IS ON</span><h2>See you in the future.</h2></div>
          <Countdown />
        </div>
      </section>

      <section className="section container home-featured">
        <div className="section-heading">
          <div><span className="eyebrow">PICK YOUR ADVENTURE</span><h2>Made for the <span>what-ifs.</span></h2></div>
          <Link to="/events" className="text-link">All events <ArrowUpRight size={16} /></Link>
        </div>
        {loading && <LoadingSpinner label="Finding your next favorite event" />}
        {error && <ErrorMessage message={error} onRetry={retry} />}
        {!loading && !error && featured && <div className="featured-event"><EventCard event={featured} featured /><div className="featured-note"><span>YOUR NEXT BIG IDEA STARTS HERE</span><h3>{highlights[activeSlide].title}</h3><p>{highlights[activeSlide].text}</p><Link className="text-link" to={`/register/${featured.id}`}>Meet us there <ArrowRight size={16} /></Link></div></div>}
      </section>

      <section className="manifesto">
        <div className="container manifesto-inner"><span className="eyebrow">NOT JUST ANOTHER TECH FEST</span><p>Come as you are.<br />Leave as <span>what’s next.</span></p><Link className="button button-light" to="/gallery">Feel the energy <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}
