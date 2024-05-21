<template>
    <div id="range-filter-container">
      <input
        type="range"
        :min="minValue"
        :max="maxValue"
        :step="step"
        v-model="minRange"
        @input="updateRange"
      >
      <input
        type="range"
        :min="minValue"
        :max="maxValue"
        :step="step"
        v-model="maxRange"
        @input="updateRange"
      >
      <div>
        <span>{{ minRange }}</span> - <span>{{ maxRange }}</span>
      </div>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        minValue: 0,
        maxValue: 151,
        step: 1,
        minRange: 0,
        maxRange: 151,
      };
    },
    methods: {
      updateRange() {
        this.$emit('range-updated', { min: this.minRange, max: this.maxRange });
      }
    }
  };
</script>
  
<style scoped>
  #range-filter-container {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  input[type=range] {
    width: 80%;
    margin: 5px 10px;
  }
  div {
    margin-top: 10px;
  }
</style>