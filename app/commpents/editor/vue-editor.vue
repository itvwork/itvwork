<template>
<div class="vue-editor-wrap" :style='{width:width}'>
    <ul class="vue-editor-nav">
        <li class="vue-editor-nav-item" @mouseover="meun.title=true" @mouseout="meun.title=false"><i class="icon icon-title"></i>
            <ul class="vue-word-title" v-show="meun.title">
                <li class="normal-word" @click="_execCommand('formatBlock', '<p>')">正文</li>
                <li class="h1" @click="_execCommand('formatBlock', '<h1>')">H1</li>
                <li class="h2" @click="_execCommand('formatBlock', '<h2>')">H2</li>
                <li class="h3" @click="_execCommand('formatBlock', '<h3>')">H3</li>
                <li class="h4" @click="_execCommand('formatBlock', '<h4>')">H4</li>
                <li class="h5" @click="_execCommand('formatBlock', '<h5>')">H5</li>
                <li class="h6" @click="_execCommand('formatBlock', '<h6>')">H6</li>
            </ul>
        </li>
        <li class="vue-editor-nav-item" @click="_execCommand('bold')"><i class="icon icon-blod"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('italic')"><i class="icon icon-itatic"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('underline')"><i class="icon icon-underline"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('strikeThrough')"><i class="icon icon-centerline"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('superscript')"><i class="icon icon-sup"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('subscript')"><i class="icon icon-sub"></i></li>
        <li class="vue-editor-nav-item" :style="{backgroundColor:meun.iconColor}" @mouseover="meun.color=true" @mouseout="meun.color=false"><i :style="{color:meun.colorBg}" class="icon icon-color"></i>
            <div class="sel-color" v-show='meun.color'>
                <div class="white-block"></div>
                <p class="sel-color-title">主题颜色</p>
                <ul class="word-color">
                    <li class="main-color-title icon-white" @click="color('#fff')"></li>
                    <li class="main-color-title icon-black" @click="color('#000')"></li>
                    <li class="main-color-title icon-cream" @click="color('#eeece1')"></li>
                    <li class="main-color-title icon-black-blue" @click="color('#1f497d')"></li>
                    <li class="main-color-title icon-blue" @click="color('#4f81bd')"></li>
                    <li class="main-color-title icon-red" @click="color('#c0504d')"></li>
                    <li class="main-color-title icon-green" @click="color('#9bbb59')"></li>
                    <li class="main-color-title icon-violet" @click="color('#8064a2')"></li>
                    <li class="main-color-title icon-cyan" @click="color('#4bacc6')"></li>
                    <li class="main-color-title icon-orange" @click="color('#f79646')"></li>
                </ul>
                <ul class="word-color vice-color">
                    <li class="main-color-title icon-white">
                        <i class="gray1" @click="color('#f2f2f2')"></i>
                        <i class="gray2" @click="color('#d8d8d8')"></i>
                        <i class="gray3" @click="color('#bfbfbf')"></i>
                        <i class="gray4" @click="color('#a5a5a5')"></i>
                        <i class="gray5" @click="color('#7f7f7f')"></i>
                    </li>
                    <li class="main-color-title icon-black">
                        <i class="black1" @click="color('#7f7f7f')"></i>
                        <i class="black2" @click="color('#595959')"></i>
                        <i class="black3" @click="color('#3f3f3f')"></i>
                        <i class="black4" @click="color('#262626')"></i>
                        <i class="black5" @click="color('#0c0c0c')"></i>
                    </li>
                    <li class="main-color-title icon-cream">
                        <i class="cream1" @click="color('#ddd9c3')"></i>
                        <i class="cream2" @click="color('#c4bd97')"></i>
                        <i class="cream3" @click="color('#938953')"></i>
                        <i class="cream4" @click="color('#494429')"></i>
                        <i class="cream5" @click="color('#1d1b10')"></i>
                    </li>
                    <li class="main-color-title icon-black-blue">
                        <i class="black-blue1" @click="color('#c6d9f0')"></i>
                        <i class="black-blue2" @click="color('#8db3e2')"></i>
                        <i class="black-blue3" @click="color('#548dd4')"></i>
                        <i class="black-blue4" @click="color('#17365d')"></i>
                        <i class="black-blue5" @click="color('#0f243e')"></i>
                    </li>
                    <li class="main-color-title icon-blue">
                        <i class="blue1" @click="color('#dbe5f1')"></i>
                        <i class="blue2" @click="color('#b8cce4')"></i>
                        <i class="blue3" @click="color('#95b3d7')"></i>
                        <i class="blue4" @click="color('#366092')"></i>
                        <i class="blue5" @click="color('#244061')"></i>
                    </li>
                    <li class="main-color-title icon-red">
                        <i class="red1" @click="color('#f2dcdb')"></i>
                        <i class="red2" @click="color('#e5b9b7')"></i>
                        <i class="red3" @click="color('#d99694')"></i>
                        <i class="red4" @click="color('#953734')"></i>
                        <i class="red5" @click="color('#632423')"></i>
                    </li>
                    <li class="main-color-title icon-green">
                        <i class="green1" @click="color('#ebf1dd')"></i>
                        <i class="green2" @click="color('#d7e3bc')"></i>
                        <i class="green3" @click="color('#c3d69b')"></i>
                        <i class="green4" @click="color('#76923c')"></i>
                        <i class="green5" @click="color('#4f6128')"></i>
                    </li>
                    <li class="main-color-title icon-violet">
                        <i class="violet1" @click="color('#e5e0ec')"></i>
                        <i class="violet2" @click="color('#ccc1d9')"></i>
                        <i class="violet3" @click="color('#b2a2c7')"></i>
                        <i class="violet4" @click="color('#5f497a')"></i>
                        <i class="violet5" @click="color('#3f3151')"></i>
                    </li>
                    <li class="main-color-title icon-cyan">
                        <i class="cyan1" @click="color('#dbeef3')"></i>
                        <i class="cyan2" @click="color('#b7dde8')"></i>
                        <i class="cyan3" @click="color('#92cddc')"></i>
                        <i class="cyan4" @click="color('#31859b')"></i>
                        <i class="cyan5" @click="color('#205867')"></i>
                    </li>
                    <li class="main-color-title icon-orange">
                        <i class="orange1" @click="color('#fdeada')"></i>
                        <i class="orange2" @click="color('#fbd5b5')"></i>
                        <i class="orange3" @click="color('#fac08f')"></i>
                        <i class="orange4" @click="color('#e36c09')"></i>
                        <i class="orange5" @click="color('#974806')"></i>
                    </li>

                </ul>
                <p class="sel-color-title">标准颜色</p>
                <ul class="word-color main-word-color">
                    <li class="main-color-title a1" @click="color('#c00000')"></li>
                    <li class="main-color-title a2" @click="color('#ff0000')"></li>
                    <li class="main-color-title a3" @click="color('#ffc000')"></li>
                    <li class="main-color-title a4" @click="color('#ffff00')"></li>
                    <li class="main-color-title a5" @click="color('#92d050')"></li>
                    <li class="main-color-title a6" @click="color('#00b050')"></li>
                    <li class="main-color-title a7" @click="color('#00b0f0')"></li>
                    <li class="main-color-title a8" @click="color('#0070c0')"></li>
                    <li class="main-color-title a8" @click="color('#002060')"></li>
                    <li class="main-color-title a10" @click="color('#7030a0')"></li>
                </ul>

                <button class="jscolor  {valueElement:null,onFineChange:'vues.update(this)'}" value="cc66ff">自定义颜色</button>
            </div>
        </li>
        <li class="vue-editor-nav-item" :style="{backgroundColor:meun.bgbgColor}" @mouseover="meun.bgcolor=true" @mouseout="meun.bgcolor=false"><i :style="{color:meun.bgiconColor}" class="icon icon-bgcolor"></i>
            <div class="sel-color" v-show='meun.bgcolor'>
                <div class="white-block"></div>
                <p class="sel-color-title">主题颜色</p>
                <ul class="word-color">
                    <li class="main-color-title icon-white" @click="backColor('fff')"></li>
                    <li class="main-color-title icon-black" @click="backColor('000')"></li>
                    <li class="main-color-title icon-cream" @click="backColor('eeece1')"></li>
                    <li class="main-color-title icon-black-blue" @click="backColor('1f497d')"></li>
                    <li class="main-color-title icon-blue" @click="backColor('4f81bd')"></li>
                    <li class="main-color-title icon-red" @click="backColor('c0504d')"></li>
                    <li class="main-color-title icon-green" @click="backColor('9bbb59')"></li>
                    <li class="main-color-title icon-violet" @click="backColor('8064a2')"></li>
                    <li class="main-color-title icon-cyan" @click="backColor('4bacc6')"></li>
                    <li class="main-color-title icon-orange" @click="backColor('f79646')"></li>
                </ul>
                <ul class="word-color vice-color">
                    <li class="main-color-title icon-white">
                        <i class="gray1" @click="backColor('f2f2f2')"></i>
                        <i class="gray2" @click="backColor('d8d8d8')"></i>
                        <i class="gray3" @click="backColor('bfbfbf')"></i>
                        <i class="gray4" @click="backColor('a5a5a5')"></i>
                        <i class="gray5" @click="backColor('7f7f7f')"></i>
                    </li>
                    <li class="main-color-title icon-black">
                        <i class="black1" @click="backColor('7f7f7f')"></i>
                        <i class="black2" @click="backColor('595959')"></i>
                        <i class="black3" @click="backColor('3f3f3f')"></i>
                        <i class="black4" @click="backColor('262626')"></i>
                        <i class="black5" @click="backColor('0c0c0c')"></i>
                    </li>
                    <li class="main-color-title icon-cream">
                        <i class="cream1" @click="backColor('ddd9c3')"></i>
                        <i class="cream2" @click="backColor('c4bd97')"></i>
                        <i class="cream3" @click="backColor('938953')"></i>
                        <i class="cream4" @click="backColor('494429')"></i>
                        <i class="cream5" @click="backColor('1d1b10')"></i>
                    </li>
                    <li class="main-color-title icon-black-blue">
                        <i class="black-blue1" @click="backColor('c6d9f0')"></i>
                        <i class="black-blue2" @click="backColor('8db3e2')"></i>
                        <i class="black-blue3" @click="backColor('548dd4')"></i>
                        <i class="black-blue4" @click="backColor('17365d')"></i>
                        <i class="black-blue5" @click="backColor('0f243e')"></i>
                    </li>
                    <li class="main-color-title icon-blue">
                        <i class="blue1" @click="backColor('dbe5f1')"></i>
                        <i class="blue2" @click="backColor('b8cce4')"></i>
                        <i class="blue3" @click="backColor('95b3d7')"></i>
                        <i class="blue4" @click="backColor('366092')"></i>
                        <i class="blue5" @click="backColor('244061')"></i>
                    </li>
                    <li class="main-color-title icon-red">
                        <i class="red1" @click="backColor('f2dcdb')"></i>
                        <i class="red2" @click="backColor('e5b9b7')"></i>
                        <i class="red3" @click="backColor('d99694')"></i>
                        <i class="red4" @click="backColor('953734')"></i>
                        <i class="red5" @click="backColor('632423')"></i>
                    </li>
                    <li class="main-color-title icon-green">
                        <i class="green1" @click="backColor('ebf1dd')"></i>
                        <i class="green2" @click="backColor('d7e3bc')"></i>
                        <i class="green3" @click="backColor('c3d69b')"></i>
                        <i class="green4" @click="backColor('76923c')"></i>
                        <i class="green5" @click="backColor('4f6128')"></i>
                    </li>
                    <li class="main-color-title icon-violet">
                        <i class="violet1" @click="backColor('e5e0ec')"></i>
                        <i class="violet2" @click="backColor('ccc1d9')"></i>
                        <i class="violet3" @click="backColor('b2a2c7')"></i>
                        <i class="violet4" @click="backColor('5f497a')"></i>
                        <i class="violet5" @click="backColor('3f3151')"></i>
                    </li>
                    <li class="main-color-title icon-cyan">
                        <i class="cyan1" @click="backColor('dbeef3')"></i>
                        <i class="cyan2" @click="backColor('b7dde8')"></i>
                        <i class="cyan3" @click="backColor('92cddc')"></i>
                        <i class="cyan4" @click="backColor('31859b')"></i>
                        <i class="cyan5" @click="backColor('205867')"></i>
                    </li>
                    <li class="main-color-title icon-orange">
                        <i class="orange1" @click="backColor('fdeada')"></i>
                        <i class="orange2" @click="backColor('fbd5b5')"></i>
                        <i class="orange3" @click="backColor('fac08f')"></i>
                        <i class="orange4" @click="backColor('e36c09')"></i>
                        <i class="orange5" @click="backColor('974806')"></i>
                    </li>

                </ul>
                <p class="sel-color-title">标准颜色</p>
                <ul class="word-color main-word-color">
                    <li class="main-color-title a1" @click="backColor('c00000')"></li>
                    <li class="main-color-title a2" @click="backColor('ff0000')"></li>
                    <li class="main-color-title a3" @click="backColor('ffc000')"></li>
                    <li class="main-color-title a4" @click="backColor('ffff00')"></li>
                    <li class="main-color-title a5" @click="backColor('92d050')"></li>
                    <li class="main-color-title a6" @click="backColor('00b050')"></li>
                    <li class="main-color-title a7" @click="backColor('00b0f0')"></li>
                    <li class="main-color-title a8" @click="backColor('0070c0')"></li>
                    <li class="main-color-title a8" @click="backColor('002060')"></li>
                    <li class="main-color-title a10" @click="backColor('7030a0')"></li>
                </ul>

                <button class="jscolor  {valueElement:null,onFineChange:'vues.backColor(this)'}" value="cc66ff">自定义颜色</button>
            </div>
        </li>
        <li class="vue-editor-nav-item" :style="{backgroundColor:meun.quoteBg}" @mouseover="meun.quote=true" @mouseout="meun.quote=false"><i :style="{color:meun.quoteIcon}" class="icon icon-quote"></i>

            <div class="sel-color" v-show='meun.quote'>
                <div class="white-block"></div>
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
                    <li class="main-color-title a10" @click="quoteColor('7030a0')"></li>
                </ul>

                <button class="jscolor  {valueElement:null,onFineChange:'vues.quoteColor(this)'}" value="cc66ff">自定义颜色</button>
            </div>
        </li>
        <li class="vue-editor-nav-item" @click="_execCommand('insertOrderedList')"><i class="icon icon-has-list"></i></li>
        <li class="vue-editor-nav-item" @click="_execCommand('insertUnorderedList')"><i class="icon icon-none-list"></i></li>
        <li class="vue-editor-nav-item"><i class="icon icon-link" @click="getFocus"></i>
            <div class="link-editor" v-show="meun.linkopen">
                <div class="white-block"></div>
                <ul>
                    <li><span>文本</span><input type="text" placeholder="请输入链接的文字" v-model="linkTitle" /></li>
                    <li><span>链接</span><input type="text" placeholder="请输入链接网址" v-model="link" /></li>
                    <li class="link-btn-group">
                        <span @click="delLink()">删除链接</span>
                        <span @click="insertLink()">插入链接</span>
                    </li>
                </ul>
            </div>
        </li>

        <li class="vue-editor-nav-item" @click="_execCommand('subscript')" @mouseover="meun.align=true" @mouseout="meun.align=false"><i class="icon icon-align"></i>
            <div class="algin-box" v-show="meun.align">
                <i class="icon icon-left-align" @click="_execCommand('justifyLeft')"></i>
                <i class="icon icon-center-align" @click="_execCommand('justifyCenter')"></i>
                <i class="icon icon-right-align" @click="_execCommand('justifyRight')"></i>
                <!-- <i class="icon icon-jusity-align" @click="_execCommand('justifyRight')"></i> -->
            </div>
        </li>
        <li class="vue-editor-nav-item" @click="_execCommand('subscript')"><i class="icon icon-face"></i></li>
          <li class="vue-editor-nav-item" @click="_execCommand('subscript')"><i class="icon icon-pic-editor"></i></li>

    </ul>
    <div class="content" @click="colseBox()" v-html="detail" @keydown="key($event)" contenteditable="true" @mouseup="updatePosition" @keyup="updatePosition" :style="{height:editHeight}">

    </div>
    <pic ref="uploapPic"></pic>
