"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";

export function FinalCta() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="border-gradient-ion shadow-glow-primary bg-aurora relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16"
        >
          <h2 className="text-h1 mx-auto max-w-lg text-balance">
            Your portfolio could be live by the time your coffee gets cold.
          </h2>
          <p className="text-body-lg mx-auto mt-4 max-w-md text-balance">
            Free to start. Publish whenever you're ready.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button variant="gradient" size="lg">
                Create your portfolio
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
