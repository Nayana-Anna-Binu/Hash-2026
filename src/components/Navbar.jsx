import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu, X, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../../images/hash-logo.png';
import Modal from './Modal.jsx';

const links = [
  ['Home', '/'],
  ['Events', '/events'],
  ['Register', '/register'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact']
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitorName, setVisitorName] = useState(() => sessionStorage.getItem('techfest_user') || '');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const saveVisitorName = event => {
    event.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    sessionStorage.setItem('techfest_user', name);
    setVisitorName(name);
    setNameInput('');
    setNameDialogOpen(false);
  };

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="TechFest home">
          <img src={logo} alt="" />
          <span>TECHFEST<span className="brand-year">’26</span></span>
        </Link>
        <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={({ isActive }) => `cart-link ${isActive ? 'active' : ''}`} aria-label={`Cart, ${itemCount} items`}>
            <ShoppingBag size={18} /> Cart <span className="cart-badge">{itemCount}</span>
          </NavLink>
        </nav>
        <button className={`welcome-chip ${visitorName ? 'has-name' : ''}`} type="button" onClick={() => setNameDialogOpen(true)}>
          <UserRound size={15} /> {visitorName ? `Welcome, ${visitorName}!` : 'Add your name'}
        </button>
        <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
      {nameDialogOpen && <Modal title={visitorName ? 'Update your greeting' : 'Welcome to TechFest'} onClose={() => setNameDialogOpen(false)}>
        <form className="welcome-form" onSubmit={saveVisitorName}>
          <p>Your name stays in this browser tab for your visit.</p>
          <label className="form-field" htmlFor="visitorName">What should we call you?<input id="visitorName" autoFocus maxLength={60} value={nameInput} onChange={event => setNameInput(event.target.value)} placeholder="Your name" /></label>
          <button className="button button-primary button-full" type="submit" disabled={!nameInput.trim()}>Save my greeting</button>
        </form>
      </Modal>}
    </header>
  );
}
