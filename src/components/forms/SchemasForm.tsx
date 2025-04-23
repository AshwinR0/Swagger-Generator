
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SchemaForm from "./SchemaForm";
import { OpenApiSpec, Schema } from "@/types/OpenApiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash, ChevronRight } from "lucide-react";

interface SchemasFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const SchemasForm = ({ spec, setSpec }: SchemasFormProps) => {
  const [newSchemaName, setNewSchemaName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  
  const schemas = spec.components?.schemas || {};
  
  const addSchema = () => {
    if (!newSchemaName.trim()) return;
    
    if (schemas[newSchemaName]) return; // Schema already exists
    
    const updatedComponents = {
      ...spec.components,
      schemas: {
        ...schemas,
        [newSchemaName]: {
          type: "object",
          properties: {}
        }
      }
    };
    
    setSpec({
      ...spec,
      components: updatedComponents
    });
    
    setNewSchemaName("");
    setSelectedSchema(newSchemaName);
  };
  
  const removeSchema = (name: string) => {
    const updatedSchemas = { ...schemas };
    delete updatedSchemas[name];
    
    setSpec({
      ...spec,
      components: {
        ...spec.components,
        schemas: updatedSchemas
      }
    });
    
    if (selectedSchema === name) {
      setSelectedSchema(null);
    }
  };
  
  const updateSchemaDescription = (name: string, description: string) => {
    setSpec({
      ...spec,
      components: {
        ...spec.components,
        schemas: {
          ...schemas,
          [name]: {
            ...schemas[name],
            description
          }
        }
      }
    });
  };
  
  const updateSchema = (name: string, updatedSchema: Schema) => {
    setSpec({
      ...spec,
      components: {
        ...spec.components,
        schemas: {
          ...schemas,
          [name]: updatedSchema
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
              placeholder="Schema name (e.g., User, Order)"
              value={newSchemaName}
              onChange={(e) => setNewSchemaName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addSchema} disabled={!newSchemaName.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add Schema
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.keys(schemas).length > 0 ? (
              <div className="space-y-2">
                {Object.keys(schemas).map((name) => (
                  <div
                    key={name}
                    className={`p-3 border rounded-md flex items-center justify-between cursor-pointer ${
                      selectedSchema === name ? "border-swagger-blue bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedSchema(name)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{name}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {schemas[name].description || "No description"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchema(name);
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
                          removeSchema(name);
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
                <p className="text-muted-foreground">No schemas defined yet.</p>
              </div>
            )}
          </div>
          
          {selectedSchema && (
            <div className="p-4 border rounded-md space-y-4">
              <h3 className="font-medium text-lg">{selectedSchema}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="schema-description">Description</Label>
                <Textarea
                  id="schema-description"
                  placeholder="Schema description"
                  value={schemas[selectedSchema].description || ""}
                  onChange={(e) => updateSchemaDescription(selectedSchema, e.target.value)}
                />
              </div>
              
              <SchemaForm
                schema={schemas[selectedSchema]}
                onChange={(schema) => updateSchema(selectedSchema, schema)}
                isRequired={false}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemasForm;
