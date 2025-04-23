
import { useEffect, useState } from "react";
import { OpenApiSpec } from "@/types/OpenApiTypes";
import { generateYaml } from "@/utils/yamlUtils";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YamlPreviewProps {
  spec: OpenApiSpec;
}

const YamlPreview = ({ spec }: YamlPreviewProps) => {
  const [yamlContent, setYamlContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const yaml = generateYaml(spec);
      setYamlContent(yaml);
    } catch (error) {
      console.error("Error generating YAML:", error);
      setYamlContent("Error generating YAML");
    }
  }, [spec]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlContent);
    toast({
      title: "Copied!",
      description: "YAML copied to clipboard",
    });
  };

  return (
    <div className="relative h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-swagger-dark">YAML Preview</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center" 
          onClick={copyToClipboard}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy
        </Button>
      </div>
      
      <div className="relative h-[calc(100%-3rem)]">
        <pre 
          className="h-full overflow-auto p-4 bg-gray-50 border rounded-md text-sm font-mono whitespace-pre"
        >
          {yamlContent}
        </pre>
      </div>
    </div>
  );
};

export default YamlPreview;
