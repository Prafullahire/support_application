import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-prafull-ahire-Desktop-Support-App',
  'assets',
  'c__Users_prafull.ahire_AppData_Roaming_Cursor_User_workspaceStorage_a38a940cfb3131a2370d7a1e79d95a9f_images_image-837b0eb7-c77a-4f45-abf0-ffb7ec1196b6.png',
);
const destDir = join(root, 'public', 'images');
const dest = join(destDir, 'admin-user-avatar.png');

if (!existsSync(src)) {
  console.error('Source avatar not found:', src);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('Copied avatar to', dest);
