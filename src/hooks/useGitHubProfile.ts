import { useState, useEffect } from 'react';

export interface GitHubProfile {
  avatarUrl: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  publicRepos: number;
  followers: number;
  following: number;
  since: string;
  loading: boolean;
}

const CACHE_KEY = 'github_profile_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000;

const FALLBACK: GitHubProfile = {
  avatarUrl: 'https://avatars.githubusercontent.com/u/114284668?v=4',
  name: 'ifBars',
  username: 'ifBars',
  bio: '',
  location: 'California',
  publicRepos: 92,
  followers: 21,
  following: 4,
  since: 'Sep 2022',
  loading: false,
};

interface CachedProfile extends GitHubProfile {
  timestamp: number;
}

function getCached(): GitHubProfile | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedProfile = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
  } catch { /* ignore */ }
  return null;
}

function setCached(profile: GitHubProfile) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...profile, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

export function useGitHubProfile() {
  const [profile, setProfile] = useState<GitHubProfile>(() => {
    const cached = getCached();
    return cached ? { ...cached, loading: false } : { ...FALLBACK, loading: true };
  });

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setProfile({ ...cached, loading: false });
      return;
    }

    fetch('https://api.github.com/users/ifBars')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) {
          setProfile({ ...FALLBACK, loading: false });
          return;
        }
        const p: GitHubProfile = {
          avatarUrl: data.avatar_url,
          name: data.name || data.login,
          username: data.login,
          bio: data.bio || '',
          location: data.location || '',
          publicRepos: data.public_repos,
          followers: data.followers,
          following: data.following,
          since: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          loading: false,
        };
        setCached(p);
        setProfile(p);
      })
      .catch(() => setProfile({ ...FALLBACK, loading: false }));
  }, []);

  return profile;
}
