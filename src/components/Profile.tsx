import { Dialog, DialogContent, DialogHeader } from './ui/ui/dialog';
import { Input } from './ui/ui/input';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCog, FaSignOutAlt, FaMoon, FaBell, FaFilm, FaStar, FaClock } from 'react-icons/fa';
import { useTheme } from './theme-provider'
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user, logout, updateAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';
  // Edit Profile modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  // Settings modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [maturityModalOpen, setMaturityModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [subtitleModalOpen, setSubtitleModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { t, i18n } = useTranslation();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Mock updateName function (replace with real one if available)
      if (editName && editName !== user.name) {
        // await updateName(editName); // Uncomment if you have this
        user.name = editName; // Mock update for now
      }
      if (updateAvatar && editAvatar) {
        await updateAvatar(editAvatar);
      }
      setEditOpen(false);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="landing-page-colors profile-container">
      {/* Remove the profile-header section */}
      {/* <div className="profile-header"> ... </div> */}
      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </div>
        {activeTab === 'profile' && (
          <div className="tab-content active">
            <div className="profile-info-section">
              <div className="profile-info-main">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                  alt={user.name} 
                  className="profile-avatar-large"
                />
                <div className="profile-info-details">
                  <h2 className="profile-info-name">{user.name}</h2>
                  <p className="profile-info-email">{user.email}</p>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Plan:</span>
                    <span className="profile-info-value">Premium (Mock)</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Language:</span>
                    <span className="profile-info-value">English (Mock)</span>
                  </div>
                  <button className="btn profile-edit-btn" onClick={() => {
                    setEditName(user.name);
                    setAvatarPreview(user.avatar || null);
                    setEditAvatar(null);
                    setEditOpen(true);
                  }}>Edit Profile</button>
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="edit-profile-modal">
                      <DialogHeader>
                        <h2>Edit Profile</h2>
                      </DialogHeader>
                      <form onSubmit={handleEditProfile} className="edit-profile-form">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <img
                            src={editAvatar ? (avatarPreview || undefined) : (user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editName)}&background=random`)}
                            alt="Avatar Preview"
                            className="edit-profile-avatar-preview"
                          />
                          <label className="btn" style={{ padding: '0.4rem 1.2rem', fontSize: '1rem', marginBottom: 0 }}>
                            Change Avatar
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleEditAvatarChange} />
                          </label>
                        </div>
                        <div style={{ width: '100%', maxWidth: 320 }}>
                          <label htmlFor="edit-name">Name</label>
                          <Input
                            id="edit-name"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="edit-profile-btn-row">
                          <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setEditOpen(false)} disabled={saving}>Cancel</button>
                          <button type="submit" className="btn profile-edit-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="profile-recent-activity">
                <h3 className="profile-section-title">Recent Activity</h3>
                <p className="muted">No recent activity to show (mock).</p>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <FaFilm className="stat-icon" />
                <span className="stat-number">24</span>
                <span className="stat-label">Watchlist</span>
              </div>
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <span className="stat-number">12</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <FaClock className="stat-icon" />
                <span className="stat-number">48</span>
                <span className="stat-label">Hours</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="tab-content active">
            <div className="settings-section">
              {/* Account Information */}
              <h3 className="settings-section-title">{t('Account & Membership')}</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Email')}</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setPasswordModalOpen(true)}>{t('Change Password')}</button>
                <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Change Password</h2>
                    </DialogHeader>
                    <form className="edit-profile-form">
                      <label htmlFor="current-password">Current Password</label>
                      <Input id="current-password" type="password" required />
                      <label htmlFor="new-password">New Password</label>
                      <Input id="new-password" type="password" required />
                      <label htmlFor="confirm-password">Confirm New Password</label>
                      <Input id="confirm-password" type="password" required />
                      <div className="edit-profile-btn-row">
                        <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setPasswordModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn profile-edit-btn">Save</button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Plan')}</label>
                    <p>{t('Premium (Mock)')}</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setPlanModalOpen(true)}>{t('Manage Plan')}</button>
                <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Manage Plan</h2>
                    </DialogHeader>
                    <div style={{ textAlign: 'center', margin: '1.2rem 0' }}>
                      <p>Your current plan: <b>Premium</b> (Mock)</p>
                      <p>Plan management coming soon!</p>
                    </div>
                    <div className="edit-profile-btn-row">
                      <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setPlanModalOpen(false)}>Close</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Profile & Parental Controls */}
              <h3 className="settings-section-title">{t('Profile & Parental Controls')}</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Language')}</label>
                    <p>{t('English (Mock)')}</p>
                  </div>
                </div>
                <select
                  className="profile-select"
                  value={i18n.language}
                  onChange={e => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Maturity Settings')}</label>
                    <p>{t('All Maturity Ratings (Mock)')}</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setMaturityModalOpen(true)}>{t('Edit')}</button>
                <Dialog open={maturityModalOpen} onOpenChange={setMaturityModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Edit Maturity Settings</h2>
                    </DialogHeader>
                    <div style={{ textAlign: 'center', margin: '1.2rem 0' }}>
                      <p>Current: <b>All Maturity Ratings</b> (Mock)</p>
                      <p>Maturity settings management coming soon!</p>
                    </div>
                    <div className="edit-profile-btn-row">
                      <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setMaturityModalOpen(false)}>Close</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Viewing Activity')}</label>
                    <p>{t("See what you've watched")}</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setActivityModalOpen(true)}>{t('View')}</button>
                <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Viewing Activity</h2>
                    </DialogHeader>
                    <div style={{ textAlign: 'center', margin: '1.2rem 0' }}>
                      <p>No activity to show (mock).</p>
                    </div>
                    <div className="edit-profile-btn-row">
                      <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setActivityModalOpen(false)}>Close</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Playback Settings */}
              <h3 className="settings-section-title">Playback Settings</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>Autoplay Next Episode</label>
                    <p>Automatically play the next episode</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>Data Usage per Screen</label>
                    <p>Control playback quality</p>
                  </div>
                </div>
                <select className="profile-select" defaultValue="auto">
                  <option value="auto">Auto</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Personalization */}
              <h3 className="settings-section-title">{t('Personalization')}</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('Subtitle Appearance')}</label>
                    <p>{t('Customize subtitles')}</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setSubtitleModalOpen(true)}>{t('Edit')}</button>
                <Dialog open={subtitleModalOpen} onOpenChange={setSubtitleModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Edit Subtitle Appearance</h2>
                    </DialogHeader>
                    <div style={{ textAlign: 'center', margin: '1.2rem 0' }}>
                      <p>Subtitle customization coming soon!</p>
                    </div>
                    <div className="edit-profile-btn-row">
                      <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setSubtitleModalOpen(false)}>Close</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>{t('App Language')}</label>
                    <p>{t('English (Mock)')}</p>
                  </div>
                </div>
                <select
                  className="profile-select"
                  value={i18n.language}
                  onChange={e => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              {/* Notifications (existing) */}
              <h3 className="settings-section-title">Notifications</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label><FaBell /> Notifications</label>
                    <p>Get updates about new content</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Theme (existing) */}
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label><FaMoon /> Dark Mode</label>
                    <p>Switch theme appearance</p>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setTheme(darkMode ? 'light' : 'dark')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Payment Method */}
              <h3 className="settings-section-title">Payment Method</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>Payment Method</label>
                    <p>Visa **** 4242 (Mock)</p>
                  </div>
                </div>
                <button className="btn" style={{ minWidth: 120 }} onClick={() => setPaymentModalOpen(true)}>Edit</button>
                <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <h2>Edit Payment Method</h2>
                    </DialogHeader>
                    <form className="edit-profile-form" style={{ maxWidth: 340, margin: '0 auto' }}>
                      <label htmlFor="card-number">Card Number</label>
                      <Input id="card-number" type="text" placeholder="1234 5678 9012 3456" maxLength={19} required />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label htmlFor="expiry">Expiry</label>
                          <Input id="expiry" type="text" placeholder="MM/YY" maxLength={5} required />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label htmlFor="cvc">CVC</label>
                          <Input id="cvc" type="text" placeholder="123" maxLength={4} required />
                        </div>
                      </div>
                      <div className="edit-profile-btn-row">
                        <button type="button" className="btn" style={{ background: '#888', color: '#fff' }} onClick={() => setPaymentModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn profile-edit-btn">Save</button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Security */}
              <h3 className="settings-section-title">Security</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>Sign out of all devices</label>
                    <p>Force sign out everywhere</p>
                  </div>
                </div>
                <button className="btn danger-btn" style={{ minWidth: 120 }}>Sign Out All</button>
              </div>
              <button className="danger-btn" onClick={logout}>
                <FaSignOutAlt /> Sign Out
              </button>

              {/* Help & Support */}
              <h3 className="settings-section-title">Help & Support</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-text">
                    <label>Need help?</label>
                    <p>Visit our <a href="/faq" className="profile-link">FAQ</a> or <a href="/contact" className="profile-link">Contact Support</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 