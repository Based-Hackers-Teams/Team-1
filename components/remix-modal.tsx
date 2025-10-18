"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Type, ImageIcon, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import type { Cast } from "@/lib/types";
import sdk from "@farcaster/miniapp-sdk";
import { RemixModalProps, MemeTemplate } from "@/lib/types";
import { memeTemplates } from "@/lib/memetemplates";

export function RemixModal({ cast, open, onOpenChange }: RemixModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(
    memeTemplates[0]
  );
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [middleText, setMiddleText] = useState("");
  const [fontSize, setFontSize] = useState([48]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [isGenerating, setIsGenerating] = useState(false);
  const memePreviewRef = useRef<HTMLDivElement>(null);

  if (!cast) return null;

  const handleGenerateMeme = async () => {
    if (!memePreviewRef.current) {
      toast.error("Preview not ready. Please try again.");
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(memePreviewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();

      if (!blob) {
        toast.error("Failed to generate meme image.");
        setIsGenerating(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      );

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploaded = await uploadResponse.json();

      if (!uploaded.secure_url) {
        toast.error("Failed to upload meme.");
        setIsGenerating(false);
        return;
      }

      await sdk.actions.composeCast({
        text: "Just made this meme on MemeForge 🎨🔥",
        embeds: [uploaded.secure_url],
      });
      console.log("Meme ready to cast!");
      toast.success("Meme ready to cast!");
    } catch (error) {
      console.error("Error generating meme:", error);
      toast.error("Failed to generate meme. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Remix Cast into Meme
          </DialogTitle>
          <DialogDescription>
            Turn {cast.author.displayName}'s cast into a viral meme
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            defaultValue="template"
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="template"
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Template
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="gap-2"
              >
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="template"
              className="flex-1 overflow-hidden mt-4"
            >
              <ScrollArea className="h-[500px] w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-4 w-full overflow-y-auto">
                  {memeTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedTemplate.id === template.id
                          ? "border-primary shadow-lg"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={template.imageUrl || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white font-semibold text-sm">
                          {template.name}
                        </p>
                      </div>
                      {selectedTemplate.id === template.id && (
                        <Badge className="absolute top-2 right-2">
                          Selected
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="text"
              className="flex-1 overflow-hidden mt-4"
            >
              <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Original Cast:
                    </p>
                    <p className="text-foreground font-medium">{cast.text}</p>
                  </div>

                  {selectedTemplate.textPositions.top && (
                    <div className="space-y-2">
                      <Label htmlFor="top-text">Top Text</Label>
                      <Textarea
                        id="top-text"
                        placeholder="Enter top text..."
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}

                  {selectedTemplate.textPositions.middle && (
                    <div className="space-y-2">
                      <Label htmlFor="middle-text">Middle Text</Label>
                      <Textarea
                        id="middle-text"
                        placeholder="Enter middle text..."
                        value={middleText}
                        onChange={(e) => setMiddleText(e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}

                  {selectedTemplate.textPositions.bottom && (
                    <div className="space-y-2">
                      <Label htmlFor="bottom-text">Bottom Text</Label>
                      <Textarea
                        id="bottom-text"
                        placeholder="Enter bottom text..."
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={24}
                      max={72}
                      step={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stroke-color">Stroke Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="stroke-color"
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 overflow-hidden mt-4"
            >
              <div className="h-[500px] flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center space-y-4">
                  <div
                    ref={memePreviewRef}
                    className="relative inline-block"
                  >
                    <img
                      src={selectedTemplate.imageUrl || "/placeholder.svg"}
                      alt={selectedTemplate.name}
                      className="max-w-full max-h-[400px] rounded-lg"
                      crossOrigin="anonymous"
                    />
                    {selectedTemplate.textPositions.top && topText && (
                      <div
                        className="absolute top-4 left-0 right-0 text-center font-bold uppercase px-4"
                        style={{
                          fontSize: `${fontSize[0]}px`,
                          color: textColor,
                          textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`,
                        }}
                      >
                        {topText}
                      </div>
                    )}
                    {selectedTemplate.textPositions.bottom && bottomText && (
                      <div
                        className="absolute bottom-4 left-0 right-0 text-center font-bold uppercase px-4"
                        style={{
                          fontSize: `${fontSize[0]}px`,
                          color: textColor,
                          textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`,
                        }}
                      >
                        {bottomText}
                      </div>
                    )}
                    {selectedTemplate.textPositions.middle && middleText && (
                      <div
                        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center font-bold uppercase px-4"
                        style={{
                          fontSize: `${fontSize[0]}px`,
                          color: textColor,
                          textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`,
                        }}
                      >
                        {middleText}
                      </div>
                    )}
                    <div
                      className="absolute bottom-1 left-0 right-0 text-center px-4"
                      style={{
                        fontSize: "12px",
                        color: textColor,
                        textShadow: `1px 1px 0 ${strokeColor}, -1px -1px 0 ${strokeColor}, 1px -1px 0 ${strokeColor}, -1px 1px 0 ${strokeColor}`,
                        opacity: 0.8,
                      }}
                    >
                      credit: @{cast.author.username}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateMeme}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Meme
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
