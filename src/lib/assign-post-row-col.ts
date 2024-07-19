// // to run this script: cd src/lib && npx tsx backfill-bar-lat-lng.ts

// import { db } from "./db";
// import { calculateFreeSpots, popFreeSpot, postIsOutOfBounds } from "./utils/tileWallUtils";

// const assignPostsForAllBars = async () => {
//     const barsToFix = await db.bar.findMany({
//         include: {
//             posts: {
//                 include: {
//                     media: {}
//                 },
//                 orderBy: {
//                     date: 'desc'
//                 },
//             }
//         }
//     });

//     let barCounter = 1;
//     for (const bar of barsToFix) {
//         const freeSpots = calculateFreeSpots(bar.posts);

//         let counter = 1;

//         for (let i = 0; i < bar.posts.length; i++) {
//             const post = bar.posts[i];

//             if (postIsOutOfBounds(post)) {
//                 const freeSpot = popFreeSpot(freeSpots);
//                 if (freeSpot) {
//                     const [row, col] = freeSpot.split(",");

//                     await db.post.update({
//                         where: { id: post.id },
//                         data: {
//                             row: +row,
//                             col: +col,
//                         },
//                         include: {
//                             media: {}
//                         }
//                     });

//                     console.log(`Placed post ${counter}/${bar.posts.length} at position (${+row}, ${+col})`);
//                     counter++;
//                 }
//             }
//         }

//         console.log(`Fixed bar ${bar.name}, ${barCounter}/${barsToFix.length}`);
//         barCounter++;
//     }

// }

// const emptyPostsForAllBars = async () => {
//     const barsToFix = await db.bar.findMany({
//         include: {
//             posts: {
//                 include: {
//                     media: {}
//                 },
//                 orderBy: {
//                     date: 'desc'
//                 },
//             }
//         }
//     });

//     let barCounter = 1;
//     for (const bar of barsToFix) {
//         let counter = 1;

//         for (let i = 0; i < bar.posts.length; i++) {
//             const post = bar.posts[i];
//             await db.post.update({
//                 where: { id: post.id },
//                 data: {
//                     row: null,
//                     col: null,
//                 },
//                 include: {
//                     media: {}
//                 }
//             });

//             console.log(`Unset post ${counter}/${bar.posts.length}`);
//             counter++;
//         }

//         console.log(`Fixed bar ${bar.name}, ${barCounter}/${barsToFix.length}`);
//         barCounter++;
//     }
// }

// assignPostsForAllBars()
//     .catch((e) => {
//         throw e;
//     })
//     .finally(async () => {
//         await db.$disconnect();
//     });