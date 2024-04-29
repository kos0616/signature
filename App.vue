<template>
  <main>
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100dvh;
        width: 100dvw;
        justify-content: center;
      "
    >
      <table>
        <caption style="text-align: left; font-size: 150%; margin-bottom: 0.5rem">
          Car maintin
        </caption>
        <thead>
          <tr>
            <th>Title</th>
            <th style="width: 3rem">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Changing Handlebar</td>
            <td class="amount">100</td>
          </tr>
          <tr>
            <td>Replacing Brake Pads</td>
            <td class="amount">150</td>
          </tr>
          <tr>
            <td>Oil Change</td>
            <td class="amount">50</td>
          </tr>
          <tr>
            <td>Spark Plug Replacement</td>
            <td class="amount">30</td>
          </tr>
          <tr>
            <td>Air Filter Replacement</td>
            <td class="amount">20</td>
          </tr>
          <tr>
            <td>Wheel Alignment</td>
            <td class="amount">80</td>
          </tr>
          <tr>
            <td>Transmission Fluid Flush</td>
            <td class="amount">120</td>
          </tr>
          <tr>
            <td>Battery Replacement</td>
            <td class="amount">90</td>
          </tr>
          <tr>
            <td>Tire Rotation</td>
            <td class="amount">25</td>
          </tr>
          <tr>
            <td>Engine Diagnostic</td>
            <td class="amount">60</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td class="amount">725</td>
          </tr>
        </tfoot>
      </table>

      <div>
        <div
          style="
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 1rem 1rem;
            display: flex;
            flex-direction: column;
          "
        >
          <div style="margin-bottom: 0.5rem; font-size: 150%">
            <strong>Signature</strong>
          </div>
          <img v-if="img" :src="img" alt="" />
          <button popovertarget="my-popover">Open signature board</button>
        </div>
      </div>
    </div>

    <div
      popover
      id="my-popover"
      style="border: 1px solid #ccc; padding: 1rem 0.5rem; border-radius: 10px"
    >
      <p>Sign here</p>
      <signature @signdone="getImg"></signature>
    </div>
    <!-- <button @click="getImg">Get img</button> -->
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import signature from './components/signature/index.vue'
const img = ref('')

const getImg = async (file: File) => {
  const dom = document.querySelector('#my-popover') as HTMLDivElement
  if (dom) dom.hidePopover()
  if (!file) return
  img.value = URL.createObjectURL(file)
}
</script>

<style>
html,
body {
  margin: 0;
}

table {
  width: 50%;
  border-collapse: collapse;
  margin: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tfoot {
  font-weight: bold;
}

.amount {
  text-align: right;
}

#my-popover::backdrop {
  backdrop-filter: blur(10px);
}
</style>
