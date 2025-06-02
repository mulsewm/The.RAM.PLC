#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Path to the .env file
const envPath = path.resolve(process.cwd(), '.env');

// Read the current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

// Check if DATABASE_URL already exists
if (envContent.includes('DATABASE_URL=')) {
  console.log('DATABASE_URL already exists in .env file');
  process.exit(0);
}

// Construct DATABASE_URL from individual variables
const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB
} = process.env;

// Validate required environment variables
if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_DB) {
  console.error('Missing required PostgreSQL environment variables');
  console.log('Required variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB');
  process.exit(1);
}

// Construct the DATABASE_URL
const databaseUrl = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

// Add DATABASE_URL to .env file
const newEnvContent = `${envContent}\n# Auto-generated DATABASE_URL\nDATABASE_URL="${databaseUrl}"\n`;

// Write the updated .env file
try {
  fs.writeFileSync(envPath, newEnvContent);
  console.log(`Added DATABASE_URL to .env file: ${databaseUrl}`);
} catch (error) {
  console.error('Error writing .env file:', error);
  process.exit(1);
}
