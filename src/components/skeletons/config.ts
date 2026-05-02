// utils/songDeduplication.ts
import { Song } from "@/types";

/**
 * Remove duplicate songs by _id from an array
 */
export const removeDuplicateSongs = (songs: Song[]): Song[] => {
  const seen = new Set();
  return songs.filter(song => {
    const id = song._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

/**
 * Remove songs that appear in exclude arrays from the main array
 */
export const excludeSongs = (mainArray: Song[], ...excludeArrays: Song[][]): Song[] => {
  const excludeIds = new Set();
  
  excludeArrays.forEach(arr => {
    if (arr && Array.isArray(arr)) {
      arr.forEach(song => {
        if (song?._id) excludeIds.add(song._id.toString());
      });
    }
  });
  
  return mainArray.filter(song => !excludeIds.has(song._id.toString()));
};

/**
 * Main deduplication function for all three sections
 * Order: featured → trending → madeForYou
 */
export const deduplicateSectionsFrontend = (
  featured: Song[],
  trending: Song[],
  madeForYou: Song[]
): { featured: Song[]; trending: Song[]; madeForYou: Song[] } => {
  
  // Step 1: Remove duplicates within each section
  const cleanFeatured = removeDuplicateSongs(featured);
  const cleanTrending = removeDuplicateSongs(trending);
  const cleanMadeForYou = removeDuplicateSongs(madeForYou);
  
  // Step 2: Remove featured songs from trending
  const trendingFiltered = excludeSongs(cleanTrending, cleanFeatured);
  
  // Step 3: Remove both featured and trending songs from madeForYou
  const madeForYouFiltered = excludeSongs(cleanMadeForYou, cleanFeatured, trendingFiltered);
  
  // Step 4: Ensure we still have enough songs (optional - get backups)
  const result = {
    featured: cleanFeatured,
    trending: trendingFiltered,
    madeForYou: madeForYouFiltered
  };
  
  // Log warning if we lost too many songs
  if (result.trending.length < cleanTrending.length) {
    console.warn(`Removed ${cleanTrending.length - result.trending.length} duplicate songs from trending`);
  }
  
  if (result.madeForYou.length < cleanMadeForYou.length) {
    console.warn(`Removed ${cleanMadeForYou.length - result.madeForYou.length} duplicate songs from madeForYou`);
  }
  
  return result;
};

/**
 * Get backup songs from allSongs if a section has too few songs
 */
export const getBackupSongs = (
  currentSongs: Song[],
  allSongs: Song[],
  targetCount: number,
  excludeSongsList: Song[]
): Song[] => {
  if (currentSongs.length >= targetCount) return currentSongs;
  
  const excludeIds = new Set([
    ...currentSongs.map(s => s._id.toString()),
    ...excludeSongsList.map(s => s._id.toString())
  ]);
  
  const availableBackups = allSongs.filter(song => !excludeIds.has(song._id.toString()));
  
  const needed = targetCount - currentSongs.length;
  const backups = availableBackups.slice(0, needed);
  
  if (backups.length < needed) {
    console.warn(`Only found ${backups.length} backup songs out of ${needed} needed`);
  }
  
  return [...currentSongs, ...backups];
};