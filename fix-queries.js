const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src/app'));

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace arrays
    const arrayRegex = /\.then\(\(r\)\s*=>\s*r\.data\.data\s*as\s*([a-zA-Z]+)\[\]\)/g;
    if (arrayRegex.test(content)) {
      content = content.replace(arrayRegex, '.then((r) => (r.data.data as $1[]) || [])');
      changed = true;
    }

    // Replace objects/single values
    const singleRegex = /\.then\(\(r\)\s*=>\s*r\.data\.data\s*as\s*([a-zA-Z]+)\)/g;
    if (singleRegex.test(content)) {
      content = content.replace(singleRegex, '.then((r) => (r.data.data as $1) || null)');
      changed = true;
    }

    // Replace complex types
    const complexRegex = /\.then\(\(r\)\s*=>\s*r\.data\.data\s*as\s*(\{.*?\})\)/g;
    if (complexRegex.test(content)) {
      content = content.replace(complexRegex, '.then((r) => (r.data.data as $1) || null)');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
