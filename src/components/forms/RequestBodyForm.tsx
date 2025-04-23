
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import SchemaForm from "./SchemaForm";
import { Operation, OpenApiSpec, Schema } from "@/types/OpenApiTypes";

interface RequestBodyFormProps {
  operation: Operation;
  updateOperation: (updatedOp: Partial<Operation>) => void;
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const RequestBodyForm = ({ 
  operation, 
  updateOperation,
  spec,
  setSpec
}: RequestBodyFormProps) => {
  const [contentType, setContentType] = useState<string>("application/json");
  const [useSchema, setUseSchema] = useState<boolean>(false);
  const [schemaRef, setSchemaRef] = useState<string>("");
  
  const requestBody = operation.requestBody || { 
    description: "",
    required: false,
    content: {}
  };
  
  const schema = requestBody.content?.[contentType]?.schema || { type: "object", properties: {} };
  
  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    
    // If switching content type, ensure we have a schema for it
    if (!requestBody.content?.[type]?.schema) {
      const updatedRequestBody = {
        ...requestBody,
        content: {
          ...(requestBody.content || {}),
          [type]: {
            schema: { type: "object", properties: {} }
          }
        }
      };
      
      updateOperation({ requestBody: updatedRequestBody });
    }
  };
  
  const handleDescriptionChange = (description: string) => {
    updateOperation({
      requestBody: {
        ...requestBody,
        description
      }
    });
  };
  
  const handleRequiredChange = (required: boolean) => {
    updateOperation({
      requestBody: {
        ...requestBody,
        required
      }
    });
  };
  
  const handleSchemaChange = (updatedSchema: Schema) => {
    updateOperation({
      requestBody: {
        ...requestBody,
        content: {
          ...(requestBody.content || {}),
          [contentType]: {
            ...(requestBody.content?.[contentType] || {}),
            schema: updatedSchema
          }
        }
      }
    });
  };
  
  const handleSchemaRefChange = (ref: string) => {
    setSchemaRef(ref);
    if (ref) {
      updateOperation({
        requestBody: {
          ...requestBody,
          content: {
            ...(requestBody.content || {}),
            [contentType]: {
              ...(requestBody.content?.[contentType] || {}),
              schema: { $ref: `#/components/schemas/${ref}` }
            }
          }
        }
      });
    }
  };
  
  const getSchemaList = () => {
    return Object.keys(spec.components?.schemas || {});
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requestBody-description">Description</Label>
          <Input
            id="requestBody-description"
            value={requestBody.description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Request body description"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requestBody-contentType">Content Type</Label>
          <Select value={contentType} onValueChange={handleContentTypeChange}>
            <SelectTrigger id="requestBody-contentType">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="application/json">application/json</SelectItem>
              <SelectItem value="application/xml">application/xml</SelectItem>
              <SelectItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</SelectItem>
              <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
              <SelectItem value="text/plain">text/plain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="requestBody-required"
            checked={requestBody.required || false}
            onCheckedChange={handleRequiredChange}
          />
          <Label htmlFor="requestBody-required">Required</Label>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="use-schema-ref"
            checked={useSchema}
            onCheckedChange={setUseSchema}
          />
          <Label htmlFor="use-schema-ref">Use Schema Reference</Label>
        </div>
      </div>
      
      {useSchema ? (
        <div className="space-y-2">
          <Label htmlFor="schema-ref">Schema Reference</Label>
          <Select value={schemaRef} onValueChange={handleSchemaRefChange}>
            <SelectTrigger id="schema-ref">
              <SelectValue placeholder="Select schema" />
            </SelectTrigger>
            <SelectContent>
              {getSchemaList().map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSchemaList().length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              No schemas defined. Add schemas in the Components tab.
            </p>
          )}
        </div>
      ) : (
        <SchemaForm
          schema={schema}
          onChange={handleSchemaChange}
          isRequired={false}
        />
      )}
    </div>
  );
};

export default RequestBodyForm;
