"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import PortalCard from "@/components/PortalCard";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <AppShell
      title="Wejdź do świata AI"
      subtitle="To już nie jest jedna długa strona. To portal z osobnymi przestrzeniami: AI, rewardy, tarot, numerologia i gry."
      rightPanel={
        <div className="right-list">
          <div className="kpi-card">
            <div className="kpi-label">Stan</div>
            <div className="kpi-value">Ready</div>
          </div>
          <div className="result-box">
            Każda zakładka prowadzi teraz do osobnej podstrony jak w porządnym
            portalu.
          </div>
        </div>
      }
    >
      <motion.div
        className="cards-grid-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div variants={cardVariants}>
          <Link href="/chat">
            <PortalCard
              title="Chat AI"
              text="Jedno centrum rozmowy i ukryta logika wieloagentowa."
              icon="💬"
            />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/rewards">
            <PortalCard
              title="Rewardy"
              text="Daily reward, streak, diamenty, bonusy i skrzynki."
              icon="🎁"
            />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/games">
            <PortalCard
              title="Gry"
              text="Przestrzeń pod mini-gry, aktywności i portale interakcji."
              icon="🎮"
            />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/games/snake">
            <PortalCard
              title="Snake"
              text="Prawdziwa mini-gra z planszą, sterowaniem i wynikiem."
              icon="🐍"
            />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="cards-grid-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delay: 0.4,
            },
          },
        }}
      >
        <motion.div variants={cardVariants}>
          <Link href="/relationships">
            <PortalCard title="Relacje" text="Analiza sygnałów, granic i dynamiki." />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/emotions">
            <PortalCard title="Emocje" text="Regulacja, napięcie, chaos i jasność." />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/quiz">
            <PortalCard title="Quiz" text="Interaktywne testy i pytania prowadzące." />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="cards-grid-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delay: 0.6,
            },
          },
        }}
      >
        <motion.div variants={cardVariants}>
          <Link href="/tasks">
            <PortalCard title="Zadania" text="Challenge, plan minimum i mikro-kroki." />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/tarot">
            <PortalCard title="Tarot" text="Karta dnia i rozkłady 3 kart." />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/horoscope">
            <PortalCard title="Horoskop" text="Dzienna energia dla znaku." />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/numerology">
            <PortalCard title="Numerologia" text="Droga życia i opis energii." />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="cards-grid-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delay: 0.8,
            },
          },
        }}
      >
        <motion.div variants={cardVariants}>
          <Link href="/profile">
            <PortalCard
              title="Profil"
              text="Profil użytkownika edytowany komendą, bardziej jak personal hub."
            />
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/admin">
            <PortalCard
              title="Admin AI Studio"
              text="Panel do sterowania zmianami strony i live preview."
            />
          </Link>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}