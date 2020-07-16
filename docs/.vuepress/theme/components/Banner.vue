<template>
  <div class="banner">
    <div class="banner-anim-elem" style="display: block; position: absolute; width: 100%; transform: translate(0px, 0px);">
      <div class="bg-wrapper">
        <svg width="100%" height="100%" viewBox="0 0 1440 451" style="opacity: 1;">
          <g transform="translate(-30, 0)" id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group-9" opacity="0.3">
              <g style="transform: translate(0px, 2.73021px);">
                <g id="r-1" style="transform: translateX(2.4908px);">
                  <rect
                    id="Rectangle-6"
                    fill="#FFFFFF"
                    transform="translate(41.000000, 169.000000) rotate(-27.000000) translate(-41.000000, -169.000000) "
                    x="11"
                    y="139"
                    width="60"
                    height="60"
                    rx="2"
                  ></rect>
                </g>
              </g>
              <g style="transform: translate(0px, 8.63942px);">
                <g id="p-1" style="transform: translateX(-2.4908px);">
                  <polygon
                    id="Polygon"
                    stroke="#FFFFFF"
                    stroke-width="2"
                    transform="translate(139.000000, 17.500000) rotate(45.000000) translate(-139.000000, -17.500000) "
                    points="139 77 152 100 126 100"
                  ></polygon>
                </g>
              </g>
              <g style="transform: translate(0px, 0.366202px);">
                <g id="p-2" style="transform: translateX(3.7362px);">
                  <polygon
                    id="Polygon"
                    stroke="#FFFFFF"
                    transform="translate(180.000000, 446.000000) rotate(-67.000000) translate(-180.000000, -446.000000) "
                    points="180 439 188 453 172 453"
                  ></polygon>
                </g>
              </g>
              <g style="transform: translate(0px, -9.37798px);">
                <g id="c-1" style="transform: translateX(-3.7362px);">
                  <circle id="Oval" stroke="#FFFFFF" stroke-width="3" fill="#FFFFFF" cx="256" cy="357" r="10"></circle>
                </g>
              </g>
            </g>
            <g id="Group-8" transform="translate(1219.000000, 69.000000)" stroke="#FFFFFF">
              <g style="transform: translate(0px, 8.20129px);">
                <g id="r-2" style="transform: translateX(-1.2454px);">
                  <rect
                    id="Rectangle-6"
                    stroke-width="2"
                    opacity="0.3"
                    transform="translate(47.000000, 343.000000) rotate(-45.000000) translate(-47.000000, -343.000000) "
                    x="15"
                    y="311"
                    width="64"
                    height="64"
                    rx="2"
                  ></rect>
                </g>
              </g>
              <g style="transform: translate(0px, 17.3115px);">
                <g id="c-2" style="transform: translateX(4.9816px);">
                  <circle id="Oval" stroke-width="3" fill="#FFFFFF" opacity="0.4" cx="155" cy="13" r="13"></circle>
                </g>
              </g>
              <g style="transform: translate(0px, -25.7483px);">
                <g id="c-3" style="transform: translateX(-3.7362px);">
                  <circle id="Oval" stroke-width="2" opacity="0.4" cx="211" cy="225" r="8"></circle>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div class="text-wrapper">
        <div class="logo-wrapper" style="opacity: 1; transform: translate(0px, 0px);">
          <i class="vertical left" style="transform: translate(0px, 0px); opacity: 1;"></i>
          <i class="horizontal top" style="transform: translate(0px, 0px); opacity: 1;"></i>
          <i class="vertical right" style="transform: translate(0px, 0px); opacity: 1;"></i>
          <i class="horizontal bottom" style="transform: translate(0px, 0px); opacity: 1;"></i>
          <Logo width="130" height="130" />
        </div>
        <p class="introduce" style="opacity: 1; transform: translate(0px, 0px);">
          乘风破浪会有时，直挂云帆济沧海
        </p>
        <div class="button-wrapper" style="opacity: 1; transform: translate(0px, 0px);">
          <!-- <a class="btn-temp home-button">Github</a> -->
          <a class="btn-editor home-button" style="margin-left:0;">关于我</a>
          <!-- <a class="btn-editor home-button">Github</a> -->
          <!-- <a class="btn-editor home-button">Github</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@theme/components/Logo';
export default {
  name: 'Banner',
  components: { Logo }
};
</script>

<style scoped></style>
