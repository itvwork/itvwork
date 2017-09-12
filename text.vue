<div class="sel-color" v-show='meun.quote'>
    <p class="sel-color-title">主题颜色</p>
    <ul class="word-color">
        <li class="main-color-title icon-white" @click="quoteColor('fff')"></li>
        <li class="main-color-title icon-black" @click="quoteColor('000')"></li>
        <li class="main-color-title icon-cream" @click="quoteColor('eeece1')"></li>
        <li class="main-color-title icon-black-blue" @click="quoteColor('1f497d')"></li>
        <li class="main-color-title icon-blue" @click="quoteColor('4f81bd')"></li>
        <li class="main-color-title icon-red" @click="quoteColor('c0504d')"></li>
        <li class="main-color-title icon-green" @click="quoteColor('9bbb59')"></li>
        <li class="main-color-title icon-violet" @click="quoteColor('8064a2')"></li>
        <li class="main-color-title icon-cyan" @click="quoteColor('4bacc6')"></li>
        <li class="main-color-title icon-orange" @click="quoteColor('f79646')"></li>
    </ul>
    <ul class="word-color vice-color">
        <li class="main-color-title icon-white">
            <i class="gray1" @click="quoteColor('f2f2f2')"></i>
            <i class="gray2" @click="quoteColor('d8d8d8')"></i>
            <i class="gray3" @click="quoteColor('bfbfbf')"></i>
            <i class="gray4" @click="quoteColor('a5a5a5')"></i>
            <i class="gray5" @click="quoteColor('7f7f7f')"></i>
        </li>
        <li class="main-color-title icon-black">
            <i class="black1" @click="quoteColor('7f7f7f')"></i>
            <i class="black2" @click="quoteColor('595959')"></i>
            <i class="black3" @click="quoteColor('3f3f3f')"></i>
            <i class="black4" @click="quoteColor('262626')"></i>
            <i class="black5" @click="quoteColor('0c0c0c')"></i>
        </li>
        <li class="main-color-title icon-cream">
            <i class="cream1" @click="quoteColor('ddd9c3')"></i>
            <i class="cream2" @click="quoteColor('c4bd97')"></i>
            <i class="cream3" @click="quoteColor('938953')"></i>
            <i class="cream4" @click="quoteColor('494429')"></i>
            <i class="cream5" @click="quoteColor('1d1b10')"></i>
        </li>
        <li class="main-color-title icon-black-blue">
            <i class="black-blue1" @click="quoteColor('c6d9f0')"></i>
            <i class="black-blue2" @click="quoteColor('8db3e2')"></i>
            <i class="black-blue3" @click="quoteColor('548dd4')"></i>
            <i class="black-blue4" @click="quoteColor('17365d')"></i>
            <i class="black-blue5" @click="quoteColor('0f243e')"></i>
        </li>
        <li class="main-color-title icon-blue">
            <i class="blue1" @click="quoteColor('dbe5f1')"></i>
            <i class="blue2" @click="quoteColor('b8cce4')"></i>
            <i class="blue3" @click="quoteColor('95b3d7')"></i>
            <i class="blue4" @click="quoteColor('366092')"></i>
            <i class="blue5" @click="quoteColor('244061')"></i>
        </li>
        <li class="main-color-title icon-red">
            <i class="red1" @click="quoteColor('f2dcdb')"></i>
            <i class="red2" @click="quoteColor('e5b9b7')"></i>
            <i class="red3" @click="quoteColor('d99694')"></i>
            <i class="red4" @click="quoteColor('953734')"></i>
            <i class="red5" @click="quoteColor('632423')"></i>
        </li>
        <li class="main-color-title icon-green">
            <i class="green1" @click="quoteColor('ebf1dd')"></i>
            <i class="green2" @click="quoteColor('d7e3bc')"></i>
            <i class="green3" @click="quoteColor('c3d69b')"></i>
            <i class="green4" @click="quoteColor('76923c')"></i>
            <i class="green5" @click="quoteColor('4f6128')"></i>
        </li>
        <li class="main-color-title icon-violet">
            <i class="violet1" @click="quoteColor('e5e0ec')"></i>
            <i class="violet2" @click="quoteColor('ccc1d9')"></i>
            <i class="violet3" @click="quoteColor('b2a2c7')"></i>
            <i class="violet4" @click="quoteColor('5f497a')"></i>
            <i class="violet5" @click="quoteColor('3f3151')"></i>
        </li>
        <li class="main-color-title icon-cyan">
            <i class="cyan1" @click="quoteColor('dbeef3')"></i>
            <i class="cyan2" @click="quoteColor('b7dde8')"></i>
            <i class="cyan3" @click="quoteColor('92cddc')"></i>
            <i class="cyan4" @click="quoteColor('31859b')"></i>
            <i class="cyan5" @click="quoteColor('205867')"></i>
        </li>
        <li class="main-color-title icon-orange">
            <i class="orange1" @click="quoteColor('fdeada')"></i>
            <i class="orange2" @click="quoteColor('fbd5b5')"></i>
            <i class="orange3" @click="quoteColor('fac08f')"></i>
            <i class="orange4" @click="quoteColor('e36c09')"></i>
            <i class="orange5" @click="quoteColor('974806')"></i>
        </li>

    </ul>
    <p class="sel-color-title">标准颜色</p>
    <ul class="word-color main-word-color">
        <li class="main-color-title a1" @click="quoteColor('c00000')"></li>
        <li class="main-color-title a2" @click="quoteColor('ff0000')"></li>
        <li class="main-color-title a3" @click="quoteColor('ffc000')"></li>
        <li class="main-color-title a4" @click="quoteColor('ffff00')"></li>
        <li class="main-color-title a5" @click="quoteColor('92d050')"></li>
        <li class="main-color-title a6" @click="quoteColor('00b050')"></li>
        <li class="main-color-title a7" @click="quoteColor('00b0f0')"></li>
        <li class="main-color-title a8" @click="quoteColor('0070c0')"></li>
        <li class="main-color-title a8" @click="quoteColor('002060')"></li>
        <li class="main-color-title a10"@click="quoteColor('7030a0')"></li>
    </ul>

  <button class="jscolor  {valueElement:null,onFineChange:'vues.update(this)'}"value="cc66ff">自定义颜色</button>
</div>
