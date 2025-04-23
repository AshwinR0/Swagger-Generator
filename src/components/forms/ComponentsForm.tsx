
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import SchemasForm from "./SchemasForm";
import SecuritySchemesForm from "./SecuritySchemesForm";
import { OpenApiSpec } from "@/types/OpenApiTypes";

interface ComponentsFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const ComponentsForm = ({ spec, setSpec }: ComponentsFormProps) => {
  const [activeTab, setActiveTab] = useState("schemas");

  return (
    <div className="w-full">
      <Tabs 
        defaultValue="schemas"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-4">
          <TabsTrigger value="schemas" className="flex-1">
            Schemas
          </TabsTrigger>
          <TabsTrigger value="securitySchemes" className="flex-1">
            Security Schemes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schemas">
          <SchemasForm spec={spec} setSpec={setSpec} />
        </TabsContent>
        
        <TabsContent value="securitySchemes">
          <SecuritySchemesForm spec={spec} setSpec={setSpec} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentsForm;
