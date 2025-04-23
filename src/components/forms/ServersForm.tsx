
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpenApiSpec } from "@/types/OpenApiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface ServersFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const ServersForm = ({ spec, setSpec }: ServersFormProps) => {
  const [newServer, setNewServer] = useState({ url: "", description: "" });

  const handleServerChange = (index: number, field: string, value: string) => {
    const updatedServers = [...spec.servers];
    updatedServers[index] = { ...updatedServers[index], [field]: value };
    setSpec({ ...spec, servers: updatedServers });
  };

  const addServer = () => {
    if (!newServer.url.trim()) return;
    
    const updatedServers = [...(spec.servers || []), { ...newServer }];
    setSpec({ ...spec, servers: updatedServers });
    setNewServer({ url: "", description: "" });
  };

  const removeServer = (index: number) => {
    const updatedServers = [...spec.servers];
    updatedServers.splice(index, 1);
    setSpec({ ...spec, servers: updatedServers });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-swagger-dark">Servers Configuration</h3>
          
          {spec.servers && spec.servers.length > 0 ? (
            <div className="space-y-6">
              {spec.servers.map((server, index) => (
                <div key={index} className="p-4 border rounded-md relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6" 
                    onClick={() => removeServer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`server-url-${index}`} className="text-sm font-medium">
                        URL <span className="text-swagger-red">*</span>
                      </Label>
                      <Input
                        id={`server-url-${index}`}
                        placeholder="https://api.example.com/v1"
                        value={server.url}
                        onChange={(e) => handleServerChange(index, "url", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`server-description-${index}`} className="text-sm font-medium">
                        Description
                      </Label>
                      <Input
                        id={`server-description-${index}`}
                        placeholder="Production Server"
                        value={server.description || ""}
                        onChange={(e) => handleServerChange(index, "description", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No servers defined yet.</p>
            </div>
          )}
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-4">Add New Server</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-server-url" className="text-sm font-medium">
                  URL <span className="text-swagger-red">*</span>
                </Label>
                <Input
                  id="new-server-url"
                  placeholder="https://api.example.com/v1"
                  value={newServer.url}
                  onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-server-description" className="text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="new-server-description"
                  placeholder="Production Server"
                  value={newServer.description}
                  onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={addServer} 
                className="w-full bg-swagger-blue hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Server
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServersForm;
