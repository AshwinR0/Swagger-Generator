
import * as jsYaml from 'js-yaml';
import { OpenApiSpec } from "@/types/OpenApiTypes";

export function generateYaml(spec: OpenApiSpec): string {
  try {
    // Do some clean up to remove empty objects and undefined values
    const cleanSpec = cleanupSpec(JSON.parse(JSON.stringify(spec)));
    return jsYaml.dump(cleanSpec, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
  } catch (error) {
    console.error("Error generating YAML:", error);
    throw error;
  }
}

export function parseYaml(yamlString: string): OpenApiSpec {
  try {
    const spec = jsYaml.load(yamlString) as OpenApiSpec;
    return spec;
  } catch (error) {
    console.error("Error parsing YAML:", error);
    throw error;
  }
}

// Helper function to clean up the spec object before generating YAML
function cleanupSpec(obj: any): any {
  // Base cases
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    const cleanArray = obj
      .map(item => cleanupSpec(item))
      .filter(item => item !== undefined);
    return cleanArray.length ? cleanArray : undefined;
  }
  
  // For objects
  const cleanObj: any = {};
  let isEmpty = true;
  
  for (const key in obj) {
    const cleanValue = cleanupSpec(obj[key]);
    if (cleanValue !== undefined) {
      cleanObj[key] = cleanValue;
      isEmpty = false;
    }
  }
  
  return isEmpty ? undefined : cleanObj;
}

// Function to indent a YAML string (for better display)
export function indentYaml(yamlString: string, spaces: number = 2): string {
  const indent = ' '.repeat(spaces);
  return yamlString.split('\n').map(line => indent + line).join('\n');
}
