<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "SvgIcon",
  //   props: ["iconClass", "className"],
  props: {
    iconClass: {
      type: String,
      defaut: ""
    },
    className: {
      type: String,
      defaut: ""
    }
  },
  setup(props) {
    const msg = ref("新的尝试");
    // 计算属性，得到最终结果后返回
    const iconName = computed(() => 
      `#icon-${props.iconClass}`
    );
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      } else {
        return `svg-icon`;
      }
    });
    return {
      iconName,
      svgClass
    };
  }
};
</script>
<style lang="scss" scoped>
.svg-icon{
    width: 1em;
    height: 1em;
    // fill: currentColor;
    // color: #fff;
    // font-size: 50px;
}
    
</style>