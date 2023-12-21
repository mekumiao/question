<script setup lang="ts">
import { NList, NListItem, NSpace, NTag, NThing, NCard } from 'naive-ui'
</script>

<template>
  <div class="grid grid-cols-6 gap-2 px-2">
    <NList hoverable clickable class="col-span-2">
      <NListItem>
        <NThing title="真题试卷" content-style="margin-top: 10px;">
          <template #description>
            <NSpace size="small" style="margin-top: 4px">
              <NTag :bordered="false" type="info" size="small"> 暑夜 </NTag>
              <NTag :bordered="false" type="info" size="small"> 晚春 </NTag>
            </NSpace>
          </template>
          奋勇呀然后休息呀<br />
          完成你伟大的人生
        </NThing>
      </NListItem>
      <NListItem>
        <NThing title="随机出题" content-style="margin-top: 10px;">
          <template #description>
            <NSpace size="small" style="margin-top: 4px">
              <NTag :bordered="false" type="info" size="small"> 环形公路 </NTag>
              <NTag :bordered="false" type="info" size="small"> 潜水艇司机 </NTag>
            </NSpace>
          </template>
          最新的打印机<br />
          让他带你去被工厂敲击
        </NThing>
      </NListItem>
    </NList>

    <div
      class="col-span-4 grid grid-cols-3 gap-2 overflow-auto ps-4"
      style="height: calc(100vh - var(--header-height) - 100px)"
    >
      <NCard v-for="(item, key) in 20" :key="key" class="col-span-1">
        <ul>
          <li>试卷：xxxxx</li>
          <li>试卷：xxxxx</li>
          <li>试卷：xxxxx</li>
        </ul>
      </NCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
