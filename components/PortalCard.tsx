"use client";

import { motion } from "framer-motion";

type PortalCardProps = {
  title: string;
  text: string;
  icon?: string;
  eyebrow?: string;
  badge?: string;
  cta?: string;
  accent?: string;
};

export default function PortalCard({
  title,
  text,
  icon,
  eyebrow,
  badge,
  cta = "Open experience",
  accent = "linear-gradient(135deg, rgba(141, 197, 255, 0.18), rgba(243, 194, 131, 0.22))",
}: PortalCardProps) {
  return (
    <motion.article
      className="portal-card glass"
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      <div className="portal-card-halo" style={{ background: accent }} />

      <div className="portal-card-topline">
        <div className="eyebrow compact">{eyebrow ?? "featured"}</div>
        {badge ? <div className="card-badge">{badge}</div> : null}
      </div>

      <div className="portal-card-header">
        {icon ? <div className="portal-card-icon">{icon}</div> : null}
        <div className="portal-card-title">{title}</div>
      </div>

      <div className="portal-card-text">{text}</div>
      <div className="portal-card-tooltip">{cta}</div>
    </motion.article>
  );
}
