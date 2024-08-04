import { z } from 'zod';
import { db } from '$db';
import { cpuBrandsTable, cpuSocketsTable, cpuModelsTable } from '$db/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { PageServerLoad } from './$types';

// Generate Zod schemas from Drizzle tables
const BrandSchema = createSelectSchema(cpuBrandsTable);
const SocketSchema = createSelectSchema(cpuSocketsTable);
const ModelSchema = createSelectSchema(cpuModelsTable);

// Infer types from Zod schemas
export type Brand = z.infer<typeof BrandSchema>;
export type Socket = z.infer<typeof SocketSchema>;
export type Model = z.infer<typeof ModelSchema>;

// Helper functions
async function fetchBrands(): Promise<Brand[]> {
	const brands = await db.select().from(cpuBrandsTable);
	return brands.map((brand) => BrandSchema.parse(brand));
}

async function fetchSockets(): Promise<Socket[]> {
	const sockets = await db
		.select({
			id: cpuSocketsTable.id,
			brandId: cpuSocketsTable.brandId,
			name: cpuSocketsTable.name,
			value: cpuSocketsTable.value
		})
		.from(cpuSocketsTable);
	return sockets.map((socket) => SocketSchema.parse(socket));
}

async function fetchModels(): Promise<Model[]> {
	const models = await db
		.select({
			id: cpuModelsTable.id,
			socketId: cpuModelsTable.socketId,
			name: cpuModelsTable.name,
			value: cpuModelsTable.value
		})
		.from(cpuModelsTable);
	return models.map((model) => ModelSchema.parse(model));
}

function organizeSocketsByBrand(sockets: Socket[], brands: Brand[]): Record<string, Socket[]> {
	const cpuSockets: Record<string, Socket[]> = {};
	for (const socket of sockets) {
		const brand = brands.find((b) => b.id === socket.brandId);
		if (brand) {
			if (!cpuSockets[brand.value]) {
				cpuSockets[brand.value] = [];
			}
			cpuSockets[brand.value].push(socket);
		}
	}
	return cpuSockets;
}

function organizeModelsByBrandAndSocket(
	models: Model[],
	sockets: Socket[],
	brands: Brand[]
): Record<string, Record<string, Model[]>> {
	const cpuModels: Record<string, Record<string, Model[]>> = {};
	for (const model of models) {
		if (model.socketId) {
			const socket = sockets.find((s) => s.id === model.socketId);
			const brand = brands.find((b) => b.id === socket?.brandId);
			if (brand && socket) {
				if (!cpuModels[brand.value]) {
					cpuModels[brand.value] = {};
				}
				if (!cpuModels[brand.value][socket.value]) {
					cpuModels[brand.value][socket.value] = [];
				}
				cpuModels[brand.value][socket.value].push(model);
			}
		}
	}
	return cpuModels;
}

export const load: PageServerLoad = async () => {
	try {
		const [cpuBrands, sockets, models] = await Promise.all([
			fetchBrands(),
			fetchSockets(),
			fetchModels()
		]);

		const cpuSockets = organizeSocketsByBrand(sockets, cpuBrands);
		const cpuModels = organizeModelsByBrandAndSocket(models, sockets, cpuBrands);

		return { cpuBrands, cpuSockets, cpuModels };
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			cpuBrands: [],
			cpuSockets: {},
			cpuModels: {}
		};
	}
};
