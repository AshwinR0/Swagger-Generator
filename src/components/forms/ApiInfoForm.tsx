
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpenApiSpec } from "@/types/OpenApiTypes";
import { Card, CardContent } from "@/components/ui/card";

interface ApiInfoFormProps {
  spec: OpenApiSpec;
  setSpec: (spec: OpenApiSpec) => void;
}

const ApiInfoForm = ({ spec, setSpec }: ApiInfoFormProps) => {
  const handleChange = (field: string, value: string) => {
    setSpec({
      ...spec,
      info: {
        ...spec.info,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              API Title <span className="text-swagger-red">*</span>
            </Label>
            <Input
              id="title"
              placeholder="My API"
              value={spec.info.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your API"
              value={spec.info.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="version" className="text-sm font-medium">
              Version <span className="text-swagger-red">*</span>
            </Label>
            <Input
              id="version"
              placeholder="1.0.0"
              value={spec.info.version}
              onChange={(e) => handleChange("version", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="termsOfService" className="text-sm font-medium">
                Terms of Service URL
              </Label>
              <Input
                id="termsOfService"
                placeholder="https://example.com/terms"
                value={spec.info.termsOfService || ""}
                onChange={(e) => handleChange("termsOfService", e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium">
                License Name
              </Label>
              <Input
                id="license"
                placeholder="MIT"
                value={spec.info.license?.name || ""}
                onChange={(e) => {
                  const license = spec.info.license || {};
                  setSpec({
                    ...spec,
                    info: {
                      ...spec.info,
                      license: {
                        ...license,
                        name: e.target.value
                      }
                    }
                  });
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiInfoForm;
