
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Schema } from "@/types/OpenApiTypes";
import { Plus, Trash } from "lucide-react";

interface SchemaFormProps {
  schema: Schema;
  onChange: (schema: Schema) => void;
  isRequired: boolean;
}

const SchemaForm = ({ schema, onChange, isRequired }: SchemaFormProps) => {
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyType, setNewPropertyType] = useState<string>("string");
  const [newPropertyRequired, setNewPropertyRequired] = useState(false);
  
  const handleTypeChange = (type: string) => {
    let updatedSchema: Schema = { ...schema, type };
    
    // Reset properties when changing types
    if (type === "object") {
      updatedSchema.properties = updatedSchema.properties || {};
      delete updatedSchema.items;
    } else if (type === "array") {
      updatedSchema.items = updatedSchema.items || { type: "string" };
      delete updatedSchema.properties;
    } else {
      delete updatedSchema.properties;
      delete updatedSchema.items;
    }
    
    onChange(updatedSchema);
  };
  
  const addProperty = () => {
    if (!newPropertyName.trim() || schema.type !== "object") return;
    
    // Avoid duplicate properties
    if (schema.properties?.[newPropertyName]) return;
    
    const updatedSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        [newPropertyName]: { type: newPropertyType }
      }
    };
    
    // Add to required array if needed
    if (newPropertyRequired) {
      updatedSchema.required = [
        ...(schema.required || []),
        newPropertyName
      ];
    }
    
    onChange(updatedSchema);
    setNewPropertyName("");
    setNewPropertyType("string");
    setNewPropertyRequired(false);
  };
  
  const removeProperty = (name: string) => {
    const { [name]: _, ...remainingProperties } = schema.properties || {};
    
    // Also remove from required array if present
    const updatedRequired = (schema.required || []).filter(prop => prop !== name);
    
    onChange({
      ...schema,
      properties: remainingProperties,
      required: updatedRequired.length > 0 ? updatedRequired : undefined
    });
  };
  
  const updatePropertyType = (name: string, type: string) => {
    onChange({
      ...schema,
      properties: {
        ...schema.properties,
        [name]: { 
          ...schema.properties?.[name],
          type 
        }
      }
    });
  };
  
  const togglePropertyRequired = (name: string, isRequired: boolean) => {
    let updatedRequired: string[] = [...(schema.required || [])];
    
    if (isRequired) {
      if (!updatedRequired.includes(name)) {
        updatedRequired.push(name);
      }
    } else {
      updatedRequired = updatedRequired.filter(prop => prop !== name);
    }
    
    onChange({
      ...schema,
      required: updatedRequired.length > 0 ? updatedRequired : undefined
    });
  };
  
  const isPropertyRequired = (name: string): boolean => {
    return (schema.required || []).includes(name);
  };
  
  const updateArrayItemsType = (type: string) => {
    onChange({
      ...schema,
      items: { type }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="schema-type">Schema Type</Label>
        <Select value={schema.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="schema-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="integer">Integer</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {schema.type === "object" && (
        <div className="space-y-4">
          <div className="space-y-4">
            {schema.properties && Object.keys(schema.properties).length > 0 ? (
              Object.keys(schema.properties).map((name) => (
                <div key={name} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{name}</span>
                      {isPropertyRequired(name) && (
                        <span className="text-xs px-2 py-1 bg-swagger-red text-white rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => removeProperty(name)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor={`prop-type-${name}`}>Type</Label>
                      <Select 
                        value={schema.properties[name].type} 
                        onValueChange={(type) => updatePropertyType(name, type)}
                      >
                        <SelectTrigger id={`prop-type-${name}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="integer">Integer</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id={`prop-required-${name}`}
                        checked={isPropertyRequired(name)}
                        onCheckedChange={(checked) => togglePropertyRequired(name, checked)}
                      />
                      <Label htmlFor={`prop-required-${name}`}>Required</Label>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">No properties defined.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border rounded-md">
            <h4 className="font-medium mb-3">Add New Property</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="new-prop-name">Name</Label>
                <Input
                  id="new-prop-name"
                  placeholder="Property name"
                  value={newPropertyName}
                  onChange={(e) => setNewPropertyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-prop-type">Type</Label>
                <Select value={newPropertyType} onValueChange={setNewPropertyType}>
                  <SelectTrigger id="new-prop-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 mb-3">
              <Switch
                id="new-prop-required"
                checked={newPropertyRequired}
                onCheckedChange={setNewPropertyRequired}
              />
              <Label htmlFor="new-prop-required">Required</Label>
            </div>
            
            <Button 
              onClick={addProperty} 
              disabled={!newPropertyName.trim()}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </div>
        </div>
      )}
      
      {schema.type === "array" && (
        <div className="space-y-2">
          <Label htmlFor="array-items-type">Item Type</Label>
          <Select 
            value={schema.items?.type || "string"} 
            onValueChange={updateArrayItemsType}
          >
            <SelectTrigger id="array-items-type">
              <SelectValue placeholder="Select item type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="integer">Integer</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default SchemaForm;
