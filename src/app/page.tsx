"use client";

import Link from "next/link";
import { useState, useRef, Fragment } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useDebounceValue } from "usehooks-ts";
import { ColorPicker } from "@/components/colorPicker";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const RandomPoints = dynamic(
  () => import("@/components/randomPoints").then((mod) => mod.RandomPoints),
  { ssr: false }
);

export default function Home() {
  const [qrData, setQrData] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [debouncedQrData] = useDebounceValue(qrData, 500);
  const [debouncedQrColor] = useDebounceValue(qrColor, 500);
  const [debouncedBgColor] = useDebounceValue(bgColor, 500);

  const presetColors = [
    "#FFB3B3",
    "#B3FFB3",
    "#B3B3FF",
    "#FFB3FF",
    "#000000",
    "#FFFFFF",
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadQR = (type: "svg" | "png") => {
    if (!qrRef.current || !debouncedQrData) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;
    const padding = 32;
    const originalWidth = parseInt(svgClone.getAttribute("width") || "250");
    const originalHeight = parseInt(svgClone.getAttribute("height") || "250");
    const totalWidth = originalWidth + padding * 2;
    const totalHeight = originalHeight + padding * 2;

    const wrapperSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    wrapperSvg.setAttribute("width", totalWidth.toString());
    wrapperSvg.setAttribute("height", totalHeight.toString());
    wrapperSvg.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", totalWidth.toString());
    rect.setAttribute("height", totalHeight.toString());
    rect.setAttribute("fill", debouncedBgColor);
    rect.setAttribute("rx", "8");

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${padding},${padding})`);
    g.appendChild(svgClone);

    wrapperSvg.appendChild(rect);
    wrapperSvg.appendChild(g);

    if (type === "svg") {
      const svgData = new XMLSerializer().serializeToString(wrapperSvg);
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
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(wrapperSvg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = totalWidth;
      canvas.height = totalHeight;
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
  };

  return (
    <Fragment>
      <RandomPoints />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 p-10 font-[family-name:var(--font-geist-sans)] relative"
      >
        <motion.header
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 items-center"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="min-w-7 h-7 bg-pink-500 rounded-full"
          />
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
        </motion.header>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-8 bg-white/5 rounded-md p-5 min-w-[300px]"
        >
          <div className="flex flex-col gap-4">
            <motion.div
              ref={qrRef}
              style={{ backgroundColor: debouncedBgColor }}
              className="flex justify-center p-4 rounded-lg relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {debouncedQrData ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <QRCodeSVG
                      value={debouncedQrData}
                      size={250}
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-[250px] h-[250px] bg-gray-200/90 rounded-lg flex items-center justify-center"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Input
                placeholder="Enter your URL or text"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="border-none md:text-lg p-0 text-center bg-transparent shadow-none outline-none focus:outline-none w-full"
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {debouncedQrData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ColorPicker
                    label="Color"
                    value={qrColor}
                    onChange={setQrColor}
                    presetColors={presetColors}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ColorPicker
                    label="Background"
                    value={bgColor}
                    onChange={setBgColor}
                    presetColors={presetColors}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4 items-center justify-center"
                >
                  <motion.div className="flex-1">
                    <Button
                      onClick={() => downloadQR("svg")}
                      className="w-full"
                    >
                      Export as SVG
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1">
                    <Button
                      variant="secondary"
                      onClick={() => downloadQR("png")}
                      className="w-full"
                    >
                      Export as PNG
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </motion.div>
    </Fragment>
  );
}
