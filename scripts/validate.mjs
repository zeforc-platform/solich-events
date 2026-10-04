import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const schemaDir = path.resolve('schema/v1');
const schemas = {};

// Load all schemas
for (const file of fs.readdirSync(schemaDir)) {
  if (file.endsWith('.schema.json')) {
    const filePath = path.join(schemaDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    schemas[file] = content;
    ajv.addSchema(content);
  }
}

const manifestValidate = ajv.compile(schemas['manifest.schema.json']);
const holidayCatalogValidate = ajv.compile(schemas['holiday-catalog.schema.json']);
const internationalCatalogValidate = ajv.compile(schemas['international-observance-catalog.schema.json']);
const overridesValidate = ajv.compile(schemas['official-overrides.schema.json']);

let hasError = false;
let validatedCount = 0;

function validateFile(filePath, validator, typeName) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const valid = validator(content);
  if (!valid) {
    console.error(`❌ [${typeName}] Validation failed for: ${filePath}`);
    for (const err of validator.errors) {
      console.error(`   - ${err.instancePath || '/'}: ${err.message}`, err.params);
    }
    hasError = true;
  } else {
    console.log(`✅ [${typeName}] ${filePath}`);
    validatedCount++;
  }
}

function scanDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.json')) {
      if (entry.name === 'manifest.json') {
        validateFile(fullPath, manifestValidate, 'Manifest');
      } else if (fullPath.includes('/international/observances/catalog.json')) {
        validateFile(fullPath, internationalCatalogValidate, 'International Observance');
      } else if (fullPath.endsWith('/catalog.json')) {
        validateFile(fullPath, holidayCatalogValidate, 'Catalog');
      } else if (fullPath.includes('/official/overrides/')) {
        validateFile(fullPath, overridesValidate, 'Overrides');
      }
    }
  }
}

console.log('🚀 Starting Schema Validation for solich-events...\n');
scanDir(path.resolve('data/v1'));

console.log(`\n📊 Total validated files: ${validatedCount}`);
if (hasError) {
  console.error('\n❌ Validation finished with errors!');
  process.exit(1);
} else {
  console.log('\n✨ All files passed schema validation successfully!');
}
