import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import AgentSwarmPanel from '@/components/dashboard/AgentSwarmPanel';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import {
  CpuChipIcon,
  CloudArrowUpIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Agent Tasks',
      value: '127',
      change: '+12%',
      changeType: 'increase' as const,
      icon: CpuChipIcon,
    },
    {
      name: 'Content Generated',
      value: '1,234',
      change: '+23%',
      changeType: 'increase' as const,
      icon: CloudArrowUpIcon,
    },
    {
      name: 'Team Members',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: UsersIcon,
    },
    {
      name: 'Success Rate',
      value: '98.5%',
      change: '+1.2%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - SwanyThree Ultimate</title>
        <meta name="description" content="Your AI automation dashboard" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Here's what's happening with your AI workflows today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.name} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <QuickActions />

            {/* Agent Swarm Panel */}
            <AgentSwarmPanel />
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </DashboardLayout>
    </>
  );
}
