<script setup lang="ts">
defineProps<{
  name: string
  title?: string
}>()
</script>

<template>
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
    class="block"
  >
    <title v-if="title">{{ title }}</title>

    <g v-if="name === 'coconut'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22" cy="26" r="11" fill="#F1D8AA"/>
      <circle cx="22" cy="26" r="6.5" fill="#FFFFFF"/>
      <path d="M18 17c3-5 8-7 14-6-2 5-6 8-11 9" fill="#2D9960"/>
      <path d="M30 13c3 2 5 5 6 9"/>
    </g>

    <g v-else-if="name === 'coconut-milk'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 14h16v22c0 2-2 4-4 4H20c-2 0-4-2-4-4V14Z" fill="#F7F3E8"/>
      <path d="M18 14V11c0-2 2-4 6-4s6 2 6 4v3" fill="#DCEDE3"/>
      <path d="M18 24h12v8c0 1.5-1.5 3-3 3h-6c-1.5 0-3-1.5-3-3v-8Z" fill="#F1D8AA"/>
      <circle cx="24" cy="20" r="2.5" fill="#FFFFFF"/>
      <path d="M22 12c1.5-2 4-3 6-2" stroke="#2D9960"/>
    </g>

    <g v-else-if="name === 'coconut-chips'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 30c4 6 12 8 18 3-6 1-11-2-14-7-2 1-3 2-4 4Z" fill="#F1D8AA"/>
      <path d="M15 24c5 6 12 8 18 4-5 0-10-4-13-9-2 1-4 3-5 5Z" fill="#F7F3E8"/>
      <path d="M21 18c4 5 10 7 16 4-5-1-9-4-12-9-2 1-3 3-4 5Z" fill="#E8A427"/>
      <path d="M28 12c3-2 6-3 9-2" stroke="#2D9960"/>
      <path d="M34 12c2 1 3 3 4 5"/>
    </g>

    <g v-else-if="name === 'coconut-oil'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 8h8v5l2 2v4H18v-4l2-2V8Z" fill="#DCEDE3"/>
      <path d="M17 19h14v19c0 2-2 4-4 4h-6c-2 0-4-2-4-4V19Z" fill="#F7F3E8"/>
      <path d="M19 28h10v7c0 1-1 2-2 2h-6c-1 0-2-1-2-2v-7Z" fill="#E8A427"/>
      <circle cx="24" cy="23" r="2" fill="#F1D8AA" stroke="none"/>
      <path d="M22 11c2-3 5-4 8-3" stroke="#2D9960"/>
    </g>

    <g v-else-if="name === 'plantain'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 28c5 7 14 8 21 2-7 1-13-2-17-8-2 1-3 3-4 6Z" fill="#E8A427"/>
      <path d="M18 22c5 6 12 8 19 5-6-1-11-5-14-11-3 1-4 3-5 6Z" fill="#F5C357"/>
      <path d="M25 16c4-3 7-5 10-5"/>
      <path d="M33 11c3-1 5 0 7 2-3 2-5 2-7-2Z" fill="#2D9960"/>
    </g>

    <g v-else-if="name === 'poultry'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 28c0-8 6-14 14-14 7 0 12 5 12 11 0 7-7 12-16 12-7 0-10-3-10-9Z" fill="#F7F3E8"/>
      <path d="M27 19c-5 2-7 7-5 12 5 1 9-2 10-7" fill="#E8A427"/>
      <path d="M37 16c0-3 2-5 4-5 0 3-1 5-4 5Zm0 0c-2-2-2-4-1-6 3 1 4 3 1 6Z" fill="#2D9960"/>
      <circle cx="36" cy="20" r="1" fill="#0B3A25" stroke="none"/>
      <path d="m39 23 5 2-5 2M21 37l-2 5m11-5 2 5M17 42h5m8 0h5"/>
    </g>

    <g v-else-if="name === 'eggs'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 31c0-8 5-17 10-17s10 9 10 17c0 6-4 9-10 9s-10-3-10-9Z" fill="#F7F3E8"/>
      <path d="M24 28c0-7 4-14 8-14s8 7 8 14c0 5-3 8-8 8s-8-3-8-8Z" fill="#F1D8AA"/>
    </g>

    <g v-else-if="['sprout','natural','leaf','regeneration'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 40V23"/>
      <path d="M23 27C15 27 10 22 9 14c8 0 13 4 14 13Zm2-6c8 0 13-5 14-13-8 0-13 4-14 13Z" fill="#2D9960"/>
      <path d="M11 40c4-4 8-6 13-6s9 2 13 6" stroke="#E8A427"/>
    </g>

    <g v-else-if="['land','field','palm'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 36c7-6 14-9 21-9s13 2 17 6" stroke="#2D9960"/>
      <path d="M7 42c8-5 16-7 24-6 5 0 9 1 12 3" stroke="#E8A427"/>
      <path d="M24 28V13"/>
      <path d="M23 17c-6 0-10-3-12-8 6-1 11 2 12 8Zm2 0c6 0 10-3 12-8-6-1-11 2-12 8Z" fill="#2D9960"/>
    </g>

    <g v-else-if="['harvest','box','package','clipboard'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m8 18 16-8 16 8-16 8-16-8Z" fill="#F1D8AA"/>
      <path d="M8 18v18l16 8 16-8V18M24 26v18"/>
      <path d="m17 14 16 8" stroke="#E8A427"/>
      <path d="M31 11c4-2 8-1 10 2-4 2-8 1-10-2Z" fill="#2D9960"/>
    </g>

    <g v-else-if="['system','cycle'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M37 18a15 15 0 0 0-25-3l-3 4"/>
      <path d="m8 12 1 7 7-1" fill="#E8A427"/>
      <path d="M11 30a15 15 0 0 0 25 3l3-4"/>
      <path d="m40 36-1-7-7 1" fill="#2D9960"/>
      <path d="M24 31V20m0 3c-5 0-8-3-9-8 5 0 8 3 9 8Zm1 2c5 0 8-3 9-8-5 0-8 3-9 8Z" fill="#2D9960"/>
    </g>

    <g v-else-if="['sun','quality','spark'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m24 7 4.5 10 10.5 1-8 7 2.5 10.5L24 30l-9.5 5.5L17 25l-8-7 10.5-1L24 7Z" fill="#E8A427"/>
      <path d="m19 24 3 3 7-8" stroke="#FFFFFF"/>
    </g>

    <g v-else-if="['trust','heart'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 38S9 29 9 18c0-5 4-9 9-9 3 0 5 1 6 4 2-3 4-4 7-4 5 0 9 4 9 9 0 11-16 20-16 20Z" fill="#F1D8AA"/>
      <path d="M16 29c5-4 11-4 16 0" stroke="#2D9960"/>
    </g>

    <g v-else-if="['community','people'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="15" r="5" fill="#E8A427"/>
      <circle cx="11" cy="20" r="4" fill="#2D9960"/>
      <circle cx="37" cy="20" r="4" fill="#2D9960"/>
      <path d="M14 39c1-8 5-12 10-12s9 4 10 12H14Zm-11-1c1-6 4-9 8-9 2 0 4 1 6 3m28 6c-1-6-4-9-8-9-2 0-4 1-6 3"/>
    </g>

    <g v-else-if="name === 'world'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="17" fill="#DCEDE3"/>
      <path d="M7 24h34M24 7c5 5 8 11 8 17s-3 12-8 17c-5-5-8-11-8-17s3-12 8-17Z"/>
      <path d="M12 14c4 3 8 4 12 4s8-1 12-4M12 34c4-3 8-4 12-4s8 1 12 4" stroke="#2D9960"/>
    </g>

    <g v-else-if="['innovation','monitor','os'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="8" width="36" height="27" rx="3" fill="#DCEDE3"/>
      <path d="M17 42h14M24 35v7M24 30V18m0 4c-5 0-8-3-9-8 5 0 8 3 9 8Zm1 2c5 0 8-3 9-8-5 0-8 3-9 8Z" fill="#2D9960"/>
    </g>

    <g v-else-if="['map','pin'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 43S11 31 11 20a13 13 0 1 1 26 0c0 11-13 23-13 23Z" fill="#F1D8AA"/>
      <circle cx="24" cy="20" r="5" fill="#2D9960"/>
    </g>

    <g v-else-if="name === 'flask'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 7h10M21 7v12L10 38c-1 2 1 4 3 4h22c2 0 4-2 3-4L27 19V7"/>
      <path d="M15 33h18l5 7H10l5-7Z" fill="#E8A427"/>
      <circle cx="23" cy="28" r="2" fill="#2D9960" stroke="none"/>
    </g>

    <g v-else-if="name === 'water'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 5S10 22 10 31a14 14 0 0 0 28 0C38 22 24 5 24 5Z" fill="#DCEDE3"/>
      <path d="M17 32c1 4 4 6 8 6" stroke="#2D9960"/>
    </g>

    <g v-else-if="name === 'pest'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="24" cy="26" rx="9" ry="13" fill="#E8A427"/>
      <path d="M24 13v26M15 22H9m6 8H8m25-8h6m-6 8h7M18 13l-4-5m16 5 4-5"/>
      <circle cx="21" cy="20" r="1" fill="#0B3A25" stroke="none"/><circle cx="27" cy="20" r="1" fill="#0B3A25" stroke="none"/>
    </g>

    <g v-else-if="['education','book'].includes(name)" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 11c7-2 13 0 19 5v26c-6-5-12-7-19-5V11Zm38 0c-7-2-13 0-19 5v26c6-5 12-7 19-5V11Z" fill="#F1D8AA"/>
      <path d="M24 16v26"/>
    </g>

    <g v-else-if="name === 'plane'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m5 27 38-17-11 30-8-10-10 7 3-11-12 1Z" fill="#DCEDE3"/>
      <path d="m17 26 15-8-8 12" stroke="#E8A427"/>
    </g>

    <g v-else-if="name === 'phone'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 7h7l3 10-5 3c3 6 5 8 11 11l3-5 10 3v7c0 4-3 7-7 7C18 41 7 30 5 14c0-4 3-7 7-7Z" fill="#DCEDE3"/>
    </g>

    <g v-else-if="name === 'mail'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="10" width="38" height="28" rx="3" fill="#F7F3E8"/>
      <path d="m7 13 17 14 17-14" stroke="#2D9960"/>
    </g>

    <g v-else-if="name === 'clock'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="18" fill="#F7F3E8"/>
      <path d="M24 13v12l8 5" stroke="#E8A427"/>
    </g>

    <g v-else-if="name === 'target'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22" cy="26" r="16" fill="#F7F3E8"/>
      <circle cx="22" cy="26" r="9" fill="#DCEDE3"/>
      <circle cx="22" cy="26" r="3" fill="#E8A427"/>
      <path d="m25 23 14-14m-4 0h4v4"/>
    </g>

    <g v-else-if="name === 'factory'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 42V20l12 7v-7l12 7V10h8l3 32H6Z" fill="#DCEDE3"/>
      <path d="M12 34h5m6 0h5m6 0h4" stroke="#E8A427"/>
    </g>

    <g v-else-if="name === 'chat'" stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8h36v27H21l-9 7v-7H6V8Z" fill="#DCEDE3"/>
      <path d="M14 18h20M14 25h14" stroke="#2D9960"/>
    </g>

    <g v-else stroke="#0B3A25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="18" fill="#F7F3E8"/>
      <path d="M24 36V21m0 4c-6 0-10-4-11-10 6 0 10 4 11 10Zm1 2c6 0 10-4 11-10-6 0-10 4-11 10Z" fill="#2D9960"/>
    </g>
  </svg>
</template>
