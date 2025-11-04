"use client"

import { useRef } from "react"
import { Label } from "@/components/ui/label"

export function MacAddressInput({ value, onChange, required = false }) {
  const inputRefs = useRef([])

  // Parse the MAC address into 6 segments
  const segments = value ? value.split(":").slice(0, 6) : ["", "", "", "", "", ""]
  while (segments.length < 6) segments.push("")

  const handleChange = (index, newValue) => {
    // Only allow hexadecimal characters
    const hex = newValue
      .replace(/[^0-9A-Fa-f]/g, "")
      .toUpperCase()
      .slice(0, 2)

    const newSegments = [...segments]
    newSegments[index] = hex

    // Update the full MAC address
    onChange(newSegments.join(":"))

    // Auto-advance to next input if 2 characters entered
    if (hex.length === 2 && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !segments[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")

    // Try to parse pasted MAC address (with or without colons)
    const cleaned = pastedText.replace(/[^0-9A-Fa-f]/g, "").toUpperCase()

    if (cleaned.length <= 12) {
      // Split into pairs
      const pairs = []
      for (let i = 0; i < cleaned.length; i += 2) {
        pairs.push(cleaned.slice(i, i + 2))
      }

      // Pad with empty strings if needed
      while (pairs.length < 6) pairs.push("")

      onChange(pairs.slice(0, 6).join(":"))
    }
  }

  return (
    <div className="space-y-2">
      <Label>MAC Address {required && "*"}</Label>
      <div className="flex items-center gap-1.5 flex-wrap">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={segment}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              maxLength={2}
              className="w-11 h-10 text-center font-mono text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="00"
              required={required}
            />
            {index < 5 && <span className="text-muted-foreground font-mono text-sm">:</span>}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Enter hexadecimal pairs (00-FF). Paste full MAC address to auto-fill.
      </p>
    </div>
  )
}
