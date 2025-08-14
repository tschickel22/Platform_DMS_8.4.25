import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Theme = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundColor: string;
};

type BrochureTemplate = {
  id: string;
  name: string;
  description?: string;
  theme: Theme; // never render this directly
};

export interface GenerateBrochureModalProps {
  onClose: () => void;
  /** Optional: vehicle object shown in the header. We only read a few safe string fields. */
  vehicle?: any;
}

// IMPORTANT: We never render theme objects. Only string labels are shown.
const DEFAULT_TEMPLATES: BrochureTemplate[] = [
  {
    id: "rv-showcase",
    name: "RV Showcase",
    description: "Clean, single-unit brochure for RV inventory.",
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#0ea5e9",
      fontFamily: "Inter, system-ui, Arial",
      backgroundColor: "#ffffff",
    },
  },
  {
    id: "mh-catalog",
    name: "Manufactured Homes Catalog",
    description: "Multi-item layout tailored for MH listings.",
    theme: {
      primaryColor: "#065f46",
      secondaryColor: "#10b981",
      fontFamily: "Inter, system-ui, Arial",
      backgroundColor: "#ffffff",
    },
  },
];

export function GenerateBrochureModal({ onClose, vehicle }: GenerateBrochureModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const templates = DEFAULT_TEMPLATES; // swap for your source later if needed
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  );

  // Safe display helpers
  const vehicleTitle =
    [vehicle?.make, vehicle?.model, vehicle?.year].filter(Boolean).join(" ") ||
    vehicle?.name ||
    "Selected Item";
  const vehicleType = vehicle?.type === "RV" ? "Manufactured Home" : vehicle?.type || "Available Item";
  const availability = (vehicle?.availability || vehicle?.status || "Available") as string;

  function handleGenerate() {
    // This is where you would trigger export/preview logic.
    // Intentionally not rendering `selectedTemplate.theme` to the DOM.
    onClose();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
        </DialogHeader>

        {/* Selected Item card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{vehicleTitle}</span>
              <Badge variant="secondary">{availability}</Badge>
            </CardTitle>
            <CardDescription className="truncate">{vehicleType}</CardDescription>
          </CardHeader>
        </Card>

        {/* Template picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Template</label>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template…" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview hint (no object rendering) */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Template Details</CardTitle>
            <CardDescription>
              {selectedTemplate ? selectedTemplate.description || selectedTemplate.name : "Pick a template to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {/* We intentionally avoid rendering the theme object. Show a short, safe summary instead. */}
            {selectedTemplate ? (
              <div>
                <div>Primary color: {selectedTemplate.theme.primaryColor}</div>
                <div>Secondary color: {selectedTemplate.theme.secondaryColor}</div>
                <div>Font: {selectedTemplate.theme.fontFamily}</div>
              </div>
            ) : (
              <div>No template selected.</div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selectedTemplate} onClick={handleGenerate}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateBrochureModal;