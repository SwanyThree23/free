import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CpuChipIcon,
  CloudArrowUpIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Agent Swarm Orchestration',
    description: 'Coordinate up to 10 specialized AI agents simultaneously for complex tasks.',
    icon: CpuChipIcon,
  },
  {
    name: 'Content Waterfall Engine',
    description: 'Transform 1 upload into 50+ platform-specific optimized assets.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Multi-User Collaboration',
    description: 'Team-based workflows with role-based access control.',
    icon: UsersIcon,
  },
  {
    name: 'Real-Time Analytics',
    description: 'Monitor AI performance, user engagement, and business KPIs.',
    icon: ChartBarIcon,
  },
  {
    name: 'Enterprise Security',
    description: 'HTTPS/SSL, JWT auth, rate limiting, and GDPR compliance.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'AI-Powered Intelligence',
    description: 'Powered by Claude (Anthropic) and GPT-4 for maximum capability.',
    icon: SparklesIcon,
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>SwanyThree Ultimate - AI-Powered Automation Platform</title>
        <meta name="description" content="Enterprise-grade AI orchestration and automation platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen">
        {/* Navigation */}
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold text-white">
                  SwanyThree Ultimate
                </span>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
                AI-Powered Automation
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Built for Scale
                </span>
              </h1>
              <p className="mt-3 max-w-3xl mx-auto text-xl text-gray-300 sm:mt-5">
                Transform your workflows with intelligent agent swarms, automated content generation,
                and enterprise-grade security. Built on N8N with Claude AI.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg border border-gray-700 transition-all"
                >
                  Watch Demo
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
                <p className="text-4xl font-bold text-purple-500">10</p>
                <p className="mt-2 text-gray-300">Concurrent AI Agents</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
                <p className="text-4xl font-bold text-purple-500">50+</p>
                <p className="mt-2 text-gray-300">Generated Assets</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
                <p className="text-4xl font-bold text-purple-500">99.9%</p>
                <p className="mt-2 text-gray-300">Uptime SLA</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Everything You Need to Scale
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Production-ready features built for modern AI applications
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all"
                >
                  <feature.icon className="h-10 w-10 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Workflows?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join leading companies already using SwanyThree Ultimate
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-lg bg-white text-purple-600 font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <SparklesIcon className="h-6 w-6 text-purple-500" />
                  <span className="ml-2 text-white font-semibold">SwanyThree</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Enterprise-grade AI automation platform
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                  <li><Link href="/docs" className="text-gray-400 hover:text-white text-sm">Documentation</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
                  <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                  <li><Link href="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</Link></li>
                  <li><Link href="/security" className="text-gray-400 hover:text-white text-sm">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              <p>&copy; 2025 SwanyThree Ultimate. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
