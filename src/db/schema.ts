import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const cpuBrandsTable = sqliteTable('cpu_brands', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	value: text('value').notNull().unique()
});

export const cpuSocketsTable = sqliteTable('cpu_sockets', {
	id: integer('id').primaryKey(),
	brandId: integer('brand_id').references(() => cpuBrandsTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	value: text('value').notNull().unique()
});

export const cpuModelsTable = sqliteTable('cpu_models', {
	id: integer('id').primaryKey(),
	socketId: integer('socket_id').references(() => cpuSocketsTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	value: text('value').notNull().unique()
});

export const suppliersTable = sqliteTable('suppliers', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	value: text('value').notNull().unique()
});

export const listingsTable = sqliteTable('listings', {
	id: integer('id').primaryKey(),
	supplierId: integer('supplier_id').references(() => suppliersTable.id, { onDelete: 'cascade' }),
	cpuModelId: integer('cpu_model_id').references(() => cpuModelsTable.id, { onDelete: 'cascade' }),
	price: integer('price').notNull(),
	shippingCost: integer('shipping').notNull(),
	url: text('url').notNull(),
	lastUpdated: integer('last_updated').notNull()
});
