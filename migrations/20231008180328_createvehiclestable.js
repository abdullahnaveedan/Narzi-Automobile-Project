/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('vehicles', (table) => {
      table.increments('id').primary();
      table.integer('brand_id').unsigned().notNullable().references('id').inTable('brands');
      table.string('name', 100).notNullable();
      table.string('license_plate', 20).notNullable().unique();
      table.string('vin', 17).notNullable().unique();
      table.integer('year').notNullable(); // corrected check constraint
      table.string('color', 50).notNullable();
      table.string('insurance_provider', 100).notNullable();
      table.string('policy_number', 50).notNullable();
      table.integer('mileage').notNullable().unsigned();
      table.enu('fuel_type', ['petrol', 'diesel']).notNullable();
      table.integer('fuel_efficiency').notNullable().unsigned();
      table.integer('seating_capacity').notNullable().unsigned();
      table.enu('transmission', ['automatic', 'manual']).notNullable();
      table.string('pickup_location', 100).notNullable();
      table.string('dropoff_location', 100).notNullable();
      table.string('contact_person', 100).notNullable();
      table.string('phone_number', 20).notNullable();
      table.string('email_address', 100).notNullable();
      table.text('additional_features');
      table.text('service_history');
      table.enu('vehicle_type', ['normal', 'buy', 'sell']).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
      table.integer('status').defaultTo(1);
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('vehicles');
};
