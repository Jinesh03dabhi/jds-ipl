'use client';

import { useState } from 'react';
import { PLAYERS } from '@/lib/data';
import { Share2, Code, Copy, Layout } from 'lucide-react';

export default function WidgetsDemo() {

  const [widgetType, setWidgetType] = useState('Player Stats Card');
  const [theme, setTheme] = useState('primary');
  const [selectedPlayerId, setSelectedPlayerId] = useState(PLAYERS[0].id);
  const [copied, setCopied] = useState(false);

  const selectedPlayer = PLAYERS.find(p => p.id === selectedPlayerId);

  const shareWidget = async () => {
    const shareUrl = `${window.location.origin}/widgets/player/${selectedPlayerId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IPL Player Widget',
          text: `Check out ${selectedPlayer?.name} stats`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const embedCode =
    `<iframe src="https://iplhistory.com/embed/player/${selectedPlayerId}" width="350" height="200" />`;

  const copyCode = async () => {
  await navigator.clipboard.writeText(embedCode);
  setCopied(true);

  setTimeout(() => setCopied(false), 2000);
};


  const getThemeStyle = () => {
    if (theme === 'dark')
      return { border: '1px solid rgba(255,255,255,0.1)', background: '#000', color: '#fff' };

    if (theme === 'light')
      return { border: '1px solid #ddd', background: '#fff', color: '#000' };

    return { border: '1px solid rgba(37, 99, 235, 0.3)' };
  };

  return (
    <div className="container widgets-container">

      <header className="widgets-header">
        <h1 className="widgets-title">
          B2B Embeddable Widgets
        </h1>
        <p className="widgets-subtitle">
          Power your sports blog or fantasy site with our deep data widgets
        </p>
      </header>

      <div className="widgets-layout">

        {/* CONFIG */}
        <section>
          <div className="glass-card config-card">

            <h2 className="config-title">
              <Layout size={24} color="var(--primary)" />
              Widget Configuration
            </h2>

            <div className="form-group">
              <label>PLAYER</label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                {PLAYERS.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>WIDGET TYPE</label>
              <select
                value={widgetType}
                onChange={(e) => setWidgetType(e.target.value)}
              >
                <option>Player Stats Card</option>
                <option>Auction High-Light</option>
                <option>Team Spending Tracker</option>
              </select>
            </div>

            <div className="form-group">
              <label>THEME</label>
              <div className="theme-options">
                <div onClick={() => setTheme('primary')} className="theme-circle primary"></div>
                <div onClick={() => setTheme('dark')} className="theme-circle dark"></div>
                <div onClick={() => setTheme('light')} className="theme-circle light"></div>
              </div>
            </div>

            <div className="embed-box">
              <div className="embed-header">
                <span>EMBED CODE</span>
                <button
  onClick={copyCode}
  style={{
    background: 'none',
    border: 'none',
    color: copied ? '#22c55e' : 'var(--primary)',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  }}
>
  <Copy size={14} />
  {copied ? 'Copied!' : 'Copy Code'}
</button>

              </div>

              <code>
                {embedCode}
              </code>
            </div>

          </div>
        </section>

        {/* PREVIEW */}
        <section>
          <div className="preview-wrapper">

            <div className="preview-label">
              Live Preview
            </div>

            {selectedPlayer && (
              <div
                className="glass-card widget-preview"
                style={getThemeStyle()}
              >
                <div className="widget-top">
                  <div className="widget-type">
                    {widgetType.toUpperCase()}
                  </div>

                  <Share2
                    size={14}
                    color="#64748b"
                    onClick={shareWidget}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <h3 className="widget-player-name">
                  {selectedPlayer.name}
                </h3>

                <div className="widget-team">
                  {selectedPlayer.currentTeam}
                </div>

                <div className="widget-stats">
                  <div>
                    <div>AVG</div>
                    <div>{selectedPlayer.stats.average ?? '-'}</div>
                  </div>

                  <div>
                    <div>S/R</div>
                    <div>{selectedPlayer.stats.strikeRate ?? '-'}</div>
                  </div>

                  <div>
                    <div>PRICE</div>
                    <div className="price">
                      {selectedPlayer.soldPrice}
                    </div>
                  </div>
                </div>

                <div className="widget-footer">
                  Powered by <span>JD's IPL</span>
                </div>
              </div>
            )}

            <div className="preview-bottom">
              <Code size={20} />
              <span>Used by 50+ local sports blogs</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
