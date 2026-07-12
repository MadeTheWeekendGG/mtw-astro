// Conditional build: only run the Tina admin build if cloud keys are present.
// This lets the site deploy before Tina Cloud is connected, then automatically
// switches on the /admin editor once the two env vars are added in Vercel.
import { execSync } from 'node:child_process';

const hasTinaKeys = process.env.PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN;

try {
  if (hasTinaKeys) {
    console.log('Tina keys found → building admin editor + site');
    execSync('tinacms build && astro build', { stdio: 'inherit' });
  } else {
    console.log('No Tina keys yet → building site only (admin editor will activate once keys are added in Vercel)');
    execSync('astro build', { stdio: 'inherit' });
  }
} catch (err) {
  process.exit(1);
}
