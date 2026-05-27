
import { useState } from "react";

// ============================================================
//  CONFIGURE YOUR CONTACT LINKS HERE
// ============================================================
const CONTACT_CONFIG = {
  telegram: {
    label: "Telegram",
    // Replace with your Telegram username or group link
    // e.g. "https://t.me/yourusername" or "https://t.me/yourgroup"
    link: "https://t.me/pheaklove12",
  },
  gmail: {
    label: "Gmail",
    // Replace with your Gmail address
    // e.g. "mailto:yourname@gmail.com"
    link: "sopheakp175@gmail.com",
  },
  phone: {
    label: "Phone / Call",
    // Replace with your phone number (international format recommended)
    // e.g. "tel:+85512345678"
    link: "tel:+85593683574",
  },
};
// ============================================================

const TelegramIcon = () => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <circle cx="120" cy="120" r="120" fill="url(#tg-grad)" />
    <path
      d="M81.229 128.772l14.237 39.406s1.78 3.686 3.686 3.686 30.255-29.492 30.255-29.492l31.525-60.89L81.737 118.6l-.508 10.172z"
      fill="#c8daea"
    />
    <path
      d="M100.106 138.878l-2.733 29.046s-1.14 8.868 7.727 0 17.346-15.718 17.346-15.718"
      fill="#a9c6d4"
    />
    <path
      d="M81.486 130.178L52.2 120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229 2.1-2.2 6.489-4.523 120.106-45.36 120.106-45.36s3.208-1.081 5.1-.362a2.766 2.766 0 011.894 2.049 9.5 9.5 0 01.254 2.585c-.009.752-.1 1.449-.169 2.542-.692 11.165-21.4 94.493-21.4 94.493s-1.239 4.876-5.678 5.043a8.13 8.13 0 01-5.925-2.292c-8.711-7.493-38.819-27.727-45.472-32.177a1.27 1.27 0 01-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6 53.821-51.492c.108-.379-.3-.566-.848-.4-3.482 1.281-63.844 39.4-70.427 43.564a3.177 3.177 0 01-1.857.176z"
      fill="#fff"
    />
    <defs>
      <linearGradient id="tg-grad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
        <stop stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
    </defs>
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <path fill="#EA4335" d="M6 40h6V22.5L4 17v20c0 1.66 1.34 3 3 3z" />
    <path fill="#34A853" d="M36 40h6c1.66 0 3-1.34 3-3V17l-9 5.5V40z" />
    <path fill="#FBBC05" d="M36 10H12L4 17l8 5.5L24 16l12 6.5L44 17z" />
    <path fill="#4285F4" d="M12 10L4 17v3l8-5.5L24 21l12-6.5L44 20v-3L36 10z" />
    <path fill="#C5221F" d="M4 20v-3l8 5.5z" />
    <path fill="#1967D2" d="M44 17l-8 5.5V20z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#fff"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const contacts = [
  {
    key: "telegram",
    Icon: TelegramIcon,
    bg: "linear-gradient(135deg, #37aee2 0%, #1e96c8 100%)",
    glow: "rgba(55,174,226,0.35)",
    tag: "Chat with us",
    description: "Fastest response. Join our channel or message directly.",
    badge: "Fastest",
    badgeColor: "#37aee2",
  },
  {
    key: "gmail",
    Icon: GmailIcon,
    bg: "linear-gradient(135deg, #EA4335 0%, #FBBC05 50%, #34A853 100%)",
    glow: "rgba(234,67,53,0.25)",
    tag: "Send an email ",
    description: "For detailed inquiries, attachments, or formal requests.",
    badge: "Official",
    badgeColor: "#EA4335",
  },
  {
    key: "phone",
    Icon: PhoneIcon,
    bg: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    glow: "rgba(37,211,102,0.30)",
    tag: "Call / WhatsApp",
    description: "Speak directly with our team during business hours.",
    badge: "Live",
    badgeColor: "#25D366",
  },
];

