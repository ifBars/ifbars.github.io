import { useState, useEffect } from 'react';

interface GithubStats {
    stars: number;
    created: string;
    contributors: string[];
    loading: boolean;
}

// Simple in-memory cache to prevent redundant fetches and save rate limits
const cache: Record<string, GithubStats> = {};

export function useGithubStats(sourceUrl?: string, projectName: string = '') {
    const [stats, setStats] = useState<GithubStats>({
        stars: 0,
        created: '',
        contributors: [],
        loading: true
    });

    useEffect(() => {
        // Fallback data
        const fallbackStars = projectName.length * 42 + 120; // Deterministic fallback
        const fallbackStats: GithubStats = {
            stars: fallbackStars,
            created: "Mar 01, 2024",
            contributors: ["https://github.com/ifBars.png"],
            loading: false
        };

        if (!sourceUrl || !sourceUrl.includes('github.com')) {
            setStats(fallbackStats);
            return;
        }

        // Check cache first
        if (cache[sourceUrl]) {
            setStats(cache[sourceUrl]);
            return;
        }

        const fetchStats = async () => {
            try {
                const url = new URL(sourceUrl);
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length < 2) {
                    setStats(fallbackStats);
                    return;
                }

                const [owner, repo] = parts;

                // Fetch repo data
                const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if (!repoRes.ok) throw new Error('Repo fetch failed');
                const repoData = await repoRes.json();

                // Fetch contributors
                // Only fetch contributors if we don't have them cached (though we cache the whole object)
                const contribsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`);
                const contribsData = contribsRes.ok ? await contribsRes.json() : [];

                const newStats: GithubStats = {
                    stars: repoData.stargazers_count,
                    created: new Date(repoData.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                    }),
                    contributors: Array.isArray(contribsData) ? contribsData.map((c: any) => c.avatar_url) : fallbackStats.contributors,
                    loading: false
                };

                // Save to cache
                cache[sourceUrl] = newStats;
                setStats(newStats);
            } catch (err) {
                console.error('Failed to fetch stats for', sourceUrl, err);
                setStats(fallbackStats);
            }
        };

        fetchStats();
    }, [sourceUrl, projectName]);

    return stats;
}
