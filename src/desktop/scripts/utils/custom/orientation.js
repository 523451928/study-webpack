export function getTransform(o) {
  let t = {Rotate: 0, ScaleX: 1, ScaleY: 1}
  switch (o) {
    case 1:
      break
    case 2:
      t.ScaleX = -1
      break
    case 3:
      t.Rotate = 180
      break
    case 4:
      t.ScaleY = -1
      break
    case 5:
      t.Rotate = 90
      t.ScaleY = -1
      break
    case 6:
      t.Rotate = 90
      break
    case 7:
      t.Rotate = 90
      t.ScaleX = -1
      break
    case 8:
      t.Rotate = 270
      break
  }
  return t
}

// from cropperjs
let IS_SAFARI_OR_UIWEBVIEW = navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent)

function getStringFromCharCode(dataView, start, length) {
  let str = ''
  let i = start

  for (length += start; i < length; i++) {
    str += String.fromCharCode(dataView.getUint8(i))
  }

  return str
}

export function getOrientation(arrayBuffer) {
  let dataView = new DataView(arrayBuffer)
  let length = dataView.byteLength
  let orientation
  let exifIDCode
  let tiffOffset
  let firstIFDOffset
  let littleEndian
  let endianness
  let app1Start
  let ifdStart
  let offset
  let i

  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2

    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset
        break
      }

      offset++
    }
  }

  if (app1Start) {
    exifIDCode = app1Start + 4
    tiffOffset = app1Start + 10

    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      endianness = dataView.getUint16(tiffOffset)
      littleEndian = endianness === 0x4949

      if (littleEndian || endianness === 0x4D4D/* bigEndian */) {
        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
          firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian)

          if (firstIFDOffset >= 0x00000008) {
            ifdStart = tiffOffset + firstIFDOffset
          }
        }
      }
    }
  }

  if (ifdStart) {
    length = dataView.getUint16(ifdStart, littleEndian)

    for (i = 0; i < length; i++) {
      offset = ifdStart + i * 12 + 2

      if (dataView.getUint16(offset, littleEndian) === 0x0112/* Orientation */) {
        // 8 is the offset of the current tag's value
        offset += 8

        // Get the original orientation value
        orientation = dataView.getUint16(offset, littleEndian)

        // Override the orientation with its default value for Safari
        if (IS_SAFARI_OR_UIWEBVIEW) {
          dataView.setUint16(offset, 1, littleEndian)
        }

        break
      }
    }
  }

  return orientation
}
