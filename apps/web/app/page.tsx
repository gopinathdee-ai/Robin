'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Award, Users, ChevronRight, Zap, Shield, Users2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const features = [
  {
    icon: BookOpen,
    title: 'Your logbook. Forever.',
    body: 'Every job, every ticket, every skill — all in one place that belongs to you. Not your employer. You.',
  },
  {
    icon: Award,
    title: 'Credentials that travel with you.',
    body: 'Move between contractors without losing your record. Share a verified credential with any employer, anywhere.',
  },
  {
    icon: Users,
    title: 'Learn from the best in the trade.',
    body: 'Connect with journeypersons and masters who have earned the right to teach — not just claimed it.',
  },
]

const stats = [
  { number: '12', label: 'Red Seal trades' },
  { number: '∞', label: 'Career portability' },
  { number: '🇨🇦', label: 'Canadian servers' },
]

const proof = [
  { text: 'Recognised by Alberta apprenticeship boards', icon: faCheckCircle },
  { text: 'Built on the Open Badges standard', icon: faCheckCircle },
  { text: 'Your data. Your privacy. Canadian servers.', icon: faCheckCircle },
]

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
}

const itemVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Nav */}
      <motion.nav
        className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full transition-all duration-300 ${
          isScrolled ? 'glass shadow-sm' : ''
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
          <Image src="/logo.png" alt="Trades Platform" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold text-ink-900">Trades Platform</span>
        </motion.div>
        <div className="flex items-center gap-4">
          <Link href="/auth/sign-in" className="btn-ghost py-2 text-sm hidden sm:flex">
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/sign-up" className="btn-primary py-2.5 text-sm">
              Get started free
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 max-w-4xl mx-auto text-center overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-trades-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-trades-50 rounded-full blur-3xl opacity-20 -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full badge mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-trades-500 animate-pulse" />
          Now available to electricians in Alberta
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl font-bold text-ink-900 leading-tight mb-6">
            Your skills record.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-trades-500 to-trades-600">
              Built to last a career.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-ink-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Portable credentials and real mentorship for Canada&apos;s skilled trades workers.
            Yours to keep no matter where you work.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/sign-up" className="btn-primary text-base px-8 py-4">
                Start building your record
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#how-it-works" className="btn-secondary text-base px-8 py-4">
                See how it works
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust signals */}
          <motion.ul variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            {proof.map((item) => (
              <motion.li
                key={item.text}
                className="flex items-center gap-2 text-sm text-ink-600 bg-trades-50 rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-trades-500 flex-shrink-0" />
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 py-12 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              whileInView={{ scale: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-trades-500 mb-2">{stat.number}</div>
              <div className="text-sm text-ink-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="section-heading text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Built for the way trades actually work
          </motion.h2>
          <motion.div
            className="grid sm:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="card card-hover group cursor-pointer"
                whileHover={{ y: -4 }}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-trades-100 to-trades-50 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-trades-500" />
                </div>
                <h3 className="font-bold text-ink-900 mb-2">{title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-gradient-to-r from-trades-500 to-trades-700 py-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to own your record?
          </h2>
          <p className="text-trades-50 mb-8 text-lg">Free to join. No employer required.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/sign-up" className="btn-primary-white text-base px-10 py-4">
              Create your free account
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
