export interface VideoAd {
  id: string;
  type: 'video';
  videoUrl: string;
  advertiser: string;
  title: string;
  duration: number;
  clickUrl: string;
  skipAfter?: number;
}

export interface BannerAd {
  id: string;
  type: 'banner';
  imageUrl: string;
  advertiser: string;
  title: string;
  duration: number;
  clickUrl: string;
  skipAfter?: number;
}

export interface OverlayAd {
  id: string;
  type: 'overlay';
  imageUrl: string;
  advertiser: string;
  title: string;
  position: 'bottom' | 'top';
  clickUrl: string;
}

export type Ad = VideoAd | BannerAd | OverlayAd;

// Sample ad content
const ads: Ad[] = [
  {
    id: '1',
    type: 'video',
    videoUrl: '/coca.mp4',
    advertiser: 'Coca-Cola',
    title: 'Refresh Your Day',
    duration: 30,
    skipAfter: 5,
    clickUrl: 'https://www.coca-cola.com'
  },
  {
    id: '2',
    type: 'banner',
    imageUrl: 'https://picsum.photos/1920/1080',
    advertiser: 'Travel Agency',
    title: 'Explore Dream Destinations',
    duration: 10,
    skipAfter: 5,
    clickUrl: 'https://example.com/travel'
  },
  {
    id: '3',
    type: 'banner',
    imageUrl: 'https://picsum.photos/1920/1080?random=2',
    advertiser: 'Gaming Studio',
    title: 'Play the Latest Games',
    duration: 8,
    skipAfter: 5,
    clickUrl: 'https://example.com/games'
  },
  {
    id: '4',
    type: 'overlay',
    imageUrl: 'https://picsum.photos/300/100',
    advertiser: 'Music Service',
    title: 'Stream Millions of Songs',
    position: 'bottom',
    clickUrl: 'https://example.com/music'
  }
];

export function getRandomAd(type?: 'video' | 'banner' | 'overlay'): Ad {
  const eligibleAds = type ? ads.filter(ad => ad.type === type) : ads;
  const randomIndex = Math.floor(Math.random() * eligibleAds.length);
  return eligibleAds[randomIndex];
}

export function getRandomPreRollAd(): Ad {
  // Only return video or banner ads for pre-roll
  const preRollAds = ads.filter(ad => ad.type === 'video' || ad.type === 'banner');
  const randomIndex = Math.floor(Math.random() * preRollAds.length);
  return preRollAds[randomIndex];
}

export function getRandomOverlayAd(): OverlayAd | null {
  const overlayAds = ads.filter(ad => ad.type === 'overlay') as OverlayAd[];
  if (overlayAds.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * overlayAds.length);
  return overlayAds[randomIndex];
} 