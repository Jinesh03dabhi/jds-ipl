'use client';

import { useState } from 'react';
import { PLAYERS } from '@/lib/data';
import {
  TrendingUp,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function Predictions() {

  const [activePoll, setActivePoll] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState('Marquee Player');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<typeof PLAYERS>([]);

  const polls = [
    {
      id: 1,
      question: "Who will be the most expensive Indian player in the 2026 Mega Auction?",
      options: ["Rishabh Pant", "KLRahul", "Shreyas Iyer", "Mohammed Shami"],
      votes: [1240, 850, 620, 410]
    },
    {
      id: 2,
      question: "Predicted SOLD price for Heinrich Klaasen if he goes into auction?",
      options: ["₹15-18 Cr", "₹18-22 Cr", "₹22-25 Cr", "₹25 Cr+"],
      votes: [320, 890, 1540, 2100]
    }
  ];

  const parsePrice = (price: string) =>
    parseFloat(price.replace(' Cr', '') || '0');

  const handleSearch = (value: string) => {
    setPlayerName(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = PLAYERS.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);

    setSuggestions(filtered);
  };

  const selectPlayer = (name: string) => {
    setPlayerName(name);
    setSuggestions([]);
  };

  const runPrediction = () => {
    const player = PLAYERS.find(
      p => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (!player) {
      alert('Player not found in dataset');
      return;
    }

    const base = parsePrice(player.soldPrice);

    let multiplier = 1;
    if (category === 'Marquee Player') multiplier = 1.4;
    if (category === 'Capped Player') multiplier = 1.2;
    if (category === 'Uncapped Player') multiplier = 1.05;

    setPrediction(base * multiplier);
  };

  const trendingPlayers = [...PLAYERS]
    .sort((a, b) => parsePrice(b.soldPrice) - parsePrice(a.soldPrice))
    .slice(0, 3)
    .map((player, index) => {
      const movements = [18.2, -5.4, 0];
      const movement = movements[index] ?? 0;

      let trend = 'Neutral';
      if (movement > 0) trend = '↑';
      if (movement < 0) trend = '↓';

      return {
        name: player.name,
        shortName: `${player.name.split(' ')[0][0]}. ${player.name.split(' ')[1] ?? ''}`,
        movement,
        trend
      };
    });

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>

      <header style={{ marginBottom: '40px' }}>
        <h1 className="predictions-title">
          Predictions & Polls
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Community driven price forecasting and expert market analysis
        </p>
      </header>

      <div className="predictions-layout">

        {/* POLLS */}
        <section>
          <h2 className="section-heading">
            <MessageSquare size={24} color="var(--primary)" />
            Live Community Polls
          </h2>

          {polls.map(poll => (
            <div key={poll.id} className="glass-card poll-card">
              <h3 className="poll-question">
                {poll.question}
              </h3>

              <div className="poll-options">
                {poll.options.map((option, idx) => {
                  const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((poll.votes[idx] / totalVotes) * 100);

                  return (
                    <button
                      key={option}
                      onClick={() => setActivePoll(poll.id)}
                      className="poll-option-btn"
                    >
                      <div
                        className="poll-progress"
                        style={{
                          width: activePoll === poll.id ? `${percentage}%` : '0%'
                        }}
                      />
                      <div className="poll-option-content">
                        <span>{option}</span>
                        {activePoll === poll.id && (
                          <span className="poll-percentage">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="poll-total">
                Total Votes: {poll.votes.reduce((a, b) => a + b, 0).toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        {/* PREDICTOR */}
        <section>

          <div className="glass-card predictor-card">
            <h2 className="section-heading">
              <Zap size={24} color="var(--primary)" />
              Price Predictor AI
            </h2>

            <div className="predictor-form">

              <div className="input-group">
                <label>PLAYER NAME</label>

                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="e.g. Suryakumar Yadav"
                />

                {suggestions.length > 0 && (
                  <div className="suggestions-box">
                    {suggestions.map(player => (
                      <div
                        key={player.id}
                        onClick={() => selectPlayer(player.name)}
                        className="suggestion-item"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Marquee Player</option>
                  <option>Capped Player</option>
                  <option>Uncapped Player</option>
                </select>
              </div>

              <button onClick={runPrediction} className="btn-primary full-width">
                Run Prediction
              </button>
            </div>

            <div className="prediction-result">
              <div>PREDICTION RESULT</div>
              <div className="prediction-value">
                {prediction ? `${prediction.toFixed(2)} Cr` : '--.-- Cr'}
              </div>
            </div>
          </div>

          <div className="glass-card trending-card">
            <h3 className="trending-title">
              <TrendingUp size={18} color="var(--primary)" />
              Top Trending
            </h3>

            <ul>
              {trendingPlayers.map(player => (
                <li key={player.name}>
                  <span>
                    {player.shortName} (Value {player.trend})
                  </span>

                  <span
                    className={
                      player.movement > 0
                        ? 'trend-up'
                        : player.movement < 0
                        ? 'trend-down'
                        : 'trend-neutral'
                    }
                  >
                    {player.movement > 0 ? '+' : ''}
                    {player.movement.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </section>

      </div>
    </div>
  );
}
