
import { useState } from "react";
import Layout from "@/components/Layout";
import ApiForm from "@/components/ApiForm";
import YamlPreview from "@/components/YamlPreview";
import Navbar from "@/components/Navbar";
import { OpenApiSpec } from "@/types/OpenApiTypes";

const defaultSpec: OpenApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Title",
    description: "API Description",
    version: "1.0.0"
  },
  servers: [
    {
      url: "https://api.example.com/v1",
      description: "Production server"
    }
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {}
  }
};

const Index = () => {
  const [spec, setSpec] = useState<OpenApiSpec>(defaultSpec);

  return (
    <Layout>
      <Navbar spec={spec} setSpec={setSpec} />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        <div className="lg:w-1/2 p-4 overflow-y-auto">
          <ApiForm spec={spec} setSpec={setSpec} />
        </div>
        <div className="lg:w-1/2 p-4 bg-swagger-light border-l border-gray-200 overflow-y-auto">
          <YamlPreview spec={spec} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
