"use client";

import Link from "next/link";
import { useState, useRef, Fragment } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useDebounceValue } from "usehooks-ts";

export default function Home() {
  const [qrData, setQrData] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"svg" | "png">("svg");
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [debouncedQrData] = useDebounceValue(qrData, 500);
  const [debouncedQrColor] = useDebounceValue(qrColor, 500);
  const [debouncedBgColor] = useDebounceValue(bgColor, 500);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current || !debouncedQrData) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    if (fileType === "svg") {
      // Download as SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "qr-code.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } else {
      // Download as PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qr-code.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-10 font-[family-name:var(--font-geist-sans)]">
      <header className="flex gap-2 items-center">
        <div className="min-w-7 h-7 bg-pink-500 rounded-full" />
        <div className="flex gap-x-2 flex-wrap">
          <p className="text-xs font-mono">
            Crafted by
            <Link
              target="_blank"
              href="https://github.com/minikas"
              className="ml-2 font-bold text-pink-500"
            >
              Kas Ferreira
            </Link>
          </p>
        </div>
      </header>
      <main className="flex flex-col gap-8 bg-white/5 rounded-md p-5 min-w-[400px]">
        <div className="flex flex-col gap-4">
          <div
            ref={qrRef}
            style={{ backgroundColor: debouncedBgColor }}
            className="flex justify-center p-4 rounded-lg relative"
          >
            {debouncedQrData ? (
              <Fragment>
                <QRCodeSVG
                  value={debouncedQrData}
                  size={200}
                  fgColor={debouncedQrColor}
                  bgColor={debouncedBgColor}
                  level="H"
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }
                      : undefined
                  }
                />
                <Button
                  variant="secondary"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logo ? "Change Logo" : "Add Logo"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </Fragment>
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add Logo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
          <Textarea
            placeholder="Enter your URL or text"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            className="border-none md:text-lg resize-y focus-visible:ring-0 p-0 text-center"
          />
        </div>

        <div>
          <h3 className="font-semibold text-sm opacity-50">Color</h3>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-9 h-9 rounded-md hover:scale-110 transition-all"
            />
            {[
              "#FFB3B3",
              "#B3FFB3",
              "#B3B3FF",
              "#FFB3FF",
              "#B3FFFF",
              "#000000",
              "#FFFFFF",
            ].map((color) => (
              <button
                key={color}
                className="min-w-9 h-9 rounded-md hover:scale-110 transition-all"
                style={{ backgroundColor: color }}
                onClick={() => setQrColor(color)}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm opacity-50">Background</h3>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-9 h-9 rounded-md hover:scale-110 transition-all"
            />
            {[
              "#FFB3B3",
              "#B3FFB3",
              "#B3B3FF",
              "#FFB3FF",
              "#B3FFFF",
              "#000000",
              "#FFFFFF",
            ].map((color) => (
              <button
                key={color}
                className="min-w-9 h-9 rounded-md hover:scale-110 transition-all"
                style={{ backgroundColor: color }}
                onClick={() => setBgColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setFileType("svg")}>
            Export as SVG
          </Button>
          <Button variant="secondary" onClick={() => setFileType("png")}>
            Export as PNG
          </Button>
          <Button onClick={downloadQR} className="ml-auto">
            Download
          </Button>
        </div>
      </main>
    </div>
  );
}
