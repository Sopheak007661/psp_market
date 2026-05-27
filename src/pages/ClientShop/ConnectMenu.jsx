import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  Facebook, Instagram, Twitter, Clock, CheckCircle,
  Headphones, Package, AlertCircle
} from 'lucide-react';

const TOPICS = [
  'Order / Delivery Issue',
  'Return & Refund',
  'Product Inquiry',
  'Payment Problem',
  'Account Support',
  'Partnership / Sell on PSP',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 px-6 py-12 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Headphones className="h-3.5 w-3.5" /> Support Center
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">How can we help?</h1>
          <p className="text-blue-200 text-sm max-w-md">
            Our team in Cambodia is ready to assist you — typically responding within 2 business hours.
          </p>

          {/* Quick contact chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full transition"
            >
              <Facebook className="h-3.5 w-3.5 text-blue-300" /> Message on Facebook
            </a>
            <a
              href="https://www.instagram.com/sopheak123.pheak/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full transition"
            >
              <Instagram className="h-3.5 w-3.5 text-pink-300" /> Instagram DM
            </a>
            <a
              href="https://x.com/PSopheak23887"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full transition"
            >
              <Twitter className="h-3.5 w-3.5 text-sky-300" /> X / Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Info cards ── */}
        <div className="space-y-4 fade-up">

          {/* Store info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Store Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Location</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Phnom Penh, Cambodia<br />PSP MART Headquarters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Phone / Telegram</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">+855 XX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Email</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">sopheakp175@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Support Hours</h3>
            <div className="space-y-2 text-xs">
              {[
                { day: 'Mon – Fri', time: '8:00 AM – 8:00 PM' },
                { day: 'Saturday',  time: '9:00 AM – 6:00 PM' },
                { day: 'Sunday',    time: '10:00 AM – 4:00 PM' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-gray-300" /> {row.day}
                  </span>
                  <span className="font-semibold text-gray-700">{row.time}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-600 font-semibold text-[11px]">Currently online</span>
              </div>
            </div>
          </div>

          {/* FAQ quick links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Common Topics</h3>
            <div className="space-y-1">
              {[
                { icon: <Package className="h-3.5 w-3.5 text-blue-500" />, label: 'How to track my order?' },
                { icon: <AlertCircle className="h-3.5 w-3.5 text-orange-500" />, label: 'Return & refund policy' },
                { icon: <MessageSquare className="h-3.5 w-3.5 text-green-500" />, label: 'KHQR payment help' },
                { icon: <Headphones className="h-3.5 w-3.5 text-violet-500" />, label: 'Contact support agent' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition text-left"
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Contact Form ── */}
        <div className="lg:col-span-2 fade-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center" style={{ animation: 'scaleIn 0.4s ease both' }}>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Message Sent!</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Thank you <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 2 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: TOPICS[0], message: '' }); }}
                  className="mt-6 px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Send us a message</h2>
                    <p className="text-[11px] text-gray-400">We'll get back to you as soon as possible</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Topic</label>
                    <select
                      value={form.topic}
                      onChange={e => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    >
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Message *</label>
                    <textarea
                      rows={6}
                      placeholder="Describe your issue or question in detail…"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-gray-400">
                    By submitting you agree to our privacy policy. We never share your data.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Social row */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { href: 'https://www.facebook.com/',                          icon: <Facebook className="h-4 w-4" />,  label: 'Facebook',  color: 'text-blue-600  bg-blue-50  border-blue-100  hover:bg-blue-100'  },
              { href: 'https://www.instagram.com/sopheak123.pheak/',        icon: <Instagram className="h-4 w-4" />, label: 'Instagram', color: 'text-pink-600  bg-pink-50  border-pink-100  hover:bg-pink-100'  },
              { href: 'https://x.com/PSopheak23887',                        icon: <Twitter className="h-4 w-4" />,   label: 'X Twitter',color: 'text-sky-600   bg-sky-50   border-sky-100   hover:bg-sky-100'   },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 border rounded-xl py-3 text-xs font-bold transition ${s.color}`}
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}