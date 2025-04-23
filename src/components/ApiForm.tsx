
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiInfoForm from "@/components/forms/ApiInfoForm";
import ServersForm from "@/components/forms/ServersForm";
import PathsForm from "@/components/forms/PathsForm";
import ComponentsForm from "@/components/forms/ComponentsForm";
import { OpenApiSpec } from "@/types/OpenApiTypes";

interface ApiFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const ApiForm = ({ spec, setSpec }: ApiFormProps) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-swagger-dark">API Specification</h2>
      
      <Tabs 
        defaultValue="info"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-4">
          <TabsTrigger value="info" className="flex-1">
            API Info
          </TabsTrigger>
          <TabsTrigger value="servers" className="flex-1">
            Servers
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex-1">
            Paths
          </TabsTrigger>
          <TabsTrigger value="components" className="flex-1">
            Components
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <ApiInfoForm spec={spec} setSpec={setSpec} />
        </TabsContent>
        
        <TabsContent value="servers">
          <ServersForm spec={spec} setSpec={setSpec} />
        </TabsContent>
        
        <TabsContent value="paths">
          <PathsForm spec={spec} setSpec={setSpec} />
        </TabsContent>
        
        <TabsContent value="components">
          <ComponentsForm spec={spec} setSpec={setSpec} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiForm;
