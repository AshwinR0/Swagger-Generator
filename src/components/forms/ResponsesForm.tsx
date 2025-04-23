
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
import SchemaForm from "./SchemaForm";
import { Operation, OpenApiSpec, Schema, Response } from "@/types/OpenApiTypes";
import { Plus, Trash } from "lucide-react";

interface ResponsesFormProps {
  operation: Operation;
  updateOperation: (updatedOp: Partial<Operation>) => void;
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const ResponsesForm = ({ 
  operation, 
  updateOperation,
  spec,
  setSpec
}: ResponsesFormProps) => {
  const [newStatusCode, setNewStatusCode] = useState("");
  const [selectedStatusCode, setSelectedStatusCode] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>("application/json");
  const [useSchemaRef, setUseSchemaRef] = useState<boolean>(false);
  const [schemaRef, setSchemaRef] = useState<string>("");
  
  const responses = operation.responses || {};
  
  const addResponse = () => {
    if (!newStatusCode) return;
    
    updateOperation({
      responses: {
        ...responses,
        [newStatusCode]: {
          description: getDefaultDescription(newStatusCode),
          content: {}
        }
      }
    });
    
    setNewStatusCode("");
    setSelectedStatusCode(newStatusCode);
  };
  
  const removeResponse = (statusCode: string) => {
    const updatedResponses = { ...responses };
    delete updatedResponses[statusCode];
    
    updateOperation({ responses: updatedResponses });
    
    if (selectedStatusCode === statusCode) {
      setSelectedStatusCode(null);
    }
  };
  
  const updateResponseDescription = (statusCode: string, description: string) => {
    updateOperation({
      responses: {
        ...responses,
        [statusCode]: {
          ...responses[statusCode],
          description
        }
      }
    });
  };
  
  const updateResponseContentSchema = (statusCode: string, schema: Schema) => {
    updateOperation({
      responses: {
        ...responses,
        [statusCode]: {
          ...responses[statusCode],
          content: {
            ...(responses[statusCode].content || {}),
            [contentType]: {
              ...(responses[statusCode].content?.[contentType] || {}),
              schema
            }
          }
        }
      }
    });
  };
  
  const handleSchemaRefChange = (ref: string) => {
    setSchemaRef(ref);
    if (ref && selectedStatusCode) {
      updateOperation({
        responses: {
          ...responses,
          [selectedStatusCode]: {
            ...responses[selectedStatusCode],
            content: {
              ...(responses[selectedStatusCode].content || {}),
              [contentType]: {
                ...(responses[selectedStatusCode].content?.[contentType] || {}),
                schema: { $ref: `#/components/schemas/${ref}` }
              }
            }
          }
        }
      });
    }
  };
  
  const getDefaultDescription = (statusCode: string): string => {
    const descriptions: Record<string, string> = {
      "200": "OK - Successful response",
      "201": "Created - Resource was created",
      "204": "No Content - Success with no response body",
      "400": "Bad Request - Invalid input",
      "401": "Unauthorized - Authentication required",
      "403": "Forbidden - Not authorized",
      "404": "Not Found - Resource not found",
      "500": "Internal Server Error",
    };
    
    return descriptions[statusCode] || "Response description";
  };
  
  const getSelectedResponseSchema = (): Schema => {
    if (!selectedStatusCode) return { type: "object", properties: {} };
    
    return responses[selectedStatusCode]?.content?.[contentType]?.schema || { type: "object", properties: {} };
  };
  
  const getStatusCodes = () => [
    "200", "201", "204", "301", "302", "400", "401", "403", "404", "500"
  ];
  
  const getSchemaList = () => {
    return Object.keys(spec.components?.schemas || {});
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Select value={newStatusCode} onValueChange={setNewStatusCode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status code" />
          </SelectTrigger>
          <SelectContent>
            {getStatusCodes().filter(code => !responses[code]).map((code) => (
              <SelectItem key={code} value={code}>{code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addResponse} disabled={!newStatusCode}>Add Response</Button>
      </div>
      
      {/* List of status codes */}
      <div className="space-y-2">
        {Object.keys(responses).length > 0 ? (
          <div className="space-y-2">
            {Object.keys(responses).map((statusCode) => (
              <div
                key={statusCode}
                className={`p-3 border rounded-md flex items-center justify-between ${
                  selectedStatusCode === statusCode ? "border-swagger-blue bg-blue-50" : ""
                }`}
                onClick={() => setSelectedStatusCode(statusCode)}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-semibold">{statusCode}</span>
                  <span className="text-sm truncate max-w-[300px]">
                    {responses[statusCode].description}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatusCode(statusCode);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-swagger-red hover:text-swagger-red"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeResponse(statusCode);
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
            <p className="text-muted-foreground">No responses defined.</p>
          </div>
        )}
      </div>
      
      {/* Selected response details */}
      {selectedStatusCode && (
        <div className="p-4 border rounded-md space-y-4">
          <h4 className="font-medium">Response {selectedStatusCode} Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="response-description">Description</Label>
            <Input
              id="response-description"
              value={responses[selectedStatusCode].description}
              onChange={(e) => updateResponseDescription(selectedStatusCode, e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response-content-type">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="response-content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application/json">application/json</SelectItem>
                <SelectItem value="application/xml">application/xml</SelectItem>
                <SelectItem value="text/plain">text/plain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="use-schema-ref-response"
              checked={useSchemaRef}
              onCheckedChange={setUseSchemaRef}
            />
            <Label htmlFor="use-schema-ref-response">Use Schema Reference</Label>
          </div>
          
          {useSchemaRef ? (
            <div className="space-y-2">
              <Label htmlFor="schema-ref-response">Schema Reference</Label>
              <Select value={schemaRef} onValueChange={handleSchemaRefChange}>
                <SelectTrigger id="schema-ref-response">
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
              schema={getSelectedResponseSchema()}
              onChange={(schema) => updateResponseContentSchema(selectedStatusCode, schema)}
              isRequired={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsesForm;
