import { execSync } from 'child_process';
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;

if (!SUPABASE_PROJECT_ID) {
  console.error('Error: SUPABASE_PROJECT_ID is not defined');
  process.exit(1);
}

console.log('Generating types...');

const command = `npx supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} --schema public > ./src/types/supabase.ts`;

try {
  execSync(command, { stdio: 'inherit' });
  console.log('Types generated successfully');
} catch (error) {
  console.error('Error generating types:', error.message);
  process.exit(1);
}
