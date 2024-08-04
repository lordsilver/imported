import { db } from './index';
import {
	cpuBrandsTable,
	cpuSocketsTable,
	cpuModelsTable,
	suppliersTable,
	listingsTable
} from './schema';

async function seed() {
	// Insert Product Listings
	await db.insert(listingsTable).values([
		{
			supplierId: 17, // Amazon.it (new supplier, you might need to add this to the suppliersTable)
			cpuModelId: 5,
			price: 55299, // 552.99 € in cents
			shippingCost: 0, // Free shipping
			url: 'https://www.trovaprezzi.it/Prezzi_processori/Offerta_AMD_Ryzen_9_7950X3D.html',
			lastUpdated: Date.now()
		}
	]);
	console.log('Database seeded successfully');
}

seed().catch((error) => {
	console.error('Error seeding database:', error);
});
