import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let user = '';
let pass = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('EMAIL_USER=')) user = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('EMAIL_PASS=')) pass = line.split('=')[1].trim().replace(/['"]/g, '');
});

console.log("Found EMAIL_USER:", user);
console.log("Found EMAIL_PASS length:", pass.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
});

async function testMail() {
  console.log("Testing Nodemailer with personal email...");
  try {
    await transporter.verify();
    console.log("✅ Nodemailer connected successfully! Authentication passed.");
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
  }
}

testMail();
