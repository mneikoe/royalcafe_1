// src/utils/bluetoothPrinter.js

let cachedCharacteristic = null;

export async function initBluetoothPrinter() {
  if (cachedCharacteristic) return cachedCharacteristic;

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: "EZO" }],
    optionalServices: [0x1101],
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(0x1101);
  cachedCharacteristic = await service.getCharacteristic(0x2a56);
  return cachedCharacteristic;
}

export async function printToBluetoothPrinter(data) {
  try {
    const char = await initBluetoothPrinter();

    // prepare buffer
    let buffer;
    if (typeof data === "string" && data.startsWith("http")) {
      const resp = await fetch(data);
      buffer = await resp.arrayBuffer();
    } else {
      buffer = new TextEncoder().encode(data).buffer;
    }

    // stream in chunks
    const chunkSize = 512;
    for (let i = 0; i < buffer.byteLength; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      await char.writeValueWithoutResponse(chunk);
    }
    alert("✅ Printed successfully");
  } catch (err) {
    if (err.name === "NotFoundError") {
      alert("⚠️ No printer selected. Please pair your EZO printer.");
    } else {
      console.error(err);
      alert("Print failed: " + err.message);
    }
  }
}
