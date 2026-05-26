const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern, callback) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, pattern, callback);
    } else if (file.match(pattern)) {
      callback(filePath);
    }
  });
}

const nodeModulesPath = path.join(__dirname, '../../node_modules/.pnpm');
const targetDir = path.join(__dirname, '../.next/server/node_modules/@prisma/engines');

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let copied = 0;
  const sourcePattern = /libquery_engine.*\.so\.node$/;

  findFiles(nodeModulesPath, sourcePattern, (file) => {
    const filename = path.basename(file);
    const targetFile = path.join(targetDir, filename);

    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(file, targetFile);
      copied++;
      console.log(`✓ Copied: ${filename}`);
    }
  });

  console.log(`\n✓ Successfully copied ${copied} Prisma engine files`);
} catch (error) {
  console.warn('Warning: Could not copy Prisma engines:', error.message);
}
