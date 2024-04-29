import { type Ref, onMounted } from 'vue'
// init canvas element
export default (refCanvas?: Ref<HTMLCanvasElement | null>) => {
  function getCanvasImageDataBlob(): Promise<Blob> {
    const canvas = refCanvas?.value
    if (!canvas) return Promise.reject('Canvas not found')
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) {
          resolve(b)
        } else {
          reject('Nothing get')
        }
      })
    })
  }

  async function getCanvasImageDataFile(): Promise<File> {
    const canvas = refCanvas?.value
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return Promise.reject('Canvas not found')

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob.'))
          return
        }
        const file = new File([blob], 'file.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg')
    })
  }

  async function handleDownload() {
    const file = await getCanvasImageDataFile()
    downloadImg(file, 'signature.jpg')
  }

  // 測試用的程式，檢測檔案下載
  function downloadImg(file: File, fileName: string) {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /** 簽名轉為圖片(文字版)，可用於 attr:src 顯示 */
  function getCanvasImageDataURL() {
    const canvas = refCanvas?.value
    if (!canvas) return
    return canvas.toDataURL('image/png')
  }
  // const imageEl = document.createElement('img');
  // imageEl.src = image;
  // imageEl.alt = 'from canvas';
  // imgResult.appendChild(imageEl);

  /** 清除畫布 */
  function clear() {
    const canvas = refCanvas?.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function initSignatureBoard() {
    const canvas = refCanvas?.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 抗鋸齒
    // ref: https://www.zhihu.com/question/37698502
    const rect = canvas.getBoundingClientRect()
    const width = rect.width || canvas.width
    const height = rect.height || canvas.height

    if (window.devicePixelRatio) {
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      canvas.height = height * window.devicePixelRatio
      canvas.width = width * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
    }

    // mouse
    function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      }
    }

    function mouseMove(evt: MouseEvent) {
      if (!ctx) return
      const mousePos = getMousePos(canvas as HTMLCanvasElement, evt)
      ctx.lineCap = 'round'
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.shadowBlur = 1 // 邊緣模糊，防止直線邊緣出現鋸齒
      ctx.shadowColor = 'black' // 邊緣顏色
      ctx.lineTo(mousePos.x, mousePos.y)
      ctx.stroke()
    }

    canvas.addEventListener('mousedown', function (evt: MouseEvent) {
      const mousePos = getMousePos(canvas, evt)
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      evt.preventDefault()
      canvas.addEventListener('mousemove', mouseMove, false)
    })

    canvas.addEventListener(
      'mouseup',
      function () {
        canvas.removeEventListener('mousemove', mouseMove, false)
      },
      false
    )

    // touch
    function getTouchPos(canvas: HTMLCanvasElement, evt: TouchEvent) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
      }
    }

    function touchMove(evt: TouchEvent) {
      if (!ctx) return
      const touchPos = getTouchPos(canvas as HTMLCanvasElement, evt)

      ctx.lineWidth = 2
      ctx.lineCap = 'round' // 繪制圓形的結束線帽
      ctx.lineJoin = 'round' // 兩條線條交匯時，建立圓形邊角
      ctx.shadowBlur = 1 // 邊緣模糊，防止直線邊緣出現鋸齒
      ctx.shadowColor = 'black' // 邊緣顏色
      ctx.lineTo(touchPos.x, touchPos.y)
      ctx.stroke()
    }

    canvas.addEventListener('touchstart', function (evt) {
      const touchPos = getTouchPos(canvas, evt)
      ctx.beginPath()
      ctx.moveTo(touchPos.x, touchPos.y)
      evt.preventDefault()
      canvas.addEventListener('touchmove', touchMove, false)
    })

    canvas.addEventListener(
      'touchend',
      function () {
        canvas.removeEventListener('touchmove', touchMove, false)
      },
      false
    )
  }

  onMounted(() => {
    initSignatureBoard()
  })

  return {
    clear,
    getCanvasImageDataURL,
    getCanvasImageDataBlob,
    getCanvasImageDataFile,
    handleDownload
  }
}
