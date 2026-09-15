'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Calendar, Percent, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FinanceCalculator({ onApplyFinancing }) {
  const [vehiclePrice, setVehiclePrice] = useState(55000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(5.9);

  // Calculations
  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);
  const loanPrincipal = vehiclePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  
  const monthlyPayment = monthlyRate > 0
    ? Math.round((loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1))
    : Math.round(loanPrincipal / termMonths);

  const totalCost = monthlyPayment * termMonths + downPaymentAmount;
  const totalInterest = totalCost - vehiclePrice;

  return (
    <section id="calculator" className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/30 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
                <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                <span>Transparent Loan & Lease Estimator</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Interactive Finance <span className="text-cyan-400">Calculator</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Customize your payment plan with flexible term lengths, down payments, and competitive rates.
              </p>
            </div>

            {/* Slider 1: Vehicle Price */}
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">Vehicle Price</span>
                <span className="text-base font-extrabold text-cyan-300">
                  ${vehiclePrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="150000"
                step="1000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$20,000</span>
                <span>$150,000+</span>
              </div>
            </div>

            {/* Slider 2: Down Payment */}
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-base font-extrabold text-cyan-300">
                  ${downPaymentAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (No Down)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Term Months Selector */}
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
              <span className="text-xs font-bold text-slate-300 block mb-2">Loan Term (Months)</span>
              <div className="grid grid-cols-5 gap-2">
                {[24, 36, 48, 60, 72].map((term) => (
                  <button
                    key={term}
                    onClick={() => setTermMonths(term)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      termMonths === term
                        ? 'btn-neon text-white shadow-md'
                        : 'glass-card text-slate-400 hover:text-white'
                    }`}
                  >
                    {term} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">Annual Interest Rate (APR)</span>
                <span className="text-base font-extrabold text-cyan-300">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="2.9"
                max="14.9"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Right Column: Dynamic Calculation Card */}
          <div className="lg:col-span-5">
            <motion.div
              layout
              className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(56,189,248,0.2)] flex flex-col justify-between bg-gradient-to-b from-[#0a1633]/90 to-[#060c1c]/90"
            >
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Estimated Monthly Payment
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight text-cyan-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] mb-6">
                  ${monthlyPayment.toLocaleString()}
                  <span className="text-sm font-semibold text-slate-400"> / month</span>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 py-4 border-y border-cyan-500/20 text-xs mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Vehicle Price:</span>
                    <span className="font-bold text-white">${vehiclePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Down Payment:</span>
                    <span className="font-bold text-cyan-300">-${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Loan Amount:</span>
                    <span className="font-bold text-white">${loanPrincipal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Est. Total Interest:</span>
                    <span className="font-bold text-slate-400">${Math.max(0, totalInterest).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-400 text-xs mb-6">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>0% hidden dealership fees • Instant pre-qualification</span>
                </div>
              </div>

              <button
                onClick={onApplyFinancing}
                className="w-full py-3.5 rounded-2xl btn-neon text-xs font-extrabold text-white tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Pre-Approve Loan Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
