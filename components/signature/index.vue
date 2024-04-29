<template>
  <div style="display: flex; flex-direction: column">
    <canvas ref="signatureBoard" style="flex-grow: 1; border: 1px solid #ccc"></canvas>
    <hr />
    <div style="display: flex; gap: 1rem; justify-content: center">
      <button
        @click="clear"
        type="button"
        style="border: transparent; background-color: transparent"
      >
        X Clear
      </button>
      <button @click="handleGetImg" type="button">V Done</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import init from './lib'
// import FileUpload from "../../Service/fileUpload";

/** 數位簽名板 */
export default defineComponent({
  name: 'signature-board',
  emits: ['signdone'],
  setup(props, { emit }) {
    const signatureBoard = ref<HTMLCanvasElement | null>(null)
    const { clear, getCanvasImageDataFile, handleDownload } = init(signatureBoard)

    const handleGetImg = async () => {
      const file = await getCanvasImageDataFile()
      emit('signdone', file)
      return file
      // const getter = new FileUpload([file])
      // return getter.action().then((img) => {
      //   return img
      // })
    }

    return { clear, handleGetImg, signatureBoard, handleDownload }
  }
})
</script>
