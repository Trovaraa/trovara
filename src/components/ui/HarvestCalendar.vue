<script setup lang="ts">
export interface HarvestWindow {
  product: string
  period: string
  status: 'available' | 'forecast' | 'planting'
  note?: string
}

defineProps<{
  windows: HarvestWindow[]
}>()

const statusStyles: Record<HarvestWindow['status'], string> = {
  available: 'bg-trovara-green/10 text-trovara-green border-trovara-green/20',
  forecast: 'bg-amber-50 text-amber-800 border-amber-200',
  planting: 'bg-blue-50 text-blue-800 border-blue-200',
}

const statusLabels: Record<HarvestWindow['status'], string> = {
  available: 'Available',
  forecast: 'Forecast',
  planting: 'Planting',
}
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
    <table class="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr class="border-b border-gray-100 bg-trovara-cream/60">
          <th class="px-5 py-4 font-bold text-trovara-dark">Product</th>
          <th class="px-5 py-4 font-bold text-trovara-dark">Supply window</th>
          <th class="px-5 py-4 font-bold text-trovara-dark">Status</th>
          <th class="px-5 py-4 font-bold text-trovara-dark hidden md:table-cell">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in windows"
          :key="`${row.product}-${row.period}`"
          class="border-b border-gray-50 last:border-0"
        >
          <td class="px-5 py-4 font-semibold text-trovara-dark">{{ row.product }}</td>
          <td class="px-5 py-4 text-gray-600">{{ row.period }}</td>
          <td class="px-5 py-4">
            <span
              class="inline-flex px-2.5 py-1 rounded-full text-xs font-bold border"
              :class="statusStyles[row.status]"
            >
              {{ statusLabels[row.status] }}
            </span>
          </td>
          <td class="px-5 py-4 text-gray-500 hidden md:table-cell">{{ row.note ?? '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
