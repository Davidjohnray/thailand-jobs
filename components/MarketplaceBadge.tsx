'use client';

import Link from 'next/link';

// Drop this component into your Navbar, positioned top-right.
// Flashy pulsing gradient badge with a shimmer sweep + bounce, so it catches the eye
// without needing any extra images or icon libraries.

export default function MarketplaceBadge() {
  return (
    <>
      <style jsx>{`
        @keyframes mp-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6), 0 4px 14px rgba(79, 70, 229, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0), 0 4px 20px rgba(79, 70, 229, 0.7);
          }
        }
        @keyframes mp-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes mp-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .mp-badge {
          animation: mp-pulse 2.2s ease-in-out infinite, mp-bounce 1.6s ease-in-out infinite;
        }
        .mp-shimmer-bar {
          animation: mp-shimmer 2.8s ease-in-out infinite;
        }
      `}</style>

      <Link href="/marketplace" style={{ textDecoration: 'none' }}>
        <div
          className="mp-badge"
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #10b981 100%)',
            color: 'white',
            padding: '8px 14px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          {/* shimmer sweep overlay */}
          <div
            className="mp-shimmer-bar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
          <span style={{ fontSize: '15px' }}>🛒</span>
          <span style={{ position: 'relative', zIndex: 1 }}>Teacher Marketplace</span>
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255,255,255,0.25)',
              padding: '2px 6px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            ฿20
          </span>
        </div>
      </Link>
    </>
  );
}
