
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpenApiSpec, SecurityScheme } from "@/types/OpenApiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash, ChevronRight } from "lucide-react";

interface SecuritySchemesFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const SecuritySchemesForm = ({ spec, setSpec }: SecuritySchemesFormProps) => {
  const [newSchemeName, setNewSchemeName] = useState("");
  const [newSchemeType, setNewSchemeType] = useState<string>("http");
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  
  const securitySchemes = spec.components?.securitySchemes || {};
  
  const addScheme = () => {
    if (!newSchemeName.trim()) return;
    
    if (securitySchemes[newSchemeName]) return; // Scheme already exists
    
    // Create default values based on type
    let newScheme: SecurityScheme = {
      type: newSchemeType as "apiKey" | "http" | "oauth2" | "openIdConnect",
      description: ""
    };
    
    if (newSchemeType === "apiKey") {
      newScheme = {
        ...newScheme,
        name: "api_key",
        in: "header"
      };
    } else if (newSchemeType === "http") {
      newScheme = {
        ...newScheme,
        scheme: "bearer"
      };
    }
    
    const updatedComponents = {
      ...spec.components,
      securitySchemes: {
        ...securitySchemes,
        [newSchemeName]: newScheme
      }
    };
    
    setSpec({
      ...spec,
      components: updatedComponents
    });
    
    setNewSchemeName("");
    setSelectedScheme(newSchemeName);
  };
  
  const removeScheme = (name: string) => {
    const updatedSchemes = { ...securitySchemes };
    delete updatedSchemes[name];
    
    setSpec({
      ...spec,
      components: {
        ...spec.components,
        securitySchemes: updatedSchemes
      }
    });
    
    if (selectedScheme === name) {
      setSelectedScheme(null);
    }
  };
  
  const updateScheme = (name: string, field: string, value: string) => {
    setSpec({
      ...spec,
      components: {
        ...spec.components,
        securitySchemes: {
          ...securitySchemes,
          [name]: {
            ...securitySchemes[name],
            [field]: value
          }
        }
      }
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Security scheme name"
              value={newSchemeName}
              onChange={(e) => setNewSchemeName(e.target.value)}
              className="flex-1"
            />
            <Select value={newSchemeType} onValueChange={setNewSchemeType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="http">HTTP Authentication</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                <SelectItem value="openIdConnect">OpenID Connect</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addScheme} disabled={!newSchemeName.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.keys(securitySchemes).length > 0 ? (
              <div className="space-y-2">
                {Object.keys(securitySchemes).map((name) => (
                  <div
                    key={name}
                    className={`p-3 border rounded-md flex items-center justify-between cursor-pointer ${
                      selectedScheme === name ? "border-swagger-blue bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedScheme(name)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{name}</span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        {securitySchemes[name].type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScheme(name);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-swagger-red hover:text-swagger-red"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScheme(name);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-muted-foreground">No security schemes defined yet.</p>
              </div>
            )}
          </div>
          
          {selectedScheme && (
            <div className="p-4 border rounded-md space-y-4">
              <h3 className="font-medium text-lg">{selectedScheme}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="scheme-type">Type</Label>
                <Input
                  id="scheme-type"
                  value={securitySchemes[selectedScheme].type}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheme-description">Description</Label>
                <Textarea
                  id="scheme-description"
                  placeholder="Describe this security scheme"
                  value={securitySchemes[selectedScheme].description || ""}
                  onChange={(e) => updateScheme(selectedScheme, "description", e.target.value)}
                />
              </div>
              
              {securitySchemes[selectedScheme].type === "http" && (
                <div className="space-y-2">
                  <Label htmlFor="http-scheme">Scheme</Label>
                  <Select 
                    value={securitySchemes[selectedScheme].scheme || "bearer"} 
                    onValueChange={(value) => updateScheme(selectedScheme, "scheme", value)}
                  >
                    <SelectTrigger id="http-scheme">
                      <SelectValue placeholder="Select scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="bearer">Bearer</SelectItem>
                      <SelectItem value="digest">Digest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {securitySchemes[selectedScheme].scheme === "bearer" && (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="bearer-format">Bearer Format</Label>
                      <Input
                        id="bearer-format"
                        placeholder="e.g., JWT"
                        value={securitySchemes[selectedScheme].bearerFormat || ""}
                        onChange={(e) => updateScheme(selectedScheme, "bearerFormat", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {securitySchemes[selectedScheme].type === "apiKey" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apikey-name">API Key Name</Label>
                    <Input
                      id="apikey-name"
                      placeholder="e.g., X-API-KEY"
                      value={securitySchemes[selectedScheme].name || ""}
                      onChange={(e) => updateScheme(selectedScheme, "name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apikey-in">In</Label>
                    <Select 
                      value={securitySchemes[selectedScheme].in || "header"} 
                      onValueChange={(value) => updateScheme(selectedScheme, "in", value)}
                    >
                      <SelectTrigger id="apikey-in">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="query">Query</SelectItem>
                        <SelectItem value="cookie">Cookie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySchemesForm;
