<template lang="pug">
canvas(ref="canvas").w-full.h-full
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from 'vue';
import { fetchCreateProgram } from '../utils/rendering';
import { bg } from '../store';

let [maxWidth, maxHeight] = [2560, 2560];
let [width, height] = [0, 0];

const canvas = ref<HTMLCanvasElement>();

const resizeCanvas = () => {
  if (!canvas.value) return;

  // Use the dom element's bounding client rect to get the aspect ratio
  const rect = canvas.value.getBoundingClientRect();
  const pxRatio = window.devicePixelRatio;
  const aspectRatio = rect.width / rect.height;
  width = Math.min(rect.width * pxRatio, maxWidth);
  height = (rect.width * pxRatio) / aspectRatio;

  if (height > maxHeight)
    [height, width] = [maxHeight, height * aspectRatio];

  if (width > maxWidth)
    [width, height] = [maxWidth, width / aspectRatio];

  // Update the canvas drawing buffer size
  [canvas.value.width, canvas.value.height] = [width, height];
};

const initRenderer = async (shaders: string[]) => {

  const gl = canvas.value!.getContext('webgl')!;

  resizeCanvas();

  if (canvas.value === null) return;
  const prog = await fetchCreateProgram(gl, shaders);

  const positionAttributeLocation = gl.getAttribLocation(prog, "a_position");

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // fill it with a 2 triangles that cover clip space
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  // first triangle
    1, -1,
    -1, 1,
    -1, 1,  // second triangle
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  // Uniform locations
  // const timeLocation = gl.getUniformLocation(prog, "iTime");
  const resolutionLocation = gl.getUniformLocation(prog, "iResolution");
  const computedTimeLocation = gl.getUniformLocation(prog, "computedTime");
  const lineWidthLocation = gl.getUniformLocation(prog, "lineWidth");
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const render = () => {
    bg.time = performance.now() * 0.001; // Current time in seconds
    // Slow down the rotation speed by decreasing the time multiplier
    bg.computedTime += ((bg.time - bg.prevTime) * bg.speed);
    bg.prevTime = bg.time;

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, width, height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(prog);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,          // 2 components per iteration
      gl.FLOAT,   // the data is 32bit floats
      false,      // don't normalize the data
      0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
      0,          // start at the beginning of the buffer
    );

    // Set the uniform values (injection)
    // gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(resolutionLocation, width, height);
    gl.uniform1f(computedTimeLocation, bg.computedTime);
    gl.uniform1f(lineWidthLocation, bg.lineWidth);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // After setting uniforms and drawing
    if (gl.getError() !== gl.NO_ERROR) {
        console.error('WebGL encountered an error');
    }
    requestAnimationFrame(render);
  }
  // Add a resize event listener to adjust the canvas size dynamically
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(render);
}

export default defineComponent({
  name: 'WebGLRenderer',
  components: {},
  props: {
    maxWidth: Number,
    maxHeight: Number,
    shaders: {
      type: Array<string>,
      default: () => [],
      required: true,
    },
  },
  setup(props) {

    if (props.maxWidth) maxWidth = props.maxWidth;
    if (props.maxHeight) maxHeight = props.maxHeight;

    onMounted(async () => {
      if (!canvas.value)
        throw new Error('Canvas not found');
      await initRenderer(props.shaders);
    });

    watchEffect((onInvalidate) => {
      onInvalidate(() => window.removeEventListener('resize', resizeCanvas));
    });

    return { props, canvas };
  },
});
</script>
<style scoped lang="pcss">
/* canvas {
    image-rendering: optimizeSpeed;             // Older versions of FF
    image-rendering: -moz-crisp-edges;          // FF 6.0+
    image-rendering: -webkit-optimize-contrast; // Safari
    image-rendering: -o-crisp-edges;            // OS X & Windows Opera (12.02+)
    image-rendering: pixelated;                 // Awesome future-browsers
    -ms-interpolation-mode: nearest-neighbor;   // IE
    filter: blur(1.5px);
} */
</style>