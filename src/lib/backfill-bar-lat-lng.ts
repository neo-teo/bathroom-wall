// // to run this script: cd src/lib && npx tsx backfill-bar-lat-lng.ts

// import { db } from "./db";

// const backfillBarUniqueName = async () => {
//     const barsToFix = await db.bar.findMany({});

//     for (let bar of barsToFix) {
//         try {
//             console.log("-------------------");

//             const response = await fetch(
//                 `https://maps.googleapis.com/maps/api/place/details/json?place_id=${bar.googleId}&key=${"api-key"}`
//             );
//             if (!response.ok) throw new Error(`Error: ${response.statusText}`);

//             const data = await response.json();
//             if (data.status !== 'OK') throw new Error(`API Error: ${data.error_message || 'Unknown error'}`);

//             console.log("fixing", bar.uniqueName);
//             console.log("lat", data.result.geometry.location.lat);
//             console.log("lng", data.result.geometry.location.lng);

//             await db.bar.update({
//                 where: {
//                     id: bar.id
//                 },
//                 data: {
//                     lat: data.result.geometry.location.lat.toString(),
//                     lng: data.result.geometry.location.lng.toString()
//                 }
//             });

//         } catch (error) {
//             console.error(`Failed to fix ${bar.uniqueName}:\n`, error);
//         }
//     }
// }

// backfillBarUniqueName()
//     .catch((e) => {
//         throw e;
//     })
//     .finally(async () => {
//         // await db.$disconnect();
//     });