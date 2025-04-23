
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Operation, Parameter } from "@/types/OpenApiTypes";
import { Trash } from "lucide-react";

interface ParametersFormProps {
  operation: Operation;
  updateOperation: (updatedOp: Partial<Operation>) => void;
}

const ParametersForm = ({ operation, updateOperation }: ParametersFormProps) => {
  const [newParameter, setNewParameter] = useState<Partial<Parameter>>({
    name: "",
    in: "query",
    description: "",
    required: false,
    schema: { type: "string" }
  });
  
  const addParameter = () => {
    if (!newParameter.name) return;
    
    const parameters = [...(operation.parameters || [])];
    parameters.push(newParameter as Parameter);
    
    updateOperation({ parameters });
    
    setNewParameter({
      name: "",
      in: "query",
      description: "",
      required: false,
      schema: { type: "string" }
    });
  };
  
  const removeParameter = (index: number) => {
    const parameters = [...(operation.parameters || [])];
    parameters.splice(index, 1);
    updateOperation({ parameters });
  };
  
  const updateParameter = (index: number, field: string, value: any) => {
    const parameters = [...(operation.parameters || [])];
    
    if (field === "type") {
      parameters[index] = {
        ...parameters[index],
        schema: { ...parameters[index].schema, type: value }
      };
    } else {
      parameters[index] = { ...parameters[index], [field]: value };
    }
    
    updateOperation({ parameters });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {operation.parameters && operation.parameters.length > 0 ? (
          <div className="space-y-4">
            {operation.parameters.map((param, index) => (
              <div key={index} className="p-4 border rounded-md relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`param-name-${index}`}>Name</Label>
                    <Input
                      id={`param-name-${index}`}
                      value={param.name}
                      onChange={(e) => updateParameter(index, "name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`param-in-${index}`}>Location</Label>
                    <Select 
                      value={param.in} 
                      onValueChange={(value) => updateParameter(index, "in", value)}
                    >
                      <SelectTrigger id={`param-in-${index}`}>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="query">Query</SelectItem>
                        <SelectItem value="path">Path</SelectItem>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="cookie">Cookie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`param-type-${index}`}>Type</Label>
                    <Select 
                      value={param.schema?.type} 
                      onValueChange={(value) => updateParameter(index, "type", value)}
                    >
                      <SelectTrigger id={`param-type-${index}`}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor={`param-description-${index}`}>Description</Label>
                    <Input
                      id={`param-description-${index}`}
                      value={param.description || ""}
                      onChange={(e) => updateParameter(index, "description", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id={`param-required-${index}`}
                      checked={param.required || false}
                      onCheckedChange={(checked) => updateParameter(index, "required", checked)}
                    />
                    <Label htmlFor={`param-required-${index}`}>Required</Label>
                  </div>
                  
                  <div className="flex justify-end items-center pt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-swagger-red hover:text-swagger-red"
                      onClick={() => removeParameter(index)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No parameters defined.</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border rounded-md">
        <h4 className="text-sm font-medium mb-4">Add New Parameter</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-param-name">Name</Label>
            <Input
              id="new-param-name"
              value={newParameter.name}
              onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
              placeholder="Parameter name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-param-in">Location</Label>
            <Select 
              value={newParameter.in} 
              onValueChange={(value) => setNewParameter({ 
                ...newParameter, 
                in: value as "query" | "path" | "header" | "cookie" 
              })}
            >
              <SelectTrigger id="new-param-in">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="query">Query</SelectItem>
                <SelectItem value="path">Path</SelectItem>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="cookie">Cookie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-param-type">Type</Label>
            <Select 
              value={newParameter.schema?.type} 
              onValueChange={(value) => setNewParameter({ 
                ...newParameter, 
                schema: { ...newParameter.schema, type: value } 
              })}
            >
              <SelectTrigger id="new-param-type">
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
          
          <div className="space-y-2">
            <Label htmlFor="new-param-description">Description</Label>
            <Input
              id="new-param-description"
              value={newParameter.description || ""}
              onChange={(e) => setNewParameter({ ...newParameter, description: e.target.value })}
              placeholder="Parameter description"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="new-param-required"
              checked={newParameter.required || false}
              onCheckedChange={(checked) => setNewParameter({ ...newParameter, required: checked })}
            />
            <Label htmlFor="new-param-required">Required</Label>
          </div>
        </div>
        
        <Button 
          onClick={addParameter} 
          className="w-full mt-4"
          disabled={!newParameter.name}
        >
          Add Parameter
        </Button>
      </div>
    </div>
  );
};

export default ParametersForm;