export default function ContactUs() {
  const [hovered, setHovered] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    const email = CONTACT_CONFIG.gmail.link.replace("mailto:", "");
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={styles.page}>
      {/* Background elements */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />
      <div style={styles.grid} />

      <div style={styles.container}>
        <div style={styles.cards}>
          {contacts.map(({ key, Icon, bg, glow, tag, description, badge, badgeColor }) => {
            const config = CONTACT_CONFIG[key];
            const isHovered = hovered === key;

            return (
              <a
                key={key}
                href={key === "gmail" ? "#" : config.link}
                onClick={key === "gmail" ? handleCopyEmail : undefined}
                target={key === "telegram" ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  ...styles.card,
                  boxShadow: isHovered
                    ? `0 24px 60px ${glow}, 0 0 0 1px rgba(255,255,255,0.08)`
                    : "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)",
                  transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
                }}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Card gradient top bar */}
                <div style={{ ...styles.cardBar, background: bg }} />

                {/* Badge */}
                <div style={{ ...styles.badge, background: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}44` }}>
                  <span style={{ ...styles.badgeDot, background: badgeColor }} />
                  {badge}
                </div>
                <div className="flex items-start justify-left gap-2 relative">
                    {/* Icon */}
                    <div
                      style={{
                        ...styles.iconWrap,
                        background: isHovered ? `${glow}` : "rgba(255,255,255,0.05)",
                        boxShadow: isHovered ? `0 0 30px ${glow}` : "none",
                      }}
                    >
                      <Icon />
                    </div>

                    {/* Text */}
                    <div className="flex pt-3">
                      <div style={styles.cardTag}>{tag}</div>
                    </div>
                </div>

                {/* Link display */}
                <div style={styles.linkRow}  >
                  <span style={styles.linkText}>
                    {key === "gmail"
                      ? config.link.replace("mailto:", "")
                      : key === "phone"
                      ? config.link.replace("tel:", "")
                      : config.link}
                  </span>
                  {key === "gmail" && (
                    <span style={styles.copyHint}>{copied ? "Copied!" : "Click to copy"}</span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex absolute top-36 left-0 right-0 mx-auto w-[90%] items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    ...styles.cta,
                    background: isHovered ? bg : "rgb(4, 62, 189)",
                    color: isHovered ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span>
                    {key === "telegram" ? "Open Telegram" : key === "gmail" ? "Copy Email" : "Call Now"}
                  </span>
                  <ArrowIcon />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    // minHeight: "100vh",
   
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "40px 16px",
    boxSizing: "border-box",
  },
  bgOrb1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(55,174,226,0.12) 0%, transparent 70%)",
    top: -100,
    left: -100,
    pointerEvents: "none",
  },
  bgOrb2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,211,102,0.08) 0%, transparent 70%)",
    bottom: -80,
    right: -80,
    pointerEvents: "none",
  },
  bgOrb3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(71, 67, 67, 0.07) 0%, transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute",
    // border: "1px solid rgba(218, 206, 206, 0.88)",
    // borderRadius: 20,
     boxShadow: "0 0 10px 2px rgb(142, 144, 155), 0 0 30px 6px rgba(172, 172, 187, 0.4)",
    inset: 0,
    // backgroundImage:
    //   "linear-gradient(rgba(233, 230, 230, 0.56) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    // backgroundSize: "50px 50px",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 10,
    maxWidth: 960,
    width: "100%",
    margin: "0 auto",
    
  },
  header: {
    textAlign: "center",
    marginBottom: 48,
  },
  pill: {
    display: "inline-block",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.2em",
    padding: "6px 16px",
    borderRadius: 100,
    marginBottom: 20,
    
  },
  title: {
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 16px",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },
  titleAccent: {
    background: "linear-gradient(90deg, #37aee2, #25D366)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(255,255,255,0.4)",
    margin: 0,
    fontWeight: 400,
    lineHeight: 1.6,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 80,
  },
  card: {
    // background: "#072475f6",
    border: "1px solid rgba(162, 162, 172, 0.89)",
    borderRadius: 20,
    padding: "28px 24px 24px",
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    position: "relative",
    overflow: "hidden",
  },
  cardBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: "20px 20px 0 0",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "4px 10px",
    borderRadius: 100,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    transition: "all 0.3s ease",
  },
  cardTag: {
    fontSize: 19,
    fontWeight: 700,
    color: "#6f6f74f1",
    marginBottom: 8,
    letterSpacing: "-0.02em",
  },
  cardDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.6,
    marginBottom: 20,
    flexGrow: 1,
  },
  linkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  linkText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    fontFamily: "monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "70%",
  },
  copyHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    flexShrink: 0,
  },
  cta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.3s ease",
    letterSpacing: "-0.01em",
  },
  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "rgba(255,255,255,0.25)",
    lineHeight: 1.8,
  },
  configHint: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: "10px 20px",
    maxWidth: 480,
    margin: "16px auto 0",
  },
  code: {
    fontFamily: "monospace",
    color: "rgba(160,196,255,0.7)",
    background: "rgba(100,160,255,0.08)",
    padding: "2px 6px",
    borderRadius: 4,
  },
};