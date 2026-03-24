import { useEffect, useState } from 'react';
import type { ProjectStatSource } from '../components/ProjectCard';

interface SourceDownloadStat {
    label: string;
    downloads: number;
}

export interface DownloadStats {
    totalDownloads: number | null;
    sources: SourceDownloadStat[];
    loading: boolean;
}

interface CachedDownloadStats extends DownloadStats {
    timestamp: number;
}

interface NexusStatsResponse {
    total_downloads?: number;
}

interface ThunderstoreVersion {
    downloads: number;
}

interface ThunderstorePackage {
    owner: string;
    name: string;
    versions: ThunderstoreVersion[];
}

interface GithubReleaseAsset {
    download_count: number;
}

interface GithubRelease {
    assets?: GithubReleaseAsset[];
}

const CACHE_KEY = 'project_download_stats_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000;
const pendingFetches = new Map<string, Promise<DownloadStats>>();
const thunderstoreCommunityCache = new Map<string, ThunderstorePackage[]>();
const pendingThunderstoreFetches = new Map<string, Promise<ThunderstorePackage[]>>();

const EMPTY_STATS: DownloadStats = {
    totalDownloads: null,
    sources: [],
    loading: false
};

const LOADING_STATS: DownloadStats = {
    totalDownloads: null,
    sources: [],
    loading: true
};

function getCache(): Record<string, CachedDownloadStats> {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch {
        return {};
    }
}

function setCache(key: string, stats: DownloadStats) {
    try {
        const cache = getCache();
        cache[key] = { ...stats, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
        console.warn('Failed to cache download stats:', err);
    }
}

function getCachedStats(key: string): DownloadStats | null {
    const cache = getCache();
    const cached = cache[key];

    if (!cached) return null;

    if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return {
            totalDownloads: cached.totalDownloads,
            sources: cached.sources,
            loading: cached.loading
        };
    }

    return null;
}

function getSourceLabel(source: ProjectStatSource) {
    if (source.label) return source.label;

    switch (source.kind) {
        case 'nexus':
            return 'Nexus Mods';
        case 'thunderstore':
            return 'Thunderstore';
        case 'github-release':
            return 'GitHub Releases';
    }
}

async function fetchNexusDownloads(source: Extract<ProjectStatSource, { kind: 'nexus' }>) {
    const response = await fetch(`https://staticstats.nexusmods.com/mod_monthly_stats/${source.gameId}/${source.modId}.json`);
    if (!response.ok) {
        throw new Error(`Nexus stats fetch failed for ${source.gameId}/${source.modId}`);
    }

    const data: NexusStatsResponse = await response.json();
    return data.total_downloads ?? 0;
}

async function getThunderstoreCommunityPackages(community: string) {
    const cached = thunderstoreCommunityCache.get(community);
    if (cached) {
        return cached;
    }

    const pending = pendingThunderstoreFetches.get(community);
    if (pending) {
        return pending;
    }

    const fetchPromise = fetch(`https://thunderstore.io/c/${community}/api/v1/package/`)
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Thunderstore package fetch failed for ${community}`);
            }

            const packages: ThunderstorePackage[] = await response.json();
            thunderstoreCommunityCache.set(community, packages);
            pendingThunderstoreFetches.delete(community);
            return packages;
        })
        .catch(err => {
            pendingThunderstoreFetches.delete(community);
            throw err;
        });

    pendingThunderstoreFetches.set(community, fetchPromise);
    return fetchPromise;
}

async function fetchThunderstoreDownloads(source: Extract<ProjectStatSource, { kind: 'thunderstore' }>) {
    const packages = await getThunderstoreCommunityPackages(source.community);
    const packageEntry = packages.find(pkg => pkg.owner === source.namespace && pkg.name === source.packageName);

    if (!packageEntry) {
        throw new Error(`Thunderstore package not found for ${source.community}/${source.namespace}/${source.packageName}`);
    }

    return packageEntry.versions.reduce((sum, version) => sum + version.downloads, 0);
}

async function fetchGithubReleaseDownloads(source: Extract<ProjectStatSource, { kind: 'github-release' }>) {
    let totalDownloads = 0;

    for (let page = 1; page <= 5; page++) {
        const response = await fetch(`https://api.github.com/repos/${source.owner}/${source.repo}/releases?per_page=100&page=${page}`);
        if (!response.ok) {
            throw new Error(`GitHub releases fetch failed for ${source.owner}/${source.repo}`);
        }

        const releases: GithubRelease[] = await response.json();
        totalDownloads += releases.reduce((releaseSum, release) => {
            return releaseSum + (release.assets?.reduce((assetSum, asset) => assetSum + asset.download_count, 0) ?? 0);
        }, 0);

        if (releases.length < 100) {
            break;
        }
    }

    return totalDownloads;
}

async function fetchSourceDownloads(source: ProjectStatSource) {
    switch (source.kind) {
        case 'nexus':
            return fetchNexusDownloads(source);
        case 'thunderstore':
            return fetchThunderstoreDownloads(source);
        case 'github-release':
            return fetchGithubReleaseDownloads(source);
    }
}

export function useDownloadStats(statSources?: ProjectStatSource[]) {
    const statSourcesKey = JSON.stringify(statSources ?? []);
    const hasSources = Boolean(statSources?.length);
    const [stats, setStats] = useState<DownloadStats>(hasSources ? LOADING_STATS : EMPTY_STATS);

    useEffect(() => {
        const sources = JSON.parse(statSourcesKey) as ProjectStatSource[];

        if (sources.length === 0) {
            setStats(EMPTY_STATS);
            return;
        }

        const cachedStats = getCachedStats(statSourcesKey);
        if (cachedStats) {
            setStats(cachedStats);
            return;
        }

        setStats(LOADING_STATS);

        const fetchStats = async (): Promise<DownloadStats> => {
            const results = await Promise.allSettled(sources.map(async source => {
                const downloads = await fetchSourceDownloads(source);

                return {
                    label: getSourceLabel(source),
                    downloads
                };
            }));

            const successfulSources = results.flatMap(result => {
                if (result.status !== 'fulfilled') {
                    return [];
                }

                if (result.value.downloads <= 0) {
                    return [];
                }

                return [result.value];
            });

            if (successfulSources.length === 0) {
                return {
                    totalDownloads: null,
                    sources: [],
                    loading: false
                };
            }

            return {
                totalDownloads: successfulSources.reduce((sum, source) => sum + source.downloads, 0),
                sources: successfulSources,
                loading: false
            };
        };

        const pending = pendingFetches.get(statSourcesKey);
        if (pending) {
            pending.then(setStats).catch(() => setStats(EMPTY_STATS));
            return;
        }

        const fetchPromise = fetchStats()
            .then(newStats => {
                setCache(statSourcesKey, newStats);
                setStats(newStats);
                pendingFetches.delete(statSourcesKey);
                return newStats;
            })
            .catch(err => {
                console.error('Failed to fetch download stats for', sources, err);
                setStats(EMPTY_STATS);
                pendingFetches.delete(statSourcesKey);
                return EMPTY_STATS;
            });

        pendingFetches.set(statSourcesKey, fetchPromise);
    }, [statSourcesKey]);

    return stats;
}
