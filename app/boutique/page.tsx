"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/BlueButton";
import Link from "next/link";

export default function BoutiquePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-50">
      {/* Éléments de design en arrière-plan (Cercles flous) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-aja-blue/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-aja-blue/5 blur-[120px]" />

      <main className="relative z-10 px-6 text-center max-w-3xl">
        {/* Icône animée */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl text-aja-blue"
        >
          <ShoppingBag size={48} strokeWidth={1.5} />
        </motion.div>

        {/* Titre avec effet de révélation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl text-aja-blue font-Bai_Jamjuree uppercase font-bold tracking-tighter mb-4"
        >
          Bientôt Prêt.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-Montserrat text-slate-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
        >
          Notre boutique est en pleine métamorphose. Nous préparons une
          sélection exclusive pour vous.
          <span className="block mt-2 italic font-medium">
            Revenez très prochainement !
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/">
            <Button size="default" type="button">
              Revenir à l&apos;accueil
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