</div>
</template>
<script>
import jscolor from './jscolor.min.js';
export default {
    props: {
        width: {
            type: String,
            default: '7rem'
        },
        editHeight: {
            type: String,
            default: '5rem'
        },
        detail: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            content: this.detail,
            meun: {
                title: false,
                align: false,
                color: false,
                iconColor: false,
                colorBg: false,
                bgcolor: false,
                bgbgColor: false,
                bgiconColor: false,
                quote: false,
                quoteIcon: false,
                quoteBg: false,
                linkopen: false,
            },
            linkTitle: "",
            link: '',
            range: null,
            nodes: '',


        }
    },
    created() {
        window.vues = this;

        jscolor();
    },
    watch: function() {

    },
    methods: {
        update: function(value) {
            this.color('#' + value);
        },
        _execCommand: function(name, value) {

            if (this.range === null) {
                return false;
            }
            this.restoreSelection();
            document.execCommand(name, false, value);
            this.saveRange();
        },
        restoreSelection: function() {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.range);
            this.saveRange();
        },
        color: function(color) {

            this._execCommand('foreColor', color)
        },
        backColor: function(color) {

            this._execCommand('backColor', '#' + color);
        },
        //quote
        quoteColor: function(color) {
            this._execCommand('formatBlock', '<p>')
            let section = window.getSelection().anchorNode;

            for (var i = 0; i < 100; i++) {
                if (section.nodeName == 'P') {
                    section.style.backgroundColor = '#' + color;
                    section.className = "quto-block";
                    break;

                } else {
                    section = section.parentNode;
                }
            }
        },
        getContent() {
            if (this.nodes) {

                return this.nodes.innerHTML;
            } else {
                debugger;
                return this.content;
            }

        },

        saveRange(e) {
            if (e && (!this.nodes)) {
                this.nodes = e.target;
            }
            const selection = window.getSelection();
            if (selection.rangeCount === 0) {
                return
            }
            const range = selection.getRangeAt(0);
            this.range = range;

        },
        updatePosition(ev) {
            let alt = ev.altKey;
            let ctrl = ev.ctrlKey;
            let shift = ev.shiftKey;
            let meta = ev.metaKey;

            if ((!alt) && (!ctrl) && (!shift)) {
                switch (ev.keyCode) {
                    case 8:
                        if (this.getContent().length < 1) {
                            ev.preventDefault();
                            this._execCommand('formatBlock', '<p>')

                        }
                        break;
                }
            }
            this.saveRange(ev);
        },
        queryCommandValue: function(name) {
            return document.queryCommandValue(name)
        },
        // 封装 document.queryCommandState
        queryCommandState: function(name) {
            return document.queryCommandState(name)
        },
        // 封装 document.queryCommandSupported
        queryCommandSupported: function(name) {
            return document.queryCommandSupported(name)
        },
        //颜色转换为rgb
        colorRgb: function(sColor) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = sColor.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return sColorChange;
                // return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        },
        key: function(ev) {
            let alt = ev.altKey;
            let ctrl = ev.ctrlKey;
            let shift = ev.shiftKey;
            let meta = ev.metaKey;
            console.log(ev.keyCode);
            if ((!alt) && (!ctrl) && (!shift)) {
                switch (ev.keyCode) {
                    case 13:
                        this._execCommand('insertHTML', '\n')
                        this._execCommand('formatBlock', '<p>');
                        setTimeout(function() {
                            let section = window.getSelection().anchorNode;
                            section.className = null;
                            section.style.backgroundColor = null;
                        }, 1)


                        break;
                    case 8:
                        console.log(this.getContent().length);
                        if (this.getContent().length < 1) {
                            ev.preventDefault();
                            this._execCommand('formatBlock', '<p>')

                        }
                        break;
                }
            }


            if ((!alt) && (ctrl || meta) && (!shift)) {
                switch (ev.keyCode) {
                    case 66:
                        ev.preventDefault();
                        this._execCommand('bold')
                        break;
                    case 49:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h1>');
                        break;
                    case 50:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h2>');
                        break;
                    case 51:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h3>');
                        break;
                    case 52:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h4>');
                        break;
                    case 53:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h5>');
                        break;
                    case 54:
                        ev.preventDefault();
                        this._execCommand('formatBlock', '<h6>');
                        break;
                    case 73:
                        ev.preventDefault();
                        this._execCommand('italic');
                        break;
                    case 85:
                        ev.preventDefault();
                        this._execCommand('underline');
                        break;
                    case 38:
                        ev.preventDefault();
                        this._execCommand('superscript');
                        break;
                    case 40:
                        ev.preventDefault();
                        this._execCommand('subscript');
                        break;
                    case 86:
                        ev.preventDefault();
                        this._execCommand('justifyLeft');
                        break;
                    case 66:
                        ev.preventDefault();
                        this._execCommand('justifyCenter');
                        break;
                    case 18:
                        ev.preventDefault();
                        this._execCommand('justifyRight');
                        break;
                    case 18:
                        ev.preventDefault();
                        this.delLink();
                        break;
                    case 8:

                        console.log(this.getContent().length);
                        ev.preventDefault();

                        break;
                    case 68:
                        ev.preventDefault();
                        this._execCommand('strikeThrough');
                        break;
                }
            }

            //console.log(this.queryCommandValue('formatBlock'));
        },
        colseBox: function() {
            for (let i in this.meun) {
                this.meun[i] = false;
            }
        },
        //添加链接
        //添加链接
        getSelectionText() {
            const range = this.range;
            if (range) {
                return this.range.toString()
            } else {
                return ''
            }
        },
        getNodeName: function() {
            const elem = this.range;
            console.log(this.anchorNode);
            return elem.anchorNode
        },
        getFocus: function() {
            this.meun.linkopen = !this.meun.linkopen;
            this.linkTitle = this.getSelectionText();
        },
        insertLink: function() {
            this._execCommand('insertHTML', `<a href="${this.link}">${this.linkTitle}</a>`);
            this.link = '';
            this.linkTitle = '';
            this.meun.linkopen = !this.meun.linkopen;
        },
        delLink: function() {
            this.restoreSelection();
            const selection = window.getSelection();
            this._execCommand('insertHTML', '<span>' + this.getSelectionText() + '</span>');
        }
    }
}
</script>
