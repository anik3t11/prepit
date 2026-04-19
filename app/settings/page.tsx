"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Moon, Globe, Shield, CreditCard, Trash2,
  ChevronRight, Check, Zap, Crown,
} from "lucide-react";

type Section = "notifications" | "appearance" | "privacy" | "billing";

const sections: { id: Section; icon: typeof Bell; label: string; desc: string }[] = [
  { id: "notifications", icon: Bell, label: "Notifications", desc: "Email and push preferences" },
  { id: "appearance", icon: Moon, label: "Appearance", desc: "Theme and display" },
  { id: "privacy", icon: Shield, label: "Privacy & Security", desc: "Password and data" },
  { id: "billing", icon: CreditCard, label: "Billing & Plan", desc: "Subscription and usage" },
];

const notifSettings = [
  { key: "daily_reminder", label: "Daily practice reminder", desc: "Get reminded to practice every day", defaultVal: true },
  { key: "streak_alert", label: "Streak alerts", desc: "Alert when your streak is at risk", defaultVal: true },
  { key: "rank_change", label: "Rank changes", desc: "Notify when your global rank changes", defaultVal: false },
  { key: "new_questions", label: "New questions added", desc: "Weekly digest of new questions", defaultVal: true },
  { key: "interview_tips", label: "Interview tips", desc: "Curated tips and resources", defaultVal: false },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["20 questions/day", "Basic AI feedback", "Practice mode", "Google Ads shown"],
    current: true,
    color: "border-white/10",
    badge: null,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: ["Unlimited questions", "Full AI feedback", "Mock interviews", "IDE with all languages", "No ads", "Priority support"],
    current: false,
    color: "border-indigo-500/40",
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    features: ["Everything in Pro", "5 team seats", "Admin dashboard", "Custom question banks", "Dedicated support"],
    current: false,
    color: "border-violet-500/30",
    badge: "For Teams",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("notifications");
  const [notifs, setNotifs] = useState(
    Object.fromEntries(notifSettings.map((s) => [s.key, s.defaultVal]))
  );
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [language, setLanguage] = useState("English");

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-52 shrink-0"
        >
          <div className="glass border border-white/7 rounded-2xl p-2 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  activeSection === s.id
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                <div>
                  <div className="font-medium text-xs">{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 space-y-4"
        >
          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <>
              <div className="glass border border-white/7 rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-1">Notification Preferences</h2>
                <p className="text-sm text-slate-500 mb-5">Choose what you want to be notified about.</p>
                <div className="space-y-4">
                  {notifSettings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-200">{setting.label}</p>
                        <p className="text-xs text-slate-500">{setting.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs({ ...notifs, [setting.key]: !notifs[setting.key] })}
                        className={`w-11 h-6 rounded-full transition-all relative ${
                          notifs[setting.key] ? "bg-indigo-500" : "bg-white/10"
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          notifs[setting.key] ? "left-6" : "left-1"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                Save Preferences
              </button>
            </>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="glass border border-white/7 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="font-semibold text-white mb-1">Appearance</h2>
                <p className="text-sm text-slate-500 mb-5">Customize how PrepIt looks for you.</p>
                <div>
                  <p className="text-sm text-slate-300 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(["dark", "light", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`p-4 rounded-xl text-sm capitalize border transition-all ${
                          theme === t
                            ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                            : "glass border-white/8 text-slate-400 hover:border-white/15"
                        }`}
                      >
                        {theme === t && <Check className="w-3.5 h-3.5 mb-1 mx-auto text-indigo-400" />}
                        <div>{t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"}</div>
                        <div className="mt-1">{t}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-3">Language</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all"
                >
                  {["English", "Hindi", "Spanish", "French", "German", "Japanese"].map((l) => (
                    <option key={l} value={l} className="bg-[#0d0d1a]">{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Compact mode</p>
                  <p className="text-xs text-slate-500">Reduce spacing for more content</p>
                </div>
                <button className="w-11 h-6 rounded-full bg-white/10 relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-all" />
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === "privacy" && (
            <div className="space-y-4">
              <div className="glass border border-white/7 rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-5">Security</h2>
                <div className="space-y-3">
                  {[
                    { label: "Change Password", desc: "Update your account password", icon: Shield },
                    { label: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield },
                    { label: "Active Sessions", desc: "Manage where you're logged in", icon: Globe },
                  ].map((item) => (
                    <button key={item.label} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-all group">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-slate-500" />
                        <div className="text-left">
                          <p className="text-sm text-slate-200">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass border border-rose-500/20 rounded-2xl p-6">
                <h2 className="font-semibold text-rose-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-slate-500 mb-4">These actions are irreversible.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl hover:bg-rose-500/15 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* BILLING */}
          {activeSection === "billing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`glass border ${plan.color} rounded-2xl p-5 relative ${plan.current ? "ring-1 ring-white/10" : ""}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-xs font-medium text-white whitespace-nowrap">
                        {plan.badge}
                      </div>
                    )}
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        {plan.name === "Pro" ? <Crown className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-slate-500" />}
                        <span className="font-semibold text-white text-sm">{plan.name}</span>
                      </div>
                      <div className="text-2xl font-black text-white">
                        {plan.price}<span className="text-sm font-normal text-slate-500">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 rounded-xl text-xs font-medium transition-all ${
                        plan.current
                          ? "bg-white/5 text-slate-500 cursor-default"
                          : plan.name === "Pro"
                          ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-md hover:shadow-indigo-500/20"
                          : "glass border border-white/10 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
