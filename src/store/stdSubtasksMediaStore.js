
// import { create } from 'zustand'; 
// import { fetchStudioMedia } from '../services/studioapiservices';

// const BASE_S3_URL= import.meta.env.VITE_STUDIO_ROOMS_BASE_S3_URL


// export const useMediaStore = create((set, get) => ({
//   media: {}, 
//   fetchMediaForSubTask: async (subTaskId, mediaPath, forceRefetch = false) => {
//     const existing = get().media[subTaskId];
//     const now = Date.now();
//     const cacheDuration = 5 * 60 * 1000; 

//     if (existing && !forceRefetch && now - existing.timestamp < cacheDuration) {
//       return existing;
//     }

//     try {
//       let mediaData = [];

//       if (mediaPath && typeof mediaPath === 'object') {
       
//         const { images = {}, videos = {} } = mediaPath;

//         const processMediaItems = (items, type) =>
//           Object.entries(items)
//             .filter(([category, urls]) => Array.isArray(urls) && urls.length > 0)
//             .flatMap(([category, urls]) =>
//               urls
//                 .filter((url) => {
//                   const isValidUrl =
//                     typeof url === 'string' &&
//                     url.match(/\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i) &&
//                     !url.endsWith('/');
//                   if (!isValidUrl) {
//                     console.warn(`Invalid or unsupported media URL in ${type} ${category}: ${url}`);
//                   }
//                   return isValidUrl;
//                 })
//                 .map((url) => {
//                   const fullUrl = url.startsWith('http') ? url : `${BASE_S3_URL}/${url.replace(/^\//, '')}`;
//                   return {
//                     url: fullUrl,
//                     type: type === 'images' ? 'image' : 'video',
//                     category,
//                   };
//                 })
//             );

//         mediaData = [...processMediaItems(images, 'images'), ...processMediaItems(videos, 'videos')];
//       } else {
      
//         mediaData = await fetchStudioMedia({ sub_task_id: subTaskId });
//       }

//       const before = mediaData.filter((item) => item.category === 'before');
//       const after = mediaData.filter((item) => item.category === 'after');

//       const formattedMedia = { before, after, timestamp: now };
//       set((state) => ({
//         media: { ...state.media, [subTaskId]: formattedMedia },
//       }));
//       return formattedMedia;
//     } catch (error) {
//       console.error(`Failed to process media for subTaskId ${subTaskId}:`, error);
//       const emptyMedia = { before: [], after: [], timestamp: now };
//       set((state) => ({
//         media: { ...state.media, [subTaskId]: emptyMedia },
//       }));
//       return emptyMedia;
//     }
//   },
//   clearMedia: (subTaskId) => {
//     set((state) => {
//       const newMedia = { ...state.media };
//       delete newMedia[subTaskId];
//       return { media: newMedia };
//     });
//   },
// }));

// src/store/stdSubtasksMediaStore.js
import { create } from 'zustand';
import { fetchStudioMedia } from '../services/studioapiservices';

const BASE_S3_URL = import.meta.env.VITE_STUDIO_ROOMS_BASE_S3_URL;

export const useMediaStore = create((set, get) => ({
  media: {},
  fetchMediaForSubTask: async (subTaskId, mediaPath, forceRefetch = false) => {
    const existing = get().media[subTaskId];
    const now = Date.now();
    const cacheDuration = 5 * 60 * 1000;

    if (existing && !forceRefetch && now - existing.timestamp < cacheDuration) {
      return existing;
    }

    try {
      let mediaData = [];

      if (mediaPath && typeof mediaPath === 'object') {
        const { images = {}, videos = {} } = mediaPath;

        const processMediaItems = (items, type) =>
          Object.entries(items)
            .filter(([category, urls]) => Array.isArray(urls) && urls.length > 0)
            .flatMap(([category, urls]) =>
              urls
                .filter((url) => {
                  const isValidUrl =
                    typeof url === 'string' &&
                    url.match(/\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i) &&
                    !url.endsWith('/');
                  if (!isValidUrl) {
                    console.warn(`Invalid or unsupported media URL in ${type} ${category}: ${url}`);
                  }
                  return isValidUrl;
                })
                .map((url) => {
                  // Ensure URLs are absolute; assume BASE_S3_URL includes protocol
                  const fullUrl = url.startsWith('http') ? url : `${BASE_S3_URL}/${url.replace(/^\//, '')}`;
                  return {
                    url: fullUrl,
                    type: type === 'images' ? 'image' : 'video',
                    category,
                  };
                })
            );

        mediaData = [...processMediaItems(images, 'images'), ...processMediaItems(videos, 'videos')];
      } else {
        // Assume fetchStudioMedia returns signed URLs or handles permissions
        mediaData = await fetchStudioMedia({ sub_task_id: subTaskId });
      }

      // Validate media URLs (optional: add logic to verify URL accessibility)
      const before = mediaData.filter((item) => item.category === 'before');
      const after = mediaData.filter((item) => item.category === 'after');

      const formattedMedia = { before, after, timestamp: now };
      set((state) => ({
        media: { ...state.media, [subTaskId]: formattedMedia },
      }));
      return formattedMedia;
    } catch (error) {
      console.error(`Failed to process media for subTaskId ${subTaskId}:`, error);
      const emptyMedia = { before: [], after: [], timestamp: now };
      set((state) => ({
        media: { ...state.media, [subTaskId]: emptyMedia },
      }));
      return emptyMedia;
    }
  },
  clearMedia: (subTaskId) => {
    set((state) => {
      const newMedia = { ...state.media };
      delete newMedia[subTaskId];
      return { media: newMedia };
    });
  },
}));