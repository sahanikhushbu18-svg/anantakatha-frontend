import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BrandMark } from './BrandMark';
import { Button } from './UI';
import { clearAuth } from '../store/authSlice';
import { authApi } from '../api/auth';

const appNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stories', label: 'Stories' },
  { to: '/generate', label: 'Generate' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
];

const publicRoutes = ['/', '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/privacy-policy', '/terms', '/data-policy'];

export const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector((state) => state.auth);
  const isAdmin = user?.userType === 'ADMIN';
  const navigate = useNavigate();
  // Treat the landing route as internal when authenticated so logged-in users see the app nav
  const isPublicRoute = !(status === 'authenticated') && publicRoutes.includes(location.pathname);
  const showAppNav = status === 'authenticated' && !isPublicRoute;
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearAuth());
      // after logout, navigate to the public home to avoid leaving users on invalid pages
      navigate('/');
    }
  };


  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand-row">
            <Link to="/" className="brand-link" onClick={closeMobileMenu}>
              <BrandMark compact />
            </Link>

            <button
              className="hamburger"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              type="button"
            >
              ☰
            </button>
          </div>

          <div className={`topbar-menu ${mobileOpen ? 'mobile-open' : ''}`}>
            {showAppNav ? (
              <nav className="nav-links">
                {appNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`.trim()} onClick={closeMobileMenu}>
                    {item.label}
                  </NavLink>
                ))}
                {isAdmin ? (
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`.trim()} onClick={closeMobileMenu}>
                    Admin
                  </NavLink>
                ) : null}
              </nav>
            ) : (
              <nav className="topbar-public-links">
                <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
                <NavLink to="/published" onClick={closeMobileMenu}>Published</NavLink>
                <NavLink to="/privacy-policy" onClick={closeMobileMenu}>Privacy</NavLink>
                <NavLink to="/terms" onClick={closeMobileMenu}>Terms</NavLink>
              </nav>
            )}

            <div className="topbar-actions">
            {status === 'authenticated' ? (
              <>
                <span className="topbar-user">{user?.firstName || user?.email || 'Reader'}</span>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link className="button ghost" to="/login" onClick={closeMobileMenu}>Login</Link>
                <Link className="button primary" to="/signup" onClick={closeMobileMenu}>Create account</Link>
              </>
            )}
            </div>
          </div>
        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <BrandMark compact />
            <p>AI storytelling, publishing, and moderation in one secure platform.</p>
          </div>

          <div className="site-footer-links">
            <div>
              <h6 className="footer-title">Explore</h6>
              <ul className="footer-links">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/data-policy">User Data Policy</Link></li>
              </ul>
            </div>

            <div>
              <h6 className="footer-title">Contact</h6>
              <ul className="footer-links">
                <li><a href="mailto:support@anantakatha.in">support@anantakatha.in</a></li>
                <li><a href="tel:+917398591393">7398591393</a></li>
                <li>Sec 5, GIDA, Gorakhpur, Uttar Pradesh 273209</li>
              </ul>
            </div>

            <div>
              <h6 className="footer-title">Legal</h6>
              <p className="footer-note">All rights reserved by AnantaKatha team. Made in India with care.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
