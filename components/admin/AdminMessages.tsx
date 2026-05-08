"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, ChevronDown, ChevronUp, Inbox } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface Props {
  initialMessages: Message[];
}

export default function AdminMessages({ initialMessages }: Props) {
  const [messages] = useState(initialMessages);
  const [expanded, setExpanded] = useState<string | null>(null);

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      {unread > 0 && (
        <div className="glass rounded-xl p-4 mb-6 border border-indigo-500/15 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Mail size={15} className="text-indigo-400" />
          </div>
          <span className="text-slate-300 text-sm">
            You have{" "}
            <span className="text-indigo-400 font-semibold">{unread}</span>{" "}
            unread message{unread !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Inbox size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No messages yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Messages from your contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl overflow-hidden border ${
                !msg.read
                  ? "border-indigo-500/20"
                  : "border-transparent"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-sm">
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      )}
                    </div>
                    <div className="text-slate-400 text-xs truncate">
                      {msg.subject}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock size={11} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                  {expanded === msg.id ? (
                    <ChevronUp size={15} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={15} className="text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expanded === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail size={13} className="text-indigo-400" />
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-indigo-400 transition-colors"
                        >
                          {msg.email}
                        </a>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Subject</div>
                        <div className="text-slate-200 text-sm font-medium">
                          {msg.subject}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Message</div>
                        <div className="text-slate-300 text-sm leading-relaxed bg-white/[0.03] rounded-lg p-3 whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/20 transition-colors"
                      >
                        <Mail size={12} />
                        Reply via Email
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
