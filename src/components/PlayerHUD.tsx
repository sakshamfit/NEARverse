import type { Player } from '../types';
import { Users, Award, MapPin } from 'lucide-react';

interface PlayerHUDProps {
  player: Player | null;
  nearbyPlayers: Player[];
}

export function PlayerHUD({ player, nearbyPlayers }: PlayerHUDProps) {
  if (!player) return null;

  return (
    <div className="player-hud">
      {/* Player Status Card */}
      <div className="hud-card player-card">
        <div className="hud-header">
          <div className="avatar-large" style={{ backgroundColor: player.avatarColor }} />
          <div>
            <div className="hud-name">{player.name}</div>
            <div className="hud-profession">{player.profession}</div>
          </div>
        </div>

        <div className="hud-stats">
          <div className="stat">
            <Award size={15} />
            <span>Trust: <strong>87</strong></span>
          </div>
          <div className="stat">
            <span>Level <strong>12</strong></span>
          </div>
        </div>
      </div>

      {/* Nearby Players */}
      {nearbyPlayers.length > 0 && (
        <div className="hud-card nearby-card">
          <div className="hud-header small">
            <Users size={15} />
            <span>Nearby ({nearbyPlayers.length})</span>
          </div>
          
          <div className="nearby-list">
            {nearbyPlayers.map((p, index) => (
              <div key={index} className="nearby-player">
                <div 
                  className="mini-avatar" 
                  style={{ backgroundColor: p.avatarColor }}
                />
                <div className="nearby-info">
                  <div className="nearby-name">{p.name}</div>
                  <div className="nearby-profession">{p.profession}</div>
                </div>
                <div className="nearby-action">Wave 👋</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="hud-card actions-card">
        <div className="hud-header small">
          <MapPin size={15} /> Quick Actions
        </div>
        <div className="quick-actions">
          <button className="action-btn">🏠 My Home</button>
          <button className="action-btn">👥 Friends</button>
          <button className="action-btn">📅 Events</button>
        </div>
      </div>
    </div>
  );
}