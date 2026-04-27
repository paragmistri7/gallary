"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import logo from "../Assets/images/logo.png";
import { clearLoginUserData } from "../redux/loginDataSlice";

/* ─── Inline style objects ──────────────────────────────────────────
   All structural/layout styles are inline so nothing in your project
   can accidentally override them.
   ──────────────────────────────────────────────────────────────────── */

const S = {
  header: {
    position: "sticky",
    top: 0,
    left: 0,
    width: "100%",
    height: "64px",
    zIndex: 1000,
    backgroundColor: "#0c0c0e",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "block",
  },
  inner: {
    width: "100%",
    height: "64px",
    margin: "0 auto",
    padding: "0 1.5rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
    textDecoration: "none",
    flexShrink: 0,
  },
  logoWrap: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "8px",
    backgroundColor: "#16161a",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  brandName: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "1.15rem",
    color: "#f0ede6",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "rgba(240,237,230,0.55)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "color 0.18s, background 0.18s",
    cursor: "pointer",
    position: "relative",
  },
  cartLink: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "7px 10px",
    borderRadius: "10px",
    color: "rgba(240,237,230,0.55)",
    textDecoration: "none",
    position: "relative",
    transition: "color 0.18s, background 0.18s",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "2px",
    right: "2px",
    minWidth: "16px",
    height: "16px",
    padding: "0 4px",
    borderRadius: "999px",
    backgroundColor: "#d4a853",
    color: "#0c0c0e",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  divider: {
    display: "inline-block",
    width: "1px",
    height: "20px",
    backgroundColor: "rgba(255,255,255,0.1)",
    margin: "0 4px",
    flexShrink: 0,
  },
  logoutLink: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "rgba(240,237,230,0.55)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "color 0.18s, background 0.18s, border-color 0.18s",
    cursor: "pointer",
  },
};

/* ─── Hover helper (CSS can't do hover with inline styles) ─── */
const hoverClass = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap');
  .ms-link:hover { color: #f0ede6 !important; background: rgba(255,255,255,0.06) !important; }
  .ms-logout:hover { color: #d4a853 !important; background: rgba(212,168,83,0.1) !important; border-color: rgba(212,168,83,0.3) !important; }
  .ms-brand:hover .ms-brand-name { color: #d4a853 !important; }
`;

const Header = ({ children }) => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state?.cart?.items?.length || 0);

  return (
    <>
      {/* Inject Google Fonts + hover states — these don't affect layout */}
      <style>{hoverClass}</style>

      <header style={S.header}>
        <div style={S.inner}>

          {/* Brand */}
          <Link href="/dashboard" style={S.brand} className="ms-brand">
            <div style={S.logoWrap}>
              <Image
                src={logo}
                alt="My Shop logo"
                width={26}
                height={26}
                priority
                style={{ objectFit: "contain", display: "block" }}
              />
            </div>
            <span style={S.brandName} className="ms-brand-name">My Shop</span>
          </Link>

          {/* Nav */}
          <nav style={S.nav}>
            <Link href="/dashboard" style={S.link} className="ms-link">
              Home
            </Link>

            <Link href="/dashboard/userList" style={S.link} className="ms-link">
              Users
            </Link>

            <Link href="/dashboard/cart" style={S.cartLink} className="ms-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 2h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span style={S.badge}>{cartCount}</span>}
            </Link>

            <span style={S.divider} />

            <Link
              href="/"
              style={S.logoutLink}
              className="ms-logout"
              onClick={() => dispatch(clearLoginUserData())}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              </svg>
              Sign out
            </Link>
          </nav>

        </div>
      </header>

      {children}
    </>
  );
};

export default Header;