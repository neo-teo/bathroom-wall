// // to run this script: cd src/lib && npx tsx backfill-bar-unique-name.ts

// import { db } from "./db";
// import { normalizeToKebabCase } from "./utils/stringUtils";

// const backfillBarUniqueName = async () => {
//     const barsToFix = await db.bar.findMany({});

//     for (let bar of barsToFix) {
//         try {
//             const response = await fetch(
//                 `https://maps.googleapis.com/maps/api/place/details/json?place_id=${bar.googleId}&key=${"api-key"}`
//             );
//             if (!response.ok) throw new Error(`Error: ${response.statusText}`);

//             const data = await response.json();
//             if (data.status !== 'OK') throw new Error(`API Error: ${data.error_message || 'Unknown error'}`);

//             // getting location identifier
//             let location;
//             const priorityTypes = ['locality', 'sublocality_level_1', 'administrative_area_level_1', 'country'];
//             let foundComponent = undefined;

//             for (const type of priorityTypes) {
//                 foundComponent = data.result.place.address_components.find((component: any) =>
//                     component.types.includes(type)
//                 );

//                 if (foundComponent) {
//                     location = foundComponent.short_name;
//                     break; // Stop searching once a match is found.
//                 }
//             }

//             // constructing unique name
//             let normalizedName = normalizeToKebabCase(data.result.place.name);
//             let normalizedLocation = normalizeToKebabCase(location);

//             let uniqueName = normalizedName;

//             let counter = 0; // Used only for appending as a suffix if needed.

//             while (true) {
//                 const exists = await db.bar.findUnique({
//                     where: { uniqueName: uniqueName },
//                 });

//                 if (!exists) break; // Unique name found.

//                 uniqueName = counter === 0
//                     ? `${name}-${normalizedLocation}`
//                     : `${name}-${normalizedLocation}-${counter}`;

//                 counter++; // Increment to ensure uniqueness in the next iteration if needed.
//             }

//             await db.bar.update({
//                 where: {
//                     id: bar.id
//                 },
//                 data: {
//                     uniqueName: uniqueName
//                 }
//             });

//         } catch (error) {
//             console.error('Failed to fetch place details:', error);
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