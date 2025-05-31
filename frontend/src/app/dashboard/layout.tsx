"use client";
import { ReactNode, useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBell, FaSearch, FaUsers, FaCog, FaSignOutAlt, FaHome, FaExchangeAlt, FaStar, FaChartLine, FaChevronDown, FaUser, FaCog as FaSettings, FaSignOutAlt as FaLogout, FaRegQuestionCircle } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Mock notifications data
const mockNotifications = [
  { id: 1, text: 'New broker call from Motilal Oswal', time: '5m ago', read: false },
  { id: 2, text: 'Your call on RELIANCE hit target', time: '1h ago', read: false },
  { id: 3, text: 'Weekly performance report is ready', time: '2h ago', read: true },
];

const sidebarLinks = [
  { label: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
  { label: 'Brokers', icon: <FaStar />, href: '/dashboard/brokers' },
  { label: 'Broker Comparison', icon: <FaChartLine />, href: '/dashboard/comparison' },
  { label: 'Settings', icon: <FaCog />, href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!showProfile) return;
    function handleClick(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfile]);

  // Hybrid logout handler: sync localStorage watchlist to backend before logout
  const handleLogout = async () => {
    if (user) {
      const watchlist = JSON.parse(localStorage.getItem('trackedBrokers') || '[]');
      try {
        await fetch('/api/watchlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ watchlist }),
        });
      } catch (e) {
        // Optionally handle error
      }
      localStorage.removeItem('trackedBrokers');
    }
    logout();
  };

  return (
    <div className="flex" style={{ background: '#F8FAFB' }}>
      {/* Sidebar */}
      <aside
        style={{ background: '#F8FAFB', borderRight: '1px solid #E5E7EB' }}
        className="w-64 flex flex-col justify-between py-8 px-4 min-h-screen fixed top-0 left-0 h-screen z-30"
      >
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="text-2xl font-extrabold" style={{ color: '#222B45' }}>Rate My Broker.</span>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map(link => {
              const isActive =
                link.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-base transition`}
                  style={isActive
                    ? { background: '#E9F366', color: '#222B45' }
                    : { color: '#A3A9B6' }
                  }
                >
                  <span className="text-lg">{link.icon}</span> {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* Bottom section: Help and Logout */}
        <div className="flex flex-col gap-2 mt-8 pt-4 border-t border-gray-200">
          <Link
            href="mailto:info.ratemybroker@gmail.com"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-base hover:bg-gray-100 transition w-full"
            style={{ color: '#A3A9B6' }}
          >
            <span className="text-lg"><FaRegQuestionCircle /></span> Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-base hover:bg-gray-100 transition w-full"
            style={{ color: '#A3A9B6' }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
      {/* Main content with left margin for fixed sidebar */}
      <div className="flex-1" style={{ marginLeft: '16rem' }}>{children}</div>
    </div>
  );
} 