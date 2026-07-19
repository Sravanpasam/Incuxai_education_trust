import React from 'react';

export const VideoPlayerSkeleton: React.FC = () => (
  <div className="skeleton-card" style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '16px', background: '#e2e8f0', overflow: 'hidden', position: 'relative' }}>
    <div className="skeleton-shimmer"></div>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: 'pulse 1.5s infinite' }}></div>
    </div>
  </div>
);

export const SidebarModuleSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-card" style={{ height: '70px', borderRadius: '12px', background: '#f1f5f9', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="skeleton-shimmer"></div>
        <div style={{ width: '60%', height: '14px', background: '#cbd5e1', borderRadius: '4px' }}></div>
        <div style={{ width: '35%', height: '10px', background: '#e2e8f0', borderRadius: '4px' }}></div>
      </div>
    ))}
  </div>
);

export const ProfileCardSkeleton: React.FC = () => (
  <div className="skeleton-card" style={{ background: '#ffffff', border: '1px solid rgba(155,122,62,0.15)', borderRadius: '18px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', overflow: 'hidden' }}>
    <div className="skeleton-shimmer"></div>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#e2e8f0' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ width: '50%', height: '18px', background: '#cbd5e1', borderRadius: '4px' }}></div>
        <div style={{ width: '30%', height: '12px', background: '#e2e8f0', borderRadius: '4px' }}></div>
      </div>
    </div>
    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '4px', width: '90%' }}></div>
    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '4px', width: '75%' }}></div>
  </div>
);
