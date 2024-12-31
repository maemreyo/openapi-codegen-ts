import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const inputDir = './examples/input/pfp'; // Update with your input directory
const outputFile = path.join(inputDir, 'openapi.yaml');

function updateRefs(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  for (const key in obj) {
    if (key === '$ref') {
      obj[key] = obj[key].replace(/\.\.\//g, '#/');
      obj[key] = obj[key].replace(/\.yaml/g, '');
    } else {
      updateRefs(obj[key]);
    }
  }
}

function processFiles() {
  const components: any = {};
  const paths: any = {};

  const componentFiles = fs.readdirSync(path.join(inputDir, 'components'));
  for (const componentDir of componentFiles) {
    if (componentDir === 'examples') {
      continue;
    }
    components[componentDir] = {};
    const componentDirPath = path.join(inputDir, 'components', componentDir);
    const files = fs.readdirSync(componentDirPath);
    for (const file of files) {
      const filePath = path.join(componentDirPath, file);
      const fileContent = yaml.load(fs.readFileSync(filePath, 'utf8'));
      const fileName = path.basename(file, path.extname(file));
      components[componentDir][fileName] = fileContent;
    }
  }

  const pathFiles = fs.readdirSync(path.join(inputDir, 'paths'));
  for (const pathDir of pathFiles) {
    paths[pathDir] = {};
    const pathDirPath = path.join(inputDir, 'paths', pathDir);
    const files = fs.readdirSync(pathDirPath);
    for (const file of files) {
      const filePath = path.join(pathDirPath, file);
      const fileContent = yaml.load(fs.readFileSync(filePath, 'utf8'));
      const fileName = path.basename(file, path.extname(file));
      paths[pathDir][fileName] = fileContent;
    }
  }

  const openapiYaml = yaml.load(fs.readFileSync(outputFile, 'utf8')) as any;
  openapiYaml.components = components;
  openapiYaml.paths = paths;
  updateRefs(openapiYaml);

  const updatedYaml = yaml.dump(openapiYaml);
  fs.writeFileSync(outputFile, updatedYaml);
}

processFiles();

console.log('OpenAPI files updated successfully!');
