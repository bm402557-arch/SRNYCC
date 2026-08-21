import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, 
  Send, CheckCircle2, AlertCircle, MessageCircle 
} from 'lucide-react';
import { api } from '../lib/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in Name, Phone, and your Message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      setSubmitting(false);
      if (res.success) {
        setSuccessMsg('Your message has been sent successfully! Our academic counselor will call you back shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg('Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Server error occurred.');
    }
  };

  const whatsappNumber = '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Shri Ramkrishna NYCC, I would like to inquire about computer training courses.')}`;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Phone className="w-4 h-4" />
            Admissions & Student Helpdesk
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Contact Shri Ramkrishna NYCC
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Have questions about course fees, batch timings, or certifications? Visit our campus or get in touch with our team.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 uppercase">
                Institute Head Office
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Campus Address:</strong>
                    <span>Shri Ramkrishna National Youth Computer Centre Main Campus, Vivekananda Sarani, Central Road, Kolkata, WB - 700001</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Phone Hotline:</strong>
                    <span className="block">+91 98765 43210</span>
                    <span className="text-slate-500">+91 98301 23456</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">WhatsApp Admissions:</strong>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">
                      +91 98765 43210 (Click to chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Email Address:</strong>
                    <span>admissions@srknycc.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Operating Hours:</strong>
                    <span className="block">Monday – Saturday: 8:00 AM – 8:00 PM</span>
                    <span className="text-slate-500">Sunday: 9:00 AM – 2:00 PM (Weekend Batches)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  Campus Location Map
                </span>
                <span className="text-emerald-700 font-semibold">Open Now</span>
              </div>
              <div className="relative h-56 bg-slate-200 flex items-center justify-center text-center p-4">
                <div className="space-y-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    Shri Ramkrishna NYCC Main Campus
                  </div>
                  <p className="text-[11px] text-slate-600 max-w-xs">
                    Central Road, Near Vivekananda Statue & Metro Station
                  </p>
                </div>
                {/* Simulated map background grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
            </div>

          </div>

          {/* Right: Contact / Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Send an Inquiry</span>
              <h3 className="text-xl font-bold text-slate-900 uppercase">
                Student & Course Inquiry Form
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill this form and our academic team will get in touch with complete syllabus, batch options, and fee structure.
              </p>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Subir Sen"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. subir@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Inquiry Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Course Inquiry: DCA Diploma">Course Inquiry: DCA Diploma</option>
                    <option value="Course Inquiry: Tally Prime with GST">Course Inquiry: Tally Prime with GST</option>
                    <option value="Course Inquiry: MS Office Specialist">Course Inquiry: MS Office Specialist</option>
                    <option value="Course Inquiry: Basic Computer">Course Inquiry: Basic Computer</option>
                    <option value="Admission & Batch Timings">Admission & Batch Timings</option>
                    <option value="Certificate Verification & Re-issue">Certificate Verification & Re-issue</option>
                    <option value="Other Query">Other Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message / Specific Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for (e.g. weekday morning batches, installment plans, etc.)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>
      </section>

    </div>
  );
};
