import {Pool} from 'pg';
import config from '.';

export const pool = new Pool({
    connectionString : config.dbConnectionString
})

const initDB = async ()=>{


    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(250) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50)
        );
        
        `)


    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(100) CHECK (type IN ('car', 'bike', 'truck','SUV')) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10,2) CHECK (daily_rent_price > 0) NOT NULL,
        availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'
       
        );
        `)

    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date >= rent_start_date),
        total_price NUMERIC(10,2) CHECK (total_price > 0) NOT NULL,
        status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'returned'))
        );
        `)
}

export default initDB;