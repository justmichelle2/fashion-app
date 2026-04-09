#!/usr/bin/env node

import { Storage } from '@google-cloud/storage';

const projectId = 'fashion-app-a5b92';

async function listBuckets() {
  const storage = new Storage({
    projectId,
  });

  try {
    console.log('Checking available buckets...');
    const [buckets] = await storage.getBuckets();
    console.log('Available buckets:');
    buckets.forEach(bucket => console.log(`  - ${bucket.name}`));
    return buckets.map(b => b.name);
  } catch (error) {
    console.error('Error listing buckets:', error.message);
    return [];
  }
}

const corsConfiguration = [
  {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:*', 'http://127.0.0.1:*'],
    method: ['GET', 'HEAD', 'DELETE', 'POST', 'PUT', 'OPTIONS'],
    responseHeader: ['Content-Type', 'x-goog-meta-goog-encryption-algorithm', 'x-goog-encryption-algorithm', 'x-goog-encryption-key'],
    maxAgeSeconds: 3600,
  },
];

async function setCors(bucketName) {
  const storage = new Storage({
    projectId,
  });

  const bucket = storage.bucket(bucketName);

  try {
    console.log(`\nSetting CORS configuration on bucket ${bucketName}...`);
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('✅ CORS configuration set successfully!');
  } catch (error) {
    console.error('❌ Error setting CORS:', error.message);
    return false;
  }
  return true;
}

async function main() {
  const buckets = await listBuckets();
  
  if (buckets.length === 0) {
    console.error('No buckets found!');
    process.exit(1);
  }

  // Try the first bucket
  const success = await setCors(buckets[0]);
  
  if (!success && buckets.length > 1) {
    console.log('\nTrying next bucket...');
    await setCors(buckets[1]);
  }
}

main();
