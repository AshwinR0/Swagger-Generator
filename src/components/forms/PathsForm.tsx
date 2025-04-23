
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpenApiSpec, PathItem, Operation } from "@/types/OpenApiTypes";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Plus,
  Trash,
  ChevronRight
} from "lucide-react";
import ParametersForm from "./PathParametersForm";
import RequestBodyForm from "./RequestBodyForm";
import ResponsesForm from "./ResponsesForm";

interface PathsFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const httpMethods = [
  { value: "get", label: "GET", color: "bg-swagger-blue" },
  { value: "post", label: "POST", color: "bg-swagger-green" },
  { value: "put", label: "PUT", color: "bg-swagger-yellow" },
  { value: "delete", label: "DELETE", color: "bg-swagger-red" },
  { value: "patch", label: "PATCH", color: "bg-swagger-purple" },
  { value: "options", label: "OPTIONS", color: "bg-swagger-gray" },
  { value: "head", label: "HEAD", color: "bg-swagger-gray" },
];

const PathsForm = ({ spec, setSpec }: PathsFormProps) => {
  const [newPath, setNewPath] = useState("");
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<{ path: string; method: string } | null>(null);
  
  const addPath = () => {
    if (!newPath.trim()) return;
    
    // Ensure path starts with /
    const formattedPath = newPath.startsWith("/") ? newPath : `/${newPath}`;
    
    if (spec.paths[formattedPath]) return; // Path already exists
    
    setSpec({
      ...spec,
      paths: {
        ...spec.paths,
        [formattedPath]: {}
      }
    });
    
    setNewPath("");
    setExpandedPath(formattedPath);
  };
  
  const removePath = (path: string) => {
    const updatedPaths = { ...spec.paths };
    delete updatedPaths[path];
    
    setSpec({
      ...spec,
      paths: updatedPaths
    });
    
    if (expandedPath === path) setExpandedPath(null);
    if (selectedOperation?.path === path) setSelectedOperation(null);
  };
  
  const addOperation = (path: string, method: string) => {
    const updatedPaths = { ...spec.paths };
    
    updatedPaths[path] = {
      ...updatedPaths[path],
      [method]: {
        summary: "",
        description: "",
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    };
    
    setSpec({
      ...spec,
      paths: updatedPaths
    });
    
    setSelectedOperation({ path, method });
  };
  
  const removeOperation = (path: string, method: string) => {
    const updatedPaths = { ...spec.paths };
    const pathItem = { ...updatedPaths[path] };
    
    delete pathItem[method];
    updatedPaths[path] = pathItem;
    
    setSpec({
      ...spec,
      paths: updatedPaths
    });
    
    if (selectedOperation?.path === path && selectedOperation?.method === method) {
      setSelectedOperation(null);
    }
  };
  
  const updateOperation = (path: string, method: string, updatedOp: Partial<Operation>) => {
    const updatedPaths = { ...spec.paths };
    
    updatedPaths[path] = {
      ...updatedPaths[path],
      [method]: {
        ...updatedPaths[path][method],
        ...updatedOp
      }
    };
    
    setSpec({
      ...spec,
      paths: updatedPaths
    });
  };
  
  const getMethodColor = (method: string) => {
    const foundMethod = httpMethods.find(m => m.value === method);
    return foundMethod ? foundMethod.color : "bg-gray-500";
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Enter path (e.g., /users)"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addPath}>
              <Plus className="mr-2 h-4 w-4" /> Add Path
            </Button>
          </div>
          
          <div className="space-y-4 mt-6">
            {Object.keys(spec.paths).length > 0 ? (
              <Accordion
                type="single"
                collapsible
                value={expandedPath || undefined}
                onValueChange={(value) => setExpandedPath(value)}
                className="border rounded-md"
              >
                {Object.keys(spec.paths).map((path) => (
                  <AccordionItem key={path} value={path} className="border-b">
                    <div className="flex items-center justify-between px-4">
                      <AccordionTrigger className="flex-1 py-4 hover:no-underline">
                        <div className="flex items-center space-x-2 text-left">
                          <span className="font-mono font-medium">{path}</span>
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePath(path);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <AccordionContent className="px-4 pt-2 pb-4">
                      <div className="space-y-4">
                        {/* List of operations for this path */}
                        <div className="space-y-3">
                          {Object.keys(spec.paths[path])
                            .filter(key => httpMethods.some(m => m.value === key))
                            .map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <div 
                                  className={`${getMethodColor(method)} text-white px-3 py-1 rounded-md uppercase text-xs font-bold w-20 text-center`}
                                >
                                  {method}
                                </div>
                                <div className="flex-1 truncate font-medium">
                                  {spec.paths[path][method].summary || "No summary"}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => setSelectedOperation({ path, method })}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-swagger-red hover:text-swagger-red"
                                  onClick={() => removeOperation(path, method)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                        
                        {/* Add new operation */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Select onValueChange={(value) => addOperation(path, value)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Add operation" />
                            </SelectTrigger>
                            <SelectContent>
                              {httpMethods
                                .filter(method => !spec.paths[path][method.value])
                                .map((method) => (
                                  <SelectItem key={method.value} value={method.value}>
                                    {method.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-muted-foreground">No paths defined yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Operation details */}
      {selectedOperation && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`${getMethodColor(selectedOperation.method)} text-white px-3 py-1 rounded-md uppercase text-xs font-bold`}>
                  {selectedOperation.method}
                </div>
                <span className="font-mono font-medium">{selectedOperation.path}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-swagger-red hover:text-swagger-red"
                onClick={() => setSelectedOperation(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="op-summary">Summary</Label>
                  <Input
                    id="op-summary"
                    placeholder="Operation summary"
                    value={spec.paths[selectedOperation.path][selectedOperation.method].summary || ""}
                    onChange={(e) => updateOperation(
                      selectedOperation.path,
                      selectedOperation.method,
                      { summary: e.target.value }
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="op-operationId">Operation ID</Label>
                  <Input
                    id="op-operationId"
                    placeholder="getUsers"
                    value={spec.paths[selectedOperation.path][selectedOperation.method].operationId || ""}
                    onChange={(e) => updateOperation(
                      selectedOperation.path,
                      selectedOperation.method,
                      { operationId: e.target.value }
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="op-description">Description</Label>
                <Textarea
                  id="op-description"
                  placeholder="Operation description"
                  value={spec.paths[selectedOperation.path][selectedOperation.method].description || ""}
                  onChange={(e) => updateOperation(
                    selectedOperation.path,
                    selectedOperation.method,
                    { description: e.target.value }
                  )}
                />
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="parameters">
                  <AccordionTrigger>Parameters</AccordionTrigger>
                  <AccordionContent>
                    <ParametersForm
                      operation={spec.paths[selectedOperation.path][selectedOperation.method]}
                      updateOperation={(updatedOp) => updateOperation(
                        selectedOperation.path,
                        selectedOperation.method,
                        updatedOp
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="requestBody">
                  <AccordionTrigger>Request Body</AccordionTrigger>
                  <AccordionContent>
                    <RequestBodyForm
                      operation={spec.paths[selectedOperation.path][selectedOperation.method]}
                      updateOperation={(updatedOp) => updateOperation(
                        selectedOperation.path,
                        selectedOperation.method,
                        updatedOp
                      )}
                      spec={spec}
                      setSpec={setSpec}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="responses">
                  <AccordionTrigger>Responses</AccordionTrigger>
                  <AccordionContent>
                    <ResponsesForm
                      operation={spec.paths[selectedOperation.path][selectedOperation.method]}
                      updateOperation={(updatedOp) => updateOperation(
                        selectedOperation.path,
                        selectedOperation.method,
                        updatedOp
                      )}
                      spec={spec}
                      setSpec={setSpec}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PathsForm;
