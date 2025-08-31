"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Type, Layout, Share2, Copy, Eye, BarChart3 } from "lucide-react";
import Link from "next/link";

const FormController = ({ jsonForm, updateForm, formId }) => {
  const [formTitle, setFormTitle] = useState("");
  const [formSubheading, setFormSubheading] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [borderRadius, setBorderRadius] = useState("rounded");
  const [fontFamily, setFontFamily] = useState("default");

  useEffect(() => {
    if (jsonForm) {
      setFormTitle(jsonForm.formTitle || "");
      setFormSubheading(jsonForm.formSubheading || "");
      setSelectedTheme(jsonForm.theme || "default");
      setBackgroundColor(jsonForm.background || "white");
      setBorderRadius(jsonForm.borderRadius || "rounded");
      setFontFamily(jsonForm.fontFamily || "default");
    }
  }, [jsonForm]);

  const themes = [
    { value: "default", label: "Default", colors: "bg-white text-gray-900" },
    { value: "dark", label: "Dark", colors: "bg-gray-900 text-white" },
    { value: "blue", label: "Blue", colors: "bg-blue-50 text-blue-900" },
    { value: "green", label: "Green", colors: "bg-green-50 text-green-900" },
    { value: "purple", label: "Purple", colors: "bg-purple-50 text-purple-900" },
  ];

  const backgrounds = [
    { value: "white", label: "White", class: "bg-white" },
    { value: "gray", label: "Gray", class: "bg-gray-50" },
    { value: "gradient", label: "Gradient", class: "bg-gradient-to-br from-purple-50 to-blue-50" },
  ];

  const borderOptions = [
    { value: "rounded", label: "Rounded", class: "rounded-lg" },
    { value: "sharp", label: "Sharp", class: "rounded-none" },
    { value: "extra-rounded", label: "Extra Rounded", class: "rounded-2xl" },
  ];

  const fontOptions = [
    { value: "default", label: "Default (Geist)" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
    { value: "sans", label: "Sans Serif" },
  ];

  const handleUpdateForm = () => {
    const updatedForm = {
      ...jsonForm,
      formTitle,
      formSubheading,
      theme: selectedTheme,
      background: backgroundColor,
      borderRadius: borderRadius,
      fontFamily: fontFamily,
    };
    updateForm(updatedForm);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Form Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            
            <div>
              <Label htmlFor="subheading">Form Subheading</Label>
              <Textarea
                id="subheading"
                value={formSubheading}
                onChange={(e) => setFormSubheading(e.target.value)}
                placeholder="Enter form description"
                rows={3}
              />
            </div>

            <Button onClick={handleUpdateForm} className="w-full">
              Update Content
            </Button>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4" />
                Theme
              </Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border ${theme.colors}`}></div>
                        {theme.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Background</Label>
              <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  {backgrounds.map((bg) => (
                    <SelectItem key={bg.value} value={bg.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border ${bg.class}`}></div>
                        {bg.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Border Style</Label>
              <Select value={borderRadius} onValueChange={setBorderRadius}>
                <SelectTrigger>
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent>
                  {borderOptions.map((border) => (
                    <SelectItem key={border.value} value={border.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 border-gray-400 ${border.class}`}></div>
                        {border.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4" />
                Font Family
              </Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleUpdateForm} className="w-full">
              Apply Styling
            </Button>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="text-center">
              <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Share Your Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                Copy the link below to share your form with others
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <code className="text-sm break-all">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/form/${formId}`}
                </code>
              </div>

              <div className="space-y-2">
                <Button onClick={copyShareLink} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Share Link
                </Button>
                
                <Link href={`/form/${formId}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Form
                  </Button>
                </Link>

                <Link href={`/responses/${formId}`} className="block">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Responses
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormController;