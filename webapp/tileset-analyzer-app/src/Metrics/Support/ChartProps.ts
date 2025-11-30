export const CHART_STYLE = {
  height: '600px',
};

export const BASE_CHART_CONFIG = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: { top: 80, right: 40, bottom: 20, left: 40, containLabel: true },
  xAxis: {
    nameLocation: 'middle',
    nameGap: 30,
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    nameLocation: 'middle',
    nameGap: 60,
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
};
