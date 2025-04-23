
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Upload, 
  FileText,
  Code
} from "lucide-react";
import { OpenApiSpec } from "@/types/OpenApiTypes";
import { generateYaml, parseYaml } from "@/utils/yamlUtils";

interface NavbarProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const Navbar = ({ spec, setSpec }: NavbarProps) => {
  const [isJsonExport, setIsJsonExport] = useState(false);
  
  const handleExport = () => {
    const fileName = `${spec.info.title.toLowerCase().replace(/\s+/g, '-')}-api-spec.${isJsonExport ? 'json' : 'yaml'}`;
    
    let content;
    if (isJsonExport) {
      content = JSON.stringify(spec, null, 2);
    } else {
      content = generateYaml(spec);
    }
    
    // Create a blob and download
    const blob = new Blob([content], { type: isJsonExport ? 'application/json' : 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedSpec = parseYaml(content);
        setSpec(parsedSpec);
      } catch (error) {
        console.error("Import failed:", error);
      }
    };
    reader.readAsText(file);

    // Reset the input value to enable re-importing the same file
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Code className="h-6 w-6 text-swagger-blue mr-2" />
        <h1 className="text-xl font-bold text-swagger-dark">Swagger YAML Generator</h1>
      </div>
      <div className="flex space-x-2">
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import YAML
          </Button>
          <Input
            id="file-input"
            type="file"
            accept=".yaml,.yml,.json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => {
            setIsJsonExport(true);
            handleExport();
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
        <Button
          variant="default"
          className="flex items-center bg-swagger-blue hover:bg-blue-700"
          onClick={() => {
            setIsJsonExport(false);
            handleExport();
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export YAML
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
