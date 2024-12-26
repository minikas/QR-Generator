"use client";
import Link from "next/link";
import { useState, useRef } from "react";
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

  const [debouncedQrData] = useDebounceValue(qrData, 500);
  const [debouncedQrColor] = useDebounceValue(qrColor, 500);
  const [debouncedBgColor] = useDebounceValue(bgColor, 500);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

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
        <div>
          <h3 className="font-semibold">Live Preview</h3>
          <div
            ref={qrRef}
            style={{ backgroundColor: debouncedBgColor }}
            className="flex justify-center p-4 rounded-lg"
          >
            <QRCodeSVG
              value={debouncedQrData || "https://example.com"}
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
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Data to encode</h3>
          <Textarea
            placeholder="Enter URL or text"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <h3 className="font-semibold">Logo</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mt-2"
          />
        </div>

        <div>
          <h3 className="font-semibold">Color</h3>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-10 h-10 rounded-md hover:scale-110 transition-all"
            />
            {["#FFB3B3", "#B3FFB3", "#B3B3FF", "#FFB3FF", "#B3FFFF"].map(
              (color) => (
                <button
                  key={color}
                  className="min-w-10 h-10 rounded-md hover:scale-110 transition-all"
                  style={{ backgroundColor: color }}
                  onClick={() => setQrColor(color)}
                />
              )
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Background</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-md hover:scale-110 transition-all"
              />
              {["#FFB3B3", "#B3FFB3", "#B3B3FF", "#FFB3FF", "#B3FFFF"].map(
                (color) => (
                  <button
                    key={color}
                    className="min-w-10 h-10 rounded-md hover:scale-110 transition-all"
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setFileType("svg")}
            className={fileType === "svg" ? "bg-pink-500 text-white" : ""}
          >
            Export as SVG
          </Button>
          <Button
            variant="outline"
            onClick={() => setFileType("png")}
            className={fileType === "png" ? "bg-pink-500 text-white" : ""}
          >
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
