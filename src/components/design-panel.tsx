"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Paintbrush } from "lucide-react"
import { useResumeStore } from "@/hooks/use-resume-store.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

const colors = ["#3F51B5", "#F44336", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];

export default function DesignPanel() {
  const { design, setDesign, isInitialized } = useResumeStore()

  if (!isInitialized) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Customize Design</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Customize</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the look and feel of your resume.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Primary Color</Label>
              <div className="col-span-2 flex gap-2">
                <TooltipProvider>
                {colors.map(color => (
                  <Tooltip key={color}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setDesign(d => { d.primaryColor = color })}
                          className={`w-6 h-6 rounded-full border-2 ${design.primaryColor === color ? 'border-primary' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent><p>{color}</p></TooltipContent>
                  </Tooltip>
                ))}
                </TooltipProvider>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fontSize">Font Size</Label>
               <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger className="col-span-2 w-full">
                         <Slider
                            id="fontSize"
                            min={8}
                            max={14}
                            step={1}
                            value={[parseInt(design.fontSize)]}
                            onValueChange={([value]) => setDesign(d => {d.fontSize = value.toString()})}
                            className="w-full"
                          />
                      </TooltipTrigger>
                      <TooltipContent><p>Adjust the base font size for body text.</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
