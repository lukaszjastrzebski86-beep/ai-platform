"use client";

import { motion } from "framer-motion";

export default function PortalCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon?: string;
}) {
  return (
    <motion.div
      className="portal-card glass"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="portal-card-header">
        {icon && <span className="portal-card-icon">{icon}</span>}
        <div className="portal-card-title">{title}</div>
      </div>
      <div className="portal-card-text">{text}</div>
      <div className="portal-card-tooltip">
        Kliknij, aby wejść
      </div>
    </motion.div>
  );
}